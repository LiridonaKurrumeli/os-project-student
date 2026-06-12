// src/gallery/GalleryApp.tsx
import { useState, useMemo } from "react";
import { toast } from "react-toastify";

// Importo të gjitha fotot
import amazingSunset from "../../../assets/icons/amazing-sunset-view.jpg";
import WaterfallWallpaper from "../../../assets/icons/waterfall-wallpaper.jpg";
import WavesWallpaper from "../../../assets/icons/waves.jpg";
import ForestInAutumn from "../../../assets/icons/forest-in-autumn.jpg";
import Lake from "../../../assets/icons/lake.jpg";
import Desert from "../../../assets/icons/desert.jpg";
import AuroraBorealis from "../../../assets/icons/aurora-borealis.jpg";
import CherryBlossoms from "../../../assets/icons/cherry-blossoms.jpg";
import SnowyMountains from "../../../assets/icons/snowy-mountains.jpg";
import SunflowerField from "../../../assets/icons/sunflower-field.jpg";
import TropicalBeach from "../../../assets/icons/tropical-beach.jpg";
import WildRiver from "../../../assets/icons/WildRiver.jpg";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  price: number;
  year: number;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
}

// Artwork data me kategori të sakta
const artworks: Artwork[] = [
  {
    id: 1,
    title: "Mountain Sunset",
    artist: "Nature Photography",
    price: 150,
    year: 2023,
    category: "Mountains",
    imageUrl: amazingSunset,
    thumbnailUrl: amazingSunset,
    description:
      "Breathtaking sunset over the majestic mountain range with golden hues painting the sky.",
  },
  {
    id: 2,
    title: "Forest Waterfall",
    artist: "Nature Photography",
    price: 175,
    year: 2023,
    category: "Forest",
    imageUrl: WaterfallWallpaper,
    thumbnailUrl: WaterfallWallpaper,
    description:
      "Hidden waterfall surrounded by lush green forest and morning mist.",
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Nature Photography",
    price: 200,
    year: 2023,
    category: "Ocean",
    imageUrl: WavesWallpaper,
    thumbnailUrl: WavesWallpaper,
    description:
      "Powerful ocean waves crashing against the rocky coastline at golden hour.",
  },
  {
    id: 4,
    title: "Autumn Forest",
    artist: "Nature Photography",
    price: 160,
    year: 2023,
    category: "Forest",
    imageUrl: ForestInAutumn,
    thumbnailUrl: ForestInAutumn,
    description:
      "Vibrant autumn colors painting the forest in shades of orange and gold.",
  },
  {
    id: 5,
    title: "Lake Reflection",
    artist: "Nature Photography",
    price: 190,
    year: 2023,
    category: "Lake",
    imageUrl: Lake,
    thumbnailUrl: Lake,
    description:
      "Crystal clear lake perfectly reflecting the surrounding mountains and sky.",
  },
  {
    id: 6,
    title: "Desert Dunes",
    artist: "Nature Photography",
    price: 220,
    year: 2023,
    category: "Desert",
    imageUrl: Desert,
    thumbnailUrl: Desert,
    description:
      "Endless sand dunes creating mesmerizing patterns in the golden light.",
  },
  {
    id: 7,
    title: "Northern Lights",
    artist: "Nature Photography",
    price: 250,
    year: 2023,
    category: "Winter",
    imageUrl: AuroraBorealis,
    thumbnailUrl: AuroraBorealis,
    description:
      "Spectacular aurora borealis dancing across the starry night sky.",
  },
  {
    id: 8,
    title: "Cherry Blossoms",
    artist: "Nature Photography",
    price: 180,
    year: 2023,
    category: "Flowers",
    imageUrl: CherryBlossoms,
    thumbnailUrl: CherryBlossoms,
    description:
      "Beautiful cherry blossoms in full bloom along a peaceful garden path.",
  },
  {
    id: 9,
    title: "Snowy Mountains",
    artist: "Nature Photography",
    price: 210,
    year: 2023,
    category: "Mountains",
    imageUrl: SnowyMountains,
    thumbnailUrl: SnowyMountains,
    description:
      "Majestic snow-capped mountains under a clear blue winter sky.",
  },
  {
    id: 10,
    title: "Sunflower Field",
    artist: "Nature Photography",
    price: 170,
    year: 2023,
    category: "Flowers",
    imageUrl: SunflowerField,
    thumbnailUrl: SunflowerField,
    description:
      "Endless field of sunflowers stretching towards the summer sun.",
  },
  {
    id: 11,
    title: "Tropical Beach",
    artist: "Nature Photography",
    price: 195,
    year: 2023,
    category: "Beach",
    imageUrl: TropicalBeach,
    thumbnailUrl: TropicalBeach,
    description:
      "Pristine white sand beach with turquoise waters and palm trees.",
  },
  {
    id: 12,
    title: "Wild River",
    artist: "Nature Photography",
    price: 185,
    year: 2023,
    category: "River",
    imageUrl: WildRiver,
    thumbnailUrl: WildRiver,
    description: "Rushing river through a dramatic canyon carved by nature.",
  },
];

