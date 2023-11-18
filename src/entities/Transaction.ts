import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";
import { Type } from "./Type";
import { User } from "./User";
import { Wallet } from "./Wallet";
// TODO -  ADD indexes
@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({
    length: 500,
  })
  description: string;

  @Column({
    type: "date",
  })
  date: string;

  @Column({ name: "user_id" })
  userId: number;
  @ManyToOne(() => User, (user) => user.transactions, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column({ name: "type_id" })
  typeId: number;
  @ManyToOne(() => Type, {
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "type_id",
  })
  type: Type;

  @Column({ name: "category_id" })
  categoryId: number;
  @ManyToOne(() => Category, {
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "category_id",
  })
  category: Category;

  @Column({ name: "wallet_id" })
  walletId: number;
  @ManyToOne(() => Wallet, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "wallet_id",
  })
  wallet: Wallet;
}
