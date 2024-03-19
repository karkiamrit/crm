import { AbstractEntity, User } from "@app/common";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Agent extends AbstractEntity<Agent>{
    @Column({unique : true})
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

    @Column()
    userId: number
}
