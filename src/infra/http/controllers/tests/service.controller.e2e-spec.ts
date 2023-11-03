import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AutomobileFactory } from 'test/factories/make-automobile'
import { EmployeeFactory } from 'test/factories/make-employee'
import { OwnerFactory } from 'test/factories/make-owner'
import { ServiceFactory } from 'test/factories/make-service'
describe('Create service (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService
    let employeeFactory: EmployeeFactory
    let ownerFactory: OwnerFactory
    let serviceFactory: ServiceFactory
    let automobileFactory: AutomobileFactory

    let employee: Employee
    let owner: Owner
    let car: Automobile
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [EmployeeFactory, ServiceFactory, OwnerFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        serviceFactory = moduleRef.get(ServiceFactory)
        ownerFactory = moduleRef.get(OwnerFactory)
        automobileFactory = moduleRef.get(AutomobileFactory)
        employeeFactory = moduleRef.get(EmployeeFactory)
        await app.init()
        employee = await employeeFactory.makePrismaEmployee()
        owner = await ownerFactory.makePrismaOwner()
        car = await automobileFactory.makePrismaAutomobile()
    })
    test('[POST] /service', async () => {
        const accessToken = jwt.sign({ sub: employee.id.toString() })
        const response = await request(app.getHttpServer())
            .post('/service')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                ownerId: owner.id,
                automobileId: car.id,
                description: 'New car service',
                totalValue: 0,
                password: '123456',
            })
        expect(response.statusCode).toBe(201)
        const userOnDatabase = await prisma.service.findFirst({
            where: {
                description: 'New car service',
            },
        })
        expect(userOnDatabase).toBeTruthy()
    })
    // test('[GET] Fetch All Services /service', async () => {
    //     const user = await employeeFactory.makePrismaEmployee()

    //     const accessToken = jwt.sign({ sub: user.id.toString() })

    //     await Promise.all([
    //         serviceFactory.makePrismaService({
    //             name: 'New Service 4',
    //             email: 'service4@example.com',
    //             password: '123456',
    //             phoneNumber: "21 99999 2121"
    //         }),
    //         serviceFactory.makePrismaService({
    //             name: 'New Service 5',
    //             email: 'service5@example.com',
    //             password: '123456',
    //             phoneNumber: "21 99999 2121"
    //         }),
    //         serviceFactory.makePrismaService({
    //             name: 'New Service 6',
    //             email: 'service6@example.com',
    //             password: '123456',
    //             phoneNumber: "21 99999 2121"
    //         }),
    //     ])
    //     const response = await request(app.getHttpServer())
    //         .get('/service')
    //         .set('Authorization', `Bearer ${accessToken}`)
    //         .send()
    //     expect(response.statusCode).toBe(200)
    //     expect(response.body).toEqual({
    //         services: expect.arrayContaining([
    //             expect.objectContaining({ name: 'New Service 4' }),
    //             expect.objectContaining({ name: 'New Service 6' }),
    //             expect.objectContaining({ name: 'New Service 5' }),
    //         ]),
    //     })
    // })
    // test('[GET] /service/:id', async () => {
    //     const user = await employeeFactory.makePrismaEmployee()

    //     const accessToken = jwt.sign({ sub: user.id.toString() })
    //     const newService = await serviceFactory.makePrismaService({
    //         name: 'New Service 1',
    //         email: 'service1@example.com',
    //         password: '123456',
    //         phoneNumber: "21 99999 2121"
    //     })
    //     const serviceId = newService.id.toString()
    //     const response = await request(app.getHttpServer())
    //         .get(`/service/${serviceId}`)
    //         .set('Authorization', `Bearer ${accessToken}`)
    //         .send()
    //     expect(response.statusCode).toBe(200)
    //     expect(response.body).toEqual({
    //         service: expect.objectContaining({
    //             name: 'New Service 1',
    //             email: 'service1@example.com',
    //         })
    //     })
    // })
    // test('[PUT] /service/:id', async () => {
    //     const user = await employeeFactory.makePrismaEmployee()
    //     const accessToken = jwt.sign({ sub: user.id.toString() })

    //     const service = await serviceFactory.makePrismaService({
    //         name: 'New Service To Edit',
    //         email: 'service3@example.com',
    //         password: '123456',
    //         phoneNumber: "21 99999 2121"
    //     })
    //     const serviceId = service.id.toString()
    //     const response = await request(app.getHttpServer())
    //         .put(`/service/${serviceId}`)
    //         .set('Authorization', `Bearer ${accessToken}`)
    //         .send({
    //             name: service.name,
    //             email: service.email,
    //             password: service.password,
    //             phoneNumber: "21 88888 2121"
    //         })
    //     expect(response.statusCode).toBe(204)
    //     const serviceOnDatabase = await prisma.service.findUnique({
    //         where: {
    //             id: serviceId,
    //         },
    //     })
        
    //     expect(serviceOnDatabase).toBeTruthy()
    //     expect(serviceOnDatabase?.phoneNumber).toBe("21 88888 2121")
    // })
})
