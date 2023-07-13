import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./Transaction";

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
}
