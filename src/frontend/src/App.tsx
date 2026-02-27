import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useGetAllDestinations,
  useSubscribeNewsletter,
  useInitialize,
} from "./hooks/useQueries";
import type { Destination } from "./backend.d";
import { Category } from "./backend.d";
import {
  MapPin,
  Search,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Church,
  TreePine,
  Landmark,
  Loader2,
  Menu,
  X,
} from "lucide-react";

// Destination image map
const destinationImages: Record<string, string> = {
  "Danteshwari Temple": "/assets/uploads/maa-danteshwari--1.png",
  "Ganesh Idol of Dholkal": "/assets/uploads/dolakal-1.webp",
  "Barsur Temples": "/assets/uploads/BARSOOR--1.png",
  "Tirathgarh Falls": "/assets/generated/tirathgarh-falls.dim_400x300.jpg",
};

const fallbackImages: Record<string, string> = {
  SacredSite: "/assets/uploads/maa-danteshwari--1.png",
  AncientShrine: "/assets/generated/ganesh-dholkal.dim_400x300.jpg",
  HeritageArchitecture: "/assets/generated/barsur-temples.dim_400x300.jpg",
  NatureAdventure: "/assets/generated/tirathgarh-falls.dim_400x300.jpg",
};

function getDestinationImage(destination: Destination): string {
  return (
    destinationImages[destination.name] ||
    fallbackImages[destination.category] ||
    "/assets/generated/hero-dantewada.dim_1200x700.jpg"
  );
}

const categoryLabels: Record<string, string> = {
  SacredSite: "Sacred Site",
  AncientShrine: "Ancient Shrine",
  HeritageArchitecture: "Heritage",
  NatureAdventure: "Nature & Adventure",
};

// Decorative section title with arrow decorations
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-12">
      {/* Ornamental top line */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-primary/40" />
        <div className="w-1.5 h-1.5 rotate-45 bg-primary/60" />
        <div className="w-1.5 h-1.5 rotate-45 bg-primary" />
        <div className="w-1.5 h-1.5 rotate-45 bg-primary/60" />
        <div className="w-8 h-px bg-primary/40" />
      </div>
      {/* Title row with flanking arrows */}
      <div className="flex items-center gap-5">
        <span
          className="font-display text-xl font-light select-none"
          style={{ color: "oklch(0.66 0.19 51)", opacity: 0.7 }}
        >
          ❧
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary text-center tracking-tight">
          {children}
        </h2>
        <span
          className="font-display text-xl font-light select-none scale-x-[-1] inline-block"
          style={{ color: "oklch(0.66 0.19 51)", opacity: 0.7 }}
        >
          ❧
        </span>
      </div>
      {/* Underline rule */}
      <div className="flex items-center gap-3">
        <div className="w-16 h-px bg-primary/50" />
        <div className="w-2 h-2 rotate-45 bg-primary" />
        <div className="w-16 h-px bg-primary/50" />
      </div>
    </div>
  );
}

// Refined section break — subtle, non-intrusive
function DiamondDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-2.5 opacity-40">
        <div className="w-24 h-px bg-gradient-to-r from-transparent to-primary/70" />
        <div className="w-1.5 h-1.5 rotate-45 bg-primary" />
        <div className="w-24 h-px bg-gradient-to-l from-transparent to-primary/70" />
      </div>
    </div>
  );
}

// Navigation
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <TreePine className="w-7 h-7 text-accent" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold text-primary leading-tight">
                Dantewada
              </span>
              <span className="text-xs text-secondary font-body font-medium tracking-wide">
                Tourist Guide
              </span>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Home", id: "home" },
              { label: "Top Destinations", id: "destinations" },
              { label: "About", id: "about" },
              { label: "Contact", id: "contact" },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className="font-body text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => scrollTo("destinations")}
              className="hidden md:flex bg-primary hover:bg-primary/90 text-white font-body text-sm"
            >
              Plan Your Trip
            </Button>
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden text-secondary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-3 flex flex-col gap-3">
            {[
              { label: "Home", id: "home" },
              { label: "Top Destinations", id: "destinations" },
              { label: "About", id: "about" },
              { label: "Contact", id: "contact" },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className="text-left font-body text-sm font-medium text-secondary hover:text-primary transition-colors py-1"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo("destinations")}
              className="bg-primary hover:bg-primary/90 text-white font-body text-sm w-full mt-2"
            >
              Plan Your Trip
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}

