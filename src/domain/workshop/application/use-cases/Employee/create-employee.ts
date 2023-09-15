import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { EmployeesRepository } from "../../repositories/employees-repository"
import { Employee } from "../../../enterprise/entities/employee"
import { UserAlreadyExistsError } from "../errors/user-already-exists-error"
import { HashGenerator } from "../../cryptography/hasher-generator"
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
        private hashGenerator: HashGenerator
    ){}
    async execute({name, monthWorkedHours, email,password,roles}: CreateEmployeeUseCaseRequest) : Promise<CreateEmployeeUseCaseResponse> {
        const employeeWithSameEmail = await this.employeeRepository.findByEmail(email)
        if(employeeWithSameEmail){
            return left(new UserAlreadyExistsError(email)) 
        }
        const hashedPassword = await this.hashGenerator.hash(password)
        const employee = Employee.create({
            name,
            monthWorkedHours,
            email,
            password: hashedPassword,
            roles,
        })
        await this.employeeRepository.create(employee)
        return right({
            employee
        })
    }
    
}