import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Employee,
  EmployeeProps,
} from '@/domain/workshop/enterprise/entities/employee'
import { PrismaEmployeeMapper } from '@/infra/database/prisma/mappers/prisma-employee-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
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
@Injectable()
export class EmployeeFactory {
    constructor(private prisma: PrismaService) {}
    async makePrismaEmployee(
        data: Partial<EmployeeProps> = {},
    ): Promise<Employee> {
        const employee = makeEmployee(data)
        await this.prisma.employee.create({
            data: PrismaEmployeeMapper.toPrisma(employee),
        })
        return employee
    }
}