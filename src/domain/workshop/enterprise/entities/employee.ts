import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from './user'
import { Optional } from '@/core/types/optional'
import { ApiProperty } from '@nestjs/swagger'
export interface EmployeeProps extends UserProps {
    monthWorkedHours: number
}

export class Employee extends User<EmployeeProps> {
    @ApiProperty({ example: 60, description: 'The amount of worked hours' })
    get monthWorkedHours() {
        return this.props.monthWorkedHours
    }
    set monthWorkedHours(workedHours: number) {
        this.props.monthWorkedHours = workedHours
        this.touch()
    }
    static create(
        props: Optional<EmployeeProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const employee = new Employee(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )
        return employee
    }
}
