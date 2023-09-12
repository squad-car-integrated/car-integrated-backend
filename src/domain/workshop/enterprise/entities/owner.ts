import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "./user";
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

    static create(props: OwnerProps, id?: UniqueEntityID) {
        const owner = new Owner({
            ...props,
        }, id);
        return owner;
    }
}