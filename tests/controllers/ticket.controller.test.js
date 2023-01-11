const User=require('../../models/user.model')
const Ticket=require("../../models/ticket.model")
const client=require('../../utils/NotificationClient').client
const {mockRequest, mockResponse} =require('../intercepter')
const {createTicket,updateTicket,getAllTickets, getOneTicket,updateTicketAssignedByEngineer,ticketPriority}
=require('../../controllers/ticket.controller');

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

const ticketCreateTestPayload={
    title:"Test",
    ticketPriority:4,
    description:"TEst",
    status:"OPEN",
    reporter:1,
    assignee:1,
    createdAt:Date.now(),
    updatedAt:Date.now()
}
const ticketTestPayload={
    title:"Test",
    ticketPriority:4,
    description:"TEst",
    status:"OPEN",
    assignee:1,
    reporter:1,
    save:jest.fn().mockReturnValue(Promise.resolve(ticketCreateTestPayload))
}

describe("Create Ticket", () => {
    // it("should pass", async () => {
    //     const userSpy = jest.spyOn(User, 'findOne')
    //         .mockReturnValue(Promise.resolve(userTestPayload))
    //     const ticketSpy = jest.spyOn(Ticket, "create")
    //         .mockReturnValue(Promise.resolve(ticketCreateTestPayload))
    //     // const clientSpy = jest.spyOn(client, 'post')
    //     //     .mockImplementation((url, args, cb) => cb("Test", null))
    //     const req = mockRequest(), res = mockResponse()
    //     req.body = ticketCreateTestPayload
    //     req.body.userId = 1
    //     await createTicket(req, res)
    //     expect(userSpy).toHaveBeenCalled()
    //     expect(ticketSpy).toHaveBeenCalled()
    //     // expect(clientSpy).toHaveBeenCalled()
    //     expect(res.status).toHaveBeenCalledWith(201)
    //     expect(res.send).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             assignee: 1,
    //             description: "Test",
    //             reporter: 1,
    //             status: "OPEN",
    //             ticketPriority: 4,
    //             title: "Test"
    //         })
    //     )
    // })

    it("should fail", async () => {
        const userSpy = jest.spyOn(User, 'findOne')
            .mockReturnValue(Promise.resolve(userTestPayload))
        const ticketSpy = jest.spyOn(Ticket, 'create')
            .mockImplementation(cb => cb(new Error("This is an error."), null))
        const req = mockRequest()
        const res = mockResponse()
        req.body = ticketTestPayload
        await createTicket(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(ticketSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            message: 'Some internal server error'
        })
    })
})

describe("Update Ticket",()=>{
    // it("should pass", async () => {
    //     const userSpy = jest.spyOn(User, 'findOne')
    //         .mockReturnValue(Promise.resolve(userTestPayload))
    //     const ticketSpy = jest.spyOn(Ticket, "findOne")
    //         .mockReturnValue(Promise.resolve(ticketTestPayload))
    //     const clientSpy = jest.spyOn(client, 'post')
    //         .mockImplementation((url, args, cb) => cb("Test", null))
    //     const req = mockRequest(), res = mockResponse()
    //     req.body = ticketTestPayload
    //     req.body.userId = 1
    //     req.params = { id: 1 }
    //     await updateTicket(req, res)
    //     expect(userSpy).toHaveBeenCalled()
    //     expect(ticketSpy).toHaveBeenCalled()
    //     expect(clientSpy).toHaveBeenCalled()
    //     expect(res.status).toHaveBeenCalledWith(200)
    //     expect(res.send).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             assignee: 1,
    //             description: "TEst",
    //             reporter: 1,
    //             status: "OPEN",
    //             ticketPriority: 4,
    //             title: "Test"
    //         })
    //     )
    // })

    it("should fail", async () => {
        userTestPayload.userId = 5
        const userSpy = jest.spyOn(User, 'findOne')
            .mockReturnValue(Promise.resolve(userTestPayload))
        const ticketSpy = jest.spyOn(Ticket, "findOne")
            .mockReturnValue(Promise.resolve(ticketTestPayload))
        const req = mockRequest()
        const res = mockResponse()
        req.params = { id: 1 }
        req.body.userId = 5
        await updateTicket(req, res)
        expect(userSpy).toHaveBeenCalled()
        expect(ticketSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({
            message:"Ticket can be updated only by the customer who created it"
        })
    })
})

describe('Get One Ticket', () => {
    it("should pass with data", async () => {
        const ticketSpy = jest.spyOn(Ticket, 'findOne')
            .mockReturnValue(Promise.resolve(ticketCreateTestPayload));
        const req = mockRequest();
        const res = mockResponse();
        req.params = { id: 1 };
        await getOneTicket(req, res);
        expect(ticketSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                assignee: 1,
                description: "TEst",
                reporter: 1,
                status: "OPEN",
                ticketPriority: 4,
                title: "Test"
            })
        );
    })
})

