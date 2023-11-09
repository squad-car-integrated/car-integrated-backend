import { makeAutomobile } from 'test/factories/make-automobile'
import { InMemoryAutomobilesRepository } from 'test/repositories/in-memory-automobiles-repository'
import { GetAutomobileByIdUseCase } from './get-automobile-by-id'

let inMemoryAutomobilesRepository: InMemoryAutomobilesRepository
let sut: GetAutomobileByIdUseCase

describe('Get Automobile By Id', () => {
    beforeEach(() => {
        inMemoryAutomobilesRepository = new InMemoryAutomobilesRepository()
        sut = new GetAutomobileByIdUseCase(inMemoryAutomobilesRepository)
    })

    it('Should be able to get a automobile by id', async () => {
        const newAutomobile = makeAutomobile({})
        await inMemoryAutomobilesRepository.create(newAutomobile)
        const result = await sut.execute({
            id: newAutomobile.id.toString(),
        })
        expect(result.value).toBeTruthy()
    })
})
