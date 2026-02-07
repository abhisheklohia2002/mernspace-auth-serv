import type { Repository } from "typeorm";
import type { Tenant } from "../entity/Tenants.js";
import type { ITenant } from "../types/index.js";

class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create({ name, address }: ITenant) {
    const save = await this.tenantRepository.save({
      name,
      address,
    });
    return save;
  }
  async getTenants() {
    const tenants = await this.tenantRepository.find({});
    return tenants;
  }
  async getTenantById(id: number) {
    const tenant = await this.tenantRepository.findOneBy({
      id,
    });
    return tenant;
  }

  async updateTenantById(id: number, body: ITenant) {
    const tenant = await this.tenantRepository.update(id, body);
    return tenant;
  }
  async deleteTenantById(id:number){
    const tenant = await this.tenantRepository.delete(id);
    return tenant;
  }
}

export default TenantService;
