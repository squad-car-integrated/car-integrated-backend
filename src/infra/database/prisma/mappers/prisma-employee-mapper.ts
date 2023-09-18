import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { Employee as PrismaEmployee, Prisma, UserRole } from '@prisma/client'

export class PrismaEmployeeMapper {
  static toDomain(raw: PrismaEmployee): Employee {
    return Employee.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        monthWorkedHours: raw.monthWorkedHours,
        roles: [raw.role],
      },
      new UniqueEntityID(raw.id),
    )
  }
  static toPrisma(employee: Employee): Prisma.EmployeeUncheckedCreateInput {
    return {
      name: employee.name.toString(),
      email: employee.email.toString(),
      password: employee.password.toString(),
      monthWorkedHours: employee.monthWorkedHours,
      role: UserRole.EMPLOYEE,
    }
  }
}
