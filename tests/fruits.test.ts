import httpStatus from "http-status"
import app from "index"
import supertest from "supertest"
import { faker } from '@faker-js/faker';
import { number, options } from "joi";

const server = supertest(app)

describe ("Testes Loja de Frutas Dona Marlene", () => {

    it("Verifing the health endpoint", async () => {
        const result = await server.get("/health")
        expect(result.text).toBe("ok!")
    })

    describe("POST /fruits", () => {
        it("should return 201 when inserting a fruit", async () => {
            const result = await server.post("/fruits").send({
                name: faker.commerce.product(),
                price: parseFloat(faker.commerce.price())
            })
    
            expect(result.status).toBe(httpStatus.CREATED)
        })
    
        it("should return 409 when inserting a fruit that is already registered", async () => {
    
            const body = {
                name : faker.commerce.product(),
                price: faker.commerce.price()
            }
    
            await server.post("/fruits").send(body)
            const result2 = await server.post("/fruits").send(body)
    
            expect(result2.status).toBe(httpStatus.CONFLICT)
    
        })
        it("should return 422 when inserting a fruit with data missing", async() => {
            const body = {
                name : faker.commerce.product()
            }

            const result = await server.post("/fruits").send(body)

            expect(result.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)

        })
    })

    describe("GET /fruits", ()=>{
        it("shoud return 404 when trying to get a fruit that doesn't exists", async () => {
            const result = await server.get("/fruits/10")
            expect(result.status).toBe(httpStatus.NOT_FOUND)
        })

        it("should return 400 when id param is not valid", async () => {
            const result = await server.get("/fruits/a")
            expect(result.status).toBe(httpStatus.BAD_REQUEST)
        })

        it("should return a fruit given an id", async () => {
            const result = await server.get("/fruits/1")

            expect(result.body).toMatchObject({
                id: 1,
                name: expect.any(String),
                price: expect.any(Number)

            })
        })

        it("should return all fruits", async () => {
            const result = await server.get("/fruits")

            expect(result.status).toBe(httpStatus.OK)
        })
    })

    

    
})