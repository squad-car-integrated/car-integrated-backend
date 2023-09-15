import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { CreateOwnerUseCase } from "@/domain/workshop/application/use-cases/Owner/create-owner";
import { UserAlreadyExistsError } from "@/domain/workshop/application/use-cases/errors/user-already-exists-error";
import { CreateEmployeeUseCase } from "@/domain/workshop/application/use-cases/Employee/create-employee";
const accountSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    phoneNumber: z.string().optional(),
    roles: z.array(z.string())
})
type AccountBodySchema = z.infer<typeof accountSchema>
@Controller("/accounts")
export class AccountController {
    constructor(private createOwner: CreateOwnerUseCase, private createEmployee: CreateEmployeeUseCase ){}
    
    @Post("/owner")
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(accountSchema))
    async handleRegisterOwner(@Body() body: AccountBodySchema){
        const {name, email, password, phoneNumber, roles} = body

        const result = await this.createOwner.execute({
            name,
            email,
            password,
            phoneNumber : phoneNumber ?? "",
            roles
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
    @Post("/employee")
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(accountSchema))
    async handleRegisterEmployee(@Body() body: AccountBodySchema){
        const {name, email, password, roles} = body

        const result = await this.createEmployee.execute({
            name,
            email,
            password,
            monthWorkedHours: 0,
            roles
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