import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ServiceEmployee,
  ServiceEmployeesProps,
} from '@/domain/workshop/enterprise/entities/service-employees'

export function makeServiceEmployee(
  override: Partial<ServiceEmployeesProps> = {},
  id?: UniqueEntityID,
) {
  const serviceemployee = ServiceEmployee.create(
    {
      serviceId: new UniqueEntityID(),
      employeeId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
  return serviceemployee
}
