import { WatchedList } from '@/core/entities/watched-list'
import { ServiceProduct } from './service-products'
type ServiceProductString = {
    id: string
    productId: string
    quantity: number
}
export class ServiceProductList extends WatchedList<ServiceProduct> {
    compareItems(a: ServiceProduct, b: ServiceProduct): boolean {
        return a.productId === b.productId
    }
    listToString(): ServiceProductString[] {
        const newList: ServiceProductString[] = []
        this.currentItems.forEach(serviceProduct => {
            newList.push({
                id: serviceProduct.id.toString(),
                productId: serviceProduct.productId.toString(),
                quantity: serviceProduct.quantity
            })
        });
        return newList
    }
}
