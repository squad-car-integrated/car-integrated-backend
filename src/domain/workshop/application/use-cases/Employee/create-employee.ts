import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { EmployeesRepository } from "../../repositories/employees-repository"
import { Employee } from "../../../enterprise/entities/employee"
import { UserAlreadyExistsError } from "../errors/user-already-exists-error"
interface CreateEmployeeUseCaseRequest {
    monthWorkedHours: number
    name: string
    email: string
    password: string
    roles: string[]
}
type CreateEmployeeUseCaseResponse = Either<UserAlreadyExistsError, {
    employee: Employee
}>
@Injectable()
export class CreateEmployeeUseCase { 
    constructor(
        private employeeRepository: EmployeesRepository,
    ){}
    async execute({name, monthWorkedHours, email,password,roles}: CreateEmployeeUseCaseRequest) : Promise<CreateEmployeeUseCaseResponse> {
        const employee = Employee.create({
            name,
            monthWorkedHours,
            email,
            password,
            roles,
        })
        await this.employeeRepository.create(employee)
        return right({
            employee
        })
    }
    
}