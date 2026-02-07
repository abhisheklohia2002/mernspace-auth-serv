import type { Repository } from "typeorm";
import type { Tenant } from "../entity/Tenants.js";
import type { ITenant } from "../types/index.js";

class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create({ name, address }: ITenant) {
  const save =   await this.tenantRepository.save({
      name,
      address,
    });
    return save;
  }
}

export default TenantService;
