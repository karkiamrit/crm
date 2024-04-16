import { AbstractEntity } from "@app/common";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Leads } from "../../leads/entities/lead.entity";

@Entity()
export class Document extends AbstractEntity<Document> {
  @Column()
  name: string;

  @Column({nullable:true})
  description: string;

  @Column({nullable:true})
  documentFile: string;

  @Column()
  createdBy: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Leads, lead => lead.officialDocs, {eager: true , onDelete: "CASCADE"})
  @JoinColumn({ name: 'leadId' }) 
  lead: Leads;
}