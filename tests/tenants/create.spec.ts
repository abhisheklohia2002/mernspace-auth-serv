/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { DataSource } from "typeorm";
// import { AppDataSource } from "../../src/config/data-source.js";
const {AppDataSource} = require('../../src/config/data-source.js')
describe("Database connection", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let connection: any;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    if (connection?.isInitialized) {
      await connection.destroy();
    }
  });

  it("should connect to the database", async () => {
    
  });
});
