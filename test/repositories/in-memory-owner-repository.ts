import { PaginationParams } from "@/core/repositories/pagination-params";
import { OwnerRepository } from "@/domain/workshop/application/repositories/owner-repository";
import { Owner } from "@/domain/workshop/enterprise/entities/owner";

export class InMemoryOwnersRepository implements OwnerRepository {
    async findManyRecent({page}: PaginationParams) {
        const owners = this.items
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice((page - 1) * 20, page * 20)
        return owners
    }
    public items: Owner[] = [];
    async findById(id: string){
        const owner = this.items.find(item => item.id.toString() === id);
        if(!owner){
            return null
        }
        return owner
    }
    async create(owner: Owner) {
        this.items.push(owner);
    }
    async save(owner: Owner){
        const itemIndex = this.items.findIndex(item => item.id === owner.id)
        this.items[itemIndex] = owner
    }
    async delete(owner: Owner) {
        const itemIndex = this.items.findIndex(item => item.id === owner.id)
        this.items.splice(itemIndex, 1)
    }
}