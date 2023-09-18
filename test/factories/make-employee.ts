import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Employee,
  EmployeeProps,
} from '@/domain/workshop/enterprise/entities/employee'
import { faker } from '@faker-js/faker'
export function makeEmployee(
  override: Partial<EmployeeProps> = {},
  id?: UniqueEntityID,
) {
  const employee = Employee.create(
    {
      name: faker.person.fullName(),
      monthWorkedHours: faker.number.int({ min: 1, max: 100 }),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: ['User'],
      ...override,
    },
    id,
  )
  return employee
}
