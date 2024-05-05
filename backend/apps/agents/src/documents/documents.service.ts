import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { LeadsService } from '../leads/leads.service';
import { Document } from './entities/document.entity';
import { DocumentsRepository } from './documents.repository';
import { ExtendedFindOptions, User } from '@app/common';
import { readFileSync } from 'fs';
import { AgentsService } from '../agents.service';
import { Leads } from '../leads/entities/lead.entity';
import { Customers } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly documentsRepository: DocumentsRepository,
    private readonly customersService: CustomersService,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, user: User) {
    console.log('createDocumentDto', createDocumentDto);
    const { leadId, customerId, ...rest } = createDocumentDto;
    const documents = new Document(rest);
    let lead: Leads, customer: Customers
    if(leadId){
      lead = await this.leadsService.getOne(Number(leadId));
      documents.lead = lead;
      if (!lead) {
        throw new NotFoundException(`Lead #${leadId} not found`);
      }
    }
    
    if(customerId){
      customer = await this.customersService.getOne(Number(customerId));
      documents.customer = customer;
      if (!customer) {
        throw new NotFoundException(`Customer #${customerId} not found`);
      }
    }
    documents.userId = user.id;
    documents.createdBy = user.email;

    return await this.documentsRepository.create(documents);
  }

  async findAll(options: ExtendedFindOptions<Document>) {
    return this.documentsRepository.findAll(options);
  }

  async findAllByLeadId(options: ExtendedFindOptions<Document>, id: number) {
    options.relations = ['lead'];
    options.where = { lead: { id: id } };
    return this.documentsRepository.findAll(options);
  }

  async findAllByCustomerId(options: ExtendedFindOptions<Document>, id: number) {
    options.relations = ['customer'];
    options.where = { customer: { id: id } };
    return this.documentsRepository.findAll(options);
  }

  async getOne(id: number) {
    const document = await this.documentsRepository.findOne({ id });
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }
    return document;
  }

  async updatefileDocument(
    documentId: number,
    filePath: string,
  ): Promise<Document> {
    // const organization = await this.organizationsRepository.findOne({id: organizationId});
    console.log('filePath', filePath);
    const document = await this.documentsRepository.findOneAndUpdate(
      { where: { id: documentId } },
      { documentFile: filePath },
    );
    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const updatedDocumentDto = {
      ...updateDocumentDto,
      documentFile: updateDocumentDto.documentFile,
    };
  
    const updatedDocument = await this.documentsRepository.findOneAndUpdate(
      { where: { id: id } },
      updatedDocumentDto,
    );
  
    if (!updatedDocument) {
      throw new NotFoundException(`Document #${id} not found`);
    }
  
    return `Document #${id} has been updated`;
  }

  async remove(id: number) {
    return await this.documentsRepository.findOneAndDelete({ id });
  }
}
