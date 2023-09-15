import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { CreateEmployeeUseCase } from "@/domain/workshop/application/use-cases/Employee/create-employee";
import { UserAlreadyExistsError } from "@/domain/workshop/application/use-cases/errors/user-already-exists-error";
const accountSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})
type AccountBodySchema = z.infer<typeof accountSchema>
@Controller("/employee")
export class EmployeeController {
    constructor(private createEmployee: CreateEmployeeUseCase ){}
    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(accountSchema))
    async handleRegisterEmployee(@Body() body: AccountBodySchema){
        const {name, email, password} = body

        const result = await this.createEmployee.execute({
            name,
            email,
            password,
            monthWorkedHours: 0,
        })
        if(result.isLeft()){
            const error = result.value
            switch (error.constructor){
                case UserAlreadyExistsError:
                    throw new ConflictException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
            
        }
    }
}