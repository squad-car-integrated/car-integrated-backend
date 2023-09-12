import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface ServiceProductProps {
    serviceId: UniqueEntityID
    productId: UniqueEntityID
}
export class ServiceProduct extends Entity<ServiceProductProps> {
    get serviceId() {
        return this.props.serviceId
    }
    get productId() {
        return this.props.productId
    }
    static create(props: ServiceProductProps, id?: UniqueEntityID){
        const product = new ServiceProduct(props,id)
        return product
    }
}