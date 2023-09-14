import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeEmployee } from "test/factories/make-employee";
import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository";
import { DeleteEmployeeUseCase } from "./delete-employee";

let inMemoryEmployeesRepository: InMemoryEmployeesRepository
let sut: DeleteEmployeeUseCase

describe("Delete Employee", () => {
    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository();
        sut = new DeleteEmployeeUseCase(inMemoryEmployeesRepository)
    })

    it("Should be able to delete a employee", async () => {
        const newEmployee = makeEmployee({}, new UniqueEntityID("employee-1"))
        await inMemoryEmployeesRepository.create(newEmployee)
        await sut.execute({
            employeeId: "employee-1",
        })
        expect(inMemoryEmployeesRepository.items).toHaveLength(0)
    })
})