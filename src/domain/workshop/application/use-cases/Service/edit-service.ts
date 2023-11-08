import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Service } from '@/domain/workshop/enterprise/entities/service'
import { ServiceProductsRepository } from '../../repositories/service-products-repository'
import { ServicesRepository } from '../../repositories/services-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ServiceProductList } from '@/domain/workshop/enterprise/entities/service-product-list'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import { ServiceEmployeesRepository } from '../../repositories/service-employees-repository'
import { ServiceEmployeeList } from '@/domain/workshop/enterprise/entities/service-employee-list'
import { Injectable } from '@nestjs/common'
import { ServiceProduct } from '@/domain/workshop/enterprise/entities/service-products'
import { ServiceEmployee } from '@/domain/workshop/enterprise/entities/service-employees'
import { ProductAndQuantity } from './create-service'

interface EditServiceUseCaseRequest {
  serviceId: string
  ownerId: string
  automobileId: string
  totalValue: number
  description: string
  status: ServiceStatus
  products: ProductAndQuantity[]
  employees: string[]
}
type EditServiceUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { service: Service }
>
@Injectable()
export class EditServiceUseCase {
  constructor(
    private serviceRepository: ServicesRepository,
    private serviceProductsRepository: ServiceProductsRepository,
    private serviceEmployeesRepository: ServiceEmployeesRepository
  ) {}
  async execute({
    automobileId,
    ownerId,
    serviceId,
    totalValue,
    description,
    status,
    products,
    employees,
  }: EditServiceUseCaseRequest): Promise<EditServiceUseCaseResponse> {
    const service = await this.serviceRepository.findById(serviceId)
    if (!service) {
      return left(new ResourceNotFoundError())
    }
    const currentServiceProducts = await this.serviceProductsRepository.findManyByServiceId(serviceId)
    const currentServiceEmployees = await this.serviceEmployeesRepository.findManyByServiceId(serviceId)

    const serviceProductList = new ServiceProductList(currentServiceProducts)
    const serviceEmployeeList = new ServiceEmployeeList(currentServiceEmployees)

    const serviceProducts = products.map((productAndQuantity) => {
      const oldId = currentServiceProducts.find(product => product.productId.toString() == productAndQuantity.productId)?.id.toString()
      const newId = oldId ? new UniqueEntityID(oldId) : new UniqueEntityID()  
      return ServiceProduct.create({
        productId: new UniqueEntityID(productAndQuantity.productId),
        serviceId: service.id,
        quantity: productAndQuantity.quantity
      },newId)
    })
    const serviceEmployees = employees.map((employeeId) => {
      const oldId = currentServiceEmployees.find(employee => employee.employeeId.toString() == employeeId)?.id.toString()
      const newId = oldId ? new UniqueEntityID(oldId) : new UniqueEntityID()  
      return ServiceEmployee.create({
        employeeId: new UniqueEntityID(employeeId),
        serviceId: service.id,
      }, newId)
    })
    serviceProductList.update(serviceProducts)
    serviceEmployeeList.update(serviceEmployees)
    service.totalValue = totalValue
    service.description = description
    service.status = status
    service.automobileId = new UniqueEntityID(automobileId)
    service.ownerId = new UniqueEntityID(ownerId)
    service.products = serviceProductList
    service.employees = serviceEmployeeList
    
    await this.serviceRepository.save(service)
    await Promise.all(
      service.products.getItems().map(async (product) =>
        this.serviceProductsRepository.save(product)
      )
    );
    await Promise.all(
      service.employees.getItems().map(async (employee) =>
        this.serviceEmployeesRepository.save(employee)
      )
    );
    return right({ service })
  }
}
