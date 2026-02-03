// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// import request from "supertest";
// import app from "../../src/app.js";

// describe("POST /auth/register", () => {
//   describe("Given all required fields", () => {
//     it("should register a new user successfully", async () => {
//       const userData = {
//         firstName: "John",
//         lastName: "Doe",
//         email: "john@gmail.com",
//         password: "password123",
//       };

//       const res = await request(app)
//         .post("/auth/register")
//         .send(userData)
//         .expect(201);

//       // Example assertions (adjust to your API response)
//       expect(res.body).toBeDefined();
//       // If you return user object:
//       // expect(res.body.user).toMatchObject({ email: userData.email });
//       // If you return token:
//       // expect(res.body.token).toBeTruthy();
//       // If you return message:
//       // expect(res.body.message).toMatch(/registered/i);
//     });
//   });

//   describe("fields are missing", () => {
//     it("should return 400 when required fields are missing", async () => {
//       const res = await request(app)
//         .post("/auth/register")
//         .send({ firstName: "John" }) // missing others
//         .expect(400);

//       // adjust to your error format
//       expect(res.body).toBeDefined();
//       // expect(res.body.message).toMatch(/required/i);
//     });
//   });
// });
