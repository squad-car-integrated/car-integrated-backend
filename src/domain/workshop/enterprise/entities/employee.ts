import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "./user";
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

    static create(props: EmployeeProps, id?: UniqueEntityID) {
        const employee = new Employee({
            ...props,
        }, id);
        return employee;
    }
}