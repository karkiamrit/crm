import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { DocumentsRepository } from './documents.repository';
import { AGENTS_SERVICE, ExtendedFindOptions, User } from '@app/common';
import { TransactionTask } from '../transaction-task/entities/transaction-task.entity';
import { sign } from 'jsonwebtoken';
import { TransactionTaskRepository } from '../transaction-task/transaction-task.repository';
import { ConfigService } from '@nestjs/config';
import { transactionTaskStatus } from '../transaction-task/dto/enum';
import { TransactionDocumentTimelineRepository } from './timelines/document.timelines.repository';
import { DocumentTimeline } from './timelines/timelines.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly taskService: TransactionTaskRepository,
    private readonly documentsRepository: DocumentsRepository,
    private readonly configService: ConfigService,
    private readonly documentTimelineRepository: TransactionDocumentTimelineRepository,
    @Inject(AGENTS_SERVICE)
    private readonly agentsService: ClientProxy,
  ) {}

  // async create(
  //   createDocumentDto: CreateDocumentDto,
  //   user: User,
  //   taskId: number,
  // ) {
  //   const documents = new Document(createDocumentDto);
  //   let task: TransactionTask;
  //   if (taskId) {
  //     task = await this.taskService.findOne({ id: Number(taskId) });
  //     const existingDocument = await this.documentsRepository.findOne({
  //       task: { id: Number(taskId) },
  //     });

  //     documents.task = task;
  //     documents.description = task.name;
  //     if (existingDocument) {
  //       const docId = existingDocument.id;

  //       return await this.documentsRepository.findOneAndUpdate(
  //         { where: { id: docId } },
  //         documents,
  //       );
  //     }
  //     if (!task) {
  //       throw new NotFoundException(`Task #${taskId} not found`);
  //     }
  //   }
  //   return await this.documentsRepository.create(documents);
  // }

  async findTask(taskId: number): Promise<TransactionTask> {
    const task = await this.taskService.findOne({ id: Number(taskId) });
    if (!task) {
      throw new NotFoundException(`Task #${taskId} not found`);
    }
    return task;
  }

  async createTimelineEntry(
    document: Document,
    attribute: string,
    value: any,
    taskId: number,
    customerName: string,
  ): Promise<DocumentTimeline> {
    if (value === null || value === undefined) {
      throw new Error(`Invalid value for attribute ${attribute}: ${value}`);
    }
    const timeline = new DocumentTimeline({
      attribute: attribute,
      value: value,
      document: document,
      taskId: taskId,
      customerName: customerName,
    });
    return await this.documentTimelineRepository.create(timeline);
  }

  async findExistingDocument(taskId: number): Promise<Document> {
    return await this.documentsRepository.findOne({
      task: { id: Number(taskId) },
    });
  }

  async updateExistingDocument(
    docId: number,
    documents: Document,
  ): Promise<Document> {
    const existingDocument = await this.documentsRepository.findOne({
      id: docId,
    });
    const updatedDocument = await this.documentsRepository.findOneAndUpdate(
      { where: { id: docId } },
      documents,
    );
    const task = await this.taskService.findOne({
      id: Number(documents.task.id),
    });
    const customerId = task.customerId;
    const customer = await firstValueFrom(
      this.agentsService.send('get_customer_by_id', { id: customerId }),
    );

    console.log(customer);
    // Create a timeline entry for the documentFile attribute if it has changed
    if (existingDocument.documentFile !== updatedDocument.documentFile) {
      await this.createTimelineEntry(
        updatedDocument,
        'documentFile',
        updatedDocument.documentFile,
        updatedDocument.task.id,
        customer.name,
      );
    }

    return updatedDocument;
  }

  async createDocument(documents: Document): Promise<Document> {
    const newDocument = await this.documentsRepository.create(documents);
    const customerId = newDocument.task.customerId;
    const customer = await firstValueFrom(
      this.agentsService.send('get_customer_by_id', { id: customerId }),
    );

    // Create a timeline entry for the documentFile attribute
    await this.createTimelineEntry(
      newDocument,
      'documentFile',
      newDocument.documentFile,
      newDocument.task.id,
      customer.name,
    );

    return newDocument;
  }

  async create(
    createDocumentDto: CreateDocumentDto,
    user: User,
    taskId: number,
  ) {
    const documents = new Document(createDocumentDto);
    let task: TransactionTask;
    if (taskId) {
      task = await this.findTask(taskId);
      const existingDocument = await this.findExistingDocument(taskId);

      documents.task = task;
      documents.description = task.name;
      if (existingDocument) {
        const docId = existingDocument.id;
        return await this.updateExistingDocument(docId, documents);
      }
    }
    return await this.createDocument(documents);
  }

  async generateUploadUrl(taskId: number): Promise<string> {
    const payload = { taskId };
    const token = sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: '24h',
    }); // The token expires in 1 hour
    const url = `${process.env.FRONTEND_URL}/upload?token=${token}`;
    return url;
  }

  async findAll(options: ExtendedFindOptions<Document>) {
    options.relations = ['task'];
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

  // async updatefileDocument(
  //   documentId: number,
  //   filePath: string,
  // ): Promise<Document> {
  //   // const organization = await this.organizationsRepository.findOne({id: organizationId});
  //   const document = await this.documentsRepository.findOneAndUpdate(
  //     { where: { id: documentId } },
  //     { documentFile: filePath },
  //   );
  //   return document;
  // }

  // async update(id: number, updateDocumentDto: UpdateDocumentDto) {
  //   const updatedDocumentDto = {
  //     ...updateDocumentDto,
  //     documentFile: updateDocumentDto.documentFile,
  //   };

  //   const updatedDocument = await this.documentsRepository.findOneAndUpdate(
  //     { where: { id: id } },
  //     updatedDocumentDto,
  //   );

  //   if (!updatedDocument) {
  //     throw new NotFoundException(`Document #${id} not found`);
  //   }
  //   if(updateDocumentDto.status === 'COMPLETED'){
  //     await this.taskService.findOneAndUpdate({where: {id: updatedDocument.task.id}}, {status: transactionTaskStatus.COMPLETED});
  //   }

  //   return `Document #${id} has been updated`;
  // }

  async updatefileDocument(
    documentId: number,
    filePath: string,
  ): Promise<Document> {
    const originalDocument = await this.documentsRepository.findOne({
      id: documentId,
    });
    const updatedDocument = await this.documentsRepository.findOneAndUpdate(
      { where: { id: documentId } },
      { documentFile: filePath },
    );
    const customerId = updatedDocument.task.customerId;

    const customer = await firstValueFrom(
      this.agentsService.send('get_customer_by_id', { id: customerId }),
    );

    if (originalDocument.documentFile !== updatedDocument.documentFile) {
      const timeline = new DocumentTimeline({
        attribute: 'documentFile',
        value: updatedDocument.documentFile,
        document: updatedDocument,
        customerName: customer.name,
      });
      timeline.taskId = updatedDocument.task.id;
      await this.documentTimelineRepository.create(timeline);
    }
    return updatedDocument;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const originalDocument = await this.documentsRepository.findOne({ id: id });
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
    const customerId = updatedDocument.task.customerId;
    const customer = await firstValueFrom(
      this.agentsService.send('get_customer_by_id', { id: customerId }),
    );

    console.log(customer, 'here');
    for (const key in updateDocumentDto) {
      if (originalDocument[key] !== updatedDocument[key]) {
        const timeline = new DocumentTimeline({
          attribute: key,
          value: updatedDocument[key],
          document: updatedDocument,
          customerName: customer.name,
        });
        timeline.taskId = updatedDocument.task.id;
        await this.documentTimelineRepository.create(timeline);
      }
    }

    if (updateDocumentDto.status === 'COMPLETED') {
      await this.taskService.findOneAndUpdate(
        { where: { id: updatedDocument.task.id } },
        { status: transactionTaskStatus.COMPLETED },
      );
    }

    return `Document #${id} has been updated`;
  }

  async remove(id: number) {
    return await this.documentsRepository.findOneAndDelete({ id });
  }

  // async findAllTimelines(
  //   options: ExtendedFindOptions<DocumentTimeline>,
  //   id: number,
  // ): Promise<{ data: DocumentTimeline[]; total: number }> {
  //   const tasks = await this.taskService.findAll({
  //     where: { transaction: { id: id } },
  //     relations: ['transaction'],
  //   });
  //   const tasksIds = tasks.data.map((task) => task.id);
  //   const timelinesPromises = tasksIds.map((id) => {
  //     options.where = { taskId: id };
  //     return this.documentTimelineRepository.findAll(options);
  //   });
  //   const timelinesArrays = await Promise.all(timelinesPromises);
  //   const nonEmptyTimelines = timelinesArrays.filter(
  //     (timeline) => timeline.total > 0,
  //   );
  //   console.log(options)

  //   const timelines = nonEmptyTimelines.flatMap((timeline) => timeline.data);
  //   console.log(timelines.length)
  //   return { data: timelines, total: timelines.length };
  // }

  async findAllTimelines(
    options: ExtendedFindOptions<DocumentTimeline>,
    id: number,
  ): Promise<{ data: DocumentTimeline[]; total: number }> {
    const tasks = await this.taskService.findAll({
      where: { transaction: { id: id } },
      relations: ['transaction'],
    });
    const tasksIds = tasks.data.map((task) => task.id);
  
    // Fetch all timelines for each task ID without any options
    const timelinesPromises = tasksIds.map((id) =>
      this.documentTimelineRepository.findAll({ where: { taskId: id } }),
    );
    const timelinesArrays = await Promise.all(timelinesPromises);
  
    // Combine all timelines into a single array
    const allTimelines = timelinesArrays.flatMap((timeline) => timeline.data);
  
    // Sort the combined data
    const sortedTimelines = allTimelines.sort((a, b) =>
      options.order.id === 'DESC' ? b.id - a.id : a.id - b.id
    );
  
    // Calculate the begin and end indices for the slice method
    const begin = Number(options.skip);
    const end = Number(options.skip) + Number(options.take);
  
    // Slice the array to get the items for the current page
    const paginatedTimelines = sortedTimelines.slice(begin, end);

    return { data: paginatedTimelines, total: allTimelines.length };
  }
}
