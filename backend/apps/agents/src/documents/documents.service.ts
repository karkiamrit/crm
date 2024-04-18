import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { LeadsService } from '../leads/leads.service';
import { Document } from './entities/document.entity';
import { DocumentsRepository } from './documents.repository';
import { ExtendedFindOptions, User } from '@app/common';
import { readFileSync } from 'fs';
import { AgentsService } from '../agents.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly documentsRepository: DocumentsRepository,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, user: User) {
    const { leadId, ...rest } = createDocumentDto;
    
    const lead = await this.leadsService.getOne(Number(leadId));
    if (!lead) {
      throw new NotFoundException(`Lead #${leadId} not found`);
    }
    const documents = new Document(rest);
    documents.lead = lead;
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
