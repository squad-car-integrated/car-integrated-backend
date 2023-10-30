import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateUserUseCase } from '@/domain/workshop/application/use-cases/Authenticate/authenticate-user'
import { CreateOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/create-owner'
import { CreateEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/create-employee'
import { AuthenticateController } from './controllers/authenticate.controller'
import { EmployeeController } from './controllers/employee.controller'
import { OwnerController } from './controllers/owner.controller'
import { AutomobileController } from './controllers/automobile.controller'
import { CreateAutomobileUseCase } from '@/domain/workshop/application/use-cases/Automobile/create-automobile'
import { GetAutomobileByIdUseCase } from '@/domain/workshop/application/use-cases/Automobile/get-automobile-by-id'
import { FetchRecentAutomobilesUseCase } from '@/domain/workshop/application/use-cases/Automobile/fetch-recent-automobile'
import { GetEmployeeByIdUseCase } from '@/domain/workshop/application/use-cases/Employee/get-employee-by-id'
import { GetOwnerByIdUseCase } from '@/domain/workshop/application/use-cases/Owner/get-owner-by-id'
import { DeleteEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/delete-employee'
import { DeleteOwnerUseCase } from '@/domain/workshop/application/use-cases/Owner/delete-owner'
import { EditAutomobileUseCase } from '@/domain/workshop/application/use-cases/Automobile/edit-automobile'
import { CreateProductUseCase } from '@/domain/workshop/application/use-cases/Product/create-product'
import { GetProductByIdUseCase } from '@/domain/workshop/application/use-cases/Product/get-product-by-id'
import { FetchRecentProductsUseCase } from '@/domain/workshop/application/use-cases/Product/fetch-recent-products'
import { EditProductUseCase } from '@/domain/workshop/application/use-cases/Product/edit-product'
import { ProductController } from './controllers/product.controller'
import { EditEmployeeUseCase } from '@/domain/workshop/application/use-cases/Employee/edit-employee'
import { FetchAllEmployeesUseCase } from '@/domain/workshop/application/use-cases/Employee/fetch-all-employees'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    EmployeeController,
    OwnerController,
    AutomobileController,
    ProductController,
  ],
  providers: [
    AuthenticateUserUseCase,

    CreateOwnerUseCase,
    GetOwnerByIdUseCase,
    DeleteOwnerUseCase,

    FetchAllEmployeesUseCase,
    CreateEmployeeUseCase,
    GetEmployeeByIdUseCase,
    DeleteEmployeeUseCase,
    EditEmployeeUseCase,

    CreateAutomobileUseCase,
    GetAutomobileByIdUseCase,
    FetchRecentAutomobilesUseCase,
    EditAutomobileUseCase,

    CreateProductUseCase,
    GetProductByIdUseCase,
    FetchRecentProductsUseCase,
    EditProductUseCase
  ],
})
export class HttpModule {}
