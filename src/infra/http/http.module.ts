import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateUserUseCase } from '@/domain/workshop/application/use-cases/Authenticate/authenticate-user'
import { CreateOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/create-owner'
import { CreateEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/create-employee'
import { AuthenticateController } from './controllers/authenticate.controller'
import { EmployeeController } from './controllers/employee.controller'
import { OwnerController } from './controllers/owner.controller'
import { GetOwnerByEmailUseCase } from '@/domain/workshop/application/use-cases/Owner/get-owner-by-email'
import { GetEmployeeByEmailUseCase } from '@/domain/workshop/application/use-cases/Employee/get-employee-by-email'
import { AutomobileController } from './controllers/automobile.controller'
import { CreateAutomobileUseCase } from '@/domain/workshop/application/use-cases/Automobile/create-automobile'
import { GetAutomobileByIdUseCase } from '@/domain/workshop/application/use-cases/Automobile/get-automobile-by-id'
import { FetchRecentAutomobilesUseCase } from '@/domain/workshop/application/use-cases/Automobile/fetch-recent-automobile'
import { GetEmployeeByIdUseCase } from '@/domain/workshop/application/use-cases/Employee/get-employee-by-id'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    EmployeeController,
    OwnerController,
    AutomobileController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateOwnerUseCase,
    GetOwnerByEmailUseCase,
    CreateEmployeeUseCase,
    GetEmployeeByIdUseCase,
    CreateAutomobileUseCase,
    GetAutomobileByIdUseCase,
    FetchRecentAutomobilesUseCase
  ],
})
export class HttpModule {}
