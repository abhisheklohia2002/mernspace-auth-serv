import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.js";


@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

 @Column({type:"timestamp"})
  expiresAt:Date;

 @ManyToOne(()=>User,(user)=>user.id)
  userId:User;

 @UpdateDateColumn()
 updateAt:number;

 @CreateDateColumn()
 createAt:number;


}
