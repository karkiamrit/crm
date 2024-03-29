import { AbstractEntity } from "@app/common";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { LeadTimeline } from "../timelines/timelines.entity";
import { Product } from "../products/products.entity";
import { Service } from "../services/services.entity";
import { Agent } from "../../entities/agent.entity";

export enum LeadsStatus{
    INITIAL= 'INITIAL',
    PENDING= 'PENDING',
    CONFIRMED= 'CONFIRMED',
    REJECTED= 'REJECTED',
    COMPLETED= 'COMPLETED',
}
@Entity()
export class Leads extends AbstractEntity<Leads>{

    @Column()
    address: string;

    @Column()
    details: string;

    @Column({
        type: "enum",
        enum: LeadsStatus,
        default: LeadsStatus.INITIAL
    })
    status: LeadsStatus;

    @Column()
    phone: string;

    @Column()
    email: string;
   
    @Column()
    name: string;

    @Column({default:0, nullable: true})
    priority: Number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable:true})  
    source: string; //eg: facebook, email etc

    @OneToMany(() => LeadTimeline, timeline => timeline.lead, {eager:true, onDelete: 'CASCADE'})
    timelines: LeadTimeline[];

    @OneToOne(() => Product, { eager: true ,nullable:true, cascade: true})
    @JoinColumn({ name: 'productId'})
    product: Product;

    @OneToOne(() => Service, { eager: true , nullable:true , cascade: true})
    @JoinColumn({ name: 'serviceId'})
    service: Service;

    @Column('simple-array',{nullable:true})
    documents: string[];

    @Column({nullable:true})
    agentId: number; 

}
