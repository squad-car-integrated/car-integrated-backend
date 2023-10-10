import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/create-employee'
import { UserAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/user-already-exists-error'
import { GetEmployeeByEmailUseCase } from '@/domain/workshop/application/use-cases/Employee/get-employee-by-email'
import { EmployeePresenter } from '../presenters/employee-presentet'
const accountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})
const employeeEmailSchema = z.object({
  email: z.string().email(),
})
type AccountBodySchema = z.infer<typeof accountSchema>
type EmployeeEmailBodySchema = z.infer<typeof employeeEmailSchema>
@Controller('/employee')
export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployeeUseCase,
    private getEmployeeByEmail: GetEmployeeByEmailUseCase
  ) {}
  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(employeeEmailSchema))
  async handleGetEmployeeById(@Body() body: EmployeeEmailBodySchema) {
    const { email } = body
    const result = await this.getEmployeeByEmail.execute({
      email,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const employee = result.value.employee
    return {
      employee: EmployeePresenter.toHTTP(employee),
    }
  }
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(accountSchema))
  async handleRegisterEmployee(@Body() body: AccountBodySchema) {
    const { name, email, password } = body

    const result = await this.createEmployee.execute({
      name,
      email,
      password,
      monthWorkedHours: 0,
    })
    if (result.isLeft()) {
      const error = result.value
      if(error instanceof UserAlreadyExistsError){
        throw new ConflictException(error.message)
      }else {
        throw new BadRequestException(error.message)
      }
    }
  }
}
