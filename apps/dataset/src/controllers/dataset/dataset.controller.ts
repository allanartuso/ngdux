import { BadRequestException, Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AngularDocsDatasetService } from './angular-docs-dataset.service';
import { DatasetTypescriptService } from './dataset-typescript.service';

interface GenerateDatasetDto {
  filePath: string;
}

@Controller('dataset')
export class DatasetController {
  constructor(
    private readonly datasetService: DatasetTypescriptService,
    private readonly docsService: AngularDocsDatasetService,
  ) {}

  private getDatasetFilePath(fileName: string = `dataset-${Date.now()}`) {
    const datasetFilePath = path.resolve(__dirname, `../../../fine-tuning/${fileName}.jsonl`);

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

    const absolutePath = path.resolve(body.filePath);
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
    const allItems = await this.generateDatasetForFileAndBlocks(body);

    const savePath = this.getDatasetFilePath();
    fs.appendFileSync(savePath, JSON.stringify(allItems), 'utf8');

    return {
      success: true,
      allItems,
      totalSnippetsCreated: allItems.length,
      fileProcessed: body.filePath,
    };
  }

  private async generateDatasetForFileAndBlocks(body: GenerateDatasetDto) {
    const fileContent: string = this.getFileContent(body);
    const { finalTrainingItem } = await this.datasetService.generateDescription(fileContent);
    const { generatedItems } = await this.datasetService.generateFromSplitFile(body.filePath);

    return [finalTrainingItem, ...generatedItems];
  }

  @Post('generate-folder')
  async generateFromFolder(@Body() body: GenerateDatasetDto) {
    const folder = body.filePath;
    const files: string[] = this.getTypeScriptFilesRecursive(folder);
    const responses: any[] = [];

    for (const file of files) {
      console.log(`Processing file: ${file}`);
      try {
        const response = await this.generateDatasetForFileAndBlocks({ filePath: file });
        responses.push(response);
        fs.appendFileSync(this.getDatasetFilePath('partial'), JSON.stringify(response) + '\n', 'utf8');
      } catch (error) {
        console.error(`Error generating dataset for file ${file}:`, error);
      }
    }

    const savePath = this.getDatasetFilePath();
    fs.appendFileSync(savePath, JSON.stringify(responses), 'utf8');

    return {
      success: true,
      totalSnippetsCreated: responses.length,
      files,
      responses,
    };
  }

  private getTypeScriptFilesRecursive(dirPath: string): string[] {
    let tsFiles: string[] = [];
    const absoluteDir = path.resolve(dirPath);

    // Read all items inside the directory
    const items = fs.readdirSync(absoluteDir);

    for (const item of items) {
      const fullPath = path.join(absoluteDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules or hidden folders (like .git) to save processing cycles
        if (item === 'node_modules' || item.startsWith('.')) {
          continue;
        }
        // Recursively crawl subdirectories and merge results
        tsFiles = tsFiles.concat(this.getTypeScriptFilesRecursive(fullPath));
      } else if (stat.isFile()) {
        const isTypeScript = item.endsWith('.ts');
        const isSpec =
          item.endsWith('.spec.ts') ||
          item.endsWith('.test.ts') ||
          item.endsWith('.mock.ts') ||
          item.endsWith('jest.config.ts') ||
          item.endsWith('index.ts') ||
          item.endsWith('.stories.ts');

        // Only retain true implementation files
        if (isTypeScript && !isSpec) {
          tsFiles.push(fullPath);
        }
      }
    }

    return tsFiles;
  }

  @Post('process-angular-docs')
  async runDocsProcessor() {
    try {
      const result = await this.docsService.processAngularDocs();
      return result;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
