import { ApiProperty } from "@nestjs/swagger"

export class UserSwaggerDTO {
    @ApiProperty({ example: "natanemployee@gmail.com", description: 'The email of an employee(Only employees can be created public) or owner' })
    email!: string
    @ApiProperty({ example: "123123", description: 'The password' })
    password!: string
}