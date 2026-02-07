import type { NextFunction, Request, Response } from "express";
import type TenantService from "../services/Tenant.service.js";
import type { ITenant } from "../types/index.js";

class TenantController {
  constructor(private tenantService: TenantService) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await this.tenantService.create(req.body as ITenant);
      res.status(201).json({ id: tenant.id });
    } catch (error) {
      next(error);
      return;
    }
  }
}

export default TenantController;
