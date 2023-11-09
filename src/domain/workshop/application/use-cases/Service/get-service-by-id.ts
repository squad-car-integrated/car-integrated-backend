import { Either, left, right } from '@/core/either'
import { Service } from '@/domain/workshop/enterprise/entities/service'
import { ServicesRepository } from '../../repositories/services-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { ServiceProductsRepository } from '../../repositories/service-products-repository'
import { ServiceProductList } from '@/domain/workshop/enterprise/entities/service-product-list'
import { ServiceEmployeesRepository } from '../../repositories/service-employees-repository'
import { ServiceEmployeeList } from '@/domain/workshop/enterprise/entities/service-employee-list'

interface GetServiceByIdUseCaseRequest {
  id: string
}
type GetServiceByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { service: Service }
>
@Injectable()
export class GetServiceByIdUseCase {
  constructor(
    private serviceRepository: ServicesRepository,
    private serviceProductsRepository: ServiceProductsRepository,
    private serviceEmployeesRepository: ServiceEmployeesRepository
    ){}
  async execute({
    id,
  }: GetServiceByIdUseCaseRequest): Promise<GetServiceByIdUseCaseResponse> {
    const service = await this.serviceRepository.findById(id)
    if (!service) {
      return left(new ResourceNotFoundError())
    }
    const serviceProducts = await this.serviceProductsRepository.findManyByServiceId(service.id.toString())
    console.log(serviceProducts)
    service.products = new ServiceProductList(serviceProducts)
    const serviceEmployees = await this.serviceEmployeesRepository.findManyByServiceId(service.id.toString())
    service.employees = new ServiceEmployeeList(serviceEmployees)
    return right({
      service,
    })
  }
}
