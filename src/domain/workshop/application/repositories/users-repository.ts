import { Employee } from "../../enterprise/entities/employee";
import { Owner } from "../../enterprise/entities/owner";

export abstract class UsersRepository {
    abstract findByEmail(email: string): Promise<Owner | Employee | null>
    abstract create(user: Owner | Employee): Promise<void>
}