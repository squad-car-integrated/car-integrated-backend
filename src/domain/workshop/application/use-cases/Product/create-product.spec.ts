import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CreateProductUseCase } from './create-product'
import { faker } from '@faker-js/faker'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('Create Product', () => {
    beforeEach(() => {
        inMemoryProductsRepository = new InMemoryProductsRepository()
        sut = new CreateProductUseCase(inMemoryProductsRepository)
    })

    it('Should be able to create a product', async () => {
        const result = await sut.execute({
            name: faker.commerce.productName(),
            unitValue: Number(faker.commerce.price()),
            productAmount: 10,
            description: faker.commerce.productDescription(),
            photo: 'uri',
        })
        expect(result.isRight()).toBe(true)
    })
})
