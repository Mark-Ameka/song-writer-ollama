// src/components/structure/SongStructure.tsx
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ScrollArea } from "../ui/scroll-area";
import { useSongStore } from "../../stores/songStore";
import { BlockItem } from "./BlockItem";
import { AddBlockButton } from "./AddBlockButton";

export function SongStructure() {
  const {
    currentSong,
    activeBlockId,
    setActiveBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
  } = useSongStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const blocks = currentSong?.blocks || [];
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      const newOrder = arrayMove(blocks, oldIndex, newIndex);
      reorderBlocks(newOrder.map((b) => b.id));
    }
  };

  if (!currentSong) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Create a new song to get started
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <AddBlockButton />

      <ScrollArea className="flex-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentSong.blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 pr-4">
              {currentSong.blocks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No blocks yet. Add one to start!
                </p>
              ) : (
                currentSong.blocks.map((block) => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    isActive={block.id === activeBlockId}
                    onSelect={() => setActiveBlock(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                    onDuplicate={() => duplicateBlock(block.id)}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </div>
  );
}
