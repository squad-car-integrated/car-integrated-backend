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
import { OwnersRepository } from '../../repositories/owners-repository';
import { Owner } from '@/domain/workshop/enterprise/entities/owner';
import { OwnerDontExistsError } from '../errors/owner-dont-exists-error';

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
  ResourceNotFoundError | NotAllowedError | OwnerDontExistsError,
  { service: Service }
>;

@Injectable()
export class EditServiceUseCase {
  constructor(
    private serviceRepository: ServicesRepository,
    private serviceProductsRepository: ServiceProductsRepository,
    private serviceEmployeesRepository: ServiceEmployeesRepository,
    private ownerRepository: OwnersRepository,
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
    const owner = await this.getOwnerByIdOrError(ownerId)
    if (!service || !owner) {
      return !service ? left(new ResourceNotFoundError()) : left(new OwnerDontExistsError(ownerId));
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
  private async getOwnerByIdOrError(ownerId: string): Promise<Owner | null> {
    const owner = await this.ownerRepository.findById(ownerId);
    return owner || null;
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

/**
 * The function updates or creates service employees based on the provided new employee IDs, current
 * service employees, and service.
 * @param {string[]} newEmployees - An array of strings representing the IDs of new employees to be
 * added to the service.
 * @param {ServiceEmployee[]} currentServiceEmployee - An array of existing service employees for a
 * specific service.
 * @param {Service} service - The `service` parameter is an object of type `Service`.
 * @returns a Promise that resolves to an array of ServiceEmployee objects.
 */
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

/**
 * The function calculates the total value of products based on their unit value and quantity.
 * @param {ServiceProductList} serviceProductList - The `serviceProductList` parameter is an instance
 * of the `ServiceProductList` class. It represents a list of service products.
 * @returns the total value of all the products in the serviceProductList.
 */
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

/**
 * The function saves a service and its related entities (products and employees) to the database.
 * @param {Service} service - The `service` parameter is an object of type `Service` which represents a
 * service entity.
 * @param {ServiceProduct[]} currentServiceProducts - An array of ServiceProduct objects that
 * represents the current products associated with the service.
 */
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
  /**
   * The function changes the stock quantity of a product based on the quantity specified in the input
   * and the current stock quantity in the database.
   * @param {ServiceProduct} product - The `product` parameter is of type `ServiceProduct` and
   * represents the product that needs to have its stock changed. It contains information such as the
   * product ID and the quantity to be changed.
   * @param {ServiceProduct[]} currentServiceProducts - currentServiceProducts is an array of
   * ServiceProduct objects that represents the current state of service products.
   */
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
        if(oldServiceProduct){
          quantityToChange += oldServiceProduct.quantity
        }
        productOnDb.productAmount += quantityToChange
        await this.productRepository.save(productOnDb);
    }
  }
}
