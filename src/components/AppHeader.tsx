export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground py-4 md:py-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <h1 className="text-2xl md:text-3xl font-bold font-headline">GroqAssist</h1>
        {/* <Settings2 className="h-7 w-7 md:h-8 md:w-8" /> */}
      </div>
    </header>
  );
}
