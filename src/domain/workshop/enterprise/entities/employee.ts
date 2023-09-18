import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from './user'
import { Optional } from '@/core/types/optional'
export interface EmployeeProps extends UserProps {
  monthWorkedHours: number
}

export class Employee extends User<EmployeeProps> {
  get monthWorkedHours() {
    return this.props.monthWorkedHours
  }
  set monthWorkedHours(workedHours: number) {
    this.props.monthWorkedHours = workedHours
    this.touch()
  }
  static create(
    props: Optional<EmployeeProps, 'createdAt' | 'roles'>,
    id?: UniqueEntityID,
  ) {
    const employee = new Employee(
      {
        ...props,
        roles: props.roles ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return employee
  }
}
