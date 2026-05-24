import { cn } from "@/lib/utils";

interface ImageGridProps {
  images: {
    src: string;
    alt: string;
  }[];
  className?: string;
  columns?: 2 | 3;
}

const ImageGrid = ({ images, className, columns = 2 }: ImageGridProps) => {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
        className
      )}
    >
      {images.map((image, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl border border-border/50 aspect-video group"
        >
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            width={640}
            height={360}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/10 pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
