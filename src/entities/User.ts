import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./Transaction";
import { Wallet } from "./Wallet";
import { Transfer } from "./Transfer";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    default: "",
  })
  username: string;

  @Column({
    length: 2048,
  })
  password: string;

  @Column({
    unique: true,
  })
  email: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Transfer, (transfer) => transfer.user)
  transfers: Transfer[];

  @CreateDateColumn()
  createdAt: Date;
}
