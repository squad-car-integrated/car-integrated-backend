import { PaginationParams } from '@/core/repositories/pagination-params'
import { EmployeesRepository } from '@/domain/workshop/application/repositories/employees-repository'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'

export class InMemoryEmployeesRepository implements EmployeesRepository {
  async findByEmail(email: string) {
    const employee = this.items.find((item) => item.email === email)
    if (!employee) {
      return null
    }
    return employee
  }
  public items: Employee[] = []
  async findById(id: string) {
    const employee = this.items.find((item) => item.id.toString() === id)
    if (!employee) {
      return null
    }
    return employee
  }
  async create(employee: Employee) {
    this.items.push(employee)
  }
  async save(employee: Employee) {
    const itemIndex = this.items.findIndex((item) => item.id === employee.id)
    this.items[itemIndex] = employee
  }
  async delete(employee: Employee) {
    const itemIndex = this.items.findIndex((item) => item.id === employee.id)
    this.items.splice(itemIndex, 1)
  }
}
