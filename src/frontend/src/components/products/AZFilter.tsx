import { Button } from '@/components/ui/button';

interface AZFilterProps {
  selectedLetter: string | null;
  onSelectLetter: (letter: string | null) => void;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AZFilter({ selectedLetter, onSelectLetter }: AZFilterProps) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Filter by Letter</h3>
        {selectedLetter && (
          <Button variant="ghost" size="sm" onClick={() => onSelectLetter(null)}>
            Clear
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {alphabet.map((letter) => (
          <Button
            key={letter}
            variant={selectedLetter === letter ? 'default' : 'outline'}
            size="sm"
            className="w-9 h-9 p-0"
            onClick={() => onSelectLetter(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
}
