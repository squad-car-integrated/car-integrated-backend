import { InMemoryEmployeesRepository } from 'test/repositories/in-memory-employees-repository'
import { CreateEmployeeUseCase } from './create-employee'
import { faker } from '@faker-js/faker'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryEmployeeRepository: InMemoryEmployeesRepository
let fakeHasher: FakeHasher
let sut: CreateEmployeeUseCase

describe('Create Employee', () => {
    beforeEach(() => {
        inMemoryEmployeeRepository = new InMemoryEmployeesRepository()
        fakeHasher = new FakeHasher()
        sut = new CreateEmployeeUseCase(inMemoryEmployeeRepository, fakeHasher)
    })

    it('Should be able to create a employee', async () => {
        const result = await sut.execute({
            name: faker.person.fullName(),
            monthWorkedHours: faker.number.float(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        })
        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            employee: inMemoryEmployeeRepository.items[0],
        })
    })
    it('Should hash employee password upon registration', async () => {
        const password = faker.internet.password()
        const result = await sut.execute({
            name: faker.person.fullName(),
            monthWorkedHours: faker.number.float(),
            email: faker.internet.email(),
            password: password,
        })
        const hashedPassword = await fakeHasher.hash(password)
        expect(result.isRight()).toBe(true)
        expect(inMemoryEmployeeRepository.items[0].password).toEqual(
            hashedPassword,
        )
    })
})
