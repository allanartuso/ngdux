import { BadRequestException, Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DatasetService } from './dataset.service';

interface GenerateDatasetDto {
  filePath: string;
}

@Controller('dataset')
export class DatasetController {
  constructor(private readonly datasetService: DatasetService) {}

  private getDatasetFilePath() {
    const datasetFilePath = path.resolve(__dirname, `../../dataset${Date.now()}.jsonl`);

    return datasetFilePath;
  }

  @Post('generate')
  async generateDescription(@Body() body: GenerateDatasetDto) {
    const fileContent: string = this.getFileContent(body);

    const { dataset, finalTrainingItem } = await this.datasetService.generateDescription(fileContent);

    fs.appendFileSync(this.getDatasetFilePath(), JSON.stringify(finalTrainingItem) + '\n', 'utf8');

    return {
      success: true,
      filePath: body.filePath,
      dataset,
      finalTrainingItem,
    };
  }

  private getFileContent(body: GenerateDatasetDto): string {
    const { filePath } = body;
    if (!filePath) throw new BadRequestException('filePath is required.');

    const absolutePath = path.resolve(
      'D:\\dev\\Allan\\ngdux\\libs\\ngil\\ui\\common\\form-cva\\src\\lib\\models\\abstract-form-component.ts',
    );
    if (!fs.existsSync(absolutePath)) throw new BadRequestException('File not found.');

    if (path.extname(absolutePath).substring(1) !== 'ts') {
      throw new BadRequestException('Currently only TypeScript files are supported for split generation.');
    }

    let fileContent: string;

    try {
      fileContent = fs.readFileSync(absolutePath, 'utf-8');
    } catch (error: any) {
      throw new InternalServerErrorException(`Failed to read file: ${error.message}`);
    }

    return fileContent;
  }

  @Post('generate-split')
  async generateFromSplitFile(@Body() body: GenerateDatasetDto) {
    const { generatedItems, blocks } = await this.datasetService.generateFromSplitFile(body.filePath);

    fs.appendFileSync(this.getDatasetFilePath(), JSON.stringify(generatedItems) + '\n', 'utf8');

    return {
      success: true,
      generatedItems,
      totalSnippetsCreated: generatedItems.length,
      fileProcessed: body.filePath,
      blocks,
    };
  }
}
