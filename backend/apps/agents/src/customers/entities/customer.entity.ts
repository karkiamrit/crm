import { AbstractEntity } from "@app/common";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CustomerTimeline } from "../../shared/objects/timelines/timelines.entity";
import { Product } from "../../shared/objects/products/products.entity";
import { Service } from "../../shared/objects/services/services.entity";
import { LeadType } from "../../shared/data";
import { Invoice } from "../../invoices/entities/invoice.entity";



@Entity()
export class Customers extends AbstractEntity<Customers>{

    @Column()
    address: string;

    @Column({ default: LeadType.SOLE, type: 'enum', enum: LeadType })
    type: LeadType;
  
    @Column()
    details: string;

    @Column()
    phone: string;

    @Column()
    email: string;
   
    @Column()
    name: string;

    @Column({default:0, nullable: true})
    priority: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable:true})  
    source: string; //eg: facebook, email etc

    @OneToMany(() => CustomerTimeline, timeline => timeline.customer, {eager:true, onDelete: 'CASCADE'})
    timelines: CustomerTimeline[];

    @OneToOne(() => Product, { eager: true ,nullable:true, cascade: true})
    @JoinColumn({ name: 'productId'})
    product: Product;

    @OneToMany(() => Invoice, invoice => invoice.customer)
    invoices: Invoice[];

    @OneToOne(() => Service, { eager: true , nullable:true , cascade: true})
    @JoinColumn({ name: 'serviceId'})
    service: Service;

    @Column('simple-array',{nullable:true})
    documents: string[];

    @Column({nullable:true})
    agentId: number; 
}
