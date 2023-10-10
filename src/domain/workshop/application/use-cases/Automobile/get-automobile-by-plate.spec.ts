import { makeAutomobile } from 'test/factories/make-automobile'
import { InMemoryAutomobilesRepository } from 'test/repositories/in-memory-automobiles-repository'
import { GetAutomobileByPlateUseCase } from './get-automobile-by-plate'

let inMemoryAutomobilesRepository: InMemoryAutomobilesRepository
let sut: GetAutomobileByPlateUseCase

describe('Get Automobile By Plate', () => {
  beforeEach(() => {
    inMemoryAutomobilesRepository = new InMemoryAutomobilesRepository()
    sut = new GetAutomobileByPlateUseCase(inMemoryAutomobilesRepository)
  })

  it('Should be able to get a automobile by plate', async () => {
    const newAutomobile = makeAutomobile({})
    await inMemoryAutomobilesRepository.create(newAutomobile)
    const result = await sut.execute({
      plate: newAutomobile.plate.toString(),
    })
    expect(result.value).toBeTruthy()
  })
})
