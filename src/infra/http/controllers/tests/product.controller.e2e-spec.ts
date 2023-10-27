import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { EmployeeFactory } from 'test/factories/make-employee'
import { ProductFactory } from 'test/factories/make-product'
describe('Create products (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService
    let employeeFactory: EmployeeFactory
    let productFactory: ProductFactory
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [EmployeeFactory, ProductFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        employeeFactory = moduleRef.get(EmployeeFactory)
        productFactory = moduleRef.get(ProductFactory)
        await app.init()
    })
    test('[POST] /products', async () => {
        const user = await employeeFactory.makePrismaEmployee()
        const accessToken = jwt.sign({ sub: user.id.toString() })
        const response = await request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Oleo Motul',
                unitValue: 90,
                productAmount: 20,
                description: '1L w40',
                photo: "uri da photo"
            })
        expect(response.statusCode).toBe(201)
        const productsOnDatabase = await prisma.product.findFirst({
            where: {
                name: 'Oleo Motul',
                unitValue: 90
            },
        })
        expect(productsOnDatabase).toBeTruthy()
    })
    test('[GET] Fetch Products /products', async () => {
        const user = await employeeFactory.makePrismaEmployee()
        const accessToken = jwt.sign({ sub: user.id.toString() })

        await Promise.all([
            productFactory.makePrismaProduct({
                name: 'New product 01',
                unitValue: 10.50,
                productAmount: 25,
                description: "Product 01 description"
            }),
            productFactory.makePrismaProduct({
                name: 'New product 02',
                unitValue: 10.50,
                productAmount: 25,
                description: "Product 01 description"
            }),
            productFactory.makePrismaProduct({
                name: 'New product 03',
                unitValue: 10.50,
                productAmount: 25,
                description: "Product 01 description"
            }),
        ])
        const response = await request(app.getHttpServer())
            .get('/products')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            products: expect.arrayContaining([
                expect.objectContaining({ name: 'New product 01' }),
                expect.objectContaining({ name: 'New product 02' }),
                expect.objectContaining({ name: 'New product 03' }),
            ]),
        })
    })
    test('[PUT] /product/:id', async () => {
        const user = await employeeFactory.makePrismaEmployee()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const product = await productFactory.makePrismaProduct({
            name: 'WD-40',
            unitValue: 24.50,
            productAmount: 25,
            description: "WD-40 MELHOR LUB",
            photo: "url photo"
        })
        const productId = product.id.toString()
        const response = await request(app.getHttpServer())
            .put(`/products/${productId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: product.name,
                unitValue: 27.50,
                productAmount: 22,
                description: product.description,
                photo: product.photo
            })
        expect(response.statusCode).toBe(204)
        const productsOnDatabase = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        })
        expect(productsOnDatabase).toBeTruthy()
        expect(productsOnDatabase?.unitValue).toBe(27.50)
        expect(productsOnDatabase?.productAmount).toBe(22)
    })
})
