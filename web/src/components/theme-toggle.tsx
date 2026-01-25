"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-white/10 dark:hover:bg-white/5"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "cursor-pointer gap-2 rounded-lg",
            theme === "light" && "bg-primary/10 text-primary"
          )}
        >
          <Sun className="h-4 w-4" />
          <span>라이트</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "cursor-pointer gap-2 rounded-lg",
            theme === "dark" && "bg-primary/10 text-primary"
          )}
        >
          <Moon className="h-4 w-4" />
          <span>다크</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "cursor-pointer gap-2 rounded-lg",
            theme === "system" && "bg-primary/10 text-primary"
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>시스템</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
