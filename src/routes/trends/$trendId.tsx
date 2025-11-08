import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Layers, Shirt, Sparkles, TrendingUp, Palette, Calendar, Heart, ShoppingBag } from 'lucide-react'

export const Route = createFileRoute('/trends/$trendId')({ component: TrendDetailPage })

const trendsData: Record<string, {
  name: string
  icon: any
  color: string
  gradient: string
  description: string
  overview: string
  howToStyle: { title: string; description: string }[]
  keyPieces: string[]
  colorPalette: { name: string; colors: string[] }
  styling_tips: string[]
}> = {
  'layered-look': {
    name: 'Layered Look',
    icon: Layers,
    color: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-800',
    description: 'Master the art of combining different pieces for dimension and warmth',
    overview: 'Layering is more than just putting on multiple clothes—it\'s an art form that adds depth, dimension, and functionality to your outfits. This fall trend focuses on thoughtful combinations of textures, lengths, and proportions to create visually interesting looks that keep you comfortable in changing temperatures.',
    howToStyle: [
      {
        title: 'Start with a Solid Base',
        description: 'Begin with a fitted base layer like a tank top or fitted long-sleeve shirt. This creates a smooth foundation that won\'t add bulk under additional layers.'
      },
      {
        title: 'Add a Middle Layer',
        description: 'Incorporate a lightweight sweater, cardigan, or button-down shirt as your middle layer. This is where you can introduce color or pattern to your outfit.'
      },
      {
        title: 'Top with an Outer Layer',
        description: 'Finish with a structured jacket, blazer, or coat. This outer layer should be slightly oversized to accommodate the layers beneath without looking bulky.'
      },
      {
        title: 'Play with Lengths',
        description: 'Vary the lengths of your layers so each piece is visible. A longer shirt peeking out from under a sweater, topped with a cropped jacket creates visual interest.'
      }
    ],
    keyPieces: [
      'Fitted turtleneck or long-sleeve tee',
      'Lightweight cardigan or sweater',
      'Button-down shirt (to layer under sweaters)',
      'Structured blazer or jacket',
      'Oversized scarf for added dimension',
      'Vest or sleeveless jacket'
    ],
    colorPalette: {
      name: 'Warm & Neutral',
      colors: ['Cream', 'Camel', 'Rust', 'Olive', 'Chocolate Brown', 'Burgundy']
    },
    styling_tips: [
      'Mix different textures: knits with denim, silk with wool',
      'Keep proportions balanced: fitted layers with one oversized piece',
      'Use similar color tones for a cohesive look',
      'Don\'t be afraid to layer patterns, just vary the scale',
      'Accessories like scarves and belts can tie layers together'
    ]
  },
  'cozy-knits': {
    name: 'Cozy Knits',
    icon: Shirt,
    color: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-100 to-red-200 dark:from-orange-900 dark:to-red-800',
    description: 'Embrace comfort with chunky sweaters and soft textures',
    overview: 'Nothing says fall quite like cozy knitwear. This season celebrates oversized sweaters, chunky cardigans, and textured knits that wrap you in warmth and style. The trend emphasizes comfort without sacrificing sophistication, with pieces that work equally well for casual weekends and polished everyday looks.',
    howToStyle: [
      {
        title: 'The Oversized Sweater',
        description: 'Pair an oversized knit sweater with fitted bottoms like skinny jeans or leggings to balance proportions. Tuck in the front or do a half-tuck for a casual, put-together look.'
      },
      {
        title: 'Chunky Cardigan Layers',
        description: 'Wear a chunky cardigan over a simple dress or with jeans and a tank. Leave it open and flowing, or belt it at the waist for definition.'
      },
      {
        title: 'Knit Dress Elegance',
        description: 'A sweater dress is an effortless one-piece solution. Add knee-high boots and a belt to create shape, or layer with a long coat for sophisticated warmth.'
      },
      {
        title: 'Texture Play',
        description: 'Mix different knit textures in one outfit: a cable knit sweater with a ribbed scarf, or a smooth knit top with a chunky cardigan.'
      }
    ],
    keyPieces: [
      'Oversized cable knit sweater',
      'Long chunky cardigan',
      'Turtleneck sweater',
      'Knit midi or maxi dress',
      'Cashmere or wool blend pullover',
      'Knitted vest for layering'
    ],
    colorPalette: {
      name: 'Soft & Warm',
      colors: ['Cream', 'Oatmeal', 'Dusty Rose', 'Sage Green', 'Terracotta', 'Caramel']
    },
    styling_tips: [
      'Balance chunky knits with fitted bottoms',
      'Choose quality natural fibers for the best drape and warmth',
      'Avoid over-layering with very chunky pieces—let one be the star',
      'Add delicate jewelry to offset the chunkiness of knits',
      'Care for knits properly: hand wash or gentle cycle, lay flat to dry'
    ]
  },
  'earth-tones': {
    name: 'Earth Tones',
    icon: Sparkles,
    color: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800',
    description: 'Natural, grounding colors inspired by nature',
    overview: 'Earth tones bring the calming, grounding essence of nature into your wardrobe. This trend celebrates rich browns, warm terracottas, olive greens, and sandy neutrals that evoke the changing fall landscape. These versatile, timeless colors create sophisticated, cohesive outfits that never go out of style.',
    howToStyle: [
      {
        title: 'Monochrome Earth Tones',
        description: 'Create depth by wearing different shades of the same earth tone family. Mix caramel, tan, and chocolate browns for a sophisticated monochrome look with natural dimension.'
      },
      {
        title: 'Complementary Nature Palette',
        description: 'Combine different earth tones that naturally exist together in nature: olive green with rust, cream with terracotta, or sage with sandy beige.'
      },
      {
        title: 'Earth Tones with Neutrals',
        description: 'Ground earth tones with classic neutrals like black, white, or gray to create contrast and visual interest while maintaining a natural aesthetic.'
      },
      {
        title: 'Texture in Earth Tones',
        description: 'Since earth tones are relatively muted, play with different textures—suede, corduroy, linen, and knits—to add visual interest to your outfits.'
      }
    ],
    keyPieces: [
      'Olive green utility jacket or pants',
      'Terracotta or rust-colored sweater',
      'Chocolate brown trousers or skirt',
      'Cream or oatmeal knit pieces',
      'Tan or camel coat',
      'Sage green blouse or dress'
    ],
    colorPalette: {
      name: 'Natural Palette',
      colors: ['Olive Green', 'Terracotta', 'Chocolate Brown', 'Cream', 'Rust', 'Sage']
    },
    styling_tips: [
      'Layer multiple earth tones for a rich, dimensional look',
      'Add gold or bronze jewelry to complement warm earth tones',
      'Mix matte and shiny textures for visual interest',
      'Earth tones work beautifully with natural materials like leather and wood',
      'Don\'t be afraid to go head-to-toe in earth tones'
    ]
  },
  'bold-accessories': {
    name: 'Bold Accessories',
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-100 to-fuchsia-200 dark:from-purple-900 dark:to-fuchsia-800',
    description: 'Statement pieces that elevate any outfit',
    overview: 'Accessories are taking center stage with bold, eye-catching pieces that transform simple outfits into fashion statements. This trend celebrates oversized jewelry, vibrant bags, statement belts, and dramatic scarves that add personality and flair to your wardrobe.',
    howToStyle: [
      {
        title: 'One Statement at a Time',
        description: 'Choose one bold accessory as your focal point—oversized earrings, a chunky necklace, or a statement bag—and keep other accessories minimal to avoid overwhelming the look.'
      },
      {
        title: 'Simple Base, Bold Accent',
        description: 'Pair statement accessories with simple, neutral outfits. A basic white tee and jeans become runway-worthy with the right bold accessories.'
      },
      {
        title: 'Color Pop Strategy',
        description: 'Use bold accessories to add color to monochrome or neutral outfits. A bright bag or bold scarf can completely transform a simple outfit.'
      },
      {
        title: 'Mix Metals & Materials',
        description: 'Don\'t be afraid to mix gold and silver, or combine different materials like leather, metal, and fabric for an eclectic, curated look.'
      }
    ],
    keyPieces: [
      'Oversized hoop or statement earrings',
      'Chunky chain necklace or layered pendant',
      'Bold-colored or textured handbag',
      'Wide statement belt',
      'Printed silk scarf',
      'Stacked rings or bold cuff bracelets'
    ],
    colorPalette: {
      name: 'Vibrant & Metallic',
      colors: ['Emerald Green', 'Cobalt Blue', 'Ruby Red', 'Gold', 'Silver', 'Hot Pink']
    },
    styling_tips: [
      'Balance proportions: oversized accessories work best with fitted clothing',
      'Consider your outfit\'s neckline when choosing statement necklaces',
      'Use accessories to tie together different elements of your outfit',
      'Quality over quantity: invest in a few statement pieces you love',
      'Let your accessories reflect your personality and mood'
    ]
  },
  'monochrome-magic': {
    name: 'Monochrome Magic',
    icon: Palette,
    color: 'text-slate-600 dark:text-slate-400',
    gradient: 'from-slate-100 to-gray-200 dark:from-slate-900 dark:to-gray-700',
    description: 'Head-to-toe single color sophistication',
    overview: 'Monochrome dressing creates elongating, sophisticated looks by wearing a single color from head to toe. This trend plays with different shades, tones, and textures of one color family to create depth and dimension while maintaining a cohesive, polished appearance.',
    howToStyle: [
      {
        title: 'Tonal Variations',
        description: 'Combine different shades of your chosen color—light, medium, and dark—to create visual interest while maintaining the monochrome effect.'
      },
      {
        title: 'Texture Mixing',
        description: 'Since you\'re working with one color, varying textures becomes crucial. Mix matte with shiny, smooth with textured, to add dimension.'
      },
      {
        title: 'All-White Sophistication',
        description: 'An all-white outfit creates a clean, modern look. Mix cream, ivory, and pure white for depth, and vary textures to prevent it from looking flat.'
      },
      {
        title: 'Dramatic All-Black',
        description: 'Black monochrome is classic and slimming. Layer different black pieces and add interest through cuts, silhouettes, and fabric choices.'
      }
    ],
    keyPieces: [
      'Matching set in your chosen color',
      'Blazer and trousers in the same hue',
      'Monochrome dress with matching outerwear',
      'Coordinating sweater and skirt',
      'Head-to-toe denim in same wash',
      'Accessories in matching tones'
    ],
    colorPalette: {
      name: 'Single Color Focus',
      colors: ['All Black', 'All White/Cream', 'All Beige', 'All Navy', 'All Gray', 'All Burgundy']
    },
    styling_tips: [
      'Mix different tones and shades for depth',
      'Play with proportions to create visual interest',
      'Add texture through different fabrics and materials',
      'Even shoes and bag should ideally match the color scheme',
      'Monochrome elongates your silhouette for a streamlined look'
    ]
  },
  'vintage-revival': {
    name: 'Vintage Revival',
    icon: TrendingUp,
    color: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-100 to-pink-200 dark:from-rose-900 dark:to-pink-800',
    description: 'Timeless pieces with retro inspiration',
    overview: 'Fashion is cyclical, and vintage-inspired pieces are making a major comeback. This trend celebrates retro silhouettes, classic patterns, and nostalgic details from the \'70s, \'80s, and \'90s, reimagined for modern wardrobes with a fresh, contemporary twist.',
    howToStyle: [
      {
        title: 'Modern Vintage Mix',
        description: 'Pair one vintage or vintage-inspired piece with modern items. A retro printed blouse with contemporary jeans, or vintage-style jeans with a modern crop top.'
      },
      {
        title: '70s Bohemian',
        description: 'Channel \'70s vibes with flared jeans, peasant blouses, and suede accessories. Add modern elements to keep it current, not costume-like.'
      },
      {
        title: '90s Minimalism',
        description: 'Embrace \'90s minimalism with slip dresses, straight-leg jeans, and simple tees. Add contemporary accessories to modernize the look.'
      },
      {
        title: 'Retro Patterns',
        description: 'Incorporate vintage-inspired patterns like paisley, psychedelic prints, or geometric designs, but style them with modern pieces.'
      }
    ],
    keyPieces: [
      'High-waisted wide-leg or flared jeans',
      'Vintage-inspired blazer with strong shoulders',
      'Slip dress or midi dress',
      'Retro printed blouse or shirt',
      'Platform shoes or chunky boots',
      'Vintage-style accessories (headbands, belts, bags)'
    ],
    colorPalette: {
      name: 'Retro-Inspired',
      colors: ['Mustard Yellow', 'Burnt Orange', 'Chocolate Brown', 'Sage Green', 'Dusty Pink', 'Denim Blue']
    },
    styling_tips: [
      'Mix vintage pieces with modern basics to avoid costume look',
      'Thrift stores and vintage shops are treasure troves',
      'Focus on quality vintage pieces that fit well',
      'Update vintage silhouettes with modern styling',
      'Let the vintage piece be the statement, keep everything else simple'
    ]
  }
}

