import { AbstractEntity } from "@app/common";
import { Invoice } from "apps/agents/src/invoices/entities/invoice.entity";
import { Column, Entity, ManyToOne  } from "typeorm";

@Entity()
export class Product extends AbstractEntity<Product> {
    @Column({nullable:true})
    name: string;

    @Column({nullable:true})
    description: string;

    @Column({nullable:true})
    quantity: number;

    @Column({nullable:true})
    price: number;

    @Column({nullable:true})
    total: number;

    @ManyToOne(() => Invoice, invoice => invoice.products, {onDelete: 'CASCADE'})
    invoice: Invoice;

    toJSON() {
      const { invoice, ...otherProperties } = this;
      return otherProperties;
    }
}