import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "./user";
import { Optional } from "@/core/types/optional";
export interface OwnerProps extends UserProps{
    phoneNumber: string;
    createdAt: Date
    updatedAt?: Date | null
}

export class Owner extends User<OwnerProps> {
    get phoneNumber() {
        return this.props.phoneNumber;
    }
    get createdAt(){
        return this.props.createdAt
    }
    get updatedAt(){
        return this.props.updatedAt
    }
    private touch(){
        this.props.updatedAt = new Date();
    }
    set monthWorkedHours(phoneNumber: string) {
        this.props.phoneNumber = phoneNumber
        this.touch()
    }

    static create(props: Optional<OwnerProps, "createdAt">, id?: UniqueEntityID) {
        const owner = new Owner({
            ...props,
            createdAt: new Date()
        }, id);
        return owner;
    }
}