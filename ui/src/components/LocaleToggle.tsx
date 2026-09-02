import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import { setUiLocale, useUiLocale, type UiLocale } from "@/i18n";

type LocaleToggleVariant = "icon" | "menu-action";

interface LocaleToggleProps {
  className?: string;
  variant?: LocaleToggleVariant;
  onAfterToggle?: () => void;
}

export function LocaleToggle({ className, variant = "icon", onAfterToggle }: LocaleToggleProps) {
  const { locale } = useUiLocale();
  const next: UiLocale = locale === "zh-CN" ? "en" : "zh-CN";
  const label = locale === "zh-CN" ? "Switch to English" : "切换到中文";
  const description = locale === "zh-CN" ? "Use English UI copy." : "侧栏和已接入文案使用中文。";

  async function handleClick() {
    await setUiLocale(next);
    onAfterToggle?.();
  }

  if (variant === "menu-action") {
    return (
      <button
        type="button"
        className={cn(
          "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-accent/60",
          className,
        )}
        onClick={() => void handleClick()}
        aria-label={label}
      >
        <span className="mt-0.5 rounded-lg border border-border bg-background/70 p-2 text-muted-foreground">
          <Languages className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">{label}</span>
          <span className="block text-xs text-muted-foreground">{description}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        className,
      )}
      onClick={() => void handleClick()}
      aria-label={label}
      title={label}
    >
      {locale === "zh-CN" ? "EN" : "中文"}
    </button>
  );
}
