import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOwner } from 'test/factories/make-owner'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { EditOwnerUseCase } from './edit-owner'

let inMemoryOwnersRepository: InMemoryOwnersRepository
let sut: EditOwnerUseCase

describe('Edit Owner', () => {
  beforeEach(() => {
    inMemoryOwnersRepository = new InMemoryOwnersRepository()
    sut = new EditOwnerUseCase(inMemoryOwnersRepository)
  })

  it('Should be able to edit a owner', async () => {
    const newOwner = makeOwner({}, new UniqueEntityID('owner-1'))
    await inMemoryOwnersRepository.create(newOwner)
    await sut.execute({
      email: newOwner.email,
      name: 'Nome editado',
      password: newOwner.password,
      phoneNumber: newOwner.phoneNumber,
    })
    expect(inMemoryOwnersRepository.items[0]).toMatchObject({
      name: 'Nome editado',
    })
  })
})
