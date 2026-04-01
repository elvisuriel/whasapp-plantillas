import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplateEntity } from './template.entity/template.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
	constructor(private readonly templatesService: TemplatesService) {}

	@Post()
	@ApiOperation({ summary: 'Crear plantilla' })
	@ApiResponse({ status: 201, type: TemplateEntity })
	create(@Body() body: Partial<TemplateEntity>) {
		return this.templatesService.create(body);
	}

	@Get()
	@ApiOperation({ summary: 'Listar plantillas' })
	@ApiResponse({ status: 200, type: [TemplateEntity] })
	findAll() {
		return this.templatesService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener plantilla por ID' })
	@ApiResponse({ status: 200, type: TemplateEntity })
	findOne(@Param('id') id: number) {
		return this.templatesService.findOne(Number(id));
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar plantilla' })
	@ApiResponse({ status: 200, type: TemplateEntity })
	update(@Param('id') id: number, @Body() body: Partial<TemplateEntity>) {
		return this.templatesService.update(Number(id), body);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar plantilla' })
	@ApiResponse({ status: 200, schema: { example: { deleted: true } } })
	remove(@Param('id') id: number) {
		return this.templatesService.remove(Number(id));
	}
}
