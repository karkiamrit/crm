import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesRepository } from './invoices.repository';
import { ExtendedFindOptions, User } from '@app/common';
import { AgentsService } from '../agents.service';
import { Product } from '../shared/objects/products/products.entity';
import { Invoice } from './entities/invoice.entity';
import { CustomersService } from '../customers/customers.service';
import { ProductRepository } from '../shared/objects/products/product.repository';
import { EntityManager, QueryRunner } from 'typeorm';
import { Customers } from '../customers/entities/customer.entity';
import { Agent } from '../entities/agent.entity';
import { CreateProductInputDTO } from '../shared/dtos/product.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly customersService: CustomersService,
    private readonly agentsService: AgentsService,
    private readonly manager: EntityManager,

  ) {}

  // async create(createInvoiceDto: CreateInvoiceDto, user: User) {
  //   let { customerId, ...rest } = createInvoiceDto;
  //   const customer = await this.customersService.getOne(customerId);
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

  //   invoice.customer = customer;
  //   invoice.agent = agent;
  //   return await this.invoicesRepository.create(invoice);
  // }

  async create(createInvoiceDto: CreateInvoiceDto, user: User) {
    const { customerId, products: productDtos, ...rest } = createInvoiceDto;
    const customer = await this.customersService.getOne(customerId);
    const agent = await this.agentsService.getAgentByUserId(user.id);

    // Start a transaction
    const queryRunner = this.manager.connection.createQueryRunner();    
    await queryRunner.startTransaction();

    try {
        // Create a new Invoices entity without products
        const invoice = this.createInvoice(rest, customer, agent);

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
        console.log(savedInvoice)
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

createInvoice(rest: Partial<Invoice>, customer: Customers, agent: Agent): Invoice {
  return new Invoice({
      ...rest,
      customer,
      agent,
  });
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

      products.push(savedProduct);
  }
  return products;
}

  async delete(id: number) {
    return this.invoicesRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Invoice>) {
    return this.invoicesRepository.findAll({...options, relations: ['customer','agent', 'products']});
  }

  async getOne(id: number) {
    return this.invoicesRepository.findOne({ id });
  }

  async update(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({ id });

    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }

    if (updateInvoiceDto.product) {
      // Map UpdateProductInputDTO[] to Product[]
      invoice.products = updateInvoiceDto.product.map(prod => {
        let product = new Product(prod); // Pass the argument to the Product constructor
        Object.assign(product, prod);
        return product;
      });
    }

    Object.assign(invoice, updateInvoiceDto);

    return await this.invoicesRepository.findOneAndUpdate({where:{id:invoice.id}}, invoice);
  }
}