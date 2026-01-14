// src/components/layout/Header.tsx
import { Music, Save, Download, FileText } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useSongStore } from "../../stores/songStore";
import { exportToText, exportToPDF } from "../../services/export";

export function Header() {
  const { currentSong, saveSong } = useSongStore();

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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6" />
          <h1 className="text-xl font-bold">SongWriter</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!currentSong}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={!currentSong}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
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

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
