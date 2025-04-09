"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

interface AiTextboxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  sidebarOpen?: boolean;
  sidebarWidth?: string;
}

export function AiTextbox({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask about cryopreservation...",
  className,
  disabled = false,
  sidebarOpen: propSidebarOpen,
  sidebarWidth = "16rem", // Default desktop width
}: AiTextboxProps) {
  const { open: contextSidebarOpen } = useSidebar();
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect viewport width and set isMobile state
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine sidebarOpen state
  const sidebarOpenFromContextOrProp =
    propSidebarOpen !== undefined ? propSidebarOpen : contextSidebarOpen;
  const sidebarOpen = isMobile ? false : sidebarOpenFromContextOrProp;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit && !disabled) {
      onSubmit();
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 max-h-[98px] z-1 bg-transparent border-t-[0.5px] border-sidebar-border bg-(--background)",
        sidebarOpen ? "left-0 w-full pl-[16rem]" : "left-0 w-full",
        "flex justify-center transition-all duration-300",
        className
      )}
      style={{
        paddingLeft: sidebarOpen ? sidebarWidth : "0", // Dynamically adjust padding based on sidebar width
      }}
    >
      <div
        className={cn(
          "flex flex-col max-w-[970px] flex-shrink-0 w-full",
          sidebarOpen ? "md:w-[80%]" : "w-[80%]", // Use 80% of the remaining space after sidebar
          "mx-auto" // Center the textbox
        )}
      >
        <div className="flex items-center gap-2 pt-[12px] w-full flex-shrink-0 min-w-0">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 px-4 py-2 text-base rounded-lg border border-(--border) shadow-sm",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
          {onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={disabled}
              className="rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 disabled:opacity-60"
            >
              <ArrowUp size={20} />
            </Button>
          )}
        </div>
        <p className="text-xs text-(--text-foreground) opacity-60 text-center my-1">
          Currently in beta. Verify all data.
        </p>
      </div>
    </div>
  );
}