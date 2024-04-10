import { AbstractEntity } from "@app/common";
import { Column, Entity  } from "typeorm";

@Entity()
export class Product extends AbstractEntity<Product> {
    @Column({nullable:true})
    name: string;
}