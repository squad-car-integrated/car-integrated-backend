import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ServiceEmployeesProps {
  serviceId: UniqueEntityID
  employeeId: UniqueEntityID
}
export class ServiceEmployees extends Entity<ServiceEmployeesProps> {
  get serviceId() {
    return this.props.serviceId
  }
  get employeeId() {
    return this.props.employeeId
  }
  static create(props: ServiceEmployeesProps, id?: UniqueEntityID) {
    const employee = new ServiceEmployees(props, id)
    return employee
  }
}
