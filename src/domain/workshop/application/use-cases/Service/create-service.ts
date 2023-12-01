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
import { ProductsRepository } from '../../repositories/products-repository'
import { ProductDontExistsError } from '../errors/product-dont-exists-error'
import { ServiceProductsRepository } from '../../repositories/service-products-repository'
import { ServiceEmployeesRepository } from '../../repositories/service-employees-repository'
import { EmployeesRepository } from '../../repositories/employees-repository'
import { EmployeeDontExistsError } from '../errors/employee-dont-exists-error'
export interface ProductAndQuantity {
    productId: string
    quantity: number
}
interface CreateServiceUseCaseRequest {
    automobileId: string
    employees: string[]
    products: ProductAndQuantity[]
    laborValue: number
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
        private productRepository: ProductsRepository,
        private employeeRepository: EmployeesRepository,
        private serviceProductsRepository: ServiceProductsRepository,
        private serviceEmployeesRepository: ServiceEmployeesRepository,
    ) {}

    async execute({
        automobileId,
        employees,
        products,
        laborValue,
        description,
        status,
    }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
        const automobile = await this.getAutomobile(automobileId)
        if (!automobile || !automobile.ownerId) {
            return left(new AutomobileDontExistsError(automobileId));
        }
        const service = this.createService(
            automobileId,
            laborValue,
            description,
            status,
        )
        await this.createServiceProductsList(service, products)
        await this.createServiceEmployeesList(service, employees)
        await this.serviceRepository.create(service)
        await this.registerServiceEmployees(service)
        await this.registerServiceProducts(service)

        return right({ service })
    }

    private async getAutomobile(automobileId: string) {
        return this.automobileRepository.findById(automobileId)
    }

    private createService(
        automobileId: string,
        laborValue: number,
        description: string,
        status: ServiceStatus,
    ) {
        return Service.create({
            automobileId: new UniqueEntityID(automobileId),
            laborValue,
            description,
            status,
        })
    }

    private async createServiceProductsList(
        service: Service,
        products: ProductAndQuantity[],
    ) {
        const serviceProducts: ServiceProduct[] = []

        for (const product of products) {
            const productExists = await this.productRepository.findById(
                product.productId,
            )

            if (!productExists) {
                return left(new ProductDontExistsError(product.productId))
            }

            const serviceProduct = ServiceProduct.create({
                productId: new UniqueEntityID(product.productId),
                serviceId: service.id,
                quantity: product.quantity,
            })
            service.productsTotalValue += productExists.unitValue * product.quantity
            serviceProducts.push(serviceProduct)
        }
        service.products = new ServiceProductList(serviceProducts)

        return serviceProducts
    }

    private async createServiceEmployeesList(
        service: Service,
        employees: string[],
    ) {
        const serviceEmployees: ServiceEmployee[] = []
        for (const employee of employees) {
            const employeeExists = await this.employeeRepository.findById(employee)

            if (!employeeExists) {
                return left(new EmployeeDontExistsError(employee))
            }

            const serviceEmployee = ServiceEmployee.create({
                employeeId: new UniqueEntityID(employee),
                serviceId: service.id,
            })
            serviceEmployees.push(serviceEmployee)
        }
        service.employees = new ServiceEmployeeList(serviceEmployees)

        return serviceEmployees
    }
    private async registerServiceEmployees(service: Service) {
        await Promise.all(
            service.employees
                .getItems()
                .map(
                    async (employee) =>
                        await this.serviceEmployeesRepository.create(
                            employee,
                        ),
                ),
        )
    }
    private async registerServiceProducts(service: Service) {
        await Promise.all(
            service.products.getItems().map(async (product) => {
                await this.serviceProductsRepository.create(product)
                const productOnDb = await this.productRepository.findById(
                    product.productId.toString(),
                )
                if (productOnDb) {
                    productOnDb.productAmount -= product.quantity
                    await this.productRepository.save(productOnDb)
                }
            }),
        )

    }
}