describe("Get All Ticket", ()=>{
    it("should pass for engineer", async()=>{
        userTestPayload.userType='ENGINEER';
        const userSpy=jest.spyOn(User,'findOne')
        .mockReturnValue(Promise.resolve(userTestPayload));
        const ticketSpy=jest.spyOn(Ticket,'find')
        .mockReturnValue(Promise.resolve([ticketCreateTestPayload]));
        const req=mockRequest();
        const res=mockResponse();
        req.query={status:"OPEN"}
        req.userId=1;
        await getAllTickets(req,res)
        expect(userSpy).toHaveBeenCalled()
        expect(ticketSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    assignee:1,
                    description:"TEst",
                    reporter:1,
                    status:"OPEN",
                    ticketPriority:4,
                    title:"Test"
                })
            ])
        )
    })
    it('should pass for customer', async () => {
        userTestPayload.userType = "CUSTOMER";
        const userSpy = jest.spyOn(User, 'findOne')
            .mockReturnValue(Promise.resolve(userTestPayload));
        const ticketSpy = jest.spyOn(Ticket, 'findOne')
            .mockReturnValue(Promise.resolve([ticketCreateTestPayload]));
        const req = mockRequest();
        const res = mockResponse();
        req.userId = 1;
        req.query = { status: "OPEN" };
        await getAllTickets(req, res);
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    assignee: 1,
                    description: "TEst",
                    reporter: 1,
                    status: "OPEN",
                    ticketPriority: 4,
                    title: "Test"
                })
            ])
        );
    })
})



// describe("Update Ticket by Engineer",()=>{
//     userTestPayload.userType="ENGINEER";
//     console.log(userTestPayload)
//     it("should pass", async () => {
//         const userSpy = jest.spyOn(User, 'findOne')
//             .mockReturnValue(Promise.resolve(userTestPayload))
//         const ticketSpy = jest.spyOn(Ticket, "findOne")
//             .mockReturnValue(Promise.resolve(ticketTestPayload))
//         const req = mockRequest(), res = mockResponse()
//         req.body = ticketTestPayload
//         req.body.userId = 1
//         req.params = { id: 1 }
//         await updateTicketAssignedByEngineer(req, res)
//         expect(userSpy).toHaveBeenCalled()
//         expect(ticketSpy).toHaveBeenCalled()
//         expect(res.status).toHaveBeenCalledWith(200)
//         expect(res.send).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 assignee: 1,
//                 description: "TEst",
//                 reporter: 1,
//                 status: "OPEN",
//                 ticketPriority: 4,
//                 title: "Test"
//             })
//         )
//     })

//     it("should fail", async () => {
//         userTestPayload.userId = 5
//         const userSpy = jest.spyOn(User, 'findOne')
//             .mockReturnValue(Promise.resolve(userTestPayload))
//         const ticketSpy = jest.spyOn(Ticket, "findOne")
//             .mockReturnValue(Promise.resolve(ticketTestPayload))
//         const req = mockRequest()
//         const res = mockResponse()
//         req.params = { id: 1 }
//         req.body.userId = 5
//         await updateTicketAssignedByEngineer(req, res)
//         expect(userSpy).toHaveBeenCalled()
//         expect(ticketSpy).toHaveBeenCalled()
//         expect(res.status).toHaveBeenCalledWith(401)
//         expect(res.send).toHaveBeenCalledWith({
//             message:"You are not assigned this ticket"
//         })
//     })
// })
