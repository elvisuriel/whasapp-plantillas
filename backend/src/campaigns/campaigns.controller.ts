import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CampaignEntity } from './campaign.entity/campaign.entity';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear campaña (sin lanzar)' })
  @ApiResponse({ status: 201, type: CampaignEntity })
  create(@Body() body: Partial<CampaignEntity>) {
    return this.campaignsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las campañas' })
  @ApiResponse({ status: 200, type: [CampaignEntity] })
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver campaña por ID' })
  @ApiResponse({ status: 200, type: CampaignEntity })
  findOne(@Param('id') id: number) {
    return this.campaignsService.findOne(Number(id));
  }

  @Post(':id/launch')
  @ApiOperation({ summary: 'Lanzar campaña — envía la plantilla a toda la lista' })
  launch(@Param('id') id: number) {
    return this.campaignsService.launch(Number(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar campaña' })
  remove(@Param('id') id: number) {
    return this.campaignsService.remove(Number(id));
  }
}
