import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../constants/index.js";
import { Tenant } from "./Tenants.js";

@Entity({name:"users"})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  firstName: string;

  @Column({ type: "varchar", length: 100 })
  lastName: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", enum: UserRole })
  role: string;
  
  @ManyToOne(()=>Tenant)
  tenantId:Tenant

  @UpdateDateColumn()
  updateAt: number;

  @CreateDateColumn()
  createAt: number;
}
