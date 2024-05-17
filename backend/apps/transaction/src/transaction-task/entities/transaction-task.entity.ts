import { AbstractEntity } from "@app/common";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { transactionTaskType } from "../dto/enum";

@Entity()
export class TransactionTask extends AbstractEntity<TransactionTask>{
    @Column()
    name: string;

    @Column({type: "enum", enum: transactionTaskType, default: transactionTaskType.DOCUMENT})
    type: transactionTaskType;

    @Column()
    customerId: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    dueDate: Date;
}
