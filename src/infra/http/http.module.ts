import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateUserUseCase } from "@/domain/workshop/application/use-cases/Authenticate/authenticate-user";
import { AuthenticateController } from "./controllers/account.controller";

@Module({
    imports: [
        DatabaseModule,
        CryptographyModule,
    ],
    controllers: [AuthenticateController],
    providers: [AuthenticateUserUseCase]
})
export class HttpModule{
    
}