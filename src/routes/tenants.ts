
import express, {
  type NextFunction,
//   type NextFunction,
  type Request,
  type Response,
} from "express";
import TenantController from "../controllers/Tenant.controller.js";
import TenantService from "../services/Tenant.service.js";
import { Tenant } from "../entity/Tenants.js";
import { AppDataSource } from "../config/data-source.js";



const tenantRouter  = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService)
tenantRouter.post("/",(req:Request,res:Response,next:NextFunction)=>tenantController.create(req,res,next))

export default tenantRouter;