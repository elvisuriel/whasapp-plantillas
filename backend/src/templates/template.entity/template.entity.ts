import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('templates')
export class TemplateEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Promoción de verano' })
  @Column()
  name: string;

  @ApiProperty({ example: 'text', description: 'Tipo: text, image, button, etc.' })
  @Column()
  type: string;

  @ApiProperty({ example: '¡Oferta especial para ti!' })
  @Column('text')
  content: string;

  @ApiProperty({ example: '[{"label":"Comprar","url":"https://..."}]', required: false })
  @Column({ type: 'json', nullable: true })
  buttons?: any[];

  @ApiProperty({ example: 'https://url-imagen.com/imagen.jpg', required: false })
  @Column({ nullable: true })
  imageUrl?: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  active: boolean;
}
