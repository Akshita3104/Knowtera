'use server';

/**
 * @fileOverview Flow for generating flashcards from a document.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to generate flashcards from.'),
  subject: z.string().describe('The subject or topic of the flashcards.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the flashcards.'),
  numFlashcards: z.number().min(1).max(20).default(10).describe('The number of flashcards to generate.')
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
  front: z.string().describe('The question or concept on the front of the flashcard.'),
  back: z.string().describe('The answer or definition on the back of the flashcard.'),
});

const GenerateFlashcardsOutputSchema = z.array(FlashcardSchema);
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert educator who can generate flashcards from document content. The flashcards should be
  on the subject: {{{subject}}}, and at the difficulty level of: {{{difficulty}}}.
  The user wants you to generate {{{numFlashcards}}} flashcards. The content of the document is below:

  Document Content:
  -----------------
  {{{documentContent}}}
  -----------------

  Each flashcard MUST have a front (question/concept) and a back (answer/definition).
  The output should be a JSON array of flashcards.
  `,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
