import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignEntity } from './campaign.entity/campaign.entity';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { TemplatesService } from '../templates/templates.service';
import { ListsService } from '../lists/lists.service';
import { HistoryService } from '../history/history.service';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepo: Repository<CampaignEntity>,
    private readonly whatsapp: WhatsappService,
    private readonly templates: TemplatesService,
    private readonly lists: ListsService,
    private readonly history: HistoryService,
  ) {}

  async create(data: Partial<CampaignEntity>) {
    const campaign = this.campaignRepo.create(data);
    return this.campaignRepo.save(campaign);
  }

  findAll() {
    return this.campaignRepo.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.campaignRepo.findOneBy({ id });
  }

  async launch(id: number) {
    const campaign = await this.campaignRepo.findOneBy({ id });
    if (!campaign) throw new NotFoundException('Campaña no encontrada');

    const template = await this.templates.findOne(campaign.templateId);
    if (!template) throw new NotFoundException('Plantilla no encontrada');

    const list = await this.lists.findOne(campaign.listId);
    if (!list) throw new NotFoundException('Lista no encontrada');

    campaign.status = 'running';
    campaign.total = list.recipients.length;
    campaign.sent = 0;
    campaign.failed = 0;
    await this.campaignRepo.save(campaign);

    // Envío asíncrono con delay entre mensajes para evitar bloqueos
    this.sendCampaign(campaign, template, list.recipients).catch(() => {});

    return { message: 'Campaña iniciada', campaignId: id, total: list.recipients.length };
  }

  private async sendCampaign(campaign: CampaignEntity, template: any, recipients: string[]) {
    for (const recipient of recipients) {
      // Reemplazar variables en el contenido: {{nombre}}, {{negocio}}, etc.
      let message = template.content;
      if (campaign.variables) {
        for (const [key, value] of Object.entries(campaign.variables)) {
          message = message.replaceAll(`{{${key}}}`, value);
        }
      }

      let result: { success: boolean; error?: string };

      if (template.type === 'image' && template.imageUrl) {
        result = await this.whatsapp.sendImage(recipient, template.imageUrl, message);
      } else {
        result = await this.whatsapp.sendText(recipient, message);
      }

      // Guardar en historial
      await this.history.create({
        recipient,
        message,
        type: template.type,
        status: result.success ? 'success' : 'error',
        campaignId: campaign.id,
      });

      if (result.success) {
        campaign.sent += 1;
      } else {
        campaign.failed += 1;
      }
      await this.campaignRepo.save(campaign);

      // Delay de 1.5s entre mensajes para no ser bloqueado por WhatsApp
      await new Promise(r => setTimeout(r, 1500));
    }

    campaign.status = 'done';
    await this.campaignRepo.save(campaign);
  }

  async remove(id: number) {
    const campaign = await this.campaignRepo.findOneBy({ id });
    if (!campaign) throw new NotFoundException('Campaña no encontrada');
    await this.campaignRepo.remove(campaign);
    return { deleted: true };
  }
}
