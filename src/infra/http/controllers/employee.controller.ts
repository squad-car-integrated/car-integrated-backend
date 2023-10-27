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
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/create-employee'
import { UserAlreadyExistsError } from '@/domain/workshop/application/use-cases/errors/user-already-exists-error'
import { EmployeePresenter } from '../presenters/employee-presenter'
import { DeleteEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/delete-employee'
import { GetEmployeeByIdUseCase } from '@/domain/workshop/application/use-cases/Employee/get-employee-by-id'
import { Public } from '@/infra/auth/public'
import { EditEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/edit-employee'
const employeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  monthWorkedHours: z.number()
})
type EmployeeBodySchema = z.infer<typeof employeeSchema>
@Controller('/employee')
export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployeeUseCase,
    private getEmployeeById: GetEmployeeByIdUseCase,
    private deleteEmployee: DeleteEmployeeUseCase,
    private editEmployee: EditEmployeeUseCase
  ) {}
  @Get("/:id")
  @HttpCode(200)
  async handleGetEmployeeById(@Param("id") employeeId: string) {
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
  @Public()
  @HttpCode(201)
  async handleRegisterEmployee(@Body(new ZodValidationPipe(employeeSchema)) body: EmployeeBodySchema) {
    const { name, email, password, monthWorkedHours } = body

    const result = await this.createEmployee.execute({
      name,
      email,
      password,
      monthWorkedHours,
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
  @Put('/:id')
  @HttpCode(204)
  async handleEditEmployee(@Body(new ZodValidationPipe(employeeSchema)) body: EmployeeBodySchema, @Param("id") employeeId: string) {
    const { name, email, password, monthWorkedHours } = body
    const result = await this.editEmployee.execute({
      employeeId,
      name,
      email,
      password,
      monthWorkedHours,
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
