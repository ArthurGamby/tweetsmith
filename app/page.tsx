import Image from "next/image";
import TweetTransformer from "./components/TweetTransformer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <header className="flex flex-col items-center">
            <Image
              src="/icon-logo.png"
              alt="TweetSmith"
              width={62}
              height={62}
              className="mb-3"
            />
            <p className="text-sm text-muted">
              polish your tweets with AI
            </p>
          </header>

          {/* Main Component */}
          <TweetTransformer />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.1em] text-muted/60">
          powered by ollama
        </p>
      </footer>
    </div>
  );
}
