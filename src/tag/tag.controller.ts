import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAllTags(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.getAllTags();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
