import { cn } from "@/lib/utils";

interface TwoToneHeadingProps {
  primaryText: string;
  accentText: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  size?: "default" | "large" | "hero";
}

const TwoToneHeading = ({
  primaryText,
  accentText,
  className,
  as: Tag = "h1",
  size = "default",
}: TwoToneHeadingProps) => {
  const sizeClasses = {
    default: "text-3xl md:text-4xl",
    large: "text-4xl md:text-5xl",
    hero: "",
  };

  return (
    <Tag
      className={cn(
        "headline-instrument",
        size !== "hero" && sizeClasses[size],
        className
      )}
    >
      <span className="headline-primary">{primaryText}</span>{" "}
      <span className="headline-accent-gradient">{accentText}</span>
    </Tag>
  );
};

export default TwoToneHeading;
