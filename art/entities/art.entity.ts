import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
export enum ArtCategory {
  SCULPTURE = 'sculpture',
  PAINTING = 'painting',
  NATURE = 'nature',
}
@Entity()
export class Art {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  quantity: number;

  @Column()
  imageUrl: string;
  @Column({
    type: 'enum',
    enum: ArtCategory,
  })
  category: ArtCategory;
  // Add the inStock property
  @Column({ default: true })
  inStock: boolean;
}
