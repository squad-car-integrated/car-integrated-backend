import { InMemoryServicesRepository } from 'test/repositories/in-memory-services-repository'
import { CreateServiceUseCase, ProductAndQuantity } from './create-service'
import { faker } from '@faker-js/faker'
import { makeOwner } from 'test/factories/make-owner'
import { makeEmployee } from 'test/factories/make-employee'
import { makeAutomobile } from 'test/factories/make-automobile'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import { InMemoryServiceProductsRepository } from 'test/repositories/in-memory-service-products-repository'
import { InMemoryServiceEmployeesRepository } from 'test/repositories/in-memory-service-employees-repository'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { InMemoryEmployeesRepository } from 'test/repositories/in-memory-employees-repository'
import { InMemoryAutomobilesRepository } from 'test/repositories/in-memory-automobiles-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'

let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryServiceProductsRepository: InMemoryServiceProductsRepository
let inMemoryServiceEmployeesRepository: InMemoryServiceEmployeesRepository
let inMemoryOwnerRepository: InMemoryOwnersRepository
let inMemoryEmployeesRepository: InMemoryEmployeesRepository
let inMemoryProductRepository: InMemoryProductsRepository
let inMemoryAutomobilesRepository: InMemoryAutomobilesRepository
let sut: CreateServiceUseCase

describe('Create Service', () => {
  beforeEach(() => {
    inMemoryServiceProductsRepository = new InMemoryServiceProductsRepository()
    inMemoryServiceEmployeesRepository = new InMemoryServiceEmployeesRepository()
    inMemoryOwnerRepository = new InMemoryOwnersRepository()
    inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
    inMemoryAutomobilesRepository = new InMemoryAutomobilesRepository()
    inMemoryProductRepository= new InMemoryProductsRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository(
      inMemoryServiceProductsRepository,
      inMemoryServiceEmployeesRepository


    )
    sut = new CreateServiceUseCase(
      inMemoryServicesRepository,
      inMemoryAutomobilesRepository,
      inMemoryOwnerRepository,
      inMemoryProductRepository,
      inMemoryEmployeesRepository,
      inMemoryServiceProductsRepository,
      inMemoryServiceEmployeesRepository,
      )
  })
  it('Should be able to create a service', async () => {
    const owner = makeOwner()
    const employee = makeEmployee()
    const automobile = makeAutomobile()
    const product = makeProduct()
    await inMemoryOwnerRepository.create(owner)
    await inMemoryEmployeesRepository.create(employee)
    await inMemoryAutomobilesRepository.create(automobile)
    await inMemoryProductRepository.create(product)
    const product1: ProductAndQuantity = {
      productId: "product1",
      quantity: 12
    } 
    const result = await sut.execute({
      totalValue: faker.number.int(),
      ownerId: owner.id.toString(),
      employees: [employee.id.toString()],
      automobileId: automobile.id.toString(),
      description: faker.commerce.productDescription(),
      status: ServiceStatus.InProgress,
      products: [product1, product1],
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryServicesRepository.items[0]).toBeTruthy()
  })
})
