import request from 'supertest';
import bcrypt from "bcrypt";
import http from "http";
import serverApp from "../app";
import { User, UserAttributes } from '../app/models/user';
import { v4 as uuidv4 } from "uuid";
import { TokenBlackList } from '../app/models/tokenblacklist';
import jwt from "jsonwebtoken"
import Helpers from '../helpers/helpers';
import sequelize from "../config/sequelize";
import path from "path"

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
                .get("/user")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 200 to get all the users", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, email_verified: true, id: uuidv4() })
            const userCreated2 = await User.create({ ...userRequired, email_verified: true, id: uuidv4(), email: 'jili989900@gmail.com' })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .get("/user")
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            await userCreated2.destroy()
            expect(response.body.data.users.length).toBe(2)
            expect(response.status).toBe(200)
        })
    })

    describe("Get /:id", () => {
        it("should return a status 401 for no access token or invalid acess token", async () => {
            const response = await request(server)
                .get("/user")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 200 to get all the users", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, email_verified: true, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .get("/user/"+userCreated.id)
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.body.data.user.id).toBe(userCreated.id)
            expect(response.status).toBe(200)
        })
    })

    describe("Post /create", () => {
        it("should return a status 400 for no argument passed", async () => {
            const response = await request(server)
                .post("/user/create")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(400)
        })

        it("should return a status 400 for wrong password length", async () => {
            const response = await request(server)
                .post("/user/create")
                .send({ ...user, password: '0000' })
                .set({ Accept: 'Application/json' })
            const passwordError = response.body.errors.fields[0]
            expect(response.status).toBe(400)
            expect(passwordError.status).toBe('len')
            expect(passwordError.name).toBe('password')
        })

        it("should return a status 400 for wrong email adress", async () => {
            const response = await request(server)
                .post("/user/create")
                .send({ ...user, email: 'yo' })
                .set({ Accept: 'Application/json' })
            const passwordError = response.body.errors.fields[0]
            expect(response.status).toBe(400)
            expect(passwordError.status).toBe('isEmail')
            expect(passwordError.name).toBe('email')
        })

        it("should return a status 400 for not unique email", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })

            const response = await request(server)
                .post("/user/create")
                .send({ ...user, phone: '0699063448' })
                .set({ Accept: 'Application/json' })
            await userCreated.destroy()
            const uniqueEmailError = response.body.errors.fields[0]
            expect(response.status).toBe(400)
            expect(uniqueEmailError.status).toBe('not_unique')
            expect(uniqueEmailError.name).toBe('email')
        })

        it("should return a status 201 for user account created successfully", async () => {
            const response = await request(server)
                .post("/user/create")
                .send({ ...user })
                .set({ Accept: 'Application/json' })
            const id = response.body?.data?.id
            const userCreated = await User.findByPk(id)
            await userCreated?.destroy()
            expect(response.status).toBe(201)
        })
    })

    describe("Post /login", () => {

        it("should return a status 400 for no arguments passed", async () => {
            const response = await request(server)
                .post("/user/login")
                .send()
                .set({ Accept: 'Application/json' })
            const loginErrors = response.body.errors.fields
            expect(response.status).toBe(400)
            expect(loginErrors[0].status).toBe('is_null')
            expect(loginErrors[0].name).toBe('login')
            expect(loginErrors[1].status).toBe('is_null')
            expect(loginErrors[1].name).toBe('password')
        })

        it("should return a status 400 with only login param", async () => {
            const response = await request(server)
                .post("/user/login")
                .send({ login: 'test' })
                .set({ Accept: 'Application/json' })
            const passwordError = response.body.errors.fields[0]
            expect(response.status).toBe(400)
            expect(passwordError.status).toBe('is_null')
            expect(passwordError.name).toBe('password')
        })

        it("should return a status 400 with only password param", async () => {
            const response = await request(server)
                .post("/user/login")
                .send({ password: 'test' })
                .set({ Accept: 'Application/json' })
            const loginError = response.body.errors.fields[0]
            expect(response.status).toBe(400)
            expect(loginError.status).toBe('is_null')
            expect(loginError.name).toBe('login')
        })

        it("should return a status 404 with wrong credentials", async () => {
            const response = await request(server)
                .post("/user/login")
                .send({ login: 'test', password: 'test' })
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(404)
        })

        it("should return a status 200 with the good credentials", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })

            const response = await request(server)
                .post("/user/login")
                .send({ login: 'marshalfry1998@gmail.com', password: '00000000' })
                .set({ Accept: 'Application/json' })
            await userCreated.destroy()
            expect(response.status).toBe(200)
        })

    })

    describe("Post /logout", () => {

        it("should return a status 401 for no arguments passed", async () => {
            const response = await request(server)
                .post("/user/logout")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 401 for invalid access token", async () => {
            const response = await request(server)
                .post("/user/logout")
                .send()
                .set({ Accept: 'Application/json', Authorization: 'Bearer yoooo' })
            expect(response.status).toBe(401)
        })

        it("should return a status 401 for access token already blacklisted", async () => {
            const token = jwt.sign({ id: "test_access_token" }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })
            const tokenTest = await TokenBlackList.create({ id: uuidv4(), token })
            const response = await request(server)
                .post("/user/logout")
                .send()
                .set({ Accept: 'Application/json', Authorization: 'Bearer ' + token })
            await tokenTest.destroy()
            expect(response.status).toBe(401)
        })

        it("should return a status 200 for good access token", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .post("/user/logout")
                .send()
                .set('Authorization', 'Bearer ' + token);
            await TokenBlackList.truncate()
            await userCreated.destroy()
            expect(response.status).toBe(200)
        })
    })

    describe("Post /refreshtoken", () => {

        it("should return a status 401 for no refresh token passed", async () => {
            const response = await request(server)
                .post("/user/refreshtoken")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 401 for invalid refresh token", async () => {
            const response = await request(server)
                .post("/user/refreshtoken")
                .send()
                .set({ Accept: 'Application/json', Authorization: 'Bearer yoooo' })
            expect(response.status).toBe(401)
        })

        it("should return a status 401 for refresh token already blacklisted", async () => {
            const token = jwt.sign({ id: "test_access_token" }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
            const tokenTest = await TokenBlackList.create({ id: uuidv4(), token })

            const response = await request(server)
                .post("/user/refreshtoken")
                .send()
                .set({ Accept: 'Application/json', Authorization: 'Bearer ' + token })
            await tokenTest.destroy()
            expect(response.status).toBe(401)
        })

        it("should return a status 200 for good refresh token", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })

            const response = await request(server)
                .post("/user/refreshtoken")
                .send()
                .set('Authorization', 'Bearer ' + token);
            await TokenBlackList.truncate()
            await userCreated.destroy()
            expect(response.status).toBe(200)
        })
    })

    describe("Update /update/generatetoken/email", () => {

        it("should return a status 401 for no access token passed", async () => {
            const response = await request(server)
                .put("/user/update/generatetoken/email")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 401 for invalid access token", async () => {
            const response = await request(server)
                .put("/user/update/generatetoken/email")
                .send()
                .set({ Accept: 'Application/json', Authorization: 'Bearer yoooo' })
            expect(response.status).toBe(401)
        })

        it("should return a status 400 for email already verified", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4(), email_verified: true })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .put("/user/update/generatetoken/email")
                .send()
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.status).toBe(400)
        })

        it("should return a status 202 for email sended", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .put("/user/update/generatetoken/email")
                .send()
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.status).toBe(202)
        })

    })

    describe("Update /update/verify/email?token", () => {

        it("should return a status 400 for no token passed", async () => {
            const response = await request(server)
                .put("/user/update/verify/email")
                .send()
            expect(response.status).toBe(400)
        })

        it("should return a status 404 for wrong verify token passed", async () => {
            const response = await request(server)
                .put("/user/update/verify/email?token=abcd")
                .send()
            expect(response.status).toBe(404)
        })

        it("should return a status 400 for email already verified", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4(), email_verified: true })


            const response = await request(server)
                .put('/user/update/verify/email?token=' + userCreated.email_verified_token)
                .send()

            await userCreated.destroy()
            expect(response.status).toBe(400)
        })

        it("should return a status 202 for email verified", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })

            const response = await request(server)
                .put('/user/update/verify/email?token=' + userCreated.email_verified_token)
                .send()
            await userCreated.destroy()
            expect(response.status).toBe(202)
        })

    })

    describe("Update /update/forgotpassword", () => {

        it("should return a status 400 for no address email passed", async () => {
            const response = await request(server)
                .put("/user/update/forgotpassword")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(400)
        })

        it("should return a status 202 for email sended", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })

            const response = await request(server)
                .put("/user/update/forgotpassword")
                .send({ email: userCreated.email })
            await userCreated.destroy()
            expect(response.status).toBe(202)
        })

    })

    describe("Update /update/forgotpassword/change?token=", () => {

        it("should return a status 400 for missing token argument", async () => {
            const response = await request(server)
                .put("/user/update/forgotpassword/change")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(400)
        })

        it("should return a status 400 for missing token argument", async () => {
            const response = await request(server)
                .put("/user/update/forgotpassword/change?token=yoooo")
                .send({ email: 'toto@test.com' })
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(400)
        })

        it("should return a status 400 for wrong confirmation password", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4(), forgotpasswordtoken: uuidv4() })

            const response = await request(server)
                .put('/user/update/forgotpassword/change?token=' + userCreated.forgotpasswordtoken)
                .send({ email: userCreated.email, password: 'aaaaaaaa', confirm_password: 'aaaaaaab' })
                .set({ Accept: 'Application/json' })
            await userCreated.destroy()
            expect(response.status).toBe(400)
        })

        it("should return a status 400 for incorrect password length", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4(), forgotpasswordtoken: uuidv4() })

            const response = await request(server)
                .put('/user/update/forgotpassword/change?token=' + userCreated.forgotpasswordtoken)
                .send({ email: userCreated.email, password: 'aaaaaa', confirm_password: 'aaaaaa' })
                .set({ Accept: 'Application/json' })
            await userCreated.destroy()
            expect(response.body.errors.fields[0].status).toBe('len')
            expect(response.body.errors.fields[0].name).toBe('password')
            expect(response.status).toBe(400)
        })

        it("should return a status 202 for good token and password", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4(), forgotpasswordtoken: uuidv4() })

            const response = await request(server)
                .put('/user/update/forgotpassword/change?token=' + userCreated.forgotpasswordtoken)
                .send({ email: userCreated.email, password: 'aaaaaaaa', confirm_password: 'aaaaaaaa' })
                .set({ Accept: 'Application/json' })
            await userCreated.destroy()
            expect(response.status).toBe(202)
        })

    })

    describe("Update /update", () => {

        it("should return a status 401 for no access token passed", async () => {
            const response = await request(server)
                .put("/user/update")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 401 for wrong access token passed", async () => {
            const response = await request(server)
                .put("/user/update")
                .send()
                .set('Authorization', 'Bearer aaaaa');
            expect(response.status).toBe(401)
        })

        it("should return a status 400 for wrong current password", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .put('/user/update')
                .send({ password: 'aaaaaaaa', current_password: '00000001' })
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.body.errors.fields[0].status).toBe("incorrect")
            expect(response.body.errors.fields[0].name).toBe("current_password")
            expect(response.status).toBe(400)
        })

        it("should return a status 400 for wrong length password", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .put('/user/update')
                .send({ password: 'aaaaa', current_password: '00000000' })
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.body.errors.fields[0].status).toBe("len")
            expect(response.body.errors.fields[0].name).toBe("password")
            expect(response.status).toBe(400)
        })

        it("should return a status 400 for wrong fullname and description", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .put('/user/update')
                .send({ fullname: ' ', description: ' ' })
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.body.errors.fields[0].status).toBe("notEmpty")
            expect(response.body.errors.fields[0].name).toBe("fullname")
            expect(response.body.errors.fields[1].status).toBe("notEmpty")
            expect(response.body.errors.fields[1].name).toBe("description")
            expect(response.status).toBe(400)
        })

        it("should return a status 202 for good params sent", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })
            const body = {
                fullname: 'Marshall FRY',
                description: 'I love life',
                current_password: '00000000',
                password: 'aaaaaaaa'
            }

            const response = await request(server)
                .put('/user/update')
                .send({ ...body })
                .set('Authorization', 'Bearer ' + token);

            const userUpdated = await User.findByPk(userCreated.id)
            await userCreated.destroy()

            expect(userUpdated?.fullname).toBe(body.fullname)
            expect(userUpdated?.description).toBe(body.description)
            expect(bcrypt.compareSync(body.password, userUpdated!.password!)).toBe(true)
            expect(response.status).toBe(202)
        })
    })

    describe("Update /update/profile_img", () => {

        it("should return a status 401 for no access token passed", async () => {
            const response = await request(server)
                .delete("/user/delete")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 401 for wrong access token passed", async () => {
            const response = await request(server)
                .delete("/user/delete")
                .send()
                .set('Authorization', 'Bearer aaaaa');
            expect(response.status).toBe(401)
        })

        /* it("should return a status 202 for profile img correctly updated", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4()})
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '1h'})
            const filePath = path.resolve(__dirname, '../../assets' , 'test.png')

            const response = await request(server)
                .put("/user/update/profile_img")
                .attach('profile_img', filePath)
                .set('Authorization', 'Bearer '+ token);
            console.log(response.body)
            await userCreated.destroy()
            expect(response.body.data.id).toBe(userCreated.id)
            expect(response.status).toBe(202)
        }) */

    })

    describe("Delete /delete", () => {

        it("should return a status 401 for no access token passed", async () => {
            const response = await request(server)
                .delete("/user/delete")
                .send()
                .set({ Accept: 'Application/json' })
            expect(response.status).toBe(401)
        })

        it("should return a status 401 for wrong access token passed", async () => {
            const response = await request(server)
                .delete("/user/delete")
                .send()
                .set('Authorization', 'Bearer aaaaa');
            expect(response.status).toBe(401)
        })

        it("should return a status 202 for good access token", async () => {
            const userRequired = user as Required<UserAttributes>
            const userCreated = await User.create({ ...userRequired, id: uuidv4() })
            const token = jwt.sign({ id: userCreated.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' })

            const response = await request(server)
                .delete("/user/delete")
                .send()
                .set('Authorization', 'Bearer ' + token);
            await userCreated.destroy()
            expect(response.body.data.id).toBe(userCreated.id)
            expect(response.status).toBe(202)
        })

    })

})
