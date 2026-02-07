/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { NextFunction, Request, Response } from "express";
import type TenantService from "../services/Tenant.service.js";
import type { ITenant } from "../types/index.js";
import createHttpError from "http-errors";

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

  async getTenants(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.getTenants();
      res.status(201).json({ tenants });
    } catch (error) {
      return next(error);
    }
  }

  async getTenantById(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await this.tenantService.getTenantById(
        Number(req.params.id),
      );
      if (!tenant) {
        return next(createHttpError(401, "ID is not present"));
      }
      res.status(201).json(tenant);
    } catch (error) {
      return next(error);
    }
  }

  async updateTenantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tenant = await this.tenantService.updateTenantById(
        Number(id),
        req.body,
      );
      if (!tenant) {
        return next(createHttpError(401, "ID is not present"));
      }
      res.status(201).json(tenant);
    } catch (error) {
      return next(error);
    }
  }

  async deleteTenantById(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
      const tenant = await this.tenantService.deleteTenantById(
        Number(id)
      );
      if (!tenant) {
        return next(createHttpError(401, "ID is not present"));
      }
      res.status(201).json({id});

    } catch (error) {
      return next(error);
        
    }
  }
}

export default TenantController;
