import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListEntity } from './list.entity/list.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('lists')
@Controller('lists')
export class ListsController {
	constructor(private readonly listsService: ListsService) {}

	@Post()
	@ApiOperation({ summary: 'Crear lista' })
	@ApiResponse({ status: 201, type: ListEntity })
	create(@Body() body: Partial<ListEntity>) {
		return this.listsService.create(body);
	}

	@Get()
	@ApiOperation({ summary: 'Listar listas' })
	@ApiResponse({ status: 200, type: [ListEntity] })
	findAll() {
		return this.listsService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener lista por ID' })
	@ApiResponse({ status: 200, type: ListEntity })
	findOne(@Param('id') id: number) {
		return this.listsService.findOne(Number(id));
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar lista' })
	@ApiResponse({ status: 200, type: ListEntity })
	update(@Param('id') id: number, @Body() body: Partial<ListEntity>) {
		return this.listsService.update(Number(id), body);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar lista' })
	@ApiResponse({ status: 200, schema: { example: { deleted: true } } })
	remove(@Param('id') id: number) {
		return this.listsService.remove(Number(id));
	}
}
