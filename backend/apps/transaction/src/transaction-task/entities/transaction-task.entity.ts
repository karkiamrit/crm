import { AbstractEntity } from "@app/common";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { transactionTaskType } from "../dto/enum";
import { Transaction } from "../../entities/transaction.entity";
import { Document } from "../../documents/entities/document.entity";

@Entity()
export class TransactionTask extends AbstractEntity<TransactionTask>{
    @Column()
    name: string;

    @Column()
    note: string;

    @Column({type: "enum", enum: transactionTaskType, default: transactionTaskType.DOCUMENT})
    type: transactionTaskType;

    @Column()
    customerId: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    dueDate: Date;

    @ManyToOne(() => Transaction, transaction => transaction.tasks, {
        eager: true
    })
    @JoinColumn({ name: 'transactionId' }) // The foreign key column in the TransactionTask table
    transaction: Transaction

    @OneToMany(() => Document, (document) => document.task, { nullable: true })
    officialDocs?: Document[];
}
