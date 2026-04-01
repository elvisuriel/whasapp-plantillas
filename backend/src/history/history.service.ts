import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntity } from './history.entity/history.entity';

@Injectable()
export class HistoryService {
	constructor(
		@InjectRepository(HistoryEntity)
		private readonly historyRepo: Repository<HistoryEntity>,
	) {}

	create(data: Partial<HistoryEntity>) {
		const history = this.historyRepo.create(data);
		return this.historyRepo.save(history);
	}

	findAll() {
		return this.historyRepo.find();
	}

	findOne(id: number) {
		return this.historyRepo.findOneBy({ id });
	}

	async update(id: number, data: Partial<HistoryEntity>) {
		const history = await this.historyRepo.findOneBy({ id });
		if (!history) throw new NotFoundException('History not found');
		Object.assign(history, data);
		return this.historyRepo.save(history);
	}

	async remove(id: number) {
		const history = await this.historyRepo.findOneBy({ id });
		if (!history) throw new NotFoundException('History not found');
		await this.historyRepo.remove(history);
		return { deleted: true };
	}
}
