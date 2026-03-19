"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Item } from "@/components/commons/SelectWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type TopicsMultiSelectProps = {
  items?: Item[];
  value: string[];
  onChange: (nextValue: string[]) => void;
  placeholder?: string;
};

export default function TopicsMultiSelect({
  items,
  value,
  onChange,
  placeholder = "Select topics",
}: TopicsMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const options = useMemo(
    () => (items ?? []).filter((item) => String(item.value).toLowerCase() !== "all"),
    [items],
  );

  const filteredOptions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return options;

    return options.filter((item) => String(item.label).toLowerCase().includes(normalizedSearch));
  }, [options, searchTerm]);

  const buttonLabel =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? value[0]
        : `${value.length} topics selected`;

  const toggleTopic = (topic: string, checked: boolean) => {
    if (checked) {
      onChange(Array.from(new Set([...value, topic])));
      return;
    }

    onChange(value.filter((selectedTopic) => selectedTopic !== topic));
  };

  return (
    <DropdownMenu
      modal={false}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setSearchTerm("");
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between font-normal">
          <span className="truncate">{buttonLabel}</span>
          {value.length > 0 ? (
            <span className="text-muted-foreground ml-2 text-xs">{value.length}</span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width) p-2">
        <div className="relative mb-2">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4
              -translate-y-1/2"
          />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => event.stopPropagation()}
            placeholder="Search topics..."
            className="h-8 pl-8"
          />
        </div>

        {value.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-2 h-8 w-full justify-start"
            onClick={() => onChange([])}
          >
            <X className="h-4 w-4" />
            Clear selection
          </Button>
        ) : null}

        <div className="max-h-56 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <p className="text-muted-foreground px-2 py-1 text-sm">No topics found.</p>
          ) : (
            filteredOptions.map((item) => {
              const topicValue = String(item.value);
              const isChecked = value.includes(topicValue);

              return (
                <DropdownMenuCheckboxItem
                  key={topicValue}
                  checked={isChecked}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={(checked) => toggleTopic(topicValue, checked === true)}
                >
                  {String(item.label)}
                </DropdownMenuCheckboxItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
