// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, MessageCircle, HelpCircle, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// AI Flow Imports
import { summarizeDocument, type SummarizeDocumentOutput } from '@/ai/flows/document-summarization';
import { aiChatbot, type AIChatbotOutput } from '@/ai/flows/ai-chatbot';
import { generateQuestionnaire, type GenerateQuestionnaireOutput } from '@/ai/flows/questionnaire-generation';
import { generateFlashcards, type GenerateFlashcardsOutput } from '@/ai/flows/flashcard-generation';

// Component Imports
import { AppHeader } from '@/components/AppHeader';
import { DocumentInput } from '@/components/DocumentInput';
import { SummaryTab } from '@/components/features/SummaryTab';
import { ChatbotTab, type ChatMessage } from '@/components/features/ChatbotTab';
import { QuestionnaireTab } from '@/components/features/QuestionnaireTab';
import { FlashcardsTab, type FlashcardItem } from '@/components/features/FlashcardsTab';

type Summary = SummarizeDocumentOutput['summary'];
type Questionnaire = GenerateQuestionnaireOutput['questionnaire'];

export default function GroqAssistPage() {
  const [documentText, setDocumentText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>('summary');
  const { toast } = useToast();

  // States for generated content
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState<string>('');
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardItem[] | null>(null);

  // Settings states
  const [questionnaireDifficulty, setQuestionnaireDifficulty] = useState<string>('medium');
  const [questionnaireSubject, setQuestionnaireSubject] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);

  const [flashcardDifficulty, setFlashcardDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [flashcardSubject, setFlashcardSubject] = useState<string>('');
  const [numFlashcards, setNumFlashcards] = useState<number>(10);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleSetLoading = (feature: string, status: boolean) => {
    setIsLoading(prev => ({ ...prev, [feature]: status }));
  };

  const handleSummarize = async () => {
    if (!documentText.trim()) {
      toast({ title: "Input Required", description: "Please enter some document text.", variant: "destructive" });
      return;
    }
    handleSetLoading('summary', true);
    setSummary(null); // Clear previous summary
    try {
      const result = await summarizeDocument({ documentText });
      setSummary(result.summary);
      toast({ title: "Success", description: "Summary generated successfully." });
    } catch (error) {
      console.error('Error summarizing document:', error);
      toast({ title: "Error", description: "Failed to summarize document.", variant: "destructive" });
      setSummary('Error: Could not generate summary.');
    }
    handleSetLoading('summary', false);
  };

  const handleChatSubmit = async () => {
    if (!documentText.trim()) {
      toast({ title: "Input Required", description: "Please provide document text first.", variant: "destructive" });
      return;
    }
    if (!userChatInput.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', content: userChatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    const currentInput = userChatInput;
    setUserChatInput('');
    handleSetLoading('chat', true);

    try {
      const result = await aiChatbot({ documentContent: documentText, userQuestion: currentInput });
      const assistantMessage: ChatMessage = { role: 'assistant', content: result.answer };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with chatbot:', error);
      const errorMessage: ChatMessage = { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' };
      setChatMessages(prev => [...prev, errorMessage]);
      toast({ title: "Chatbot Error", description: "Failed to get response from chatbot.", variant: "destructive" });
    }
    handleSetLoading('chat', false);
  };

  const handleGenerateQuestionnaire = async () => {
    if (!documentText.trim()) {
      toast({ title: "Input Required", description: "Please enter document text.", variant: "destructive" });
      return;
    }
    if (!questionnaireSubject.trim()) {
      toast({ title: "Input Required", description: "Please enter a subject for the questionnaire.", variant: "destructive" });
      return;
    }
    handleSetLoading('questionnaire', true);
    setQuestionnaire(null);
    try {
      const result = await generateQuestionnaire({
        documentContent: documentText,
        difficulty: questionnaireDifficulty,
        subject: questionnaireSubject,
        numberOfQuestions: numQuestions,
      });
      setQuestionnaire(result.questionnaire);
      toast({ title: "Success", description: "Questionnaire generated successfully." });
    } catch (error) {
      console.error('Error generating questionnaire:', error);
      toast({ title: "Error", description: "Failed to generate questionnaire.", variant: "destructive" });
      setQuestionnaire(null);
    }
    handleSetLoading('questionnaire', false);
  };

  const handleGenerateFlashcards = async () => {
    if (!documentText.trim()) {
      toast({ title: "Input Required", description: "Please enter document text.", variant: "destructive" });
      return;
    }
    if (!flashcardSubject.trim()) {
      toast({ title: "Input Required", description: "Please enter a subject for the flashcards.", variant: "destructive" });
      return;
    }
    handleSetLoading('flashcards', true);
    setFlashcards(null);
    try {
      const result = await generateFlashcards({
        documentContent: documentText,
        subject: flashcardSubject,
        difficulty: flashcardDifficulty,
        numFlashcards: numFlashcards,
      });
      setFlashcards(result.map((fc, index) => ({ ...fc, id: `fc-${index}-${Date.now()}`, flipped: false })));
      toast({ title: "Success", description: "Flashcards generated successfully." });
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({ title: "Error", description: "Failed to generate flashcards.", variant: "destructive" });
      setFlashcards(null);
    }
    handleSetLoading('flashcards', false);
  };

  const toggleFlashcardFlip = (id: string) => {
    setFlashcards(prev =>
      prev?.map(fc => (fc.id === id ? { ...fc, flipped: !fc.flipped } : fc))
    );
  };

  if (!isMounted) {
    return null; // Or a loading spinner for the whole page
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <DocumentInput documentText={documentText} onDocumentTextChange={setDocumentText} />

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-muted p-1 rounded-lg shadow-sm">
            <TabsTrigger value="summary" className="py-2.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md rounded-md transition-all flex items-center justify-center gap-2">
              <FileText className="h-5 w-5" /> Summarize
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="py-2.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md rounded-md transition-all flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5" /> Chatbot
            </TabsTrigger>
            <TabsTrigger value="questionnaire" className="py-2.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md rounded-md transition-all flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5" /> Questionnaire
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="py-2.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md rounded-md transition-all flex items-center justify-center gap-2">
              <Copy className="h-5 w-5" /> Flashcards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <SummaryTab
              summary={summary}
              isLoading={isLoading['summary'] || false}
              handleSummarize={handleSummarize}
              hasDocument={!!documentText.trim()}
            />
          </TabsContent>

          <TabsContent value="chatbot">
            <ChatbotTab
              chatMessages={chatMessages}
              userChatInput={userChatInput}
              onUserChatInputChange={setUserChatInput}
              handleChatSubmit={handleChatSubmit}
              isLoading={isLoading['chat'] || false}
              hasDocument={!!documentText.trim()}
            />
          </TabsContent>

          <TabsContent value="questionnaire">
            <QuestionnaireTab
              questionnaire={questionnaire}
              difficulty={questionnaireDifficulty}
              onDifficultyChange={setQuestionnaireDifficulty}
              subject={questionnaireSubject}
              onSubjectChange={setQuestionnaireSubject}
              numQuestions={numQuestions}
              onNumQuestionsChange={setNumQuestions}
              isLoading={isLoading['questionnaire'] || false}
              handleGenerateQuestionnaire={handleGenerateQuestionnaire}
              hasDocument={!!documentText.trim()}
            />
          </TabsContent>

          <TabsContent value="flashcards">
            <FlashcardsTab
              flashcards={flashcards}
              difficulty={flashcardDifficulty}
              onDifficultyChange={setFlashcardDifficulty}
              subject={flashcardSubject}
              onSubjectChange={setFlashcardSubject}
              numFlashcards={numFlashcards}
              onNumFlashcardsChange={setNumFlashcards}
              isLoading={isLoading['flashcards'] || false}
              handleGenerateFlashcards={handleGenerateFlashcards}
              toggleFlashcardFlip={toggleFlashcardFlip}
              hasDocument={!!documentText.trim()}
            />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} GroqAssist. Powered by AI.
      </footer>
    </div>
  );
}
