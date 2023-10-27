import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaEmployeesRepository } from './prisma/repositories/prisma-employee-repository'
import { PrismaOwnersRepository } from './prisma/repositories/prisma-owner-repository'
import { OwnersRepository } from '@/domain/workshop/application/repositories/owners-repository'
import { EmployeesRepository } from '@/domain/workshop/application/repositories/employees-repository'
import { AutomobilesRepository } from '@/domain/workshop/application/repositories/automobiles-repository'
import { PrismaAutomobilesRepository } from './prisma/repositories/prisma-automobile-repository'
import { ProductsRepository } from '@/domain/workshop/application/repositories/products-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-product-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: OwnersRepository,
      useClass: PrismaOwnersRepository,
    },
    {
      provide: EmployeesRepository,
      useClass: PrismaEmployeesRepository,
    },
    {
      provide: AutomobilesRepository,
      useClass: PrismaAutomobilesRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [
    PrismaService,
    EmployeesRepository,
    OwnersRepository,
    AutomobilesRepository,
    ProductsRepository,
  ],
})
export class DatabaseModule {}
