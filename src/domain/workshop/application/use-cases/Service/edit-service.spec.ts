import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeService } from 'test/factories/make-service'
import { InMemoryServicesRepository } from 'test/repositories/in-memory-services-repository'
import { EditServiceUseCase } from './edit-service'
import { InMemoryServiceProductsRepository } from 'test/repositories/in-memory-service-products-repository'
import { makeServiceProduct } from 'test/factories/make-service-product'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import { ServiceEmployeeList } from '@/domain/workshop/enterprise/entities/service-employee-list'

let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryServiceProductsRepository: InMemoryServiceProductsRepository
let sut: EditServiceUseCase

describe('Edit Service', () => {
  beforeEach(() => {
    inMemoryServiceProductsRepository = new InMemoryServiceProductsRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository(
      inMemoryServiceProductsRepository,
    )
    sut = new EditServiceUseCase(
      inMemoryServicesRepository,
      inMemoryServiceProductsRepository,
    )
  })

  it('Should be able to edit a service', async () => {
    const newService = makeService(
      {
        ownerId: new UniqueEntityID('owner-1'),
        automobileId: new UniqueEntityID('car-1'),
      },
      new UniqueEntityID('service-1'),
    )
    await inMemoryServicesRepository.create(newService)
    inMemoryServiceProductsRepository.items.push(
      makeServiceProduct({
        serviceId: newService.id,
        productId: new UniqueEntityID('1'),
      }),
      makeServiceProduct({
        serviceId: newService.id,
        productId: new UniqueEntityID('2'),
      }),
    )
    await sut.execute({
      serviceId: newService.id.toString(),
      totalValue: newService.totalValue,
      description: 'Descricao editada',
      status: ServiceStatus.Completed,
      productsIds: ['1', '3'],
    })
    expect(inMemoryServicesRepository.items[0]).toMatchObject({
      description: 'Descricao editada',
    })
    expect(
      inMemoryServicesRepository.items[0].products.currentItems,
    ).toHaveLength(2)
    expect(inMemoryServicesRepository.items[0].products.currentItems).toEqual([
      expect.objectContaining({ productId: new UniqueEntityID('1') }),
      expect.objectContaining({ productId: new UniqueEntityID('3') }),
    ])
  })
})
