import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Art } from '../../art/entities/art.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Art)
  art: Art;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number; 
}