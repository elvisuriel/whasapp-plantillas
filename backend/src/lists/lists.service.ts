import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListEntity } from './list.entity/list.entity';

@Injectable()
export class ListsService {
	constructor(
		@InjectRepository(ListEntity)
		private readonly listRepo: Repository<ListEntity>,
	) {}

	create(data: Partial<ListEntity>) {
		const list = this.listRepo.create(data);
		return this.listRepo.save(list);
	}

	findAll() {
		return this.listRepo.find();
	}

	findOne(id: number) {
		return this.listRepo.findOneBy({ id });
	}

	async update(id: number, data: Partial<ListEntity>) {
		const list = await this.listRepo.findOneBy({ id });
		if (!list) throw new NotFoundException('List not found');
		Object.assign(list, data);
		return this.listRepo.save(list);
	}

	async remove(id: number) {
		const list = await this.listRepo.findOneBy({ id });
		if (!list) throw new NotFoundException('List not found');
		await this.listRepo.remove(list);
		return { deleted: true };
	}
}
