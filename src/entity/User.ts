import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserRole } from "../constants/index.js";
import { Tenant } from "./Tenants.js";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  firstName: string;

  @Column({ type: "varchar", length: 100 })
  lastName: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, select: false })
  password: string;

  @Column({ type: "varchar", enum: UserRole })
  role: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant | null;
}
