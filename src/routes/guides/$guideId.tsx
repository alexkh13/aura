import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Shirt, Calendar, Heart } from 'lucide-react'

export const Route = createFileRoute('/guides/$guideId')({ component: GuidePage })

const guidesData: Record<string, {
  title: string
  gradient: string
  description: string
  introduction: string
  sections: { title: string; content: string; tips?: string[] }[]
}> = {
  'white-shirt': {
    title: '5 Ways to Style a White Shirt',
    gradient: 'from-sky-100 to-blue-200 dark:from-sky-900 dark:to-blue-800',
    description: 'Classic versatility',
    introduction: 'The white shirt is the ultimate wardrobe staple. Its timeless appeal and incredible versatility make it a must-have piece that works for any occasion. Here are five stylish ways to wear this classic piece.',
    sections: [
      {
        title: '1. Classic Professional',
        content: 'Pair your white shirt with tailored trousers and a blazer for a polished, professional look. This combination never goes out of style and works perfectly for office settings or business meetings.',
        tips: ['Tuck it in for a sharper silhouette', 'Add a statement watch or simple jewelry', 'Choose well-fitted trousers for the best look']
      },
      {
        title: '2. Casual Chic',
        content: 'Style your white shirt with your favorite jeans and sneakers for an effortlessly cool, casual vibe. Leave a few buttons undone and roll up the sleeves for a relaxed feel.',
        tips: ['Try a half-tuck for a trendy touch', 'Layer with a denim or leather jacket', 'Accessorize with a crossbody bag']
      },
      {
        title: '3. Layered Elegance',
        content: 'Wear your white shirt under a sweater or cardigan, letting the collar peek out for a preppy, layered look that\'s perfect for cooler weather.',
        tips: ['Try different necklines for variety', 'Match your shirt collar with your sweater color', 'Add a delicate necklace over the collar']
      },
      {
        title: '4. Date Night Ready',
        content: 'Elevate your white shirt for evening by pairing it with a sleek skirt or dress pants. Add heels and statement jewelry for a sophisticated dinner look.',
        tips: ['Choose a silky or satin finish for evening', 'Try knotting the shirt at the waist', 'Add bold earrings or a statement necklace']
      },
      {
        title: '5. Weekend Relaxed',
        content: 'For weekend comfort, wear your white shirt oversized with leggings or bike shorts. Add sneakers and a baseball cap for running errands in style.',
        tips: ['Size up for an oversized fit', 'Layer over a sports bra or tank', 'Roll up the sleeves for a casual vibe']
      }
    ]
  },
  'business-casual': {
    title: 'Business Casual Essentials',
    gradient: 'from-slate-100 to-gray-200 dark:from-slate-800 dark:to-gray-700',
    description: 'Professional polish',
    introduction: 'Business casual can be tricky to navigate, but with these essential pieces and styling tips, you\'ll always look professional and polished while maintaining comfort and personal style.',
    sections: [
      {
        title: 'The Foundation Pieces',
        content: 'Start with quality basics: well-fitted dress pants or chinos, tailored blazers, and crisp button-down shirts. These pieces form the backbone of any business casual wardrobe.',
        tips: ['Invest in neutral colors like navy, gray, and black', 'Ensure proper fit - tailoring is worth it', 'Choose quality fabrics that resist wrinkles']
      },
      {
        title: 'Smart Separates',
        content: 'Mix and match blazers with dress pants or skirts. A-line skirts and tailored dresses also work beautifully in business casual settings.',
        tips: ['Keep hemlines at or below the knee', 'Coordinate colors for maximum versatility', 'Add texture with subtle patterns']
      },
      {
        title: 'Footwear Matters',
        content: 'Choose closed-toe shoes like loafers, oxford shoes, or low heels. They should be clean, polished, and in good condition.',
        tips: ['Keep shoes conservative in color', 'Comfort is key for all-day wear', 'Have backup shoes at your desk']
      },
      {
        title: 'Accessorize Professionally',
        content: 'Simple jewelry, a quality watch, and a structured bag complete your business casual look without overwhelming it.',
        tips: ['Keep jewelry minimal and elegant', 'Choose a professional bag that fits your laptop', 'A classic watch adds sophistication']
      },
      {
        title: 'Seasonal Adaptations',
        content: 'Layer appropriately for the season with cardigans, blazers, or light sweaters. In summer, opt for breathable fabrics in professional cuts.',
        tips: ['Keep a blazer at the office year-round', 'Choose breathable, natural fabrics', 'Layer for temperature-controlled offices']
      }
    ]
  },
  'weekend-comfort': {
    title: 'Weekend Comfort Guide',
    gradient: 'from-indigo-100 to-purple-200 dark:from-indigo-900 dark:to-purple-800',
    description: 'Effortless style',
    introduction: 'Weekends are for relaxation, but that doesn\'t mean sacrificing style. These comfortable yet chic outfit ideas will have you looking effortlessly put-together for all your weekend activities.',
    sections: [
      {
        title: 'Elevated Loungewear',
        content: 'Matching sets in soft fabrics like cotton or modal make you look intentional while feeling like you\'re wearing pajamas. Perfect for brunch or coffee runs.',
        tips: ['Choose coordinated sets for a polished look', 'Add sneakers and a crossbody bag', 'Layer with a denim jacket if needed']
      },
      {
        title: 'Denim Done Right',
        content: 'Your favorite jeans paired with a cozy sweater or soft t-shirt is the weekend uniform. Make it special with the right accessories and footwear.',
        tips: ['Try different denim washes', 'Add interest with texture in your top', 'Comfortable shoes are non-negotiable']
      },
      {
        title: 'Casual Dresses',
        content: 'A comfortable t-shirt dress or midi dress with sneakers or sandals is the easiest one-and-done weekend outfit.',
        tips: ['Look for breathable fabrics', 'Belt it for definition if desired', 'Layer with a cardigan or jacket']
      },
      {
        title: 'Athleisure Chic',
        content: 'Leggings or joggers with an oversized sweatshirt or hoodie can look incredibly chic when done right. It\'s all about proportions and quality pieces.',
        tips: ['Balance oversized tops with fitted bottoms', 'Choose elevated athleisure pieces', 'Add a baseball cap for sporty vibes']
      },
      {
        title: 'Transitional Layers',
        content: 'Light jackets, cardigans, and shackets (shirt-jackets) add style and functionality to weekend outfits.',
        tips: ['Keep neutral outerwear for versatility', 'Play with proportions and lengths', 'Don\'t be afraid of oversized fits']
      }
    ]
  },
  'capsule-wardrobe': {
    title: 'Capsule Wardrobe Basics',
    gradient: 'from-emerald-100 to-teal-200 dark:from-emerald-900 dark:to-teal-800',
    description: 'Minimalist approach',
    introduction: 'A capsule wardrobe simplifies your life while maximizing your style. By curating a collection of versatile, high-quality pieces, you\'ll always have something to wear and reduce decision fatigue.',
    sections: [
      {
        title: 'The Essential Tops',
        content: 'Start with 5-7 versatile tops: white t-shirt, black t-shirt, white button-down, striped shirt, neutral sweater, and a dressier blouse.',
        tips: ['Choose quality over quantity', 'Stick to neutral colors', 'Ensure each piece works with multiple bottoms']
      },
      {
        title: 'Bottom Basics',
        content: 'Include classic jeans (dark wash), black pants, neutral chinos, and a versatile skirt. These should mix and match with all your tops.',
        tips: ['Perfect fit is crucial for bottoms', 'Invest in alterations if needed', 'Choose timeless styles over trends']
      },
      {
        title: 'Outerwear Collection',
        content: 'A well-fitted blazer, denim jacket, and weather-appropriate coat are your capsule wardrobe outerwear essentials.',
        tips: ['Choose neutral colors for maximum versatility', 'Consider your climate when selecting', 'Quality outerwear is worth the investment']
      },
      {
        title: 'Shoes & Accessories',
        content: 'Limit yourself to 4-5 pairs of shoes: white sneakers, black shoes (flats or loafers), boots, sandals, and one dressier option. Add a quality bag and minimal jewelry.',
        tips: ['Comfortable, versatile shoes are key', 'One statement bag, one everyday bag', 'Keep jewelry simple and classic']
      },
      {
        title: 'Seasonal Updates',
        content: 'Rotate seasonal items in and out rather than maintaining a huge wardrobe. Store off-season items properly.',
        tips: ['Refresh your capsule each season', 'Add 2-3 trendy pieces per season', 'Donate items you haven\'t worn in a year']
      }
    ]
  },
  'seasonal-transition': {
    title: 'Seasonal Transition Looks',
    gradient: 'from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-800',
    description: 'Weather-ready style',
    introduction: 'Dressing for in-between seasons can be challenging with unpredictable temperatures. These outfit formulas will keep you comfortable and stylish through all weather changes.',
    sections: [
      {
        title: 'Layering Fundamentals',
        content: 'Master the art of layering with lightweight pieces that can be easily added or removed. Think t-shirt, cardigan, and jacket combinations.',
        tips: ['Start with breathable base layers', 'Add layers you can remove easily', 'Carry a light jacket or scarf']
      },
      {
        title: 'Transitional Fabrics',
        content: 'Choose medium-weight fabrics like lightweight knits, chambray, and linen blends that work in varying temperatures.',
        tips: ['Avoid heavy winter or light summer fabrics', 'Cotton blends offer versatility', 'Consider moisture-wicking materials']
      },
      {
        title: 'The Jacket Game',
        content: 'Denim jackets, leather jackets, and lightweight trench coats are perfect transition pieces that add style and warmth.',
        tips: ['Keep a jacket in your car or bag', 'Choose versatile colors', 'Ensure it layers well over other pieces']
      },
      {
        title: 'Versatile Footwear',
        content: 'Ankle boots, loafers, and closed-toe flats work beautifully during seasonal transitions, offering more coverage than sandals but not as heavy as winter boots.',
        tips: ['Choose weather-resistant materials', 'Consider comfort for all-day wear', 'Neutral colors work with everything']
      },
      {
        title: 'Accessory Adaptations',
        content: 'Light scarves, sunglasses, and crossbody bags adapt to changing weather while adding style to your outfits.',
        tips: ['Keep a light scarf in your bag', 'Sunglasses for bright transitional days', 'Choose bags that work day to night']
      }
    ]
  },
  'date-night': {
    title: 'Date Night Outfits',
    gradient: 'from-rose-100 to-pink-200 dark:from-rose-900 dark:to-pink-800',
    description: 'Confident elegance',
    introduction: 'First dates, special occasions, or romantic evenings all call for outfits that make you feel confident and beautiful. Here\'s how to dress for any date night scenario.',
    sections: [
      {
        title: 'Classic Dinner Date',
        content: 'A elegant dress or tailored pants with a silk blouse creates a sophisticated look perfect for upscale restaurants.',
        tips: ['Choose fabrics that drape well', 'Add heels or dressy flats', 'Keep jewelry elegant but not overwhelming']
      },
      {
        title: 'Casual Coffee or Drinks',
        content: 'Smart jeans with a beautiful top strikes the perfect balance between relaxed and put-together for casual dates.',
        tips: ['Dark denim looks more polished', 'Add a blazer for sophistication', 'Comfortable shoes you can walk in']
      },
      {
        title: 'Activity Dates',
        content: 'For active dates like mini-golf or bowling, choose stylish athleisure or fitted jeans with sneakers and a cute top.',
        tips: ['Prioritize comfort and movement', 'Avoid overly dressy pieces', 'Keep jewelry minimal for activities']
      },
      {
        title: 'Special Occasion Romance',
        content: 'For anniversaries or special celebrations, pull out your favorite cocktail dress or dressy jumpsuit.',
        tips: ['Choose something that makes you feel amazing', 'Don\'t sacrifice comfort for style', 'Add statement jewelry or accessories']
      },
      {
        title: 'Confidence Boosters',
        content: 'Whatever the date, wear something that makes you feel like your best self. Confidence is the best accessory.',
        tips: ['Choose colors that make you glow', 'Wear clothes that fit well', 'Don\'t try a completely new style for the first time']
      }
    ]
  }
}

function GuidePage() {
  const { guideId } = Route.useParams()
  const navigate = useNavigate()
  const guide = guidesData[guideId]

  if (!guide) {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Guide not found</p>
          <button
            onClick={() => navigate({ to: '/discover' })}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Discover
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-0 z-10">
          <button
            onClick={() => navigate({ to: '/discover' })}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Discover
          </button>
        </div>

        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${guide.gradient} p-8 flex flex-col items-center justify-center text-center min-h-[250px]`}>
          <Shirt className="w-16 h-16 text-white/90 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{guide.title}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-200">{guide.description}</p>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {guide.introduction}
            </p>
          </div>

          {/* Sections */}
          {guide.sections.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                {section.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {section.content}
              </p>
              {section.tips && section.tips.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Pro Tips:</p>
                  <ul className="space-y-1">
                    {section.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate({ to: '/outfits/new' })}
              className="flex-1 py-3 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Shirt className="w-5 h-5" />
              Create Outfit
            </button>
            <button
              onClick={() => navigate({ to: '/calendar' })}
              className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
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