function TrendDetailPage() {
  const { trendId } = Route.useParams()
  const navigate = useNavigate()
  const trend = trendsData[trendId]

  if (!trend) {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Trend not found</p>
          <button
            onClick={() => navigate({ to: '/trends' })}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Trends
          </button>
        </div>
      </div>
    )
  }

  const Icon = trend.icon

  return (
    <div className="bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-0 z-10">
          <button
            onClick={() => navigate({ to: '/trends' })}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Trends
          </button>
        </div>

        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${trend.gradient} p-8 flex flex-col items-center justify-center text-center min-h-[250px]`}>
          <Icon className="w-16 h-16 text-white/90 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{trend.name}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-200">{trend.description}</p>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">What's This Trend About?</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {trend.overview}
            </p>
          </div>

          {/* How to Style */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">How to Style It</h2>
            <div className="space-y-4">
              {trend.howToStyle.map((style, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {style.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {style.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Pieces */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Key Pieces to Own</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trend.keyPieces.map((piece, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                  <span>{piece}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Color Palette */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Color Palette</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{trend.colorPalette.name}</p>
            <div className="flex flex-wrap gap-2">
              {trend.colorPalette.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Styling Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-6 border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Pro Styling Tips</h2>
            </div>
            <ul className="space-y-2">
              {trend.styling_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 pt-0.5">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => navigate({ to: '/outfits/new' })}
              className="py-3 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Shirt className="w-5 h-5" />
              Create Outfit
            </button>
            <button
              onClick={() => navigate({ to: '/calendar' })}
              className="py-3 px-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Plan Outfit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
