import { UsersRepository } from "@/domain/workshop/application/repositories/users-repository";
import { Employee } from "@/domain/workshop/enterprise/entities/employee";
import { Owner } from "@/domain/workshop/enterprise/entities/owner";
import { User } from "@/domain/workshop/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
    public ownerUsers: Owner[] = [];
    public empolyeesUsers: Employee[] = [];
    async findByEmail(email: string){
        let user: Owner | Employee | undefined
        user = this.ownerUsers.find(item => item.email.toString() === email);
        if(!user){
            user = this.empolyeesUsers.find(item => item.email.toString() === email);
            if(!user){
                return null
            }
        }
        return user
    }
    async create(user: Owner | Employee) {
        if(user instanceof Owner){
            this.ownerUsers.push(user)
        }else if(user instanceof Employee){
            this.empolyeesUsers.push(user)
        }
    }
}