import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeesRepository } from 'test/repositories/in-memory-employees-repository'
import { FetchAllEmployeesUseCase } from './fetch-all-employees'

let inMemoryEmployeesRepository: InMemoryEmployeesRepository
let sut: FetchAllEmployeesUseCase

describe('Fetch all employees', () => {
    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        sut = new FetchAllEmployeesUseCase(inMemoryEmployeesRepository)
    })

    it('Should be able to fetch all employees', async () => {
        await inMemoryEmployeesRepository.create(
            makeEmployee({ createdAt: new Date(2022, 0, 20) }),
        )
        await inMemoryEmployeesRepository.create(
            makeEmployee({ createdAt: new Date(2022, 0, 18) }),
        )
        await inMemoryEmployeesRepository.create(
            makeEmployee({ createdAt: new Date(2022, 0, 23) }),
        )

        const result = await sut.execute({
            page: 1,
        })
        expect(result.value?.employees).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
        ])
    })
    it('Should be able to fetch paginated all employees', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryEmployeesRepository.create(makeEmployee())
        }
        const result = await sut.execute({
            page: 2,
        })
        expect(result.value?.employees).toHaveLength(2)
    })
})
