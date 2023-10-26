import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/create-employee'
import { UserAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/user-already-exists-error'
import { EmployeePresenter } from '../presenters/employee-presenter'
import { DeleteEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/delete-employee'
import { GetEmployeeByIdUseCase } from '@/domain/workshop/application/use-cases/Employee/get-employee-by-id'
const accountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})
type AccountBodySchema = z.infer<typeof accountSchema>
@Controller('/employee')
export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployeeUseCase,
    private getEmployeeById: GetEmployeeByIdUseCase,
    private deleteEmployee: DeleteEmployeeUseCase
  ) {}
  @Get()
  @HttpCode(200)
  async handleGetEmployeeById(@Param() employeeId: string) {
    const result = await this.getEmployeeById.execute({
      id: employeeId,
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
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      } else {
        throw new BadRequestException(error.message)
      }
    }
  }
  @Delete("/:id")
  @HttpCode(204)
  async handleDeleteEmployee(@Param("id") employeeId: string) {

    const result = await this.deleteEmployee.execute({
      employeeId
    })
    if (result.isLeft()) {
      const error = result.value
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      } else {
        throw new BadRequestException(error.message)
      }
    }
  }
}
