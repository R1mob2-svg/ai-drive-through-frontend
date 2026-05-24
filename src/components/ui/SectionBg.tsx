import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionBgProps {
  image: string;
  alt?: string;
  children: ReactNode;
  className?: string;
  /** How visible the background image is. Lower = more subtle */
  intensity?: "ghost" | "subtle" | "medium";
  /** Position of the image */
  position?: "center" | "top" | "bottom" | "left" | "right";
}

const intensityStyles = {
  ghost: "opacity-[0.04]",
  subtle: "opacity-[0.07]",
  medium: "opacity-[0.12]",
};

/**
 * Wraps a section with a very faint industry-relevant background image.
 * The image is purely decorative and heavily faded so text remains readable.
 */
const SectionBg = ({
  image,
  alt = "",
  children,
  className,
  intensity = "subtle",
  position = "center",
}: SectionBgProps) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Faded background image */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover scale-110",
            intensityStyles[intensity],
          )}
          style={{
            objectPosition: position,
            filter: "grayscale(40%) blur(1px)",
          }}
        />
        {/* Extra overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" />
      </div>
      {/* Actual content */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default SectionBg;