// Kategoritë kryesore - vetëm ato që kanë foto
const categories: string[] = [
  "All",
  "Mountains",
  "Forest",
  "Ocean",
  "Lake",
  "Desert",
  "Winter",
  "Flowers",
  "Beach",
  "River",
];

// Art Card Component
const ArtCard = ({
  artwork,
  onClick,
  index,
}: {
  artwork: Artwork;
  onClick: () => void;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <div
      className="group cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
      style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800">
        <div className="relative overflow-hidden h-72">
          {!imageError ? (
            <img
              src={artwork.thumbnailUrl}
              alt={artwork.title}
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-4xl">🏔️</span>
            </div>
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute bottom-4 left-4 right-4">
              <button className="w-full bg-white text-gray-900 py-2 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors">
                Quick View
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-lg leading-tight line-clamp-1">
                {artwork.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                by {artwork.artist}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                ${artwork.price}.00
              </p>
              <p className="text-xs text-gray-400">{artwork.year}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {artwork.category}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              #{artwork.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Art Card
const FeaturedArtCard = ({
  artwork,
  onClick,
}: {
  artwork: Artwork;
  onClick: () => void;
}) => {
  const bids = Math.floor(Math.random() * 30) + 1;
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <img
            src={artwork.thumbnailUrl}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <span className="text-3xl">🏔️</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          Live
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
          {artwork.title}
        </h4>
        <p className="text-sm text-gray-500">by {artwork.artist}</p>
        <p className="text-sm text-gray-500 mt-1">
          Current bid: ${artwork.price}.00
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-400">{bids} bids</span>
          <button className="text-primary text-sm font-medium hover:underline">
            Place Bid →
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Gallery Component
export const GalleryApp = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"all" | "auctions">("all");

  // Filter artworks by category
  const filteredArtworks = useMemo(() => {
    let filtered = [...artworks];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(term) ||
          artwork.artist.toLowerCase().includes(term) ||
          artwork.description.toLowerCase().includes(term),
      );
    }

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (artwork) => artwork.category === activeCategory,
      );
    }

    return filtered;
  }, [searchTerm, activeCategory]);

  const featuredArtworks = artworks.slice(0, 4);

  // Get icon for each category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "All":
        return "🌄";
      case "Mountains":
        return "🏔️";
      case "Forest":
        return "🌲";
      case "Ocean":
        return "🌊";
      case "Lake":
        return "💧";
      case "Desert":
        return "🏜️";
      case "Winter":
        return "❄️";
      case "Flowers":
        return "🌸";
      case "Beach":
        return "🏖️";
      case "River":
        return "🏞️";
      default:
        return "📸";
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-4xl">🏔️</span>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                  Nature<span className="text-primary">Gallery</span>
                </h1>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Discover the beauty of nature through stunning photography
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-primary text-gray-800 shadow-md"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                All Galleries
              </button>
              <button
                onClick={() => setActiveTab("auctions")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "auctions"
                    ? "bg-primary text-gray-800 shadow-md"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Featured
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search nature photos..."
              className="w-full px-5 py-3 pl-12 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Featured Section */}
        {activeTab === "auctions" && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                🔥 Featured Nature Photography
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredArtworks.map((artwork) => (
                <FeaturedArtCard
                  key={artwork.id}
                  artwork={artwork}
                  onClick={() => setSelectedArtwork(artwork)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categories - Vetëm ato kryesore */}
        {activeTab === "all" && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-primary text-gray-800 shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {getCategoryIcon(category)} {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500">
          {filteredArtworks.length} photo{filteredArtworks.length !== 1 && "s"}{" "}
          found
        </div>

        {/* Artworks Grid */}
        <div className="mb-8">
          {filteredArtworks.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
              <div className="text-6xl mb-4">🏔️</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No photos found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork, index) => (
                <ArtCard
                  key={artwork.id}
                  artwork={artwork}
                  index={index}
                  onClick={() => setSelectedArtwork(artwork)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>
            © 2024 NatureGallery. Capturing the beauty of our natural world.
          </p>
        </div>
      </div>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArtwork(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedArtwork.imageUrl}
              alt={selectedArtwork.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";
              }}
            />
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full text-white text-2xl flex items-center justify-center transition-colors"
              onClick={() => setSelectedArtwork(null)}
            >
              ×
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white font-semibold text-xl mb-1">
                {selectedArtwork.title}
              </h3>
              <p className="text-white/70 text-sm">
                by {selectedArtwork.artist} • {selectedArtwork.year} •{" "}
                {selectedArtwork.category}
              </p>
              <p className="text-white/60 text-sm mt-2">
                {selectedArtwork.description}
              </p>
              <p className="text-primary font-bold text-lg mt-2">
                ${selectedArtwork.price}.00
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
