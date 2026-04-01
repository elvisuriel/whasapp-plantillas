import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as QRCode from 'qrcode';

@Injectable()
export class WhatsappService implements OnModuleDestroy {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;
  private qrCodeData: string | null = null;
  private status: 'disconnected' | 'qr' | 'connected' = 'disconnected';

  constructor() {
    this.initClient();
  }

  private initClient() {
    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', async (qr) => {
      this.status = 'qr';
      this.qrCodeData = await QRCode.toDataURL(qr);
      this.logger.log('QR generado — escanéelo para conectar');
    });

    this.client.on('ready', () => {
      this.status = 'connected';
      this.qrCodeData = null;
      this.logger.log('WhatsApp conectado y listo');
    });

    this.client.on('disconnected', (reason) => {
      this.status = 'disconnected';
      this.logger.warn(`WhatsApp desconectado: ${reason}`);
      setTimeout(() => this.initClient(), 5000);
    });

    this.client.initialize();
  }

  getQR(): string | null {
    return this.qrCodeData;
  }

  getStatus(): string {
    return this.status;
  }

  isConnected(): boolean {
    return this.status === 'connected';
  }

  async sendText(recipient: string, message: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'WhatsApp no está conectado' };
    }
    try {
      const number = recipient.replace(/\D/g, '');
      const chatId = `${number}@c.us`;
      await this.client.sendMessage(chatId, message);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendImage(recipient: string, imageUrl: string, caption?: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'WhatsApp no está conectado' };
    }
    try {
      const { MessageMedia } = await import('whatsapp-web.js');
      const number = recipient.replace(/\D/g, '');
      const chatId = `${number}@c.us`;
      const media = await MessageMedia.fromUrl(imageUrl);
      await this.client.sendMessage(chatId, media, { caption });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async onModuleDestroy() {
    await this.client.destroy();
  }
}
