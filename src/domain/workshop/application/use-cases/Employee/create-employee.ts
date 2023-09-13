import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { EmployeeRepository } from "../../repositories/employee-repository"
import { Employee } from "../../../enterprise/entities/employee"
interface CreateEmployeeUseCaseRequest {
    monthWorkedHours: number
    name: string
    email: string
    password: string
}
type CreateEmployeeUseCaseResponse = Either<null, {
    employee: Employee
}>
@Injectable()
export class CreateEmployeeUseCase { 
    constructor(
        private employeeRepository: EmployeeRepository,
    ){}
    async execute({name, monthWorkedHours, email,password}: CreateEmployeeUseCaseRequest) : Promise<CreateEmployeeUseCaseResponse> {
        const employee = Employee.create({
            name,
            monthWorkedHours,
            email,
            password,
        })
        await this.employeeRepository.create(employee)
        return right({
            employee
        })
    }
    
}