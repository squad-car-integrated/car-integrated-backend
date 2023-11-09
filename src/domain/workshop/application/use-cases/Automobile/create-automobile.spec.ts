import { InMemoryAutomobilesRepository } from 'test/repositories/in-memory-automobiles-repository'
import { CreateAutomobileUseCase } from './create-automobile'
import { faker } from '@faker-js/faker'
import { makeOwner } from 'test/factories/make-owner'

let inMemoryAutomobilesRepository: InMemoryAutomobilesRepository
let sut: CreateAutomobileUseCase

describe('Create Automobile', () => {
    beforeEach(() => {
        inMemoryAutomobilesRepository = new InMemoryAutomobilesRepository()
        sut = new CreateAutomobileUseCase(inMemoryAutomobilesRepository)
    })

    it('Should be able to create a automobile', async () => {
        const owner = makeOwner()
        const result = await sut.execute({
            model: faker.vehicle.model(),
            brand: 'Honda',
            plate: 'KFG91230I',
            ownerId: owner.id.toString(),
        })
        expect(result.isRight()).toBe(true)
    })
})
