import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { GetProductByIdUseCase } from './get-product-by-id'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: GetProductByIdUseCase

describe('Get Product By Id', () => {
    beforeEach(() => {
        inMemoryProductsRepository = new InMemoryProductsRepository()
        sut = new GetProductByIdUseCase(inMemoryProductsRepository)
    })

    it('Should be able to get a product by id', async () => {
        const newProduct = makeProduct({})
        await inMemoryProductsRepository.create(newProduct)
        const result = await sut.execute({
            id: newProduct.id.toString(),
        })
        expect(result.value).toBeTruthy()
    })
})
