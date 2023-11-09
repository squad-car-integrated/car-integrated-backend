import { makeOwner } from 'test/factories/make-owner'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { FetchAllOwnersUseCase } from './fetch-all-owners'

let inMemoryOwnersRepository: InMemoryOwnersRepository
let sut: FetchAllOwnersUseCase

describe('Fetch all owners', () => {
    beforeEach(() => {
        inMemoryOwnersRepository = new InMemoryOwnersRepository()
        sut = new FetchAllOwnersUseCase(inMemoryOwnersRepository)
    })

    it('Should be able to fetch all owners', async () => {
        await inMemoryOwnersRepository.create(
            makeOwner({ createdAt: new Date(2022, 0, 20) }),
        )
        await inMemoryOwnersRepository.create(
            makeOwner({ createdAt: new Date(2022, 0, 18) }),
        )
        await inMemoryOwnersRepository.create(
            makeOwner({ createdAt: new Date(2022, 0, 23) }),
        )

        const result = await sut.execute({
            page: 1,
        })
        expect(result.value?.owners).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
        ])
    })
    it('Should be able to fetch paginated all owners', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryOwnersRepository.create(makeOwner())
        }
        const result = await sut.execute({
            page: 2,
        })
        expect(result.value?.owners).toHaveLength(2)
    })
})
