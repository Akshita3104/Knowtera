import { config } from 'dotenv';
config();

import '@/ai/flows/document-summarization.ts';
import '@/ai/flows/questionnaire-generation.ts';
import '@/ai/flows/ai-chatbot.ts';
import '@/ai/flows/flashcard-generation.ts';