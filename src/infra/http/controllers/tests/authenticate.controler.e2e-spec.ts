import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
describe('Authenticate (E2E)', () => {
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
    test('[POST] /sessions', async () => {
        const newPassword = faker.internet.password()
        await prisma.employee.create({
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                monthWorkedHours: 0,
                password: await hash(newPassword, 8),
            },
        })
        const response = await request(app.getHttpServer())
            .post('/sessions')
            .send({
                email: 'johndoe@example.com',
                password: newPassword,
            })
        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            access_token: expect.any(String),
        })
    })
})
