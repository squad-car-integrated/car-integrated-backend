import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateUserUseCase } from "@/domain/workshop/application/use-cases/Authenticate/authenticate-user";
import { CreateOwnerUseCase } from "@/domain/workshop/application/use-cases/Owner/create-owner";
import { CreateEmployeeUseCase } from "@/domain/workshop/application/use-cases/Employee/create-employee";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { EmployeeController } from "./controllers/employee.controller";
import { OwnerController } from "./controllers/owner.controller";
import { GetOwnerByIdUseCase } from "@/domain/workshop/application/use-cases/Owner/get-owner-by-id";
import { GetEmployeeByIdUseCase } from "@/domain/workshop/application/use-cases/Employee/get-employee-by-id";
import { GetOwnerByEmailUseCase } from "@/domain/workshop/application/use-cases/Owner/get-owner-by-email";

@Module({
    imports: [
        DatabaseModule,
        CryptographyModule,
    ],
    controllers: [AuthenticateController, EmployeeController, OwnerController],
    providers: [AuthenticateUserUseCase, CreateOwnerUseCase, CreateEmployeeUseCase, GetOwnerByEmailUseCase, GetEmployeeByIdUseCase]
})
export class HttpModule{
    
}