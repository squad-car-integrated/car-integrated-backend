import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { EmployeeFactory } from 'test/factories/make-employee'
describe('Create employee (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService
    let employeeFactory: EmployeeFactory
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [EmployeeFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        employeeFactory = moduleRef.get(EmployeeFactory)
        await app.init()
    })
    test('[POST] /employee', async () => {
        const response = await request(app.getHttpServer())
            .post('/employee')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '123456',
                monthWorkedHours: 0
            })
        expect(response.statusCode).toBe(201)
        const userOnDatabase = await prisma.employee.findUnique({
            where: {
                email: 'johndoe@example.com',
            },
        })
        expect(userOnDatabase).toBeTruthy()
    })
    test('[GET] /employee/:id', async () => {
        const user = await employeeFactory.makePrismaEmployee()
        const accessToken = jwt.sign({ sub: user.id.toString() })
        const newEmployee = await employeeFactory.makePrismaEmployee({
            name: 'New Employee 1',
            email: 'employee1@example.com',
            password: '123456',
            monthWorkedHours: 10
        })
        const employeeId = newEmployee.id.toString()
        const response = await request(app.getHttpServer())
            .get(`/employee/${employeeId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            employee: expect.objectContaining({
                name: 'New Employee 1',
                email: 'employee1@example.com',
            })
        })
    })
    test('[PUT] /employee/:id', async () => {
        const user = await employeeFactory.makePrismaEmployee()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const employee = await employeeFactory.makePrismaEmployee({
            name: 'New Employee To Edit',
            email: 'employee3@example.com',
            password: '123456',
            monthWorkedHours: 0
        })
        const employeeId = employee.id.toString()
        const response = await request(app.getHttpServer())
            .put(`/employee/${employeeId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: employee.name,
                email: employee.email,
                password: employee.password,
                monthWorkedHours: 20
            })
            console.log(response.body)
        expect(response.statusCode).toBe(204)
        const employeeOnDatabase = await prisma.employee.findUnique({
            where: {
                id: employeeId,
            },
        })
        
        expect(employeeOnDatabase).toBeTruthy()
        expect(employeeOnDatabase?.monthWorkedHours).toBe(20)
    })
})
