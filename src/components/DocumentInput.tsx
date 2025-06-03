import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import React from 'react'; // Import React for ChangeEvent type

interface DocumentInputProps {
  documentText: string;
  onDocumentTextChange: (text: string) => void;
}

export function DocumentInput({ documentText, onDocumentTextChange }: DocumentInputProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/plain") {
        try {
          const text = await file.text();
          onDocumentTextChange(text);
        } catch (error) {
          console.error("Error reading file:", error);
          alert("Could not read the file. Please ensure it's a valid text file.");
        }
      } else {
        alert("Please upload a .txt file.");
        event.target.value = ''; // Reset file input
      }
    }
  };

  return (
    <Card className="mb-6 md:mb-8 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <FileText className="h-6 w-6 text-primary" />
          Document Input
        </CardTitle>
        <CardDescription>
          Paste your document text below or upload a plain text (.txt) file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your document text here..."
          value={documentText}
          onChange={(e) => onDocumentTextChange(e.target.value)}
          rows={8}
          className="w-full p-3 border rounded-md focus:ring-primary focus:border-primary text-sm"
          aria-label="Document text input"
        />
        <div className="mt-4">
          <Label htmlFor="file-upload" className="text-sm font-medium">Upload .txt file</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
          />
        </div>
      </CardContent>
    </Card>
  );
}
