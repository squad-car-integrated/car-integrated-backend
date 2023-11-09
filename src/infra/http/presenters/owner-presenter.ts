import { Owner } from '@/domain/workshop/enterprise/entities/owner'

export class OnwerPresenter {
    static toHTTP(onwer: Owner) {
        return {
            id: onwer.id.toString(),
            name: onwer.name,
            email: onwer.email,
            password: onwer.password,
            phoneNumber: onwer.phoneNumber,
            createdAt: onwer.createdAt,
            updatedAt: onwer.updatedAt,
        }
    }
}
