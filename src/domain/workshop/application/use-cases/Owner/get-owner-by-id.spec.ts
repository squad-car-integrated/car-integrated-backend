import { makeOwner } from "test/factories/make-owner"
import { GetOwnerByIdUseCase } from "./get-owner-by-id"
import { InMemoryOwnersRepository } from "test/repositories/in-memory-owners-repository"

let inMemoryOwnersRepository: InMemoryOwnersRepository
let sut: GetOwnerByIdUseCase

describe("Get Owner By Id", () => {
    beforeEach(() => {
        inMemoryOwnersRepository = new InMemoryOwnersRepository();
        sut = new GetOwnerByIdUseCase(inMemoryOwnersRepository)
    })

    it("Should be able to get a owner by Id", async () => {
        const newOwner = makeOwner({})
        await inMemoryOwnersRepository.create(newOwner)
        const result = await sut.execute({
            id: newOwner.id.toString()
        })
        expect(result.value).toBeTruthy()
    })
})