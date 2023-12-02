import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeService } from 'test/factories/make-service'
import { InMemoryServicesRepository } from 'test/repositories/in-memory-services-repository'
import { EditServiceUseCase } from './edit-service'
import { InMemoryServiceProductsRepository } from 'test/repositories/in-memory-service-products-repository'
import { ServiceStatus } from '@/core/entities/service-status-enum'
import { InMemoryServiceEmployeesRepository } from 'test/repositories/in-memory-service-employees-repository'
import { makeServiceEmployee } from 'test/factories/make-service-employee'
import { ProductAndQuantity } from './create-service'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'

let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryServiceProductsRepository: InMemoryServiceProductsRepository
let inMemoryServiceEmployeesRepository: InMemoryServiceEmployeesRepository
let inMemoryProductRepository: InMemoryProductsRepository
let sut: EditServiceUseCase

describe('Edit Service', () => {
    beforeEach(() => {
        inMemoryServiceProductsRepository =
            new InMemoryServiceProductsRepository()
        inMemoryServiceEmployeesRepository =
            new InMemoryServiceEmployeesRepository()
        inMemoryProductRepository = new InMemoryProductsRepository()
        inMemoryServicesRepository = new InMemoryServicesRepository(
            inMemoryServiceProductsRepository,
            inMemoryServiceEmployeesRepository,
        )
        sut = new EditServiceUseCase(
            inMemoryServicesRepository,
            inMemoryServiceProductsRepository,
            inMemoryServiceEmployeesRepository,
            inMemoryProductRepository,
        )
    })

    it('Should be able to edit a service', async () => {
        const newService = makeService(
            {
                automobileId: new UniqueEntityID('car-1'),
                description: 'New service',
                laborValue: 2000,
                status: ServiceStatus.PendingApproval,
            },
            new UniqueEntityID('service-1'),
        )
        await inMemoryServicesRepository.create(newService)
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
        const product = makeProduct({ productAmount: 50 })
        await inMemoryProductRepository.create(product)
        const productAndQuantity: ProductAndQuantity = {
            productId: product.id.toString(),
            quantity: 20,
        }
        await sut.execute({
            automobileId: newService.automobileId.toString(),
            serviceId: newService.id.toString(),
            laborValue: 3000,
            description: 'Descricao editada',
            status: ServiceStatus.Completed,
            products: [productAndQuantity],
            employees: ['3', '4'],
        })
        expect(inMemoryServicesRepository.items[0]).toMatchObject({
            description: 'Descricao editada',
            laborValue: 3000,
            status: ServiceStatus.Completed,
            productsTotalValue: product.unitValue * 20
        })
        const serviceProducts = inMemoryServicesRepository.items[0].products.currentItems
        expect(serviceProducts).toHaveLength(1)
        expect(serviceProducts).toEqual([expect.objectContaining({ productId: product.id })])
        expect(inMemoryProductRepository.items[0]).toEqual(
            expect.objectContaining({ id: product.id, productAmount: 30 }),
        )
        const serviceEmployees = inMemoryServicesRepository.items[0].employees.currentItems
        expect(serviceEmployees).toHaveLength(2)
        expect(serviceEmployees).toEqual([
            expect.objectContaining({ employeeId: new UniqueEntityID('3') }),
            expect.objectContaining({ employeeId: new UniqueEntityID('4') }),
        ])
        const productAndQuantity2: ProductAndQuantity = {
            productId: product.id.toString(),
            quantity: 18,
        }
        await sut.execute({
            automobileId: newService.automobileId.toString(),
            serviceId: newService.id.toString(),
            laborValue: 3000,
            description: 'Descricao editada',
            status: ServiceStatus.Completed,
            products: [productAndQuantity2],
            employees: ['3', '4'],
        })
        console.log(inMemoryProductRepository.items[0])
        expect(inMemoryProductRepository.items[0]).toEqual(
            expect.objectContaining({ id: product.id, productAmount: 32 }),
        )
    })
})
