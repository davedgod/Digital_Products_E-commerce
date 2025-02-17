import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="container flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Digital Products for
          <br />
          Modern Creators
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Discover premium digital assets, templates, and tools to elevate your
          creative projects.
        </p>
        <Button size="lg" className="text-lg">
          Browse Products
        </Button>
      </div>
    </section>
  );
}
