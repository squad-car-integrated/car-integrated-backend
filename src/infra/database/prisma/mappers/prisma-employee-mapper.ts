import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { Employee as PrismaEmployee, Prisma } from '@prisma/client'

export class PrismaEmployeeMapper {
  static toDomain(raw: PrismaEmployee): Employee {
    return Employee.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        monthWorkedHours: raw.monthWorkedHours,
      },
      new UniqueEntityID(raw.id),
    )
  }
  static toPrisma(employee: Employee): Prisma.EmployeeUncheckedCreateInput {
    return {
      id: employee.id.toString(),
      name: employee.name,
      email: employee.email,
      password: employee.password,
      monthWorkedHours: employee.monthWorkedHours,
    }
  }
}
