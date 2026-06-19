import { BadRequestException, Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface GenerateDatasetDto {
  filePath: string;
}

@Controller('dataset')
export class DatasetController {
  // LM Studio default local endpoint
  private readonly lmStudioUrl = 'http://localhost:1234/v1/chat/completions';

  @Post('generate')
  async generateDescription(@Body() body: GenerateDatasetDto) {
    const { filePath } = body;

    if (!filePath) {
      throw new BadRequestException('The "filePath" property is required.');
    }

    // 1. Validate local file
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new BadRequestException(`File not found at path: ${absolutePath}`);
    }

    // 2. Read file content
    let fileContent: string;
    const fileExtension = path.extname(absolutePath).substring(1) || 'unknown';

    try {
      fileContent = fs.readFileSync(absolutePath, 'utf-8');
    } catch (error: any) {
      throw new InternalServerErrorException(`Failed to read file: ${error.message}`);
    }

    // 3. Craft the prompt for fine-tuning formats
    const systemPrompt = `You are a dataset engineering assistant. You must output ONLY a raw JSON object matching this schema:
    {
      "instruction": "A prompt asking to write or explain this specific code.",
      "input": "Context or metadata about the code.",
      "output": "A highly detailed, concise description of the logic, inputs, outputs, and architectural purpose."
    }
    Do not include markdown code blocks, do not include backticks, and do not write conversational text. Output pure JSON.`;

    const userPrompt = `Analyze this code file:
    Extension: ${fileExtension}
    Content:
    ${fileContent}`;

    try {
      // 4. Send request to LM Studio
      // Note: "model" can be any string, LM Studio defaults to whichever model you currently have loaded in the UI.
      const response = await axios.post(this.lmStudioUrl, {
        model: 'local-model',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2, // Low temperature for more structured, predictable output
      });

      const rawText = response.data.choices[0].message.content.trim();

      // 5. Parse local LLM text output into JSON dataset format
      const datasetItem = JSON.parse(rawText);

      return {
        success: true,
        filePath: absolutePath,
        language: fileExtension,
        dataset: datasetItem,
      };
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new InternalServerErrorException(`LLM failed to output valid JSON. Raw response was: ${error.message}`);
      }
      throw new InternalServerErrorException(
        `LM Studio connection failed. Is the server running? Error: ${error.message}`,
      );
    }
  }
}
