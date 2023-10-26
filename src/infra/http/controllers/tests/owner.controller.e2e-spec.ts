import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
describe('Create owner (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        await app.init()
    })
    test('[POST] /owner', async () => {
        const response = await request(app.getHttpServer())
            .post('/owner')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                phoneNumber: "21 99999-2121",
                password: '123456',
            })
        expect(response.statusCode).toBe(201)
        const userOnDatabase = await prisma.owner.findUnique({
            where: {
                email: 'johndoe@example.com',
            },
        })
        expect(userOnDatabase).toBeTruthy()
    })
})
