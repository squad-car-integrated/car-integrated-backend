import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Service } from '@/domain/workshop/enterprise/entities/service';
import { ServiceProductsRepository } from '../../repositories/service-products-repository';
import { ServicesRepository } from '../../repositories/services-repository';
import { NotAllowedError } from '../errors/not-allowed-error';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { ServiceProductList } from '@/domain/workshop/enterprise/entities/service-product-list';
import { ServiceStatus } from '@/core/entities/service-status-enum';
import { ServiceEmployeesRepository } from '../../repositories/service-employees-repository';
import { ServiceEmployeeList } from '@/domain/workshop/enterprise/entities/service-employee-list';
import { ServiceProduct } from '@/domain/workshop/enterprise/entities/service-products';
import { ServiceEmployee } from '@/domain/workshop/enterprise/entities/service-employees';
import { ProductsRepository } from '../../repositories/products-repository';
import { ProductAndQuantity } from './create-service';

interface EditServiceUseCaseRequest {
  serviceId: string;
  ownerId: string;
  automobileId: string;
  laborValue: number;
  description: string;
  status: ServiceStatus;
  products: ProductAndQuantity[];
  employees: string[];
}
type EditServiceUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { service: Service }
>;

@Injectable()
export class EditServiceUseCase {
  constructor(
    private serviceRepository: ServicesRepository,
    private serviceProductsRepository: ServiceProductsRepository,
    private serviceEmployeesRepository: ServiceEmployeesRepository,
    private productRepository: ProductsRepository,
  ) {}

  async execute({
    automobileId,
    ownerId,
    serviceId,
    laborValue,
    description,
    status,
    products,
    employees,
  }: EditServiceUseCaseRequest): Promise<EditServiceUseCaseResponse> {
    const service = await this.getServiceByIdOrError(serviceId);
    if (!service) {
      return left(new ResourceNotFoundError());
    }

    const currentServiceProducts = await this.serviceProductsRepository.findManyByServiceId(serviceId);
    const currentServiceEmployees = await this.serviceEmployeesRepository.findManyByServiceId(serviceId);

    const serviceProductList = new ServiceProductList(currentServiceProducts);
    const serviceEmployeeList = new ServiceEmployeeList(currentServiceEmployees);

    const serviceProducts = await this.updateOrCreateServiceProduct(products, currentServiceProducts, service);
    const serviceEmployees = await this.updateOrCreateServiceEmployee(employees, currentServiceEmployees, service);

    serviceProductList.update(serviceProducts);
    serviceEmployeeList.update(serviceEmployees);

    service.productsTotalValue = await this.updateProductsTotalValue(serviceProductList);
    service.laborValue = laborValue;
    service.description = description;
    service.status = status;
    service.automobileId = new UniqueEntityID(automobileId);
    service.ownerId = new UniqueEntityID(ownerId);
    service.products = serviceProductList;
    service.employees = serviceEmployeeList;

    await this.saveServiceAndRelatedEntities(service, currentServiceProducts);

    return right({ service });
  }

  private async getServiceByIdOrError(serviceId: string): Promise<Service | null> {
    const service = await this.serviceRepository.findById(serviceId);
    return service || null;
  }

  private async updateOrCreateServiceProduct(
    newProducts: ProductAndQuantity[],
    currentServiceProduct: ServiceProduct[],
    service: Service
  ): Promise<ServiceProduct[]> {
    const newServiceProducts = newProducts.map((productAndQuantity) => {
      const productOnDb = currentServiceProduct.find(
        (product) => product.productId.toString() === productAndQuantity.productId
      );
      const newId = productOnDb?.id ? new UniqueEntityID(productOnDb.id.toString()) : new UniqueEntityID();
      return ServiceProduct.create(
        {
          productId: new UniqueEntityID(productAndQuantity.productId),
          serviceId: service.id,
          quantity: productAndQuantity.quantity,
        },
        newId
      );
    });
    return newServiceProducts;
  }

  private async updateOrCreateServiceEmployee(
    newEmployees: string[],
    currentServiceEmployee: ServiceEmployee[],
    service: Service
  ): Promise<ServiceEmployee[]> {
    const serviceEmployees = newEmployees.map((employeeId) => {
      const oldId =
        currentServiceEmployee.find((employee) => employee.employeeId.toString() === employeeId)?.id.toString() ||
        undefined;
      const newId = oldId ? new UniqueEntityID(oldId) : new UniqueEntityID();
      return ServiceEmployee.create(
        {
          employeeId: new UniqueEntityID(employeeId),
          serviceId: service.id,
        },
        newId
      );
    });
    return serviceEmployees;
  }

  private async updateProductsTotalValue(serviceProductList: ServiceProductList): Promise<number> {
    let productTotal = 0;
    for (const serviceProduct of serviceProductList.getItems()) {
      const product = await this.productRepository.findById(serviceProduct.productId.toString());

      if (product) {
        productTotal += product.unitValue * serviceProduct.quantity;
      }
    }
    return productTotal;
  }

  private async saveServiceAndRelatedEntities(service: Service, currentServiceProducts: ServiceProduct[]): Promise<void> {
    await this.serviceRepository.save(service);

    await Promise.all(
      service.products.getItems().map(async (product) => {
        await this.serviceProductsRepository.save(product);
        this.changeProductStock(product,currentServiceProducts)
      })
    );

    await Promise.all(
      service.employees.getItems().map(async (employee) => await this.serviceEmployeesRepository.save(employee))
    );
  }
  private async changeProductStock(product: ServiceProduct, currentServiceProducts: ServiceProduct[]){
    const productOnDb = await this.productRepository.findById(product.productId.toString());
    if (productOnDb) {
        let quantityToChange = -product.quantity;
        const oldServiceProduct = currentServiceProducts.find(
        (serviceProduct) => serviceProduct.id.toString() === product.id.toString()
        );
        if (oldServiceProduct && oldServiceProduct.quantity > product.quantity) {
        quantityToChange = -product.quantity + oldServiceProduct.quantity;
        }
        productOnDb.productAmount += quantityToChange;
        await this.productRepository.save(productOnDb);
    }
  }
}
