import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindManyOptions, Between } from 'typeorm';

interface RangeCondition {
  property: string;
  lower: string;
  upper: string;
}
export interface ExtendedFindOptions<T> extends FindManyOptions<T> {
  range?: RangeCondition[];
  query?: any;
}

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;
  constructor(
    private readonly entityRepository: Repository<T>, //to get type information around our queries,
    private readonly entityManager: EntityManager, // use save entities in our relational database using instances of these entities
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findAll(options: ExtendedFindOptions<T>): Promise<T[]> {
    // Define a list of valid properties
    const validProperties = this.entityRepository.metadata.columns.map(
      (column) => column.propertyName,
    );

    // Construct the where clause
    const where = Object.keys(options).reduce((conditions, key) => {
      if (validProperties.includes(key) && key !== 'range' && key !== 'order') {
        conditions[key] = options[key];
      }
      return conditions;
    }, {} as FindOptionsWhere<T>);

    if (options.range) {
      let range = options.range;
      if (typeof options.range === 'string') {
        try {
          range = JSON.parse(options.range);
        } catch (err) {
          throw new Error('Invalid range parameter');
        }
      }

      if (!Array.isArray(range)) {
        throw new Error('Range must be an array');
      }

      range.forEach((rangeCondition) => {
        if (validProperties.includes(rangeCondition.property)) {
          where[rangeCondition.property] = Between(
            rangeCondition.lower,
            rangeCondition.upper,
          );
        }
      });
    }

    // Extract pagination options
    const { skip, take } = options;

    let orderOption = {};
    if (options.order) {
      console.log(Object.entries(options.order));
      for (const [key, value] of Object.entries(options.order)) {
        // Changed this line
        console.log(key, value, typeof value);
        if (validProperties.includes(key) && typeof value === 'string') {
          orderOption[key] = value.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        }
      }
    }

    // Call the find method with the constructed where clause, pagination options, and order options
    return this.entityRepository.find({
      where,
      skip,
      take,
      order: orderOption,
    });
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.entityRepository.findOne({ where });
    if (!entity) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found ');
    }
    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>, //subset of properties that exist on our entity that we want to update
  ) {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );
    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found ');
    }
    return this.findOne(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.entityRepository.delete(where);
  }
}
