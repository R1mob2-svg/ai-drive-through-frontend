interface CinematicSectionProps {
  image: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

/**
 * Full-width section with a faded background image and content layered on top.
 * This is the standard layout pattern for the site — no standalone images allowed.
 */
const CinematicSection = ({
  image,
  alt,
  children,
  className = "",
  intensity = "medium",
}: CinematicSectionProps) => {
  const overlayMap = {
    light: "from-background/80 via-background/65 to-background/55",
    medium: "from-background/90 via-background/80 to-background/70",
    heavy: "from-background/95 via-background/90 to-background/85",
  };

  return (
    <section className={`section-padding relative overflow-hidden ${className}`}>
      <img
        src={image}
        alt={alt}
        loading="lazy"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${overlayMap[intensity]}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />
      <div className="container mx-auto px-6 relative z-10">
        {children}
      </div>
    </section>
  );
};

export default CinematicSection;
