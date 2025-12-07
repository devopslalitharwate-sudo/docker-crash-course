const request = require("supertest");
const app = require("../main");
const User = require("../models/UserModel");

beforeEach(() => {
    jest.clearAllMocks(); 
});

// initial api test
test("GET /api return message hello world", async () => {
    const res = await request(app).get("/api");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Hello world");
});

// get users /api/users
test("GET /api/users returns all the users", async () => {
    User.findAll = jest.fn().mockResolvedValue([
        { id: 1, username: "john" },
        { id: 2, username: "mary" }
    ]);

    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].username).toBe("john");
});

// get user by id /api/users/:id
test("GET /api/users/:id return user by id", async () => {
    User.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        username: "john"
    });

    const res = await request(app).get("/api/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.username).toBe("john");
});

// create user /api/users
test("POST /api/users create user", async () => {
    User.create = jest.fn().mockResolvedValue({
        username: "john",
        email: "john@mail.com",
        password: "123"
    });

    const res = await request(app).post("/api/users").send({
        username: "john",
        email: "john@mail.com",
        password: "123"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.username).toBe("john");
});

// User Not Found /api/users/:id
test("DELETE /api/users/:id user Not Found", async () => {
    User.destroy = jest.fn().mockResolvedValue(0); // simulate "not found"

    const res = await request(app).delete("/api/users/1");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User Not Found");
});

// User Found and Deleted /api/users/:id
test("DELETE /api/users/:id User Deleted", async () => {
    User.destroy = jest.fn().mockResolvedValue(1); // simulate "deleted"

    const res = await request(app).delete("/api/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User Deleted");
});

// update user /api/users/:id
test("UPDATE /api/users/:id", async () => {
    User.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        username: "oldname",
        email: "oldemail@gmail.com",
        password: "123",
        update: jest.fn().mockImplementation(function (data) {
            this.username = data.username || this.username;
            this.email = data.email || this.email;
            this.password = data.password || this.password;
            return Promise.resolve(this);
        })
    });

    const res = await request(app)
        .put("/api/users/1")
        .send({
            username: "Lalit",
            email: "lalitharwate@gmail.com",
            password: "1234"
        });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User Updated");
    expect(res.body.data.username).toBe("Lalit");
});
