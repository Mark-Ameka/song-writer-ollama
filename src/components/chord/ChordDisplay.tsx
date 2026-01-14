// src/components/chord/ChordDisplay.tsx
import { cn } from "@/lib/utils";
import { ChordProgression } from "../../types/chord";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface ChordDisplayProps {
  progression: ChordProgression;
  compact?: boolean;
}

export function ChordDisplay({
  progression,
  compact = false,
}: ChordDisplayProps) {
  return (
    <div
      className={cn(
        "space-y-2 p-3 bg-secondary/30 rounded-lg border",
        compact && "p-2",
      )}
    >
      <div className="flex flex-wrap gap-1.5">
        {progression.chords.map((chord, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className={cn(
              "text-sm px-2.5 py-0.5",
              compact && "text-xs px-2 py-0.5",
            )}
          >
            {chord.display}
          </Badge>
        ))}
      </div>

      {!compact && (
        <>
          <Separator />
          <div className="space-y-1">
            <div className="text-xs">
              <span className="font-medium">Roman Numerals: </span>
              <span className="text-muted-foreground">
                {progression.romanNumerals}
              </span>
            </div>
            <div className="text-xs">
              <span className="font-medium">Nashville: </span>
              <span className="text-muted-foreground">
                {progression.nashvilleNumbers}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
