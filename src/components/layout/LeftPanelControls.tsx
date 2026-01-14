// src/components/layout/LeftPanelControls.tsx
import {
  Moon,
  Sun,
  Save,
  Download,
  FileText,
  Eye,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUIStore } from "../../stores/uiStore";
import { useSongStore } from "../../stores/songStore";
import { exportToText, exportToPDF } from "../../services/export";

export function LeftPanelControls() {
  const { theme, toggleTheme, setShowPreview } = useUIStore();
  const { currentSong, saveSong, undo, redo, canUndo, canRedo } =
    useSongStore();

  const handleSave = () => {
    saveSong();
  };

  const handleExportText = () => {
    if (currentSong) exportToText(currentSong);
  };

  const handleExportPDF = () => {
    if (currentSong) exportToPDF(currentSong);
  };

  return (
    <div className="flex items-center gap-2 p-3 border-b bg-card">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={!currentSong}
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save (Ctrl+S)</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={!currentSong}>
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Export</TooltipContent>
          </Tooltip>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportText}>
              <FileText className="h-4 w-4 mr-2" />
              Text File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              disabled={!currentSong}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preview Lyrics</TooltipContent>
        </Tooltip>

        <div className="flex-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Theme</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
