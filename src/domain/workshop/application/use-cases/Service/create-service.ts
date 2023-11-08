import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ServicesRepository } from '../../repositories/services-repository'
import { Service } from '../../../enterprise/entities/service'
import { ServiceProductList } from '@/domain/workshop/enterprise/entities/service-product-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import { ServiceProduct } from '@/domain/workshop/enterprise/entities/service-products'
import { ServiceEmployee } from '@/domain/workshop/enterprise/entities/service-employees'
import { ServiceEmployeeList } from '@/domain/workshop/enterprise/entities/service-employee-list'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'
import { AutomobileDontExistsError } from '../errors/automobile-dont-exists-error'
import { OwnersRepository } from '../../repositories/owners-repository'
import { OwnerDontExistsError } from '../errors/owner-dont-exists-error'
import { ProductsRepository } from '../../repositories/products-repository'
import { ProductDontExistsError } from '../errors/product-dont-exists-error'
export interface ProductAndQuantity {
  productId: string
  quantity: number
}
interface CreateServiceUseCaseRequest {
  automobileId: string
  ownerId: string
  employees: string[]
  products: ProductAndQuantity[]
  totalValue: number
  description: string
  status: ServiceStatus
}
type CreateServiceUseCaseResponse = Either<
  null | AutomobileDontExistsError,
  {
    service: Service
  }
>
@Injectable()
export class CreateServiceUseCase {
  constructor(
    private serviceRepository: ServicesRepository,
    private automobileRepository: AutomobilesRepository,
    private ownerRepository: OwnersRepository,
    private productRepository: ProductsRepository
  ) {}

  async execute({
    automobileId,
    ownerId,
    employees,
    products,
    totalValue,
    description,
    status,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const automobile = this.getAutomobile(automobileId);
    const owner = this.getOwner(ownerId);

    if (!automobile || !owner) {
      return !automobile
        ? left(new AutomobileDontExistsError(automobileId))
        : left(new OwnerDontExistsError(ownerId));
    }

    const service = this.createService(automobileId, ownerId, totalValue, description, status);
    this.createServiceProducts(service, products);
    this.createServiceEmployees(service, employees);

    await this.serviceRepository.create(service);

    return right({ service });
  }

  private getAutomobile(automobileId: string) {
    return this.automobileRepository.findById(automobileId);
  }

  private getOwner(ownerId: string) {
    return this.ownerRepository.findById(ownerId);
  }

  private createService(
    automobileId: string,
    ownerId: string,
    totalValue: number,
    description: string,
    status: ServiceStatus
  ) {
    return Service.create({
      automobileId: new UniqueEntityID(automobileId),
      ownerId: new UniqueEntityID(ownerId),
      totalValue,
      description,
      status,
    });
  }

  private createServiceProducts(service: Service, products: ProductAndQuantity[]) {
    const serviceProducts: ServiceProduct[] = [];

    for (const product of products) {
      const productExists = this.productRepository.findById(product.productId);

      if (!productExists) {
        return left(new ProductDontExistsError(product.productId));
      }

      const serviceProduct = ServiceProduct.create({
        productId: new UniqueEntityID(product.productId),
        serviceId: service.id,
        quantity: product.quantity,
      });

      serviceProducts.push(serviceProduct);
    }


    return serviceProducts;
  }

  private createServiceEmployees(service: Service, employees: string[]) {
    const serviceEmployees: ServiceEmployee[] = [];
    for (const employee of employees) {
      const productExists = this.productRepository.findById(employee);

      if (!productExists) {
        return left(new ProductDontExistsError(employee));
      }

      const serviceEmployee = ServiceEmployee.create({
        employeeId: new UniqueEntityID(employee),
        serviceId: service.id,
      });
      serviceEmployees.push(serviceEmployee);
    }
    service.employees = new ServiceEmployeeList(serviceEmployees);

    return serviceEmployees;
  }
}
