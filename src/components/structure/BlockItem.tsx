// src/components/structure/BlockItem.tsx
import { GripVertical, Trash2, Copy } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SongBlock } from "../../types/song";
import { BLOCK_TYPES } from "../../constants/blockTypes";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { BlockChordGenerator } from "../chord/BlockChordGenerator";
import { cn } from "@/lib/utils";

interface BlockItemProps {
  block: SongBlock;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function BlockItem({
  block,
  isActive,
  onSelect,
  onDelete,
  onDuplicate,
}: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const blockConfig = BLOCK_TYPES[block.type];
  const preview =
    block.content.slice(0, 40) + (block.content.length > 40 ? "..." : "");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border p-3 cursor-pointer transition-all",
        isActive
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/50",
        isDragging && "opacity-50",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <button
          className="cursor-grab active:cursor-grabbing mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", blockConfig.color)} />
            <span className="font-medium text-sm">{block.label}</span>
          </div>

          {preview && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {preview}
            </p>
          )}

          {block.wordCount !== undefined && block.wordCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {block.wordCount} words • {block.syllableCount} syllables
            </p>
          )}

          <div onClick={(e) => e.stopPropagation()}>
            <BlockChordGenerator block={block} />
          </div>
        </div>

        <TooltipProvider>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate block</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete block</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
