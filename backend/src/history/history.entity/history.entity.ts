import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('history')
export class HistoryEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '+573001234567' })
  @Column({ nullable: true })
  recipient?: string;

  @ApiProperty({ example: '¡Hola! Esta es una promo.' })
  @Column({ type: 'text', nullable: true })
  message?: string;

  @ApiProperty({ example: 'text' })
  @Column({ nullable: true })
  type?: string;

  @ApiProperty({ example: 1, required: false })
  @Column({ nullable: true })
  templateId?: number;

  @ApiProperty({ example: 1, required: false })
  @Column({ nullable: true })
  listId?: number;

  @ApiProperty({ example: 1, required: false, description: 'ID de la campaña que generó el envío' })
  @Column({ nullable: true })
  campaignId?: number;

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
