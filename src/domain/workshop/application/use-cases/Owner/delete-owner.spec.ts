import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOwner } from 'test/factories/make-owner'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { DeleteOwnerUseCase } from './delete-owner'

let inMemoryOwnersRepository: InMemoryOwnersRepository
let sut: DeleteOwnerUseCase

describe('Delete Owner', () => {
  beforeEach(() => {
    inMemoryOwnersRepository = new InMemoryOwnersRepository()
    sut = new DeleteOwnerUseCase(inMemoryOwnersRepository)
  })

  it('Should be able to delete a owner', async () => {
    const newOwner = makeOwner({}, new UniqueEntityID('owner-1'))
    await inMemoryOwnersRepository.create(newOwner)
    await sut.execute({
      ownerId: 'owner-1',
    })
    expect(inMemoryOwnersRepository.items).toHaveLength(0)
  })
})
