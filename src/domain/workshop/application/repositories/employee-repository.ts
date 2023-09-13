import { PaginationParams } from "@/core/repositories/pagination-params";
import { Employee } from "../../enterprise/entities/employee";

export abstract class EmployeeRepository {
    abstract findById(id: string): Promise<Employee | null>
    abstract findManyRecent(params: PaginationParams): Promise<Employee[]>
    abstract create(employee: Employee): Promise<void>
    abstract save(employee: Employee): Promise<void>
    abstract delete(employee: Employee): Promise<void>
}