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
            providers: [EmployeeFactory, OwnerFactory],
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        ownerFactory = moduleRef.get(OwnerFactory)
        employeeFactory = moduleRef.get(EmployeeFactory)
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
                phoneNumber: '21 99999-2121',
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
    test('[GET] Fetch All Owners /owner', async () => {
        const user = await employeeFactory.makePrismaEmployee()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        await Promise.all([
            ownerFactory.makePrismaOwner({
                name: 'New Owner 4',
                email: 'owner4@example.com',
                password: '123456',
                phoneNumber: '21 99999 2121',
            }),
            ownerFactory.makePrismaOwner({
                name: 'New Owner 5',
                email: 'owner5@example.com',
                password: '123456',
                phoneNumber: '21 99999 2121',
            }),
            ownerFactory.makePrismaOwner({
                name: 'New Owner 6',
                email: 'owner6@example.com',
                password: '123456',
                phoneNumber: '21 99999 2121',
            }),
        ])
        const response = await request(app.getHttpServer())
            .get('/owner')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            owners: expect.arrayContaining([
                expect.objectContaining({ name: 'New Owner 4' }),
                expect.objectContaining({ name: 'New Owner 6' }),
                expect.objectContaining({ name: 'New Owner 5' }),
            ]),
        })
    })
    test('[GET] /owner/:id', async () => {
        const user = await employeeFactory.makePrismaEmployee()

        const accessToken = jwt.sign({ sub: user.id.toString() })
        const newOwner = await ownerFactory.makePrismaOwner({
            name: 'New Owner 1',
            email: 'owner1@example.com',
            password: '123456',
            phoneNumber: '21 99999 2121',
        })
        const ownerId = newOwner.id.toString()
        const response = await request(app.getHttpServer())
            .get(`/owner/${ownerId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            owner: expect.objectContaining({
                name: 'New Owner 1',
                email: 'owner1@example.com',
            }),
        })
    })
    test('[PUT] /owner/:id', async () => {
        const user = await employeeFactory.makePrismaEmployee()
        const accessToken = jwt.sign({ sub: user.id.toString() })

        const owner = await ownerFactory.makePrismaOwner({
            name: 'New Owner To Edit',
            email: 'owner3@example.com',
            password: '123456',
            phoneNumber: '21 99999 2121',
        })
        const ownerId = owner.id.toString()
        const response = await request(app.getHttpServer())
            .put(`/owner/${ownerId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: owner.name,
                email: owner.email,
                password: owner.password,
                phoneNumber: '21 88888 2121',
            })
        expect(response.statusCode).toBe(204)
        const ownerOnDatabase = await prisma.owner.findUnique({
            where: {
                id: ownerId,
            },
        })

        expect(ownerOnDatabase).toBeTruthy()
        expect(ownerOnDatabase?.phoneNumber).toBe('21 88888 2121')
    })
})
