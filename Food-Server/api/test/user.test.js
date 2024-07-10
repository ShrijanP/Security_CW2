const httpStatus = require('http-status');
const { initializeApp } = require('../../server');
const request = require('supertest');
require('dotenv').config();

describe("User Test", () => {
    let app;
    let user_id, superAdminToken;

    async function loginAsSuperAdmin() {
        const superAdminData = {
            email: "superadmin@gmail.com",
            password: "password"
        };

        const res = await request(app)
            .post('/users/login')
            .send(superAdminData);
        console.log("res", res.body);
        return res.body.data.token;
    }

    beforeAll(async () => {

        // Initialize the app before running tests
        app = await initializeApp();
        //login as superadmin
        superAdminToken = await loginAsSuperAdmin();
    });

    it('User Register', async () => {
        const res = await request(app).post('/users/register')
            .send({
                name: "Test ing",
                email: "test@gmail.com",
                password: "password",
                mobile_no: "9800000000"
            });
        expect(res.statusCode).toEqual(httpStatus.OK);
        expect(res.body.success).toEqual(true);
    });

    it('User Login!! Invalid Credential', async () => {
        const res = await request(app).post('/users/login')
            .send({
                email: "test@gmail.com",
                password: "password123",
            });
        expect(res.statusCode).toEqual(httpStatus.UNAUTHORIZED);
        expect(res.body.success).toEqual(false);
    });

    it('User Login!! Success', async () => {
        const res = await request(app).post('/users/login')
            .send({
                email: "test@gmail.com",
                password: "password",
            });
        console.log("res", res.body);
        user_id = res.body.data._id;
        expect(res.statusCode).toEqual(httpStatus.OK);
        expect(res.body.success).toEqual(true);
    });

    it('User Login!! Success', async () => {
        const res = await request(app).post('/users/login')
            .send({
                email: "test@gmail.com",
                password: "password",
            });
        console.log("res", res.body);
        expect(res.statusCode).toEqual(httpStatus.OK);
        expect(res.body.success).toEqual(true);
    });

    it('User Delete!! Success', async () => {
        const res = await request(app).delete(`/users/delete-user/${user_id}`)
            .set('Authorization', `Bearer ${superAdminToken}`);
        expect(res.statusCode).toEqual(httpStatus.OK);
        expect(res.body.success).toEqual(true);
    });


});