// Hero Section
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const el = document.getElementById("destinations");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/uploads/0011122_Dantewada_Danteswari_Mata_Mandir_Chattisgarh_007-1.jpg')`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Warm bottom vignette for section transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, oklch(0.97 0.025 87) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in pb-16">
        <p className="font-display text-5xl md:text-7xl font-light italic text-white/95 mb-0 leading-tight drop-shadow-lg">
          Explore
        </p>
        <h1
          className="font-display text-6xl md:text-8xl font-bold leading-none mb-5 drop-shadow-md"
          style={{ color: "oklch(0.84 0.18 65)" }}
        >
          Dantewada
        </h1>
        <p className="font-body text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
          Discover the Sacred Sites and Scenic Wonders of Dantewada, Chhattisgarh
        </p>

        {/* Search bar */}
        <div className="flex max-w-lg mx-auto gap-0 rounded-xl overflow-hidden shadow-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for places..."
              className="pl-10 rounded-none border-0 h-12 font-body text-sm bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-white rounded-none rounded-r-xl px-6 h-12 font-body text-sm font-semibold"
          >
            Search
          </Button>
        </div>
      </div>
    </section>
  );
}

// Destination Card
function DestinationCard({
  destination,
  onLearnMore,
}: {
  destination: Destination;
  onLearnMore: (d: Destination) => void;
}) {
  const image = getDestinationImage(destination);
  const categoryLabel = categoryLabels[destination.category] ?? destination.category;

  return (
    <div className="group rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col border border-border/60 bg-card">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
          style={{ transition: "transform 0.5s ease" }}
        />
        {/* Image gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {/* Category pill */}
        <span
          className="category-pill absolute top-3 left-3 text-white text-[10px] font-body font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
        >
          {categoryLabel}
        </span>
      </div>

      {/* Card body with left accent */}
      <div className="dest-card-accent p-5 flex flex-col flex-1 ml-0 pl-4">
        <h3 className="font-display text-[1.05rem] font-bold text-secondary mb-1 leading-snug">
          {destination.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
          {destination.tagline}
        </p>
        <Button
          type="button"
          onClick={() => onLearnMore(destination)}
          className="bg-primary hover:bg-primary/90 text-white font-body text-sm w-full rounded-lg font-semibold tracking-wide"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}

// Destinations Section
function DestinationsSection() {
  const { data: destinations = [], isLoading } = useGetAllDestinations();
  const [selected, setSelected] = useState<Destination | null>(null);

  // Fallback destinations for display
  const fallbackDestinations: Destination[] = [
    {
      id: 1n,
      name: "Danteshwari Temple",
      tagline: "Heart of Faith & Spirituality",
      description:
        "The Danteshwari Temple is one of the 52 Shakti Peethas in India, dedicated to Goddess Danteshwari. This revered temple draws thousands of devotees every year and is the spiritual heart of Dantewada. The temple architecture reflects the rich cultural heritage of the Bastar region.",
      category: Category.SacredSite,
    },
    {
      id: 2n,
      name: "Ganesh Idol of Dholkal",
      tagline: "Ancient & Holy Shrine",
      description:
        "Located atop the Bailadila hill at an altitude of 3000 feet, the Ganesh Idol of Dholkal is a remarkable 1000-year-old ancient statue. The trek to this magnificent idol through dense forests offers breathtaking views and a deeply spiritual experience.",
      category: Category.AncientShrine,
    },
    {
      id: 3n,
      name: "Barsur Temples",
      tagline: "Heritage & Architecture",
      description:
        "Barsur is an ancient town known for its remarkable temples and archaeological heritage. The Chandradita temples and the remarkable twin temples showcase exquisite Nagara-style architecture dating back to the 9th-10th century. Barsur was once known as the 'city of temples and tanks'.",
      category: Category.HeritageArchitecture,
    },
    {
      id: 4n,
      name: "Tirathgarh Falls",
      tagline: "Nature's Paradise",
      description:
        "Tirathgarh Falls is one of the most spectacular waterfalls in Chhattisgarh, cascading from a height of about 91 feet. Surrounded by lush green forests, this natural wonder is perfect for nature lovers and photographers. The misty spray and the sound of falling water create a mesmerizing atmosphere.",
      category: Category.NatureAdventure,
    },
  ];

  const displayDestinations = destinations.length > 0 ? destinations : fallbackDestinations;

  return (
    <section id="destinations" className="py-16 px-4 max-w-7xl mx-auto">
      <SectionTitle>Popular Destinations</SectionTitle>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayDestinations.map((dest) => (
            <DestinationCard
              key={String(dest.id)}
              destination={dest}
              onLearnMore={setSelected}
            />
          ))}
        </div>
      )}

      {/* Destination detail modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-2">
                <img
                  src={getDestinationImage(selected)}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-secondary">
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="font-body text-primary font-medium">
                  {selected.tagline}
                </DialogDescription>
              </DialogHeader>
              <p className="font-body text-sm text-foreground/80 leading-relaxed">
                {selected.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="font-body text-xs text-muted-foreground">
                  Dantewada, Chhattisgarh, India
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// Why Visit section
function WhyVisitSection() {
  const features = [
    {
      icon: Church,
      title: "Sacred Sites",
      description:
        "Visit revered temples and ancient holy sites that have drawn pilgrims for centuries. Experience the divine energy of Danteshwari Temple and other sacred shrines.",
    },
    {
      icon: Landmark,
      title: "Ancient Temples",
      description:
        "Explore the rich heritage of Barsur and its historic temples. Marvel at the exquisite stone carvings and architectural brilliance of medieval craftsmen.",
    },
    {
      icon: TreePine,
      title: "Nature & Adventure",
      description:
        "Discover waterfalls, lush forests, and thrilling outdoor activities. From the misty Tirathgarh Falls to trekking through dense jungle, adventure awaits.",
    },
  ];

  return (
    <section id="about" className="py-16 px-4 why-section-bg">
      <div className="max-w-7xl mx-auto">
        <SectionTitle>Why Visit Dantewada</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-card rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <feat.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-secondary mb-3">
                {feat.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Newsletter section
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { mutate: subscribe, isPending } = useSubscribeNewsletter();

  const handleSubscribe = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    subscribe(email, {
      onSuccess: () => {
        toast.success("You're subscribed! We'll keep you updated on Dantewada's wonders.");
        setEmail("");
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    });
  };

  return (
    <section className="py-16 px-4 newsletter-bg relative overflow-hidden">
      {/* Decorative side images */}
      <div
        className="absolute inset-y-0 left-0 w-1/4 bg-cover bg-center opacity-20 hidden lg:block"
        style={{
          backgroundImage: `url('/assets/uploads/maa-danteshwari--1.png')`,
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/4 bg-cover bg-center opacity-20 hidden lg:block"
        style={{
          backgroundImage: `url('/assets/generated/tirathgarh-falls.dim_400x300.jpg')`,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Subscribe for the Latest Updates
        </h2>
        <p className="font-body text-white/75 text-base mb-8 leading-relaxed">
          Get the latest travel tips, destination guides, and special offers for Dantewada
          delivered straight to your inbox.
        </p>
        <div className="flex max-w-md mx-auto gap-0 rounded-lg overflow-hidden shadow-xl">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            placeholder="Enter your email address..."
            className="rounded-none border-0 h-12 font-body text-sm bg-white focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
          />
          <Button
            type="button"
            onClick={handleSubscribe}
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-white rounded-none px-6 h-12 font-body text-sm font-semibold"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
          </Button>
        </div>
      </div>
    </section>
  );
}

// Contact section
function ContactSection() {
  const contactItems = [
    {
      icon: MapPin,
      title: "Location",
      info: "Dantewada, Chhattisgarh\nIndia - 494449",
    },
    {
      icon: Church,
      title: "Best Time to Visit",
      info: "October to February\nPost-monsoon & winter",
    },
    {
      icon: TreePine,
      title: "Known For",
      info: "Danteshwari Temple\nWaterfalls & Forests",
    },
  ] as const;

  return (
    <section id="contact" className="py-16 px-4 max-w-7xl mx-auto">
      <SectionTitle>Get In Touch</SectionTitle>
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-body text-muted-foreground leading-relaxed mb-6">
          Have questions about visiting Dantewada? Want to share your experience or plan your
          perfect trip? We'd love to hear from you!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-card rounded-xl p-6 text-center border border-border"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-secondary mb-1">
                  {item.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground whitespace-pre-line">
                  {item.info}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();
  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Top Destinations", id: "destinations" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <TreePine className="w-6 h-6 text-primary" />
            <span className="font-display text-lg font-bold text-primary">
              Dantewada Tourist Guide
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {navLinks.map((link, i) => (
              <span key={link.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className="font-body text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
                {i < navLinks.length - 1 && (
                  <span className="text-secondary-foreground/30">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-secondary-foreground/70 hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-secondary-foreground/70 hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-secondary-foreground/70 hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-secondary-foreground/70 hover:text-primary transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-secondary-foreground/60 font-body">
            <p>© {year} Dantewada Tourist Guide. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button type="button" className="hover:text-primary transition-colors">
                Privacy Policy
              </button>
              <span className="text-secondary-foreground/30">|</span>
              <button type="button" className="hover:text-primary transition-colors">
                Terms of Service
              </button>
            </div>
            <p>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// App initializer - runs initialize() once on load
function AppInitializer() {
  useInitialize();
  return null;
}

// Main App
export default function App() {
  return (
    <div className="min-h-screen bg-background font-body">
      <AppInitializer />
      <Toaster position="top-center" richColors />
      <Navbar />
      <main>
        <HeroSection />
        <DiamondDivider />
        <DestinationsSection />
        <DiamondDivider />
        <WhyVisitSection />
        <DiamondDivider />
        <ContactSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
