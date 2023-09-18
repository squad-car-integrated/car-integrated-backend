import { Employee } from '../../enterprise/entities/employee'

export abstract class EmployeesRepository {
  abstract findById(id: string): Promise<Employee | null>
  abstract findByEmail(email: string): Promise<Employee | null>
  abstract create(employee: Employee): Promise<void>
  abstract save(employee: Employee): Promise<void>
  abstract delete(employee: Employee): Promise<void>
}
