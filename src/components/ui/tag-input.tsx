"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  allowDuplicates?: boolean;
  validateTag?: (tag: string) => boolean;
  tagVariant?: "default" | "secondary" | "destructive" | "outline";
}

export function TagInput({
  value = [],
  onChange,
  disabled = false,
  placeholder = "Add a tag...",
  maxTags = 10,
  className,
  allowDuplicates = false,
  validateTag,
  tagVariant = "secondary",
}: TagInputProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();

    // Validation checks
    if (!trimmedTag) return;
    if (value.length >= maxTags) return;
    if (!allowDuplicates && value.includes(trimmedTag)) return;
    if (validateTag && !validateTag(trimmedTag)) return;

    onChange([...value, trimmedTag]);
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = value.filter((tag) => tag !== tagToRemove);
    onChange(updatedTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const canAddTag =
    !disabled &&
    newTag.trim() &&
    value.length < maxTags &&
    (allowDuplicates || !value.includes(newTag.trim())) &&
    (!validateTag || validateTag(newTag.trim()));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddTag}
          variant="outline"
          size="icon"
          disabled={!canAddTag}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tags Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag: string) => (
            <Badge key={tag} variant={tagVariant} className="gap-1 pr-1">
              <span>{tag}</span>
              <button
                type="button"
                className="ml-1 p-0.5 rounded-sm hover:bg-destructive/20 transition-colors focus:outline-none focus:ring-1 focus:ring-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!disabled) {
                    handleRemoveTag(tag);
                  }
                }}
                disabled={disabled}
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag count indicator */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          {value.length} of {maxTags} tags
        </span>
        {value.length >= maxTags && (
          <span className="text-warning">Maximum tags reached</span>
        )}
      </div>
    </div>
  );
}
