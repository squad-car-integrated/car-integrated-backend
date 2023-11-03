import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ServiceEmployeesProps {
  serviceId: UniqueEntityID
  employeeId: UniqueEntityID
}
export class ServiceEmployee extends AggregateRoot<ServiceEmployeesProps> {
  get serviceId() {
    return this.props.serviceId
  }
  get employeeId() {
    return this.props.employeeId
  }
  static create(props: ServiceEmployeesProps, id?: UniqueEntityID) {
    const employee = new ServiceEmployee(props, id)
    return employee
  }
}
