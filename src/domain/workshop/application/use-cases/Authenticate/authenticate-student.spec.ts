import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { AuthenticateUserUseCase } from "./authenticate-student"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { makeOwner } from "test/factories/make-owner"
import { User } from "@/domain/workshop/enterprise/entities/user"

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()
        sut = new AuthenticateUserUseCase(inMemoryUsersRepository,fakeHasher,fakeEncrypter)
    })

    it("Should be able to authenticate a user", async () => {
        const userOwner = makeOwner({
            email: "johndoeowner@example.com",
            password: await fakeHasher.hash("123123")
        })
        const userEmployee = makeOwner({
            email: "johndoeempolyee@example.com",
            password: await fakeHasher.hash("123456")
        })
        await inMemoryUsersRepository.create(userOwner)
        await inMemoryUsersRepository.create(userEmployee)
        const result = await sut.execute({
            email: "johndoeowner@example.com",
            password: "123123"
        })
        const result2 = await sut.execute({
            email: "johndoeowner@example.com",
            password: "123123"
        })
        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            accessToken: expect.any(String)
        })
        expect(result2.isRight()).toBe(true)
        expect(result2.value).toEqual({
            accessToken: expect.any(String)
        })
    })
})
