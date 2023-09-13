import { InMemoryOwnersRepository } from "test/repositories/in-memory-owner-repository"
import { CreateOwnerUseCase } from "./create-owner"
import {faker} from "@faker-js/faker"


let inMemoryOwnerRepository: InMemoryOwnersRepository
let sut: CreateOwnerUseCase

describe("Create Owner", () => {
    beforeEach(() => {
        inMemoryOwnerRepository = new InMemoryOwnersRepository();
        sut = new CreateOwnerUseCase(inMemoryOwnerRepository)
    })

    it("Should be able to create a owner", async () => {
        const result = await sut.execute({
            name: faker.person.fullName(),
            phoneNumber: faker.phone.number(),
            email: faker.internet.email(),
            password: faker.internet.password(),
      
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryOwnerRepository.items[0]).toEqual(result.value?.owner)
    })
})
