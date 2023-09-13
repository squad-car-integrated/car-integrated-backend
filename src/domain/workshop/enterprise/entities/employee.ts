import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "./user";
import { Optional } from "@/core/types/optional";
export interface EmployeeProps extends UserProps{
    monthWorkedHours: number;
    createdAt: Date
    updatedAt?: Date | null
}

export class Employee extends User<EmployeeProps> {
    get monthWorkedHours() {
        return this.props.monthWorkedHours;
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
    set monthWorkedHours(workedHours: number) {
        this.props.monthWorkedHours = workedHours
        this.touch()
    }

    static create(props: Optional<EmployeeProps, "createdAt">, id?: UniqueEntityID) {
        const employee = new Employee({
            ...props,
            createdAt: new Date()
        }, id);
        return employee;
    }
}