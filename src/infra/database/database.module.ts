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
import { ServicesRepository } from '@/domain/workshop/application/repositories/services-repository'
import { PrismaServicesRepository } from './prisma/repositories/prisma-service-repositoryt'
import { ServiceProductsRepository } from '@/domain/workshop/application/repositories/service-products-repository'
import { PrismaServiceProductsRepository } from './prisma/repositories/prisma-service-products-repository'
import { ServiceEmployeesRepository } from '@/domain/workshop/application/repositories/service-employees-repository'
import { PrismaServiceEmployeesRepository } from './prisma/repositories/prisma-service-employees-repository'

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
    {
      provide: ServicesRepository,
      useClass: PrismaServicesRepository
    },
    {
      provide: ServiceProductsRepository,
      useClass: PrismaServiceProductsRepository
    },
    {
      provide: ServiceEmployeesRepository,
      useClass: PrismaServiceEmployeesRepository
    }
  ],
  exports: [
    PrismaService,
    EmployeesRepository,
    OwnersRepository,
    AutomobilesRepository,
    ProductsRepository,
    ServicesRepository,
    ServiceProductsRepository,
    ServiceEmployeesRepository
  ],
})
export class DatabaseModule {}
