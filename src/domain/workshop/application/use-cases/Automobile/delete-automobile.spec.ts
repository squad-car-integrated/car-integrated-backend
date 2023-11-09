import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAutomobile } from 'test/factories/make-automobile'
import { InMemoryAutomobilesRepository } from 'test/repositories/in-memory-automobiles-repository'
import { DeleteAutomobileUseCase } from './delete-automobile'

let inMemoryAutomobilesRepository: InMemoryAutomobilesRepository
let sut: DeleteAutomobileUseCase

describe('Delete Automobile', () => {
    beforeEach(() => {
        inMemoryAutomobilesRepository = new InMemoryAutomobilesRepository()
        sut = new DeleteAutomobileUseCase(inMemoryAutomobilesRepository)
    })

    it('Should be able to delete a automobile', async () => {
        const newAutomobile = makeAutomobile(
            {
                ownerId: new UniqueEntityID('owner-1'),
            },
            new UniqueEntityID('automobile-1'),
        )
        await inMemoryAutomobilesRepository.create(newAutomobile)
        await sut.execute({
            automobileId: 'automobile-1',
        })
        expect(inMemoryAutomobilesRepository.items).toHaveLength(0)
    })
})
