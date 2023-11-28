import { PaginationParams } from '@/core/repositories/pagination-params'
import { Employee } from '../../enterprise/entities/employee'

export abstract class EmployeesRepository {
    abstract findById(id: string): Promise<Employee | null>
    abstract findByEmail(email: string): Promise<Employee | null>
    abstract getAll(params: PaginationParams): Promise<Employee[]>
    abstract create(employee: Employee): Promise<void>
    abstract save(employee: Employee): Promise<void>
    abstract delete(employee: Employee): Promise<void>
    abstract getNumberOfPages(): Promise<number>
}
