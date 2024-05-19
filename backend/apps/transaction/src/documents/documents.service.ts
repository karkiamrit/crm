import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { TransactionTaskService } from '../transaction-task/transaction-task.service';
import { Document } from './entities/document.entity';
import { DocumentsRepository } from './documents.repository';
import { ExtendedFindOptions, User } from '@app/common';
import { TransactionTask } from '../transaction-task/entities/transaction-task.entity';
import { sign } from 'jsonwebtoken';


@Injectable()
export class DocumentsService {
  constructor(
    private readonly taskService: TransactionTaskService,
    private readonly documentsRepository: DocumentsRepository,

  ) {}

  async create(createDocumentDto: CreateDocumentDto, user: User, taskId: number) {
    const documents = new Document(createDocumentDto);
    let task: TransactionTask;
    if(taskId){
      task = await this.taskService.getOne(Number(taskId));
      documents.task = task;
      if (!task) {
        throw new NotFoundException(`Task #${taskId} not found`);
      }
    }
    return await this.documentsRepository.create(documents);
  }

  async generateUploadUrl(taskId: number): Promise<string> {
    const payload = { taskId };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // The token expires in 1 hour
    const url = `https://yourwebsite.com/upload?token=${token}`;
    return url;
  }

  async findAll(options: ExtendedFindOptions<Document>) {
    options.relations= ['task']
    return this.documentsRepository.findAll(options);
  }

  async findAllByTaskId(options: ExtendedFindOptions<Document>, id: number) {
    options.relations = ['task'];
    options.where = { task: { id: id } };
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
