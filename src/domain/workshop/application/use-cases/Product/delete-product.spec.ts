import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeProduct } from "test/factories/make-product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { DeleteProductUseCase } from "./delete-product";

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: DeleteProductUseCase

describe("Delete Product", () => {
    beforeEach(() => {
        inMemoryProductsRepository = new InMemoryProductsRepository();
        sut = new DeleteProductUseCase(inMemoryProductsRepository)
    })

    it("Should be able to delete a product", async () => {
        const newProduct = makeProduct({}, new UniqueEntityID("product-1"))
        await inMemoryProductsRepository.create(newProduct)
        await sut.execute({
            productId: "product-1",
        })
        expect(inMemoryProductsRepository.items).toHaveLength(0)
    })
})