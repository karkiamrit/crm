import { AbstractEntity } from "@app/common";
import { Column, Entity } from "typeorm";

@Entity()
export class Organization extends AbstractEntity<Organization>{
    @Column()
    email: string;

    @Column()
    name: string;

    @Column({nullable:true})
    description: string;

    @Column({nullable:true})
    logo: string;

    @Column()
    address: string;

    @Column()
    phone: string;
}
