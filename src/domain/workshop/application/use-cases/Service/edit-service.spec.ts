import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeService } from 'test/factories/make-service'
import { InMemoryServicesRepository } from 'test/repositories/in-memory-services-repository'
import { EditServiceUseCase } from './edit-service'
import { InMemoryServiceProductsRepository } from 'test/repositories/in-memory-service-products-repository'
import { makeServiceProduct } from 'test/factories/make-service-product'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import { InMemoryServiceEmployeesRepository } from 'test/repositories/in-memory-service-employees-repository'
import { makeServiceEmployee } from 'test/factories/make-service-employee'
import { ProductAndQuantity } from './create-service'

let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryServiceProductsRepository: InMemoryServiceProductsRepository
let inMemoryServiceEmployeesRepository: InMemoryServiceEmployeesRepository
let sut: EditServiceUseCase

describe('Edit Service', () => {
  beforeEach(() => {
    inMemoryServiceProductsRepository = new InMemoryServiceProductsRepository()
    inMemoryServiceEmployeesRepository = new InMemoryServiceEmployeesRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository(
      inMemoryServiceProductsRepository,
      inMemoryServiceEmployeesRepository
    )
    sut = new EditServiceUseCase(
      inMemoryServicesRepository,
      inMemoryServiceProductsRepository,
      inMemoryServiceEmployeesRepository
    )
  })

  it('Should be able to edit a service', async () => {
    const newService = makeService(
      {
        ownerId: new UniqueEntityID('owner-1'),
        automobileId: new UniqueEntityID('car-1'),
        description: "New service",
        totalValue: 20,
        status: ServiceStatus.PendingApproval
      },
      new UniqueEntityID('service-1'),
    )
    await inMemoryServicesRepository.create(newService)
    const product1 = makeServiceProduct({
      serviceId: newService.id,
      productId: new UniqueEntityID('1'),
      quantity: 10
    })
    const product2 = makeServiceProduct({
      serviceId: newService.id,
      productId: new UniqueEntityID('2'),
      quantity: 8
    })
    inMemoryServiceProductsRepository.create(product1)
    inMemoryServiceProductsRepository.create(product2)
    inMemoryServiceEmployeesRepository.items.push(
      makeServiceEmployee({
        serviceId: newService.id,
        employeeId: new UniqueEntityID('3'),
      }),
      makeServiceEmployee({
        serviceId: newService.id,
        employeeId: new UniqueEntityID('4'),
      }),
    )
    const product1Quantity: ProductAndQuantity = {
      productId: product1.productId.toString(),
      quantity: 20,
    }
    const product2Quantity: ProductAndQuantity = {
      productId: product2.productId.toString(),
      quantity: 10,
    }
    await sut.execute({
      automobileId: newService.automobileId.toString(),
      ownerId: newService.ownerId.toString(),
      serviceId: newService.id.toString(),
      totalValue: 30,
      description: 'Descricao editada',
      status: ServiceStatus.Completed,
      productsIds: [product1Quantity, product2Quantity],
      employeesIds: ["3", "4"]
    })
    expect(inMemoryServicesRepository.items[0]).toMatchObject({
      description: 'Descricao editada',
      totalValue: 30,
      status: ServiceStatus.Completed
    })
    expect(
      inMemoryServicesRepository.items[0].products.currentItems,
    ).toHaveLength(2)
    expect(inMemoryServicesRepository.items[0].products.currentItems).toEqual([
      expect.objectContaining({ productId: new UniqueEntityID("1") }),
      expect.objectContaining({ productId: new UniqueEntityID("2")}),
    ])
    expect(
      inMemoryServicesRepository.items[0].employees.currentItems,
    ).toHaveLength(2)
    expect(inMemoryServicesRepository.items[0].employees.currentItems).toEqual([
      expect.objectContaining({ employeeId: new UniqueEntityID('3') }),
      expect.objectContaining({ employeeId: new UniqueEntityID('4') }),
    ])
  })
})