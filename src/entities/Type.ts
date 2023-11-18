import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, {
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'category_id'
  })
  category: Category;
}

