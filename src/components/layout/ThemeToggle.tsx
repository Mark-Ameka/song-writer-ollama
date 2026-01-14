// src/components/layout/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useUIStore } from "../../stores/uiStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
