import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  starting_balance: number;

  @Column({ length: 255, default: "My wallet" })
  wallet_name: string;

  @ManyToOne(() => User, user => user.wallets)
  @JoinColumn({ name: "user_id" })
  user: User;
}