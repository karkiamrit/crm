import { AbstractEntity } from "@app/common";
import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity()
export class Listing extends AbstractEntity<Listing>{
    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    propertyType: string;

    @Column()
    offerType: string;

    @Column()
    listingAddress: string;

    @Column()
    listingCity: string;

    @Column()
    floor: number;

    @Column({type: "float"})
    buildingArea: number;

    @Column({type: "float"})
    surfaceArea: number;

    @Column()
    propertyStatus: string;

    @CreateDateColumn()
    createdAt: Date;
}
