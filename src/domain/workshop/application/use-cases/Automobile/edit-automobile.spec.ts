import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAutomobile } from 'test/factories/make-automobile'
import { InMemoryAutomobilesRepository } from 'test/repositories/in-memory-automobiles-repository'
import { EditAutomobileUseCase } from './edit-automobile'

let inMemoryAutomobilesRepository: InMemoryAutomobilesRepository
let sut: EditAutomobileUseCase

describe('Edit Automobile', () => {
    beforeEach(() => {
        inMemoryAutomobilesRepository = new InMemoryAutomobilesRepository()
        sut = new EditAutomobileUseCase(inMemoryAutomobilesRepository)
    })

    it('Should be able to edit a automobile', async () => {
        const newAutomobile = makeAutomobile(
            {},
            new UniqueEntityID('automobile-1'),
        )
        await inMemoryAutomobilesRepository.create(newAutomobile)
        await sut.execute({
            brand: newAutomobile.brand,
            plate: 'kza212121',
            model: newAutomobile.model,
            ownerId: 'ownerid',
            automobileId: newAutomobile.id.toString(),
        })
        expect(inMemoryAutomobilesRepository.items[0]).toMatchObject({
            plate: 'kza212121',
        })
    })
})
