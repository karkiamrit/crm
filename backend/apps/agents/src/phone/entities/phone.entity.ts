import { AbstractEntity } from '@app/common';
import { Entity } from 'typeorm';

@Entity()
export class Phone extends AbstractEntity<Phone> {}
