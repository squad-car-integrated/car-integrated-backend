import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { FetchRecentProductsUseCase } from './fetch-recent-products'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: FetchRecentProductsUseCase

describe('Fetch recent products', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new FetchRecentProductsUseCase(inMemoryProductsRepository)
  })

  it('Should be able to fetch recent products', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })
    expect(result.value?.products).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })
  it('Should be able to fetch paginated recent products', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryProductsRepository.create(makeProduct())
    }
    const result = await sut.execute({
      page: 2,
    })
    expect(result.value?.products).toHaveLength(2)
  })
})
