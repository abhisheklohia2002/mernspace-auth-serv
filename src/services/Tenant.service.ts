import { Brackets, type Repository } from "typeorm";
import type { Tenant } from "../entity/Tenants.js";
import type { ITenant, IValidateTenantQuery } from "../types/index.js";

class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create({ name, address }: ITenant) {
    const save = await this.tenantRepository.save({
      name,
      address,
    });
    return save;
  }

  async getTenants(validateQuery: IValidateTenantQuery) {
    const qb = this.tenantRepository.createQueryBuilder("tenant");

    if (validateQuery.q?.trim()) {
      const q = `%${validateQuery.q.trim()}%`;

      qb.andWhere(
        new Brackets((sqb) => {
          sqb
            .where(`"tenant"."name" ILIKE :q`, { q })
            .orWhere(`"tenant"."address" ILIKE :q`, { q });
        }),
      );
    }

    const tenants = await qb
      .skip((validateQuery.currentPage - 1) * validateQuery.perPage)
      .take(validateQuery.perPage)
      .getManyAndCount();
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
  async deleteTenantById(id: number) {
    const tenant = await this.tenantRepository.delete(id);
    return tenant;
  }
}

export default TenantService;
