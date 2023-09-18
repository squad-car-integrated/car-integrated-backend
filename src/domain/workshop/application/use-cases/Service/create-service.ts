import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ServicesRepository } from '../../repositories/services-repository'
import { Service } from '../../../enterprise/entities/service'
import { ServiceProductList } from '@/domain/workshop/enterprise/entities/service-product-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import { ServiceProducts } from '@/domain/workshop/enterprise/entities/service-products'
import { ServiceEmployees } from '@/domain/workshop/enterprise/entities/service-employees'
import { ServiceEmployeeList } from '@/domain/workshop/enterprise/entities/service-employee-list'
interface CreateServiceUseCaseRequest {
  automobileId: string
  ownerId: string
  employeesIds: string[]
  productsIds: string[]
  totalValue: number
  description: string
  status: ServiceStatus
}
type CreateServiceUseCaseResponse = Either<
  null,
  {
    service: Service
  }
>
@Injectable()
export class CreateServiceUseCase {
  constructor(private serviceRepository: ServicesRepository) {}
  async execute({
    automobileId,
    ownerId,
    employeesIds,
    productsIds,
    totalValue,
    description,
    status,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const service = Service.create({
      automobileId: new UniqueEntityID(automobileId),
      ownerId: new UniqueEntityID(ownerId),
      totalValue,
      description,
      status,
    })
    const serviceProducts = productsIds.map((productId) => {
      return ServiceProducts.create({
        productId: new UniqueEntityID(productId),
        serviceId: service.id,
      })
    })
    const serviceEmployees = employeesIds.map((employeesId) => {
      return ServiceEmployees.create({
        employeeId: new UniqueEntityID(employeesId),
        serviceId: service.id,
      })
    })
    service.employees = new ServiceEmployeeList(serviceEmployees)
    service.products = new ServiceProductList(serviceProducts)
    await this.serviceRepository.create(service)
    return right({
      service,
    })
  }
}
