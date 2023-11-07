import { ServiceStatus } from '@/core/entities/service-status-enum'
import { ProductAndQuantity } from '@/domain/workshop/application/use-cases/Service/create-service'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { Product } from '@/domain/workshop/enterprise/entities/product'
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
import { ProductFactory } from 'test/factories/make-product'
import { ServiceFactory } from 'test/factories/make-service'
import { ServiceEmployeeFactory } from 'test/factories/make-service-employee'
import { ServiceProductFactory } from 'test/factories/make-service-product'
describe('Create service (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService
    let employeeFactory: EmployeeFactory
    let ownerFactory: OwnerFactory
    let serviceFactory: ServiceFactory
    let automobileFactory: AutomobileFactory
    let productFactory: ProductFactory
    let serviceProductFactory : ServiceProductFactory
    let serviceEmployeeFactory : ServiceEmployeeFactory
    let employee: Employee
    let owner: Owner
    let car: Automobile
    let product1: Product
    let product2: Product
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [EmployeeFactory, ServiceFactory, OwnerFactory, AutomobileFactory, ProductFactory, ServiceProductFactory, ServiceEmployeeFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        serviceFactory = moduleRef.get(ServiceFactory)
        ownerFactory = moduleRef.get(OwnerFactory)
        automobileFactory = moduleRef.get(AutomobileFactory)
        employeeFactory = moduleRef.get(EmployeeFactory)
        productFactory = moduleRef.get(ProductFactory)
        serviceProductFactory = moduleRef.get(ServiceProductFactory)
        serviceEmployeeFactory = moduleRef.get(ServiceEmployeeFactory)
        
        await app.init()
        employee = await employeeFactory.makePrismaEmployee()
        owner = await ownerFactory.makePrismaOwner()
        car = await automobileFactory.makePrismaAutomobile({ownerId: owner.id})
        product1= await productFactory.makePrismaProduct()
        product2= await productFactory.makePrismaProduct()
    })
    test('[POST] /service', async () => {
        const accessToken = jwt.sign({ sub: employee.id.toString() })

        const response = await request(app.getHttpServer())
            .post('/services')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                ownerId: owner.id.toString(),
                automobileId: car.id.toString(),
                description: 'New car service',
                totalValue: 0,
                employeesIds: [employee.id.toString()],
                productsIds: [product1.id.toString(), product2.id.toString()]
            })
        expect(response.statusCode).toBe(201)
        const serviceOnDatabase = await prisma.service.findFirst({
            where: {
                description: 'New car service',
            },
        })
        expect(serviceOnDatabase).toBeTruthy()
    })
    test('[GET] Fetch All Services /service', async () => {
        const accessToken = jwt.sign({ sub: employee.id.toString() })

        await Promise.all([
            serviceFactory.makePrismaService({
                description: 'New Service 2',
                ownerId: owner.id,
                automobileId: car.id,
            }),
            serviceFactory.makePrismaService({
                description: 'New Service 3',
                ownerId: owner.id,
                automobileId: car.id,
            }),
            serviceFactory.makePrismaService({
                description: 'New Service 4',
                ownerId: owner.id,
                automobileId: car.id,
            }),
        ])
        const response = await request(app.getHttpServer())
            .get('/services')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            services: expect.arrayContaining([
                expect.objectContaining({ description: 'New Service 2' }),
                expect.objectContaining({ description: 'New Service 3' }),
                expect.objectContaining({ description: 'New Service 4' }),
            ]),
        })
    })
    test('[GET] /service/:id', async () => {
        const accessToken = jwt.sign({ sub: employee.id.toString() })
        const newService = await serviceFactory.makePrismaService({
            description: 'New Service 5',
            ownerId: owner.id,
            automobileId: car.id,
        })
        const serviceId = newService.id.toString()
        const response = await request(app.getHttpServer())
            .get(`/services/${serviceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            service: expect.objectContaining({
                description: 'New Service 5',
                ownerId: owner.id.toString(),
            })
        })
    })
    test('[PUT] /service/:id', async () => {
        const accessToken = jwt.sign({ sub: employee.id.toString() })
        const newProduct1 = await productFactory.makePrismaProduct()
        const newProduct2 = await productFactory.makePrismaProduct()

        const service = await serviceFactory.makePrismaService({
            description: 'New Service To Edit',
            ownerId: owner.id,
            automobileId: car.id,
            totalValue: 20
        })
        await serviceEmployeeFactory.makePrismaServiceEmployee({
            serviceId: service.id,
            employeeId: employee.id,
        })
        await serviceProductFactory.makePrismaServiceProduct({
            serviceId: service.id,
            productId: newProduct1.id,
            quantity: 10
        })
        await serviceProductFactory.makePrismaServiceProduct({
            serviceId: service.id,
            productId: newProduct2.id,
            quantity: 10
        })
        const newProduct3 = await productFactory.makePrismaProduct({})
        const serviceId = service.id.toString()


        const productAndQuantity1: ProductAndQuantity = {
            productId: newProduct1.id.toString(),
            quantity: 6
        }
        const productAndQuantity2: ProductAndQuantity = {
            productId: newProduct2.id.toString(),
            quantity: 9
        }
        const response = await request(app.getHttpServer())
            .put(`/services/${serviceId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                description: service.description,
                ownerId: service.ownerId.toString(),
                automobileId: service.automobileId.toString(),
                totalValue: 2987,
                status: ServiceStatus.InProgress,
                employeesIds: [employee.id.toString()],
                productsIds: [productAndQuantity1, productAndQuantity2]
            })
        console.log(response.body)
        expect(response.statusCode).toBe(204)
        const serviceOnDatabase = await prisma.service.findUnique({
            where: {
                id: serviceId,
            },
        })
        
        expect(serviceOnDatabase).toBeTruthy()
        expect(serviceOnDatabase?.totalValue).toBe(2987)
        const productsOnDatabase = await prisma.serviceProducts.findMany({
            where: {
              serviceId: serviceOnDatabase?.id,
            },
        })
        expect(productsOnDatabase).toHaveLength(2)
        expect(productsOnDatabase).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
            id: newProduct1.id.toString(),
            }),
            expect.objectContaining({
            id: newProduct3.id.toString(),
            }),
        ]),
        )
    })
})
