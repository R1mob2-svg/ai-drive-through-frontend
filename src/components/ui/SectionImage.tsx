import { cn } from "@/lib/utils";

interface SectionImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
  overlay?: "none" | "subtle" | "medium" | "heavy";
  blur?: boolean;
}

const SectionImage = ({
  src,
  alt,
  className,
  aspectRatio = "video",
  overlay = "subtle",
  blur = false,
}: SectionImageProps) => {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
  };

  const overlayClasses = {
    none: "",
    subtle: "bg-gradient-to-b from-background/10 via-transparent to-background/30",
    medium: "bg-gradient-to-b from-background/30 via-transparent to-background/50",
    heavy: "bg-gradient-to-b from-background/50 via-background/20 to-background/70",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50",
        aspectClasses[aspectRatio],
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-transform duration-500 hover:scale-105",
          blur && "blur-[2px]"
        )}
        loading="lazy"
      />
      {overlay !== "none" && (
        <div
          className={cn("absolute inset-0 pointer-events-none", overlayClasses[overlay])}
        />
      )}
    </div>
  );
};

export default SectionImage;
