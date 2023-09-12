import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface ProductProps {
    name: string
    unitValue: number
    productAmout: number
    description: string
    photo: string
    createdAt: Date
    updatedAt?: Date
}
export class Product extends Entity<ProductProps>{
    get name(){
        return this.props.name;
    }
    get unitValue(){
        return this.props.unitValue;
    }
    get productAmout(){
        return this.props.productAmout;
    }
    get description() {
        return this.props.description
    }
    get photo() {
        return this.props.photo
    }
    get createdAt(){
        return this.props.createdAt;
    }
    get updatedAt(){
        return this.props.updatedAt;
    }
    private touch(){
        this.props.updatedAt = new Date();
    }
    set name(name: string){
        this.props.name = name;
        this.touch()
    }
    set unitValue(unitValue: number){
        this.props.unitValue = unitValue;
        this.touch()
    }
    set productAmout(productAmout: number){
        this.props.productAmout = productAmout;
        this.touch()
    }
    set description(description: string){
        this.props.description = description;
        this.touch()
    }
    set photo(photo: string){
        this.props.photo = photo;
        this.touch()
    }
    static create(props: Optional<ProductProps, "createdAt" | "photo"> , id?: UniqueEntityID){
        const product = new Product({
            ...props,
            photo: props.photo ?? "",
            createdAt: new Date(),
        }, id)
        return product;
    }  
}