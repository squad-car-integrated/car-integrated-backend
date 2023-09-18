import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { AuthenticateUserUseCase } from "./authenticate-user"
import { makeOwner } from "test/factories/make-owner"
import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { InMemoryOwnersRepository } from "test/repositories/in-memory-owners-repository"
import { makeEmployee } from "test/factories/make-employee"

let inMemoryEmployeesRepository: InMemoryEmployeesRepository
let inMemoryOwnersRepository: InMemoryOwnersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository();
        inMemoryOwnersRepository = new InMemoryOwnersRepository();
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()
        sut = new AuthenticateUserUseCase(inMemoryEmployeesRepository,inMemoryOwnersRepository,fakeHasher,fakeEncrypter)
    })

    it("Should be able to authenticate a user", async () => {
        const userOwner = makeOwner({
            email: "johndoeowner@example.com",
            password: await fakeHasher.hash("mypassword")// sensitive
        })
        const userEmployee = makeEmployee({
            email: "johndoeempolyee@example.com",
            password: await fakeHasher.hash("mypassword")// sensitive
        })
        await inMemoryOwnersRepository.create(userOwner)
        await inMemoryEmployeesRepository.create(userEmployee)
        const result = await sut.execute({
            email: "johndoeowner@example.com",
            password: "mypassword", // sensitive
        })
        const result2 = await sut.execute({
            email: "johndoeowner@example.com",
            password: "mypassword", // sensitive
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
