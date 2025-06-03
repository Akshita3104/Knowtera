import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { GenerateQuestionnaireOutput } from '@/ai/flows/questionnaire-generation';

type Questionnaire = GenerateQuestionnaireOutput['questionnaire'];

interface QuestionnaireTabProps {
  questionnaire: Questionnaire | null;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  subject: string;
  onSubjectChange: (value: string) => void;
  numQuestions: number;
  onNumQuestionsChange: (value: number) => void;
  isLoading: boolean;
  handleGenerateQuestionnaire: () => void;
  hasDocument: boolean;
}

export function QuestionnaireTab({
  questionnaire,
  difficulty,
  onDifficultyChange,
  subject,
  onSubjectChange,
  numQuestions,
  onNumQuestionsChange,
  isLoading,
  handleGenerateQuestionnaire,
  hasDocument
}: QuestionnaireTabProps) {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Generate Questionnaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-muted/50">
          <div>
            <Label htmlFor="q-difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={onDifficultyChange} disabled={!hasDocument}>
              <SelectTrigger id="q-difficulty"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="q-subject">Subject</Label>
            <Input id="q-subject" value={subject} onChange={(e) => onSubjectChange(e.target.value)} placeholder="e.g., History" disabled={!hasDocument} />
          </div>
          <div>
            <Label htmlFor="q-num">Number of Questions</Label>
            <Input id="q-num" type="number" value={numQuestions} onChange={(e) => onNumQuestionsChange(Math.max(1, parseInt(e.target.value)))} min="1" disabled={!hasDocument} />
          </div>
        </div>
        <Button onClick={handleGenerateQuestionnaire} disabled={isLoading || !hasDocument || !subject.trim()} className="mb-4 w-full md:w-auto">
          {isLoading ? <LoadingSpinner /> : 'Generate Questionnaire'}
        </Button>
        {questionnaire && (
          <ScrollArea className="h-auto max-h-[60vh] w-full rounded-md border p-2 bg-secondary/30">
            <Accordion type="single" collapsible className="w-full">
              {questionnaire.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b border-border/50 last:border-b-0">
                  <AccordionTrigger className="hover:no-underline px-4 py-3 text-left text-sm font-medium">
                    {index + 1}. {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 pt-1 text-sm text-muted-foreground bg-background rounded-b-md">
                    <strong>Answer:</strong> {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}
        {!questionnaire && !isLoading && hasDocument && (
            <p className="text-sm text-muted-foreground">Configure settings and click "Generate Questionnaire".</p>
        )}
        {!hasDocument && (
            <p className="text-sm text-muted-foreground">Please provide document text first to generate a questionnaire.</p>
        )}
      </CardContent>
    </Card>
  );
}
