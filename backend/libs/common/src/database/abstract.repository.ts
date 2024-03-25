import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  EntityManager,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindManyOptions, Between } from 'typeorm';

interface RangeCondition {
  property: string;
  lower: string;
  upper: string;
}
// export interface ExtendedFindOptions<T> extends FindManyOptions<T> {
//   range?: RangeCondition[];
//   query?: any;
//   relations?: string[];
// }
export interface ExtendedFindOptions<T>
  extends Omit<FindManyOptions<T>, 'where'> {
  where?: FindManyOptions<T>['where'] | ((qb: SelectQueryBuilder<T>) => void);
  range?: RangeCondition[];
  query?: any;
  relations?: string[];
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

  async findAll(options: ExtendedFindOptions<T>): Promise<T[]> {
    // If where is a function, use a query builder
    if (typeof options.where === 'function') {
      const qb = this.entityRepository.createQueryBuilder('entity');

      // Call the where function with the query builder
      options.where(qb);

      // Apply ordering
      if (options.order) {
        for (const [key, value] of Object.entries(options.order)) {
          qb.addOrderBy(`entity.${key}`, value);
        }
      }

      // Apply pagination
      if (options.skip) {
        qb.skip(options.skip);
      }
      if (options.take) {
        qb.take(options.take);
      }

      // Execute the query
      return qb.getMany();
    }

    // If where is not a function, use the existing implementation
    const validProperties = this.entityRepository.metadata.columns.map(
      (column) => column.propertyName,
    );

    const where = Object.keys(options).reduce((conditions, key) => {
      if (validProperties.includes(key) && key !== 'range' && key !== 'order') {
        conditions[key] = options[key];
      }
      return conditions;
    }, {} as FindOptionsWhere<T>);

    const qb = this.entityRepository.createQueryBuilder('entity');
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
          const lower = rangeCondition.lower;
          const upper = rangeCondition.upper;
          if (rangeCondition.property === 'source') {
            const regex = new RegExp(`[${lower}-${upper}]`);
            qb.andWhere(`entity.${rangeCondition.property} ~ :regex`, {
              regex: regex.source,
            });
          } else {
            const lowerCondition = isNaN(Number(lower))
              ? `entity.${rangeCondition.property} >= :lower`
              : `entity.${rangeCondition.property} >= :lower::integer`;
            const upperCondition = isNaN(Number(upper))
              ? `entity.${rangeCondition.property} <= :upper`
              : `entity.${rangeCondition.property} <= :upper::integer`;
            qb.andWhere(lowerCondition, { lower: lower }).andWhere(
              upperCondition,
              { upper: upper },
            );
          }
        }
      });
    }

    const { skip, take } = options;

    let orderOption = {};
    if (options.order) {
      for (const [key, value] of Object.entries(options.order)) {
        if (validProperties.includes(key) && typeof value === 'string') {
          orderOption[key] = value.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        }
      }
    }

    //   Object.entries(where).forEach(([key, value]) => {
    //     if (validProperties.includes(key)) {
    //         if (
    //             value instanceof Object &&
    //             '_value' in value &&
    //             Array.isArray(value._value) &&
    //             value._value.length === 2
    //         ) {
    //             const lower = value._value[0];
    //             const upper = value._value[1];
    //             if (isNaN(Number(lower)) || isNaN(Number(upper))) {
    //                 // If lower or upper is not a number, treat them as strings
    //                 qb.andWhere(`entity.${key} >= :lower`, { lower: `'${lower}'` })
    //                     .andWhere(`entity.${key} <= :upper`, { upper: `'${upper}'` });
    //             } else {
    //                 // If lower and upper are both numbers, treat them as numbers
    //                 qb.andWhere(`entity.${key} BETWEEN :lower AND :upper`, {
    //                     lower: Number(lower),
    //                     upper: Number(upper),
    //                 });
    //             }
    //         } else {
    //             // Treat enum properties as strings
    //             const propertyType = this.entityRepository.metadata.columns.find(column => column.propertyName === key)?.type;
    //             if (propertyType === 'enum') {
    //                 qb.andWhere(`entity.${key} = :value`, { value: value.toString() });
    //             }
    //             else {
    //                 qb.andWhere(`entity.${key} = :value`, { value });
    //             }
    //         }
    //     } else {
    //         // If the property is not a valid property, it might be a relation
    //         qb.leftJoinAndSelect(`entity.${key}`, key).andWhere(
    //             `${key}.id = :value`,
    //             { value },
    //         );
    //     }
    // });

    Object.entries(where).forEach(([key, value], index) => {
      if (validProperties.includes(key)) {
        if (
          value instanceof Object &&
          '_value' in value &&
          Array.isArray(value._value) &&
          value._value.length === 2
        ) {
          const lower = value._value[0];
          const upper = value._value[1];
          if (isNaN(Number(lower)) || isNaN(Number(upper))) {
            // If lower or upper is not a number, treat them as strings
            const condition = `entity.${key} BETWEEN :lower AND :upper`;
            const parameters = { lower: `'${lower}'`, upper: `'${upper}'` };
            index === 0
              ? qb.where(condition, parameters)
              : qb.andWhere(condition, parameters);
          } else {
            // If lower and upper are both numbers, treat them as numbers
            const condition = `entity.${key} BETWEEN :lower AND :upper`;
            const parameters = { lower: Number(lower), upper: Number(upper) };
            index === 0
              ? qb.where(condition, parameters)
              : qb.andWhere(condition, parameters);
          }
        } else {
          // Treat enum properties as strings
          const propertyType = this.entityRepository.metadata.columns.find(
            (column) => column.propertyName === key,
          )?.type;
          if (propertyType === 'enum') {
            const condition = `entity.${key} = :value`;
            const parameters = { value: value.toString() };
            index === 0
              ? qb.where(condition, parameters)
              : qb.andWhere(condition, parameters);
          } else {
            const condition = `entity.${key} = :${key}`;
            const parameters = { [key]: value };
            index === 0
              ? qb.where(condition, parameters)
              : qb.andWhere(condition, parameters);
          }
        }
      } else {
        // If the property is not a valid property, it might be a relation
        qb.leftJoinAndSelect(`entity.${key}`, key).andWhere(
          `${key}.id = :value`,
          { value },
        );
      }
    });

    // Apply ordering
    Object.entries(orderOption).forEach(([key, value]) => {
      if (typeof value === 'string') {
        qb.addOrderBy(`entity.${key}`, value as 'ASC' | 'DESC');
      }
    });

    // Apply pagination
    if (skip) {
      qb.skip(skip);
    }
    if (take) {
      qb.take(take);
    }

    // Execute the query
    return qb.getMany();
  }
}
