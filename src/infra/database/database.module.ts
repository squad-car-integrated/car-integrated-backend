import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaEmployeesRepository } from "./prisma/repositories/prisma-employee-repository";
import { PrismaOwnersRepository } from "./prisma/repositories/prisma-owner-repository";
import { OwnersRepository } from "@/domain/workshop/application/repositories/owners-repository";
import { EmployeesRepository } from "@/domain/workshop/application/repositories/employees-repository";

@Module({
    providers: [
        PrismaService,
        {
            provide: OwnersRepository,
            useClass:PrismaOwnersRepository
        },
        {
            provide: EmployeesRepository,
            useClass: PrismaEmployeesRepository
        },
    ],
    exports: [PrismaService,PrismaEmployeesRepository, PrismaOwnersRepository]
})
export class DatabaseModule{

}