import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { EditProductUseCase } from './edit-product'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: EditProductUseCase

describe('Edit Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new EditProductUseCase(inMemoryProductsRepository)
  })

  it('Should be able to edit a product', async () => {
    const newProduct = makeProduct({}, new UniqueEntityID('product-1'))
    await inMemoryProductsRepository.create(newProduct)
    await sut.execute({
      productId: newProduct.id.toString(),
      name: 'Nome do Produto Editado',
      unitValue: newProduct.unitValue,
      productAmount: newProduct.productAmount,
      description: newProduct.description,
      photo: newProduct.photo,
    })
    expect(inMemoryProductsRepository.items[0]).toMatchObject({
      name: 'Nome do Produto Editado',
    })
  })
})
