import request from 'supertest';
import bcrypt from "bcrypt";
import http from "http";
import serverApp from "../app";
import { User, UserAttributes } from '../app/models/user';
import { v4 as uuidv4 } from "uuid";
import { TokenBlackList } from '../app/models/tokenblacklist';
import jwt from "jsonwebtoken"
import Helpers from '../helpers/helpers';
import Conversation from '../app/models/conversation';
import Message from '../app/models/message';

let server: http.Server;
let user: Partial<UserAttributes>

beforeAll(() => {
    server = serverApp
    user = {
        fullname: 'Marshall FRY',
        description: 'J\'aime la vie',
        email: "marshalfry1998@gmail.com",
        email_verified_token: "testtesttesttest",
        email_expiredtime: Helpers.timeAfterSecond(600).toString(),
        email_verified: false,
        password: "00000000",
    }
})

describe("user", () => {

    describe("Get /", () => {
        it("should return a status 401 for no access token or invalid acess token", async () => {
            const response = await request(server)
                .get("/message")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 200 to get all the conversation and message of a user", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, email_verified: true, id: uuidv4() })
            const userCreated2 = await User.create({ ...userRequired, email_verified: true, id: uuidv4(), email: 'jili989900@gmail.com' })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const conversation = await Conversation.create({
                id: uuidv4(),
                user_id_1: userCreated.id,
                user_id_2: userCreated2.id
            })
            await conversation.setUser1(userCreated)
            await conversation.setUser2(userCreated2)

            const message1 = await Message.create({
                id: uuidv4(),
                sender_id: userCreated.id,
                receiver_id: userCreated2.id,
                content: 'Hello ça va ?',
                conversation_id: conversation.id
            })
            await message1.setSender(userCreated)
            await message1.setReceiver(userCreated2)

            const message2 = await Message.create({
                id: uuidv4(),
                sender_id: userCreated2.id,
                receiver_id: userCreated.id,
                content: 'Ouais bien et toi ?',
                conversation_id: conversation.id
            })
            await message2.setSender(userCreated2)
            await message2.setReceiver(userCreated)

            const response = await request(server)
                .get("/message")
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            await userCreated2.destroy()
            await conversation.destroy()
            await message1.destroy()
            await message2.destroy()
            expect(response.body.data[0].conversation_id).toBe(conversation.id)
            expect(response.body.data[0].messages.length).toBe(2)
            expect(response.status).toBe(200)
        })
    })

    describe("POST /create", () => {
        it("should return a status 401 for no access token or invalid acess token", async () => {
            const response = await request(server)
                .post("/message/send")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 400 for trying to send message to yourself", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, email_verified: true, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .post("/message/send")
                .send({ receiver_id: userCreated.id, content: "Helloooo" })
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.body.data.msg).toBe('Receiver user cannot be the sender user')
            expect(response.status).toBe(400)
        })

        it("should return a status 404 for receiver doesn't exist", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, email_verified: true, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .post("/message/send")
                .send({ receiver_id: 'yooo', content: "Helloooo" })
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.body.data.msg).toBe('Receiver user doesn\'t exist')
            expect(response.status).toBe(404)
        })

       it("should return a status 201 for sending message", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, email_verified: true, id: uuidv4() })
            const userCreated2 = await User.create({ ...userRequired, email_verified: true, id: uuidv4(), email: 'jili989900@gmail.com' })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .post("/message/send")
                .send({ receiver_id: userCreated2.id, content: "Helloooo" })
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            await userCreated2.destroy()
            expect(response.body.data.msg).toBe('msg sent successfully')
            expect(response.status).toBe(201)
        })
    })
})
