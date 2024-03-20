import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Leads } from "../entities/lead.entity";
import { AbstractEntity } from "@app/common";

@Entity()
export class LeadTimeline extends AbstractEntity<LeadTimeline>{
    @ManyToOne(() => Leads, lead => lead.timelines)
    @JoinColumn({ name: 'leadId' })
    lead: Leads;

    @Column()
    attribute: string;

    @Column()
    value: string;

    @CreateDateColumn()
    createdAt: Date;
}