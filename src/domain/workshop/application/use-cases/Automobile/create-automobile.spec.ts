import { InMemoryAutomobilesRepository } from "test/repositories/in-memory-automobile-repository"
import { CreateAutomobileUseCase } from "./create-automobile"
import {faker} from "@faker-js/faker"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"


let inMemoryAutomobilesRepository: InMemoryAutomobilesRepository
let sut: CreateAutomobileUseCase

describe("Create Automobile", () => {
    beforeEach(() => {
        inMemoryAutomobilesRepository = new InMemoryAutomobilesRepository();
        sut = new CreateAutomobileUseCase(inMemoryAutomobilesRepository)
    })

    it("Should be able to create a automobile", async () => {

        const result = await sut.execute({
            model: faker.vehicle.model(),
            brand: "Honda",
            plate: "KFG91230I",
            ownerId: "123123",
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryAutomobilesRepository.items[0]).toEqual(result.value?.automobile)
    })
})
