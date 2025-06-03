import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from '@/components/LoadingSpinner';

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  flipped: boolean;
}

interface FlashcardsTabProps {
  flashcards: FlashcardItem[] | null;
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (value: 'easy' | 'medium' | 'hard') => void;
  subject: string;
  onSubjectChange: (value: string) => void;
  numFlashcards: number;
  onNumFlashcardsChange: (value: number) => void;
  isLoading: boolean;
  handleGenerateFlashcards: () => void;
  toggleFlashcardFlip: (id: string) => void;
  hasDocument: boolean;
}

export function FlashcardsTab({
  flashcards,
  difficulty,
  onDifficultyChange,
  subject,
  onSubjectChange,
  numFlashcards,
  onNumFlashcardsChange,
  isLoading,
  handleGenerateFlashcards,
  toggleFlashcardFlip,
  hasDocument
}: FlashcardsTabProps) {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Generate Flashcards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-muted/50">
          <div>
            <Label htmlFor="fc-difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={(val) => onDifficultyChange(val as 'easy' | 'medium' | 'hard')} disabled={!hasDocument}>
              <SelectTrigger id="fc-difficulty"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fc-subject">Subject</Label>
            <Input id="fc-subject" value={subject} onChange={(e) => onSubjectChange(e.target.value)} placeholder="e.g., Biology" disabled={!hasDocument}/>
          </div>
          <div>
            <Label htmlFor="fc-num">Number of Flashcards</Label>
            <Input id="fc-num" type="number" value={numFlashcards} onChange={(e) => onNumFlashcardsChange(Math.max(1, Math.min(20, parseInt(e.target.value))))} min="1" max="20" disabled={!hasDocument}/>
          </div>
        </div>
        <Button onClick={handleGenerateFlashcards} disabled={isLoading || !hasDocument || !subject.trim()} className="mb-4 w-full md:w-auto">
          {isLoading ? <LoadingSpinner /> : 'Generate Flashcards'}
        </Button>
        {flashcards && (
          <ScrollArea className="h-auto max-h-[70vh] w-full p-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map((card) => (
                <Card
                  key={card.id}
                  className="min-h-[180px] flex flex-col justify-center items-center p-1 shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-card rounded-xl relative overflow-hidden"
                  onClick={() => toggleFlashcardFlip(card.id)}
                  style={{ perspective: '1000px' }}
                  aria-label={`Flashcard: ${card.front}. Click to flip.`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFlashcardFlip(card.id)}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-500 ease-in-out"
                    style={{ transformStyle: 'preserve-3d', transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                    <div className="absolute w-full h-full flex items-center justify-center text-center p-3 bg-card rounded-xl" style={{ backfaceVisibility: 'hidden' }}>
                      <p className="text-sm font-medium text-card-foreground">{card.front}</p>
                    </div>
                    <div className="absolute w-full h-full flex items-center justify-center text-center p-3 bg-accent text-accent-foreground rounded-xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <p className="text-sm">{card.back}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
        {!flashcards && !isLoading && hasDocument && (
            <p className="text-sm text-muted-foreground">Configure settings and click "Generate Flashcards".</p>
        )}
        {!hasDocument && (
            <p className="text-sm text-muted-foreground">Please provide document text first to generate flashcards.</p>
        )}
      </CardContent>
    </Card>
  );
}
