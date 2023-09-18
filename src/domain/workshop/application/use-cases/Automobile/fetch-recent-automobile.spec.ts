import { makeAutomobile } from 'test/factories/make-automobile'
import { InMemoryAutomobilesRepository } from 'test/repositories/in-memory-automobiles-repository'
import { FetchRecentAutomobilesUseCase } from './fetch-recent-automobile'

let inMemoryAutomobilesRepository: InMemoryAutomobilesRepository
let sut: FetchRecentAutomobilesUseCase

describe('Fetch recent automobiles', () => {
  beforeEach(() => {
    inMemoryAutomobilesRepository = new InMemoryAutomobilesRepository()
    sut = new FetchRecentAutomobilesUseCase(inMemoryAutomobilesRepository)
  })

  it('Should be able to fetch recent automobiles', async () => {
    await inMemoryAutomobilesRepository.create(
      makeAutomobile({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryAutomobilesRepository.create(
      makeAutomobile({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryAutomobilesRepository.create(
      makeAutomobile({ createdAt: new Date(2022, 0, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })
    expect(result.value?.automobiles).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })
  it('Should be able to fetch paginated recent automobiles', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAutomobilesRepository.create(makeAutomobile())
    }
    const result = await sut.execute({
      page: 2,
    })
    expect(result.value?.automobiles).toHaveLength(2)
  })
})
