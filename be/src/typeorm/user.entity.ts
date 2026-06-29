import { Entity, Column, OneToMany } from 'typeorm';
import { Player } from '@entities/player.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  telegram_id: string | null;

  @Column({ nullable: true, type: 'varchar' })
  telegram_username: string | null;

  @OneToMany(() => Player, (player) => player.user)
  players: Player[];
}
