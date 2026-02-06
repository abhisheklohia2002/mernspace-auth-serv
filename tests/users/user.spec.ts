// import { createJWKSMock } from 'mock-jwks'
// import type { DataSource } from "typeorm";
// import request from "supertest";
// import { AppDataSource } from "../../src/config/data-source.js";
// import app from "../../src/app.js";
// import type { UserData } from '../../src/types/index.js';
// import { User } from '../../src/entity/User.js';

// describe("GET /api/auth/self", () => {
//   let connection: DataSource;

//   let jwts:ReturnType<typeof createJWKSMock>;
//   beforeAll(async () => {
//      jwts = createJWKSMock("http://localhost:5000")
//     connection = await AppDataSource.initialize();
//   });

//   beforeEach(async () => {
//     jwts.start();
//     await connection.dropDatabase();
//     await connection.synchronize();
//   });

//   afterEach(()=>{
//     jwts.stop()
//   })
//   afterAll(async () => {
//     await connection.destroy();
//   });

//   it("should return 200", async () => {
//     const res = await request(app).get("/api/auth/self");
//     expect(res.status).toBe(200);
//   });
//    it("should return user data", async () => {
//     const userData:UserData = {
//         email:"a@gmail.com",
//         password:"a",
//         firstName:"abhi",
//         lastName:"lohia",
//         role:"admin"
//     }
//     const userRepository = connection.getRepository(User);
//     const data = await userRepository.save({...userData});
//    const accessToken = jwts.token({
//         sub:String(data.id),
//         role:data.role
//     })
//     const response = await request(app).get("/api/auth/self").set("Cookie",[`accessToken=${accessToken};`]).send();
    
//     expect(response.body as Record<string,string>).toBe(data.id)
//   });
// });
