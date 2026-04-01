import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import type { Response } from 'express';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('status')
  @ApiOperation({ summary: 'Estado de la conexión WhatsApp' })
  getStatus() {
    return { status: this.whatsappService.getStatus() };
  }

  @Get('qr')
  @ApiOperation({ summary: 'Obtener QR para conectar WhatsApp (imagen base64)' })
  getQR(@Res() res: Response) {
    const qr = this.whatsappService.getQR();
    if (!qr) {
      const status = this.whatsappService.getStatus();
      if (status === 'connected') {
        return res.status(200).json({ message: 'WhatsApp ya está conectado', status });
      }
      return res.status(202).json({ message: 'Generando QR, intente en unos segundos...', status });
    }
    return res.status(200).json({ qr, status: 'qr' });
  }
}
