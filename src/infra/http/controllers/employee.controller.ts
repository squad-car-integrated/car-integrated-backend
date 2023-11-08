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
  Query,
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
import { FetchAllEmployeesUseCase } from '@/domain/workshop/application/use-cases/Employee/fetch-all-employees'
import { ApiBearerAuth, ApiBody, ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiUnprocessableEntityResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
const employeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  monthWorkedHours: z.number()
})
const pageQueryParamSchema = z.string().optional().default("1").transform(Number).pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type EmployeeBodySchema = z.infer<typeof employeeSchema>
@ApiTags('CarIntegrated')
@ApiBearerAuth('defaultBearerAuth')
@Controller('/employee')
export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployeeUseCase,
    private getEmployeeById: GetEmployeeByIdUseCase,
    private deleteEmployee: DeleteEmployeeUseCase,
    private editEmployee: EditEmployeeUseCase,
    private getAllEmployees: FetchAllEmployeesUseCase
  ) {}
  @Get()
  @ApiOperation({ summary: 'Fetch employee by page' })
  @HttpCode(200)
  async handleFetchEmployee(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.getAllEmployees.execute({page})
    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const employees = result.value.employees
    return {
      employees : employees.map(EmployeePresenter.toHTTP)
    }
  }
  @Get("/:id")
  @HttpCode(200)
  //Swagger
  @ApiOperation({ summary: 'Find employee by id'})
  @ApiResponse({
    status: 200,
    description: 'Car found',
    type: Employee,
  })
  //Fim do Swagger
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
  //Swagger
  @ApiOperation({ summary: 'Create Employee'})
  @ApiResponse({
    status: 201,
    description: 'Created Employee',
    type: Employee,
  })
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiBody({
    type: Employee,
    description: 'Json structure for Employee object'
  })
  //Fim do Swagger
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
  //Swagger
  @ApiOperation({ summary: 'Delete Employee'})
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  //Fim do Swagger
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
  //Swagger
  @ApiOperation({ summary: 'Edit Employee by id'})
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({
    type: Employee,
    description: 'Json structure for user object'
  })
  @ApiResponse({
    status: 200,
    description: 'Employee edited',
    type: Employee,
  })
  //Fim do Swagger
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
