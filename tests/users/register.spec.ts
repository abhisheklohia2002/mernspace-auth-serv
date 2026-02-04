 
 
import request from "supertest";
import app from "../../src/app.js";

describe("POST /api/auth/register", () => {
  describe("Given all required fields", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: `john_${Date.now()}@gmail.com`,
        password: "password123",
      };

      const res = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(res.body).toBeDefined();
      // Example:
    //   expect(res.body).toHaveProperty("user");
    //   expect(res.body.user.email).toBe(userData.email);
    });
  });

  describe("fields are missing", () => {
    it("should return 400 when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ firstName: "John" })
        .expect(400);

      expect(res.body).toBeDefined();
    });
  });
});
