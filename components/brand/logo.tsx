import { cn } from "@/lib/utils";
import {
  LOGO_VIEWBOX,
  SHIELD_PATHS,
  SHIELD_VIEWBOX,
  TAGLINE_PATHS,
  WORDMARK_PATHS,
} from "./brand-paths";

/** Версии логотипа из гайда (п. 1.3): основная, инверсия на красном/тёмном, монохром */
type LogoVariant = "color" | "inverse" | "mono";

const PALETTE: Record<LogoVariant, { shield: string; wordmark: string; tagline: string }> = {
  color: { shield: "#575756", wordmark: "#AE1613", tagline: "#575756" },
  inverse: { shield: "#FFFFFF", wordmark: "#FFFFFF", tagline: "#FFFFFF" },
  mono: { shield: "currentColor", wordmark: "currentColor", tagline: "currentColor" },
};

type LogoProps = {
  variant?: LogoVariant;
  showTagline?: boolean;
  className?: string;
  title?: string;
};

export function Logo({
  variant = "color",
  showTagline = true,
  className,
  title = "BEBRAND — Right to be brand",
}: LogoProps) {
  const colors = PALETTE[variant];
  return (
    <svg
      viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
      role="img"
      aria-label={title}
      className={cn("h-10 w-auto shrink-0", className)}
    >
      <g fill={colors.shield}>
        {SHIELD_PATHS.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </g>
      <g fill={colors.wordmark}>
        {WORDMARK_PATHS.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </g>
      {showTagline && (
        <g fill={colors.tagline}>
          {TAGLINE_PATHS.map((d, index) => (
            <path key={index} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}

type ShieldMarkProps = { className?: string; color?: string };

/** Знак без надписи — для мелких носителей и декоративных акцентов */
export function ShieldMark({ className, color = "currentColor" }: ShieldMarkProps) {
  return (
    <svg
      viewBox={`0 0 ${SHIELD_VIEWBOX.width} ${SHIELD_VIEWBOX.height}`}
      aria-hidden="true"
      className={cn("h-10 w-auto shrink-0", className)}
    >
      <path d={SHIELD_PATHS[0]} fill={color} />
    </svg>
  );
}
