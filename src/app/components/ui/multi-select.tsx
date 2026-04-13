import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected?: string[];
  value?: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function MultiSelect({
  options,
  selected,
  value,
  onChange,
  placeholder = "Select items...",
  className,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  
  // Support both 'selected' and 'value' props
  const selectedValues = value || selected || [];

  const handleSelect = (selectValue: string) => {
    const newSelected = selectedValues.includes(selectValue)
      ? selectedValues.filter((item) => item !== selectValue)
      : [...selectedValues, selectValue];
    onChange(newSelected);
  };

  const handleRemove = (removeValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((item) => item !== removeValue));
  };

  const selectedLabels = selectedValues
    .map((val) => options.find((option) => option.value === val)?.label)
    .filter(Boolean) as string[];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-[2.25rem] py-1",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              selectedValues.map((selectedVal) => {
                const label = options.find((opt) => opt.value === selectedVal)?.label;
                if (!label) return null;
                return (
                  <Badge
                    key={selectedVal}
                    variant="secondary"
                    className="bg-[#2D6EF5] text-white hover:bg-[#2557D6] mr-1"
                  >
                    {label}
                    <span
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer inline-flex items-center"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onChange(selectedValues.filter((item) => item !== selectedVal));
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        handleRemove(selectedVal, e);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                );
              })
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}