import { WatchedList } from '@/core/entities/watched-list'
import { ServiceProduct } from './service-products'

export class ServiceProductList extends WatchedList<ServiceProduct> {
    compareItems(a: ServiceProduct, b: ServiceProduct): boolean {
        return a.productId === b.productId
    }
}
