
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
import authenications from "../middleware/authenications.js";
import { canAccess } from "../middleware/canAccess.js";
import { UserRole } from "../constants/index.js";



const tenantRouter  = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService)
tenantRouter.post("/",authenications,canAccess([UserRole.ADMIN]),(req:Request,res:Response,next:NextFunction)=>tenantController.create(req,res,next))

export default tenantRouter;