import { Injectable, NotFoundException } from '@nestjs/common';
import { WhatsappApiService } from './whatsapp-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendEntity } from './send.entity/send.entity';

@Injectable()
export class SendService {

	constructor(
		@InjectRepository(SendEntity)
		private readonly sendRepo: Repository<SendEntity>,
		private readonly whatsappApi: WhatsappApiService,
	) {}

	async create(data: Partial<SendEntity>) {
		const send = this.sendRepo.create(data);
		let status = 'pending';
		let apiResponse: any = null;
		if (data.type === 'text' && data.recipient && data.message) {
			apiResponse = await this.whatsappApi.sendTextMessage(data.recipient, data.message);
			status = apiResponse.error ? 'error' : 'success';
		}
		send.status = status;
		send.whatsappApiResponse = apiResponse;
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
