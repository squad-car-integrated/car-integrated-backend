import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
export interface UserProps {
    name: string
    email: string
    password: string
}
export abstract class User<Props extends UserProps> extends Entity<Props>{
    get name(){
        return this.props.name
    }
    get email(){
        return this.props.email
    }
    get password(){
        return this.props.password
    }
}