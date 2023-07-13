import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  limit: number;

  @ManyToOne(() => Category, {
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'category_id'
  })
  category: Category;

  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id'
  })
  user: User;
}