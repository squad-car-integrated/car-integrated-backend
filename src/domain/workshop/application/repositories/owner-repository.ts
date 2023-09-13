import { PaginationParams } from "@/core/repositories/pagination-params";
import { Owner } from "../../enterprise/entities/owner";

export abstract class OwnerRepository {
    abstract findById(id: string): Promise<Owner | null>
    abstract findManyRecent(params: PaginationParams): Promise<Owner[]>
    abstract create(owner: Owner): Promise<void>
    abstract save(owner: Owner): Promise<void>
    abstract delete(owner: Owner): Promise<void>
}