// src/components/editor/InlineAutocomplete.tsx
import { useState, useEffect, useRef, KeyboardEvent, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useAutocomplete } from "../../hooks/useAutocomplete";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange?: (
    start: number,
    end: number,
    selectedText: string,
  ) => void;
  placeholder?: string;
  className?: string;
}

export function InlineAutocomplete({
  value,
  onChange,
  onSelectionChange,
  placeholder,
  className,
}: InlineAutocompleteProps) {
  const { suggestion, isLoading, fetchAutocomplete, clearSuggestion } =
    useAutocomplete();
  const [showSuggestion, setShowSuggestion] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    if (!suggestion) {
      setShowSuggestion(false);
    }
  }, [suggestion]);

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key for autocomplete
    if (e.key === "Tab") {
      e.preventDefault();

      if (showSuggestion && suggestion) {
        // Accept current suggestion
        const before = value.substring(0, cursorPosition);
        const after = value.substring(cursorPosition);
        const newValue = before + suggestion + after;
        onChange(newValue);
        clearSuggestion();
        setShowSuggestion(false);

        // Set cursor after inserted text
        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = before.length + suggestion.length;
            textareaRef.current.selectionStart = newPos;
            textareaRef.current.selectionEnd = newPos;
          }
        }, 0);
      } else {
        // Fetch new suggestion
        const textarea = textareaRef.current;
        if (!textarea) return;

        const pos = textarea.selectionStart;
        setCursorPosition(pos);
        const textBefore = value.substring(0, pos);
        const lastLine = textBefore.split("\n").pop() || "";

        if (lastLine.trim().length >= 3) {
          setShowSuggestion(true);
          await fetchAutocomplete(lastLine);
        }
      }
    }

    // Escape to dismiss suggestion
    if (e.key === "Escape" && showSuggestion) {
      clearSuggestion();
      setShowSuggestion(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // Clear suggestion if user types anything
    if (showSuggestion) {
      clearSuggestion();
      setShowSuggestion(false);
    }
  };

  // Debounced selection handler to prevent infinite loops
  const selectionTimeoutRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const handleSelect = useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      if (!onSelectionChange) return;

      const target = e.currentTarget;

      // Debounce selection changes
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }

      selectionTimeoutRef.current = setTimeout(() => {
        onSelectionChange(
          target.selectionStart,
          target.selectionEnd,
          target.value.substring(target.selectionStart, target.selectionEnd),
        );
      }, 100);
    },
    [onSelectionChange],
  );

  return (
    <div className="relative">
      {/* Ghost text for suggestion */}
      {showSuggestion && suggestion && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 1 }}
        >
          <div
            className="whitespace-pre-wrap break-words p-3 font-mono text-sm"
            style={{
              color: "transparent",
              caretColor: "transparent",
            }}
          >
            {value.substring(0, cursorPosition)}
            <span className="text-muted-foreground/50 bg-muted/30">
              {suggestion}
            </span>
            {value.substring(cursorPosition)}
          </div>
        </div>
      )}

      {/* Actual textarea */}
      <TextareaAutosize
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        onMouseUp={handleSelect}
        placeholder={placeholder}
        className={cn(
          "relative z-10 bg-transparent font-mono text-sm",
          className,
        )}
        minRows={8}
      />

      {showSuggestion && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Generating...</span>
            </>
          ) : suggestion ? (
            <>
              <kbd className="px-1.5 py-0.5 border rounded bg-muted">Tab</kbd>
              <span>to accept</span>
              <span className="text-muted-foreground/50">•</span>
              <kbd className="px-1.5 py-0.5 border rounded bg-muted">Esc</kbd>
              <span>to dismiss</span>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
