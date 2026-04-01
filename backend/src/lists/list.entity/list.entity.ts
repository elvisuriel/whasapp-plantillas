import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('lists')
export class ListEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Clientes VIP' })
  @Column()
  name: string;

  @ApiProperty({ example: '["+573001234567", "+573008765432"]' })
  @Column('simple-array')
  recipients: string[];

  @ApiProperty({ example: true })
  @Column({ default: true })
  active: boolean;
}
