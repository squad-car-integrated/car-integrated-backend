import { PaginationParams } from '@/core/repositories/pagination-params'
import { EmployeesRepository } from '@/domain/workshop/application/repositories/employees-repository'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'

export class InMemoryEmployeesRepository implements EmployeesRepository {
    getNumberOfPages(): Promise<number> {
        return new Promise((resolve) => {
            const numberOfAutomobiles = this.items.length;
            const carsPerPage = 20;
            const totalPages = Math.ceil(numberOfAutomobiles / carsPerPage);
            resolve(totalPages);
        });
    }
    async findByEmail(email: string) {
        const employee = this.items.find((item) => item.email === email)
        if (!employee) {
            return null
        }
        return employee
    }
    async getAll({ page }: PaginationParams) {
        const sortedEmployee = this.items
            .slice()
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        const employee = sortedEmployee.slice((page - 1) * 20, page * 20)
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
        const itemIndex = this.items.findIndex(
            (item) => item.id === employee.id,
        )
        this.items[itemIndex] = employee
    }
    async delete(employee: Employee) {
        const itemIndex = this.items.findIndex(
            (item) => item.id === employee.id,
        )
        this.items.splice(itemIndex, 1)
    }
}
