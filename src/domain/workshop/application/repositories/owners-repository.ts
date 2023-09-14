import { PaginationParams } from "@/core/repositories/pagination-params";
import { Owner } from "../../enterprise/entities/owner";

export abstract class OwnersRepository {
    abstract findById(id: string): Promise<Owner | null>
    abstract findByEmail(email: string): Promise<Owner | null>
    abstract create(owner: Owner): Promise<void>
    abstract save(owner: Owner): Promise<void>
    abstract delete(owner: Owner): Promise<void>
}