import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('history')
export class HistoryEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column()
  templateId: number;

  @ApiProperty({ example: 1 })
  @Column()
  listId: number;

  @ApiProperty({ example: 'success', description: 'success, error, pending' })
  @Column()
  status: string;

  @ApiProperty({ example: 'Mensaje enviado correctamente', required: false })
  @Column({ nullable: true })
  details?: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
