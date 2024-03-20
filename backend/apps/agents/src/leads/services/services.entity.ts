import { AbstractEntity } from "@app/common";
import { Column, Entity } from "typeorm";

@Entity()
export class Service extends AbstractEntity<Service> {
    @Column()
    name: string;
}