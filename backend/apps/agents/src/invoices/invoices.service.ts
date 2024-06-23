import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesRepository } from './invoices.repository';
import { ExtendedFindOptions, NOTIFICATIONS_SERVICE, User } from '@app/common';
import { AgentsService } from '../agents.service';
import { Product } from '../shared/objects/products/products.entity';
import { Invoice } from './entities/invoice.entity';
import { LeadsService } from '../leads/leads.service';
import { ProductRepository } from '../shared/objects/products/product.repository';
import { EntityManager, QueryRunner } from 'typeorm';
import { Leads } from '../leads/entities/lead.entity';
import { Agent } from '../entities/agent.entity';
import { CreateProductInputDTO } from '../shared/dtos/product.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { tap } from 'rxjs';
import { InvoiceStatus } from '../shared/data';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly leadsService: LeadsService,
    private readonly agentsService: AgentsService,
    private readonly manager: EntityManager,
    private readonly productRepository: ProductRepository,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
    private readonly configService: ConfigService
  ) {}

  // async create(createInvoiceDto: CreateInvoiceDto, user: User) {
  //   let { leadId, ...rest } = createInvoiceDto;
  //   const lead = await this.leadsService.getOne(leadId);
  //   const agent = await this.agentsService.getAgentByUserId(user.id);
  //   let products: Product[] = [];
  //   if (createInvoiceDto.products) {
  //     products = createInvoiceDto.products.map((prod) => new Product(prod));
  //     products.forEach(async(product)=>{
  //       await this.productRepository.create(product);
  //     })
     
  //   }

  //   // Create a new Invoices entity
  //   const invoice = new Invoice({
  //     ...rest,
  //     products,
  //   });

  //   invoice.lead = lead;
  //   invoice.agent = agent;
  //   return await this.invoicesRepository.create(invoice);
  // }

  async create(createInvoiceDto: CreateInvoiceDto, user: User) {
    const { leadId, products: productDtos, ...rest } = createInvoiceDto;
    let lead = null;
    let agent = null;
  
    if (leadId) {
      lead = await this.leadsService.getOne(leadId);
    }
  
    agent = await this.agentsService.getAgentByUserId(user.id);
  
    // Start a transaction
    const queryRunner = this.manager.connection.createQueryRunner();    
    await queryRunner.startTransaction();
  
    try {
      // Create a new Invoices entity without products
      const invoice = this.createInvoice(rest, lead, agent, user);
  
      // Save the invoice to get the generated id
      const savedInvoice = await this.saveInvoice(queryRunner, invoice);
  
      if (productDtos) {
        // Create and save the products
        const products = await this.createAndSaveProducts(queryRunner, productDtos, savedInvoice);
  
        // Update the invoice with the products
        savedInvoice.products = products;
        await this.saveInvoice(queryRunner, savedInvoice);
      }
  
      // Commit the transaction
      await queryRunner.commitTransaction();
      return savedInvoice;
    } catch (err) {
      // If any operation fails, roll back the transaction
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
  
  createInvoice(rest: Partial<Invoice>, lead: Leads, agent: Agent, user: User): Invoice {
    if(agent){
      return new Invoice({
        ...rest,
        lead,
        agent,
        sendorName: agent.name
      });
    }else{
      return new Invoice({
        ...rest,
        lead,
        agent,
        sendorName: agent.name
      });
    }
  
  }

async saveInvoice(queryRunner: QueryRunner, invoice: Invoice): Promise<Invoice> {
  return await queryRunner.manager.save(invoice);
}

async createAndSaveProducts(queryRunner: QueryRunner, productDtos: CreateProductInputDTO[], invoice: Invoice): Promise<Product[]> {
  let products: Product[] = [];
  for (const prodDto of productDtos) {
      // Create a new Product entity with the invoiceId
      const product = new Product({
          ...prodDto,
          invoice, // Assign the saved invoice to the product
      });

      // Save the product
      const savedProduct = await queryRunner.manager.save(product);

      // Check if the product was saved successfully
      if (!savedProduct) {
        throw new Error('Failed to save product');
      }

      products.push(savedProduct);
  }
  return products;
}

  async delete(id: number) {
    return this.invoicesRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Invoice>) {
    return this.invoicesRepository.findAll({...options, relations: ['lead','agent', 'products']});
  }

  async getOne(id: number) {
    return this.invoicesRepository.findOne({ id });
  }

  async update(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({ id },['products'] );
    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }

    if (updateInvoiceDto.products) {
      // Map UpdateProductInputDTO[] to Product[]
      const updatedProducts = updateInvoiceDto.products.map(async (prod) => {
        console.log(prod);

        let product: Product;
        if (prod.id) {
          const id = prod.id;
          product = await this.productRepository.findOne({ id }); // Fetch the product by its ID
          if (!product) {
            throw new NotFoundException(`Product #${prod.id} not found`);
          }
          // Only update the fields that are present in the DTO
          for (const key in prod) {
            if (prod[key] !== undefined) {
              product[key] = prod[key];
            }
          }
          await this.productRepository.findOneAndUpdate({where:{id: product.id}}, product);
        } else {
          product = new Product(prod); // Create a new instance of the Product entity
          product.invoice = invoice;
          await this.productRepository.create(product);

        }
        return product;
      });

      invoice.products = await Promise.all(updatedProducts);
    }
    // Only update the fields that are present in the DTO
    for (const key in updateInvoiceDto) {
      if (updateInvoiceDto[key] !== undefined) {
        invoice[key] = updateInvoiceDto[key];
      }
    }
    return await this.invoicesRepository.findOneAndUpdate({where:{ id: invoice.id}}, invoice); // Save the updated invoice back to the database
  }

  async sendInvoice(invoicePath: string, email: string, id: number, user: User){
    const invoice = await this.invoicesRepository.findOne({id});
    if(!invoice){
      throw new NotFoundException(`Invoice #${id} not found`);
    }
    const username= user.email.split('@')[0];
    const text= `${this.configService.get('UPLOAD_URL')}/${invoicePath}`;
    return this.notificationsService.send('send_invoice_email', { username, to: email, text_content:text }).pipe(
      tap({
        next: async (response) => {
          console.log(`Email Sent successfully: ${response}`);
          await this.invoicesRepository.findOneAndUpdate({where:{id: invoice.id}}, {status: InvoiceStatus.SAVED});
        },
        error: (error) => console.error(`Failed to send email: ${error.message}`),
      })
    );
  }
}
