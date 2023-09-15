import { PaginationParams } from "@/core/repositories/pagination-params";
import { OwnersRepository } from "@/domain/workshop/application/repositories/owners-repository";
import { Owner } from "@/domain/workshop/enterprise/entities/owner";

export class InMemoryOwnersRepository implements OwnersRepository {
    async findByEmail(email: string){
        const owner = this.items.find(item => item.email === email);
        if(!owner){
            return null
        }
        return owner
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