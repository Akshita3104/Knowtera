import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface SummaryTabProps {
  summary: string | null;
  isLoading: boolean;
  handleSummarize: () => void;
  hasDocument: boolean;
}

export function SummaryTab({ summary, isLoading, handleSummarize, hasDocument }: SummaryTabProps) {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Document Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSummarize} disabled={isLoading || !hasDocument} className="mb-4 w-full md:w-auto">
          {isLoading ? <LoadingSpinner /> : 'Generate Summary'}
        </Button>
        {summary && (
          <ScrollArea className="h-60 w-full rounded-md border p-4 bg-secondary/30">
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </ScrollArea>
        )}
        {!summary && !isLoading && hasDocument && (
            <p className="text-sm text-muted-foreground">Click "Generate Summary" to see the result.</p>
        )}
         {!summary && !isLoading && !hasDocument && (
            <p className="text-sm text-muted-foreground">Please provide document text first to generate a summary.</p>
        )}
      </CardContent>
    </Card>
  );
}
