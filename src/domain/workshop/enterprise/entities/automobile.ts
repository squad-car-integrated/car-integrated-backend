import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface AutomobileProps {
    model: string
    brand: string
    plate: string
    ownerId: UniqueEntityID
    createdAt: Date
    updatedAt?: Date
}
export class Automobile extends Entity<AutomobileProps>{
    get model(){
        return this.props.model;
    }
    get brand(){
        return this.props.brand;
    }
    get plate(){
        return this.props.plate;
    }
    get createdAt(){
        return this.props.createdAt;
    }
    get updatedAt(){
        return this.props.updatedAt;
    }
    static create(props: Optional<AutomobileProps, "createdAt"> , id?: UniqueEntityID){
        const automobile = new Automobile({
            ...props,
            createdAt: new Date(),
        }, id)
        return automobile;
    }  
}