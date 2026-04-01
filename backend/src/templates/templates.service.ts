import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEntity } from './template.entity/template.entity';

@Injectable()
export class TemplatesService {
	constructor(
		@InjectRepository(TemplateEntity)
		private readonly templateRepo: Repository<TemplateEntity>,
	) {}

	create(data: Partial<TemplateEntity>) {
		const template = this.templateRepo.create(data);
		return this.templateRepo.save(template);
	}

	findAll() {
		return this.templateRepo.find();
	}

	findOne(id: number) {
		return this.templateRepo.findOneBy({ id });
	}

	async update(id: number, data: Partial<TemplateEntity>) {
		const template = await this.templateRepo.findOneBy({ id });
		if (!template) throw new NotFoundException('Template not found');
		Object.assign(template, data);
		return this.templateRepo.save(template);
	}

	async remove(id: number) {
		const template = await this.templateRepo.findOneBy({ id });
		if (!template) throw new NotFoundException('Template not found');
		await this.templateRepo.remove(template);
		return { deleted: true };
	}
}
