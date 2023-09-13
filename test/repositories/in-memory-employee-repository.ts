import { PaginationParams } from "@/core/repositories/pagination-params";
import { EmployeeRepository } from "@/domain/workshop/application/repositories/employee-repository";
import { Employee } from "@/domain/workshop/enterprise/entities/employee";

export class InMemoryEmployeeRepository implements EmployeeRepository {
    async findManyRecent({page}: PaginationParams) {
        const employees = this.items
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice((page - 1) * 20, page * 20)
        return employees
    }
    public items: Employee[] = [];
    async findById(id: string){
        const employee = this.items.find(item => item.id.toString() === id);
        if(!employee){
            return null
        }
        return employee
    }
    async create(employee: Employee) {
        this.items.push(employee);
    }
    async save(employee: Employee){
        const itemIndex = this.items.findIndex(item => item.id === employee.id)
        this.items[itemIndex] = employee
    }
    async delete(employee: Employee) {
        const itemIndex = this.items.findIndex(item => item.id === employee.id)
        this.items.splice(itemIndex, 1)
    }
}