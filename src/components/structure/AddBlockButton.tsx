// src/components/structure/AddBlockButton.tsx
import { Plus, Layers } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { BlockType } from "../../types/song";
import { BLOCK_TYPES } from "../../constants/blockTypes";
import { SONG_TEMPLATES } from "../../constants/templates";
import { useSongStore } from "../../stores/songStore";

export function AddBlockButton() {
  const { addBlock, addBlocksFromTemplate } = useSongStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Single Blocks</DropdownMenuLabel>
        {Object.entries(BLOCK_TYPES).map(([type, config]) => (
          <DropdownMenuItem
            key={type}
            onClick={() => addBlock(type as BlockType)}
          >
            <div className="flex items-center gap-2 w-full">
              <div className={`w-3 h-3 rounded-full ${config.color}`} />
              <div className="flex-1">
                <div className="font-medium">{config.label}</div>
                <div className="text-xs text-muted-foreground">
                  {config.description}
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Layers className="h-3 w-3" />
            Templates
          </div>
        </DropdownMenuLabel>
        {SONG_TEMPLATES.map((template) => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => addBlocksFromTemplate(template.structure)}
          >
            <div className="w-full">
              <div className="font-medium">{template.name}</div>
              <div className="text-xs text-muted-foreground">
                {template.description}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
