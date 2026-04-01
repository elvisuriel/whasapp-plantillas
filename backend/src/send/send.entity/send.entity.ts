import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('send')
export class SendEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '+573001234567' })
  @Column()
  recipient: string;

  @ApiProperty({ example: '¡Hola! Esta es una prueba.' })
  @Column('text')
  message: string;

  @ApiProperty({ example: 'text', description: 'Tipo de mensaje: text, image, button, etc.' })
  @Column()
  type: string;

  @ApiProperty({ example: 'https://url-imagen.com/imagen.jpg', required: false })
  @Column({ nullable: true })
  imageUrl?: string;

  @ApiProperty({ example: '[{"label":"Comprar","url":"https://..."}]', required: false })
  @Column({ type: 'json', nullable: true })
  buttons?: any[];

  @ApiProperty({ example: 'success', description: 'success, error, pending' })
  @Column({ default: 'pending' })
  status: string;

  @ApiProperty({ required: false, description: 'Respuesta del envío' })
  @Column({ type: 'json', nullable: true })
  whatsappApiResponse?: any;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
