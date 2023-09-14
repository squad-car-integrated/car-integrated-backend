import { InMemoryOwnersRepository } from "test/repositories/in-memory-owners-repository"
import { CreateOwnerUseCase } from "./create-owner"
import {faker} from "@faker-js/faker"


let inMemoryOwnersRepository: InMemoryOwnersRepository
let sut: CreateOwnerUseCase

describe("Create Owner", () => {
    beforeEach(() => {
        inMemoryOwnersRepository = new InMemoryOwnersRepository();
        sut = new CreateOwnerUseCase(inMemoryOwnersRepository)
    })

    it("Should be able to create a owner", async () => {
        const result = await sut.execute({
            name: faker.person.fullName(),
            phoneNumber: faker.phone.number(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            roles: ["admin"]
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryOwnersRepository.items[0]).toEqual(result.value?.owner)
    })
})
