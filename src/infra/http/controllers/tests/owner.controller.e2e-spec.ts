import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { EmployeeFactory } from 'test/factories/make-employee'
import { OwnerFactory } from 'test/factories/make-owner'
describe('Create owner (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService
    let employeeFactory: EmployeeFactory
    let ownerFactory: OwnerFactory
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [EmployeeFactory, OwnerFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        employeeFactory = moduleRef.get(EmployeeFactory)
        ownerFactory = moduleRef.get(OwnerFactory)
        await app.init()
    })
    test('[POST] /owner', async () => {
        const user = await employeeFactory.makePrismaEmployee()

        const accessToken = jwt.sign({ sub: user.id.toString() })
        const response = await request(app.getHttpServer())
            .post('/owner')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'John Doe',
                email: 'johndoeowner@example.com',
                phoneNumber: "21 99999-2121",
                password: '123456',
            })
        expect(response.statusCode).toBe(201)
        const userOnDatabase = await prisma.owner.findUnique({
            where: {
                email: 'johndoeowner@example.com',
            },
        })
        expect(userOnDatabase).toBeTruthy()
    })
})
