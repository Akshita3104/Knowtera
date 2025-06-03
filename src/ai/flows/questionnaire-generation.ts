// src/ai/flows/questionnaire-generation.ts
'use server';

/**
 * @fileOverview Generates a questionnaire from document content based on difficulty and subject.
 *
 * - generateQuestionnaire - A function that handles the questionnaire generation process.
 * - GenerateQuestionnaireInput - The input type for the generateQuestionnaire function.
 * - GenerateQuestionnaireOutput - The return type for the generateQuestionnaire function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionnaireInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to generate a questionnaire from.'),
  difficulty: z
    .string()
    .describe('The difficulty level of the questionnaire (e.g., easy, medium, hard).'),
  subject: z.string().describe('The subject of the questionnaire (e.g., history, science, literature).'),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuestionnaireInput = z.infer<typeof GenerateQuestionnaireInputSchema>;

const GenerateQuestionnaireOutputSchema = z.object({
  questionnaire: z.array(
    z.object({
      question: z.string().describe('The question.'),
      answer: z.string().describe('The answer to the question.'),
    })
  ).describe('The generated questionnaire.'),
});
export type GenerateQuestionnaireOutput = z.infer<typeof GenerateQuestionnaireOutputSchema>;

export async function generateQuestionnaire(input: GenerateQuestionnaireInput): Promise<GenerateQuestionnaireOutput> {
  return generateQuestionnaireFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionnairePrompt',
  input: {schema: GenerateQuestionnaireInputSchema},
  output: {schema: GenerateQuestionnaireOutputSchema},
  prompt: `You are an expert in creating questionnaires based on document content.

  Based on the provided document content, generate a questionnaire with the specified difficulty and subject.
  The questionnaire should contain the specified number of questions.

  Document Content: {{{documentContent}}}
  Difficulty: {{{difficulty}}}
  Subject: {{{subject}}}
  Number of Questions: {{{numberOfQuestions}}}

  Ensure that the questions are relevant to the document content and appropriate for the specified difficulty and subject.

  Format the output as a JSON array of question-answer pairs.

  {{output}}
  `,
});

const generateQuestionnaireFlow = ai.defineFlow(
  {
    name: 'generateQuestionnaireFlow',
    inputSchema: GenerateQuestionnaireInputSchema,
    outputSchema: GenerateQuestionnaireOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
