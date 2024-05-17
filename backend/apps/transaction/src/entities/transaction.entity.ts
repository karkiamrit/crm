import { AbstractEntity } from "@app/common";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { transactionStatus, transactionType } from "../dto/enums";

@Entity()
export class Transaction extends AbstractEntity<Transaction>{
    @Column('enum', {enum: transactionStatus, default: transactionStatus.LISTED})
    status: transactionStatus; 

    @Column()
    listingPrice: string;

    @Column('enum',{nullable:true, enum: transactionType, default: transactionType.PURCHASE})
    type: transactionType; 

    @Column()
    toBuyer: boolean;

    @Column()
    listingAddress: string;

    @Column()
    listingCity: string;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable:true})
    closingDate: Date;

    //After making task which has document it will have one to one relation with the document
}
