import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('campaigns')
export class CampaignEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Promo Navidad 2026' })
  @Column()
  name: string;

  @ApiProperty({ example: 1, description: 'ID de la plantilla a usar' })
  @Column()
  templateId: number;

  @ApiProperty({ example: 1, description: 'ID de la lista de contactos' })
  @Column()
  listId: number;

  @ApiProperty({ example: 'pending', description: 'pending | running | done | error' })
  @Column({ default: 'pending' })
  status: string;

  @ApiProperty({ example: 100, description: 'Total de destinatarios' })
  @Column({ default: 0 })
  total: number;

  @ApiProperty({ example: 95, description: 'Mensajes enviados exitosamente' })
  @Column({ default: 0 })
  sent: number;

  @ApiProperty({ example: 5, description: 'Mensajes con error' })
  @Column({ default: 0 })
  failed: number;

  @ApiProperty({ required: false, description: 'Variables a reemplazar en la plantilla' })
  @Column({ type: 'json', nullable: true })
  variables?: Record<string, string>;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
