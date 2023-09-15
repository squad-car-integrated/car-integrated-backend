import { InMemoryOwnersRepository } from "test/repositories/in-memory-owners-repository"
import { CreateOwnerUseCase } from "./create-owner"
import {faker} from "@faker-js/faker"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { UserRole } from "@/core/entities/user-role-enum"


let inMemoryOwnersRepository: InMemoryOwnersRepository
let fakeHasher: FakeHasher
let sut: CreateOwnerUseCase

describe("Create Owner", () => {
    beforeEach(() => {
        inMemoryOwnersRepository = new InMemoryOwnersRepository();
        fakeHasher = new FakeHasher()
        sut = new CreateOwnerUseCase(inMemoryOwnersRepository,fakeHasher)
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
        expect(result.value).toEqual({
            owner: inMemoryOwnersRepository.items[0]
        })
    })
    it("Should hash owner password upon registration", async () => {
        const result = await sut.execute({
            name: faker.person.fullName(),
            phoneNumber: faker.phone.number(),
            email: faker.internet.email(),
            password: "123123",
            roles: [UserRole.OWNER.toString()]
        })
        const hashedPassword = await fakeHasher.hash("123123")
        expect(result.isRight()).toBe(true)
        expect(inMemoryOwnersRepository.items[0].password).toEqual(hashedPassword)
    })
})
