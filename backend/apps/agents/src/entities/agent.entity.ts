import { AbstractEntity } from "@app/common";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { Leads } from "../leads/entities/lead.entity";
import { Customers } from "../customers/entities/customer.entity";

@Entity()
export class Agent extends AbstractEntity<Agent>{
    @Column({unique : true})
    reference_no: string;

    @Column('simple-array')
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

    @OneToMany(() => Leads, lead => lead.agentId, {nullable: true})
    leads: Leads[];

    @OneToMany(() => Customers, customer => customer.agentId, {nullable: true})
    customers: Customers[];
}
