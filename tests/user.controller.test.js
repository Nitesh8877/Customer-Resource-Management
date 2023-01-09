const { mockRequest, mockResponse } = require("../tests/intercepter");
const { update, findAll, findById } = require("../controllers/user.controller");
const User = require("../models/user.model");
const intercepter = require("../tests/intercepter");

const userTestPayload = {
    userType: "CUSTOMER",
    password: "12345678",
    userStatus: "APPROVED",
    name: "Test",
    userId: 1,
    email: "test@relevel.com",
    ticketsCreated: [],
    ticketsAssigned: [],
    exec: jest.fn()
}

describe("Update", () => {
    it('should fail if no user found', async () => {
        const userSpy = jest.spyOn(User, 'findOneAndUpdate')
            .mockImplementation(() => ({
                exec: jest.fn().mockReturnValue(null)
            }))
        const req = mockRequest()
        const res = mockResponse()
        req.params = { userId: 1 }
        req.body = userTestPayload
        await update(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({
            message: "No user with id found!"
        })
    })

    it('should fail due to internal error', async () => {
        const userSpy = jest.spyOn(User, 'findOneAndUpdate')
            .mockReturnValue(cb => cb(new Error("This is an error")), null)
        const req = mockRequest()
        const res = mockResponse()
        req.params = { userId: 1 }
        await update(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error occured! in update function"
        })

    })

    it('should pass', async () => {
        const userSpy = jest.spyOn(User, 'findOneAndUpdate')
            .mockImplementation(() => ({
                exec: jest.fn().mockReturnValue(userTestPayload)
            }))
        const req = mockRequest()
        const res = mockResponse()
        req.params = { userId: 1 }
        req.body = userTestPayload
        await update(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({
            message: `User record has been updated successfully`
        })

    })
})


describe('Find By Id', () => {

    it(`should fail if no user found`, async () => {
        const userSpy = jest.spyOn(User, "find")
            .mockReturnValue(Promise.resolve([]))
        const req = mockRequest()
        const res = mockResponse()
        req.params = { userId: 1 }
        req.body = userTestPayload
        await findById(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({
            message: `User with this id [1] is not present`
        })
    })

    it(`should fail due to internal error`, async () => {
        const userSpy = jest.spyOn(User, 'find')
            .mockReturnValue(cb => cb(new Error("This is an error")), null)
        const req = mockRequest()
        const res = mockResponse()
        req.params = { userId: 1 }
        await findById(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error occured ! find by id side"
        })
    })

    it('should pass', async () => {
        const userSpy = jest.spyOn(User, 'find')
            .mockReturnValue(Promise.resolve([userTestPayload]))
        const req = mockRequest()
        const res = mockResponse()
        req.params = { userId: 1 }
        await findById(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    userType: userTestPayload.userType,
                    name: userTestPayload.name,
                    userId: userTestPayload.userId,
                    email: userTestPayload.email,
                    userStatus: userTestPayload.userStatus
                })
            ])
        )
    })

})


describe("Fidn all", () => {

    it(`should pass`, async () => {
        const userSpy = jest.spyOn(User, 'find')
            .mockReturnValue(Promise.resolve([userTestPayload]))
        const req = mockRequest()
        const res = mockResponse()
        req.query = {}
        await findAll(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
               expect.objectContaining({
                email: "test@relevel.com",
                name: "Test",
                userId: 1,
                userStatus: 'APPROVED',
                userType: 'CUSTOMER'
            })
        ])
        )
    })

    
})