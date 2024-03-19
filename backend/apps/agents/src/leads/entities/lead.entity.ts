import { AbstractEntity, User } from "@app/common";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Leads extends AbstractEntity<Leads>{
    @Column()
    reference_no: string;

    @Column()
    documents: string[];

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    email: string;
   
    @Column()
    name: string

    @CreateDateColumn()
    createdAt: Date;
    
}
