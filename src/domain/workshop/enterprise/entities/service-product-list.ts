import { WatchedList } from '@/core/entities/watched-list'
import { ServiceProducts } from './service-products'

export class ServiceProductList extends WatchedList<ServiceProducts> {
  compareItems(a: ServiceProducts, b: ServiceProducts): boolean {
    return a.productId === b.productId
  }
}
