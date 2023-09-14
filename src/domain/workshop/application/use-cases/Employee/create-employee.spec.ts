import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { CreateEmployeeUseCase } from "./create-employee"
import {faker} from "@faker-js/faker"


let inMemoryEmployeeRepository: InMemoryEmployeesRepository
let sut: CreateEmployeeUseCase

describe("Create Employee", () => {
    beforeEach(() => {
        inMemoryEmployeeRepository = new InMemoryEmployeesRepository();
        sut = new CreateEmployeeUseCase(inMemoryEmployeeRepository)
    })

    it("Should be able to create a employee", async () => {
        const result = await sut.execute({
            name: faker.person.fullName(),
            monthWorkedHours: faker.number.float(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            roles: ["User"]
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryEmployeeRepository.items[0]).toEqual(result.value?.employee)
    })
})
