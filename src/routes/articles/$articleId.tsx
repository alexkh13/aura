import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Sparkles, BookOpen, Lightbulb } from 'lucide-react'

export const Route = createFileRoute('/articles/$articleId')({ component: ArticlePage })

const articlesData: Record<string, {
  title: string
  gradient: string
  category: string
  introduction: string
  mainContent: { subtitle: string; text: string }[]
  keyTakeaways: string[]
}> = {
  'color-coordination': {
    title: 'Color Coordination 101',
    gradient: 'from-violet-100 to-purple-200 dark:from-violet-900 dark:to-purple-800',
    category: 'Basics',
    introduction: 'Understanding color coordination is fundamental to creating cohesive, stylish outfits. Learn the basics of color theory and how to apply them to your wardrobe for effortlessly beautiful combinations.',
    mainContent: [
      {
        subtitle: 'The Color Wheel Basics',
        text: 'The color wheel is your best friend when learning color coordination. Primary colors (red, blue, yellow) mix to create secondary colors (green, orange, purple), which combine to form tertiary colors. Understanding these relationships helps you create harmonious outfits.'
      },
      {
        subtitle: 'Complementary Colors',
        text: 'Colors opposite each other on the color wheel create dynamic, eye-catching combinations. Think blue and orange, or purple and yellow. These pairings create visual interest and make both colors pop.'
      },
      {
        subtitle: 'Analogous Colors',
        text: 'Colors next to each other on the color wheel create harmonious, pleasing combinations. Blue, blue-green, and green work beautifully together, as do red, orange, and yellow. These combinations feel natural and cohesive.'
      },
      {
        subtitle: 'Neutral Foundation',
        text: 'Black, white, gray, beige, and navy are your neutral foundations. They pair with almost everything and help balance bolder color choices. Build your outfits around neutral bases and add pops of color strategically.'
      },
      {
        subtitle: 'The 60-30-10 Rule',
        text: 'Use 60% of a dominant color, 30% of a secondary color, and 10% of an accent color. This creates visual balance and prevents your outfit from feeling overwhelming or chaotic.'
      },
      {
        subtitle: 'Consider Your Skin Tone',
        text: 'Certain colors naturally complement different skin tones. Warm undertones glow in earthy colors like olive, rust, and warm browns. Cool undertones shine in jewel tones like sapphire, emerald, and ruby.'
      }
    ],
    keyTakeaways: [
      'Start with neutrals and add one or two accent colors',
      'Use the color wheel to find complementary or analogous combinations',
      'Apply the 60-30-10 rule for balanced outfits',
      'Consider your skin tone when choosing colors',
      'Don\'t be afraid to experiment with unexpected combinations'
    ]
  },
  'accessorize-pro': {
    title: 'Accessorize Like a Pro',
    gradient: 'from-fuchsia-100 to-pink-200 dark:from-fuchsia-900 dark:to-pink-800',
    category: 'Tips',
    introduction: 'Accessories have the power to transform any outfit from basic to extraordinary. Master the art of accessorizing to elevate your style and express your personality through the perfect finishing touches.',
    mainContent: [
      {
        subtitle: 'The Power of Statement Pieces',
        text: 'One bold accessory can make your entire outfit. Whether it\'s oversized earrings, a chunky necklace, or a statement bag, let one piece take center stage while keeping other accessories minimal.'
      },
      {
        subtitle: 'Jewelry Layering',
        text: 'Mix different necklace lengths, stack rings, and combine bracelets for a curated, personal look. Vary textures and sizes while maintaining a cohesive metal tone (gold, silver, or mixed metals).'
      },
      {
        subtitle: 'Bag Selection Strategy',
        text: 'Your bag should complement your outfit without competing with it. Match formality levels: structured bags for professional settings, slouchy bags for casual outings, and clutches for evening events.'
      },
      {
        subtitle: 'Scarf Styling',
        text: 'Scarves add color, pattern, and texture to any outfit. Wear them around your neck, tied to your bag, as a headband, or even as a belt. They\'re incredibly versatile accessories.'
      },
      {
        subtitle: 'Belt It Right',
        text: 'Belts define your waist and add structure to loose-fitting pieces. Use them over dresses, cardigans, or blazers to create shape and visual interest.'
      },
      {
        subtitle: 'Footwear as an Accessory',
        text: 'Shoes can make or break an outfit. They set the tone: sneakers for casual, heels for dressy, boots for edge. Choose them thoughtfully as you would any other accessory.'
      }
    ],
    keyTakeaways: [
      'Let one statement piece be the focal point',
      'Layer jewelry thoughtfully for dimension',
      'Match your bag to the occasion and outfit formality',
      'Scarves are versatile and add instant style',
      'Use belts to create shape and structure'
    ]
  },
  'mix-match-patterns': {
    title: 'Mix and Match Patterns',
    gradient: 'from-cyan-100 to-blue-200 dark:from-cyan-900 dark:to-blue-800',
    category: 'Advanced',
    introduction: 'Pattern mixing is an advanced styling technique that adds depth and personality to your outfits. Once you understand the rules, you can confidently combine different patterns for sophisticated, fashion-forward looks.',
    mainContent: [
      {
        subtitle: 'Start with Similar Colors',
        text: 'The easiest way to mix patterns is by keeping the color palette consistent. When your stripes and florals share the same colors, they naturally coordinate even though the patterns differ.'
      },
      {
        subtitle: 'Vary Pattern Scale',
        text: 'Combine patterns of different sizes: pair large florals with small polka dots, or wide stripes with thin pinstripes. This contrast creates visual interest without overwhelming the eye.'
      },
      {
        subtitle: 'The Neutral Buffer',
        text: 'Use solid neutrals to separate busy patterns. A solid blazer over a striped shirt and printed pants, or solid shoes with patterned clothing creates breathing room and balance.'
      },
      {
        subtitle: 'Stick to Two or Three Patterns',
        text: 'Limit yourself to two or three patterns per outfit when starting out. More than that requires advanced skill and can easily look chaotic rather than intentional.'
      },
      {
        subtitle: 'Classic Pattern Combinations',
        text: 'Some patterns naturally complement each other: stripes with florals, plaids with stripes, polka dots with florals, or animal prints with geometric patterns.'
      },
      {
        subtitle: 'Let One Pattern Dominate',
        text: 'Choose one pattern as your dominant piece and let others play supporting roles. This creates hierarchy and prevents visual competition between patterns.'
      }
    ],
    keyTakeaways: [
      'Keep colors consistent when mixing patterns',
      'Vary the scale of patterns for balance',
      'Use neutral solids as buffers between patterns',
      'Start with two patterns before adding more',
      'Let one pattern be the star of your outfit'
    ]
  },
  'body-type-guide': {
    title: 'Dress for Your Body Type',
    gradient: 'from-lime-100 to-green-200 dark:from-lime-900 dark:to-green-800',
    category: 'Guide',
    introduction: 'Understanding your body type helps you choose clothes that flatter your natural shape and make you feel confident. This isn\'t about following strict rules, but about understanding proportion and balance.',
    mainContent: [
      {
        subtitle: 'Understanding Body Types',
        text: 'Common body types include pear, apple, hourglass, rectangle, and inverted triangle. Each has unique characteristics, but remember: these are guidelines, not limitations. The goal is to dress in ways that make you feel great.'
      },
      {
        subtitle: 'Creating Balance',
        text: 'The key to flattering dressing is creating visual balance. If you\'re top-heavy, balance with slightly wider leg pants. If you\'re bottom-heavy, draw attention upward with interesting necklines and details.'
      },
      {
        subtitle: 'Emphasize Your Favorite Features',
        text: 'Rather than hiding what you don\'t love, highlight what you do. Love your legs? Show them off. Proud of your shoulders? Wear off-shoulder or sleeveless styles. Confidence is the most flattering thing you can wear.'
      },
      {
        subtitle: 'The Power of Fit',
        text: 'Proper fit matters more than body type. Clothes that are too tight or too loose won\'t flatter anyone. Invest in tailoring for a custom fit, especially for key pieces like blazers and pants.'
      },
      {
        subtitle: 'Vertical Lines and Proportions',
        text: 'Vertical lines elongate, while horizontal lines widen. Use this knowledge strategically. Monochromatic outfits create long, lean lines. Breaking up your outfit with different colors creates proportion.'
      },
      {
        subtitle: 'Experiment and Evolve',
        text: 'Your body type doesn\'t dictate what you can wear. These guidelines are starting points. Try different styles, take photos, and see what makes you feel amazing. Your comfort and confidence matter most.'
      }
    ],
    keyTakeaways: [
      'Body type guidelines are suggestions, not rules',
      'Focus on creating visual balance in your outfits',
      'Emphasize features you love instead of hiding others',
      'Proper fit is more important than following body type rules',
      'Confidence and comfort should guide your choices'
    ]
  },
  'sustainable-fashion': {
    title: 'Sustainable Fashion Tips',
    gradient: 'from-teal-100 to-cyan-200 dark:from-teal-900 dark:to-cyan-800',
    category: 'Eco',
    introduction: 'Fashion can be both stylish and sustainable. By making mindful choices about what we buy, how we care for our clothes, and how we dispose of them, we can reduce our environmental impact while still loving what we wear.',
    mainContent: [
      {
        subtitle: 'Quality Over Quantity',
        text: 'Invest in well-made pieces that will last years rather than buying cheap, trendy items that fall apart quickly. Higher quality items have a lower cost-per-wear and create less waste over time.'
      },
      {
        subtitle: 'Shop Secondhand First',
        text: 'Thrift stores, consignment shops, and online resale platforms offer treasure troves of unique pieces. Buying secondhand reduces demand for new production and keeps clothes out of landfills.'
      },
      {
        subtitle: 'Care for Your Clothes',
        text: 'Proper care extends garment life significantly. Wash less frequently, use cold water, air dry when possible, and repair items instead of replacing them. Small holes and loose buttons are easily fixed.'
      },
      {
        subtitle: 'Choose Sustainable Materials',
        text: 'Look for organic cotton, linen, hemp, Tencel, and recycled materials. These fabrics have lower environmental impacts than conventional cotton or synthetic materials derived from petroleum.'
      },
      {
        subtitle: 'Support Ethical Brands',
        text: 'Research brands\' labor practices and environmental commitments. Many companies now prioritize fair wages, safe working conditions, and eco-friendly production methods. Your dollars vote for the future you want.'
      },
      {
        subtitle: 'Rent or Swap for Special Occasions',
        text: 'For events requiring special attire, consider renting instead of buying something you\'ll wear once. Organize clothing swaps with friends to refresh your wardrobe without buying new items.'
      }
    ],
    keyTakeaways: [
      'Buy fewer, higher-quality pieces that last longer',
      'Shop secondhand to reduce environmental impact',
      'Care for clothes properly to extend their life',
      'Choose sustainable and ethical brands when buying new',
      'Consider renting or swapping for special occasions'
    ]
  },
  'confidence-style': {
    title: 'Building Confidence Through Style',
    gradient: 'from-orange-100 to-amber-200 dark:from-orange-900 dark:to-amber-800',
    category: 'Mindset',
    introduction: 'Personal style is a powerful tool for building confidence and self-expression. When you feel good in what you\'re wearing, it shows in how you carry yourself and interact with the world.',
    mainContent: [
      {
        subtitle: 'Define Your Personal Style',
        text: 'Discover what makes you feel most like yourself. Create a vision board, save inspiring images, and identify common themes. Your personal style should reflect who you are, not who you think you should be.'
      },
      {
        subtitle: 'The Psychology of Color',
        text: 'Colors affect mood and perception. Wear bold reds when you need energy and confidence, calming blues for important meetings, or powerful blacks for sophistication. Notice how different colors make you feel.'
      },
      {
        subtitle: 'Dress for the Day Ahead',
        text: 'Consider your schedule when choosing outfits. Dress slightly more polished than necessary for confidence boosts. Even on work-from-home days, getting dressed intentionally affects your mindset and productivity.'
      },
      {
        subtitle: 'Comfort Equals Confidence',
        text: 'You can\'t feel confident if you\'re uncomfortable. Choose clothes that fit well, don\'t restrict movement, and make you feel at ease. Style should enhance your life, not complicate it.'
      },
      {
        subtitle: 'Develop Your Signature',
        text: 'A signature element—whether it\'s always wearing interesting earrings, rocking red lipstick, or collecting unique jackets—makes you memorable and reinforces your personal brand.'
      },
      {
        subtitle: 'Practice Self-Compassion',
        text: 'Fashion is about experimentation and evolution. Not every outfit will be a winner, and that\'s okay. Learn from what doesn\'t work and celebrate what does. Be kind to yourself in the process.'
      }
    ],
    keyTakeaways: [
      'Your personal style should reflect your authentic self',
      'Use color psychology to boost confidence strategically',
      'Dress intentionally even for ordinary days',
      'Prioritize comfort—it\'s essential for confidence',
      'Be patient and compassionate with yourself as you explore style'
    ]
  }
}

function ArticlePage() {
  const { articleId } = Route.useParams()
  const navigate = useNavigate()
  const article = articlesData[articleId]

  if (!article) {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Article not found</p>
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
        <div className={`bg-gradient-to-br ${article.gradient} p-8 flex flex-col items-center justify-center text-center min-h-[250px]`}>
          <Sparkles className="w-16 h-16 text-white/90 mb-4" />
          <div className="inline-block bg-white/20 dark:bg-black/20 px-3 py-1 rounded-full mb-3">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{article.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{article.title}</h1>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {article.introduction}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          {article.mainContent.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                {section.subtitle}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-6 border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Key Takeaways</h2>
            </div>
            <ul className="space-y-3">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 pt-0.5">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ready to put these tips into practice?
            </p>
            <button
              onClick={() => navigate({ to: '/outfits/new' })}
              className="py-3 px-6 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
            >
              Create Your Outfit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
