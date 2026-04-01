import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SendService } from './send.service';
import { SendEntity } from './send.entity/send.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('send')
@Controller('send')
export class SendController {
	constructor(private readonly sendService: SendService) {}

	@Post()
	@ApiOperation({ summary: 'Crear envío' })
	@ApiResponse({ status: 201, type: SendEntity })
	async create(@Body() body: Partial<SendEntity>) {
		const result = await this.sendService.create(body);
		// Leer el registro recién guardado y devolver whatsappApiResponse explícitamente
		const full = await this.sendService.findOne(result.id);
		return {
			...full,
			whatsappApiResponse: result.whatsappApiResponse,
		};
	}

	@Get()
	@ApiOperation({ summary: 'Listar envíos' })
	@ApiResponse({ status: 200, type: [SendEntity] })
	findAll() {
		return this.sendService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener envío por ID' })
	@ApiResponse({ status: 200, type: SendEntity })
	findOne(@Param('id') id: number) {
		return this.sendService.findOne(Number(id));
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar envío' })
	@ApiResponse({ status: 200, type: SendEntity })
	update(@Param('id') id: number, @Body() body: Partial<SendEntity>) {
		return this.sendService.update(Number(id), body);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar envío' })
	@ApiResponse({ status: 200, schema: { example: { deleted: true } } })
	remove(@Param('id') id: number) {
		return this.sendService.remove(Number(id));
	}
}
