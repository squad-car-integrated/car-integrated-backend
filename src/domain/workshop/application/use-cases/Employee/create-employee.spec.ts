import { InMemoryEmployeeRepository } from "test/repositories/in-memory-employee-repository"
import { CreateEmployeeUseCase } from "./create-employee"
import {faker} from "@faker-js/faker"


let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: CreateEmployeeUseCase

describe("Create Employee", () => {
    beforeEach(() => {
        inMemoryEmployeeRepository = new InMemoryEmployeeRepository();
        sut = new CreateEmployeeUseCase(inMemoryEmployeeRepository)
    })

    it("Should be able to create a employee", async () => {
        const result = await sut.execute({
            name: faker.person.fullName(),
            monthWorkedHours: faker.number.float(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryEmployeeRepository.items[0]).toEqual(result.value?.employee)
    })
})
