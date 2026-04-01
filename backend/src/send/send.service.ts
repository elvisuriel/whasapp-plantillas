import { Injectable, NotFoundException } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendEntity } from './send.entity/send.entity';

@Injectable()
export class SendService {

	constructor(
		@InjectRepository(SendEntity)
		private readonly sendRepo: Repository<SendEntity>,
		private readonly whatsapp: WhatsappService,
	) {}

	async create(data: Partial<SendEntity>) {
		const send = this.sendRepo.create(data);
		let result: { success: boolean; error?: string } = { success: false };

		if (data.recipient && data.message) {
			if (data.type === 'image' && data.imageUrl) {
				result = await this.whatsapp.sendImage(data.recipient, data.imageUrl, data.message);
			} else {
				result = await this.whatsapp.sendText(data.recipient, data.message);
			}
		}

		send.status = result.success ? 'success' : 'error';
		send.whatsappApiResponse = result;
		const saved = await this.sendRepo.save(send);
		return saved;
	}

	findAll() {
		return this.sendRepo.find();
	}

	findOne(id: number) {
		return this.sendRepo.findOneBy({ id });
	}

	async update(id: number, data: Partial<SendEntity>) {
		const send = await this.sendRepo.findOneBy({ id });
		if (!send) throw new NotFoundException('Send not found');
		Object.assign(send, data);
		return this.sendRepo.save(send);
	}

	async remove(id: number) {
		const send = await this.sendRepo.findOneBy({ id });
		if (!send) throw new NotFoundException('Send not found');
		await this.sendRepo.remove(send);
		return { deleted: true };
	}
}
