import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryEntity } from './history.entity/history.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('history')
@Controller('history')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}

	@Post()
	@ApiOperation({ summary: 'Crear registro de historial' })
	@ApiResponse({ status: 201, type: HistoryEntity })
	create(@Body() body: Partial<HistoryEntity>) {
		return this.historyService.create(body);
	}

	@Get()
	@ApiOperation({ summary: 'Listar historial' })
	@ApiResponse({ status: 200, type: [HistoryEntity] })
	findAll() {
		return this.historyService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener registro de historial por ID' })
	@ApiResponse({ status: 200, type: HistoryEntity })
	findOne(@Param('id') id: number) {
		return this.historyService.findOne(Number(id));
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar registro de historial' })
	@ApiResponse({ status: 200, type: HistoryEntity })
	update(@Param('id') id: number, @Body() body: Partial<HistoryEntity>) {
		return this.historyService.update(Number(id), body);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar registro de historial' })
	@ApiResponse({ status: 200, schema: { example: { deleted: true } } })
	remove(@Param('id') id: number) {
		return this.historyService.remove(Number(id));
	}
}
