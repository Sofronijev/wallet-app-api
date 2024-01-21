import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Wallet } from "./Wallet";
import { User } from "./User";
import { Transaction } from "./Transaction";

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "date",
  })
  date: string;

  @Column({ name: "user_id" })
  userId: number;

  @ManyToOne(() => User, (user) => user.transfers, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column({ name: "from_wallet_id" })
  fromWalletId: number;
  @ManyToOne(() => Wallet, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "from_wallet_id",
  })
  fromWallet: Wallet;

  @Column({ name: "to_wallet_id" })
  toWalletId: number;
  @ManyToOne(() => Wallet, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "to_wallet_id",
  })
  toWallet: Wallet;

  @Column({ name: "from_transaction_id" })
  fromTransactionId: number;
  @ManyToOne(() => Transaction, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "from_transaction_id",
  })
  fromTransaction: Transaction;

  @Column({ name: "to_transaction_id" })
  toTransactionId: number;
  @ManyToOne(() => Transaction, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "to_transaction_id",
  })
  toTransaction: Transaction;
}
