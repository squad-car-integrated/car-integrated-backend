import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { ServiceProductList } from "./service-product-list"
import { ServiceStatus } from "@/core/entities/service-status-enum"

export interface ServiceProps {
    automobileId: UniqueEntityID
    ownerId: UniqueEntityID
    employeesIds: UniqueEntityID[]
    products: ServiceProductList
    totalValue: number
    description: string
    status: ServiceStatus
    createdAt: Date
    updatedAt?: Date
}
export class Service extends Entity<ServiceProps>{
    get automobileId(){
        return this.props.automobileId;
    }
    get ownerId(){
        return this.props.ownerId;
    }
    get employeesIds(){
        return this.props.employeesIds;
    }
    get products() {
        return this.props.products
    }
    get totalValue() {
        return this.props.totalValue
    }
    get description() {
        return this.props.description
    }
    get status() {
        return this.props.status
    }
    get createdAt(){
        return this.props.createdAt;
    }
    get updatedAt(){
        return this.props.updatedAt;
    }
    private touch(){
        this.props.updatedAt = new Date();
    }
    set products(products: ServiceProductList){
        this.props.products = products;
        this.touch()
    }
    set totalValue(totalValue: number){
        this.props.totalValue = totalValue;
        this.touch()
    }
    set description(description: string){
        this.props.description = description;
        this.touch()
    }
    set status(status: ServiceStatus){
        this.props.status = status;
        this.touch()
    }
    static create(props: Optional<ServiceProps, "createdAt" | "totalValue" | "description" | "products"> , id?: UniqueEntityID){
        const service = new Service({
            ...props,
            totalValue: props.totalValue ?? 0,
            description: props.description ?? "",
            products: props.products ?? new ServiceProductList(),
            createdAt: new Date(),
            
        }, id)
        return service;
    }  
}