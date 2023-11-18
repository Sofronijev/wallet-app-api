import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export enum WalletType {
  SYSTEM = 'system',
  CUSTOM = 'custom',
}
@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  walletId: number;

  @Column()
  userId: number;

  @Column("decimal", { precision: 16, scale: 2 })
  startingBalance: number;

  @Column({ length: 255, default: "My custom wallet" })
  walletName: string;

  @Column({ length: 3, default: "EUR" })
  currencyCode: string;

  @Column({ length: 5, default: "€" })
  currencySymbol: string;

  @Column({
    type: 'enum',
    enum: WalletType,
    default: WalletType.CUSTOM,
  })
  type: WalletType;

  @ManyToOne(() => User, (user) => user.wallets, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  user: User;
}
