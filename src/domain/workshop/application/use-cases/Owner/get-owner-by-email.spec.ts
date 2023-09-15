import { makeOwner } from "test/factories/make-owner"
import { GetOwnerByEmailUseCase } from "./get-owner-by-email"
import { InMemoryOwnersRepository } from "test/repositories/in-memory-owners-repository"

let inMemoryOwnersRepository: InMemoryOwnersRepository
let sut: GetOwnerByEmailUseCase

describe("Get Owner By Email", () => {
    beforeEach(() => {
        inMemoryOwnersRepository = new InMemoryOwnersRepository();
        sut = new GetOwnerByEmailUseCase(inMemoryOwnersRepository)
    })

    it("Should be able to get a owner by Email", async () => {
        const newOwner = makeOwner({})
        await inMemoryOwnersRepository.create(newOwner)
        const result = await sut.execute({
            email: newOwner.email.toString()
        })
        expect(result.value).toBeTruthy()
    })
})