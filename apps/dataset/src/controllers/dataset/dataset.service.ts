import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ClassDeclaration, Project } from 'ts-morph';

@Injectable()
export class DatasetService {
  private readonly lmStudioUrl = 'http://localhost:1234/v1/chat/completions';

  private readonly systemPrompt = `You are an elite dataset engineer for Angular applications. Look at this snippet of TypeScript code.
Output ONLY a raw JSON object matching this schema:
{
  "instruction": "A realistic user prompt that a human developer would actually write in an IDE chat to ask you to create this functionality. Avoid listing technical variables explicitly unless absolutely necessary. Avoid listing to much details to the functionality, otherwise the user could do it by himself.",
  "system_message": "A short, professional system prompt specifying the technology stack."
}
Do not include markdown code blocks. Output pure JSON.`;

  async generateDescription(fileContent: string) {
    // 3. Craft the prompt for fine-tuning formats

    const userPrompt = `Analyze this code file:
    Extension: ts
    Content:
    ${fileContent}`;

    try {
      // 4. Send request to LM Studio
      // Note: "model" can be any string, LM Studio defaults to whichever model you currently have loaded in the UI.
      const response = await axios.post(this.lmStudioUrl, {
        model: 'local-model',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2, // Low temperature for more structured, predictable output
      });

      const rawText = response.data.choices[0].message.content.trim();

      // 5. Parse local LLM text output into JSON dataset format
      const datasetItem = JSON.parse(rawText);

      const finalTrainingItem = {
        messages: [
          { role: 'system', content: datasetItem.system_message },
          { role: 'user', content: datasetItem.instruction },
          { role: 'assistant', content: `\`\`\`typescript\n${fileContent}\n\`\`\`` }, // Your real code!
        ],
      };

      return {
        success: true,
        dataset: datasetItem,
        finalTrainingItem,
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

  async generateFromSplitFile(filePath: string) {
    // 1. Split the file into logical parts (e.g., individual methods or blocks)
    // This regex splits on standard class method declarations
    const blocks = this.splitTypeScriptFile(filePath);
    const generatedItems: {
      messages: {
        role: string;
        content: any;
      }[];
    }[] = [];

    // 2. Loop through each block and generate a tailored dataset item
    for (const block of blocks) {
      const userPrompt = `Analyze this code fragment:\n\n${block}`;

      try {
        const response = await axios.post(this.lmStudioUrl, {
          model: 'local-model',
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
        });

        const rawText = response.data.choices[0].message.content.trim();
        const aiMetadata = JSON.parse(rawText);

        const finalTrainingItem = {
          messages: [
            { role: 'system', content: aiMetadata.system_message },
            { role: 'user', content: aiMetadata.instruction },
            { role: 'assistant', content: `\`\`\`typescript\n${block}\n\`\`\`` },
          ],
        };

        generatedItems.push(finalTrainingItem);
      } catch (error: any) {
        console.error(`Failed to process snippet. Error: ${error.message}`);
        // continue; // Keep processing remaining blocks even if one fails
      }
    }

    return {
      success: true,
      totalSnippetsCreated: generatedItems.length,
      generatedItems,
      blocks,
    };
  }

  /**
   * Robust AST Parser for TypeScript files
   */
  private splitTypeScriptFile(absoluteFilePath: string): string[] {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(absoluteFilePath);
    const blocks: string[] = [];

    // --- 1. STANDALONE UTILITY FUNCTIONS ---
    const functions = sourceFile.getFunctions();
    for (const fn of functions) {
      if (fn.isExported()) {
        // Clean text right here
        const sanitizedText = fn.getText().replace(/\r/g, '');
        blocks.push(sanitizedText);
      }
    }

    // --- 2. CLASSES (Components, Directives, Services) ---
    const classes = sourceFile.getClasses();
    for (const clazz of classes) {
      // Clean the class structure shell
      const classShell = this.extractClassShell(clazz).replace(/\r/g, '');
      blocks.push(classShell);

      // Clean individual methods
      const methods = clazz.getMethods();
      for (const method of methods) {
        if (method.getText().split('\n').length > 2) {
          const sanitizedMethodText = method.getText().replace(/\r/g, '');
          blocks.push(sanitizedMethodText);
        }
      }
    }

    return blocks;
  }

  /**
   * Helper to capture decorators, class declaration, fields, and constructor
   * without including all the inner methods.
   */
  private extractClassShell(clazz: ClassDeclaration): string {
    const decorators = clazz
      .getDecorators()
      .map(d => d.getText())
      .join('\n');
    const className = clazz.getName();
    const extendsClass = clazz.getExtends()?.getText();
    const implementsInterfaces = clazz
      .getImplements()
      .map(i => i.getText())
      .join(', ');

    let signature = `${decorators}\nexport class ${className}`;
    if (extendsClass) signature += ` extends ${extendsClass}`;
    if (implementsInterfaces) signature += ` implements ${implementsInterfaces}`;
    signature += ' {\n';

    // Add properties/fields
    clazz.getProperties().forEach(p => {
      signature += `  ${p.getText()}\n`;
    });

    // Add constructor
    clazz.getConstructors().forEach(c => {
      signature += `\n  ${c.getText()}\n`;
    });

    signature += '\n  // [Methods implemented here...]\n}';
    return signature;
  }
}
