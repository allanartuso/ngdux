import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AngularDocsDatasetService {
  private readonly angularDocsUrl = 'https://angular.dev/assets/context/llms-full.txt';
  private readonly lmStudioUrl = 'http://localhost:1234/v1/chat/completions';
  private readonly outputDatasetPath = path.resolve(__dirname, '../../../fine-tuning/angular_docs_dataset.jsonl');

  /**
   * Main orchestrator to download, parse, and convert the entire documentation file.
   */
  public async processAngularDocs(): Promise<{ success: boolean; totalEntriesCreated: number }> {
    let totalEntriesCreated = 0;

    // 1. Download the full documentation text
    console.log('Downloading Angular llms-full.txt...');
    let rawDocs: string;
    try {
      const response = await axios.get(this.angularDocsUrl);
      rawDocs = response.data;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to download Angular docs: ${error.message}`);
    }

    console.log(rawDocs.substring(0, 500)); // Log the first 500 characters to verify content

    // 2. Chunk the document by its major markdown headers
    console.log('Parsing and chunking document segments...');
    const sections = this.splitDocsIntoSections(rawDocs);

    // 3. Process each documentation chapter one by one
    console.log(`Found ${sections.length} document sections. Starting AI translation processing...`);
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      // Skip headers that don't contain enough informational text body
      if (section.content.trim().length < 150) continue;

      console.log(`Processing section [${i + 1}/${sections.length}]: ${section.title}`);

      const systemPrompt = `You are an elite dataset engineering assistant for fine-tuning LLMs.
      Analyze the provided Angular documentation text and extract its core technical knowledge.
      You must output ONLY a raw JSON object matching this schema:
      {
        "system_message": "A precise system prompt defining a modern Angular framework architect persona.",
        "qa_pairs": [
          {
            "user_query": "A highly realistic, direct, or conversational developer question about this specific capability, concept, or feature requirement.",
            "assistant_response": "The complete code solution, pattern explanation, or structural implementation matching the exact code standards and syntax rules from the documentation snippet."
          }
        ]
      }
      Generate exactly 2 to 3 high-quality QA pairs for the text. Ensure code blocks inside assistant responses are formatted correctly using clean Unix line breaks without '\\r'. Do not include markdown code wrapping around the JSON payload itself.`;

      const userPrompt = `DOCUMENTATION CHAPTER: ${section.title}\n\nCONTENT:\n${section.content}`;

      try {
        // 4. Request the structural question-answer mapping from LM Studio
        const response = await axios.post(this.lmStudioUrl, {
          model: 'local-model',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
        });
        const rawText = response.data.choices[0].message.content.trim();
        const aiMetadata = JSON.parse(rawText);

        // 5. Append each generated interaction cleanly into the final dataset file
        for (const pair of aiMetadata.qa_pairs) {
          const trainingItem = {
            messages: [
              { role: 'system', content: aiMetadata.system_message },
              { role: 'user', content: pair.user_query },
              { role: 'assistant', content: pair.assistant_response },
            ],
          };

          // Append line by line to keep VRAM/system memory foot print tiny
          fs.appendFileSync(this.outputDatasetPath, JSON.stringify(trainingItem) + '\n', 'utf8');
          totalEntriesCreated++;
        }
      } catch (error: any) {
        console.error(`CRITICAL: Failed to process section "${section.title}". Error: ${error.message}`);
        // Keep looping to maximize document coverage despite occasional JSON parsing errors
        continue;
      }
    }

    return {
      success: true,
      totalEntriesCreated,
    };
  }

  /**
   * Helper function to slice the unified string by its structural markdown layout
   */
  private splitDocsIntoSections(rawText: string): Array<{ title: string; content: string }> {
    const lines = rawText.split('\n');
    const sections: Array<{ title: string; content: string }> = [];

    let currentTitle = 'Introduction';
    let currentLines: string[] = [];

    for (const line of lines) {
      // Clean up Windows carriage returns from incoming text data streams
      const cleanLine = line.replace(/\r/g, '');

      // Identify major structural sections using Markdown headers
      if (cleanLine.startsWith('# ') || cleanLine.startsWith('## ') || cleanLine.startsWith('### ')) {
        if (currentLines.length > 0) {
          sections.push({
            title: currentTitle,
            content: currentLines.join('\n'),
          });
        }
        currentTitle = cleanLine.replace(/#/g, '').trim();
        currentLines = [];
      }
      currentLines.push(cleanLine);
    }

    // Add the final trailing text chunk
    if (currentLines.length > 0) {
      sections.push({
        title: currentTitle,
        content: currentLines.join('\n'),
      });
    }

    return sections;
  }
}
