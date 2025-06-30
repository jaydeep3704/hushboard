"use client"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Share2, Link, MessageSquareMore, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Variants } from "framer-motion"
const cardInfo = [
  {
    title: "Generate Your Link",
    description: "Create your anonymous message board with just one click. Get a unique, shareable link instantly.",
    icon: <Link className="w-6 h-6" />,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-500/10",
    borderColor: "border-violet-200 dark:border-violet-500/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    step: "01",
  },
  {
    title: "Share it Anywhere",
    description:
      "Post your link on social media, send it privately, or share it however you want. Complete flexibility.",
    icon: <Share2 className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
    borderColor: "border-cyan-200 dark:border-cyan-500/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    step: "02",
  },
  {
    title: "Receive Feedback",
    description: "Get honest, anonymous messages instantly. All feedback is completely private and secure.",
    icon: <MessageSquareMore className="w-6 h-6" />,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-200 dark:border-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    step: "03",
  },
]

const HowItWorks = () => {
  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants:Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 dark:from-card dark:to-background relative overflow-hidden"
      id="how-it-works"
    >

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-cyan-100 dark:from-violet-500/10 dark:to-cyan-500/10 border border-violet-200 dark:border-violet-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Simple Process</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Works?
            </span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Get started with anonymous messaging in three simple steps. It's fast, secure, and completely private.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {cardInfo.map((card, i) => (
            <motion.div key={card.title} variants={itemVariants} className="relative group">
              {/* Connecting line for desktop */}
              {i < cardInfo.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 w-6 lg:w-12 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700 z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              )}

              <Card className="relative p-8 h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 hover:border-transparent transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-slate-200/20 dark:group-hover:shadow-slate-900/40 overflow-hidden">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Step number */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-12 h-12 rounded-full ${card.bgColor} border ${card.borderColor} flex items-center justify-center`}
                  >
                    <span className={`text-sm font-bold ${card.iconColor}`}>{card.step}</span>
                  </div>
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${card.bgColor} border ${card.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className={card.iconColor}>{card.icon}</div>
                  </div>

                  {/* Content */}
                  <CardTitle className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-colors duration-300">
                    {card.title}
                  </CardTitle>

                  <CardDescription className="text-base text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-500 dark:group-hover:text-slate-200 transition-colors duration-300">
                    {card.description}
                  </CardDescription>

                  {/* Hover indicator */}
                  <div className="mt-6 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className={card.iconColor}>Learn more</span>
                    <ArrowRight
                      className={`w-4 h-4 ml-2 ${card.iconColor} transform group-hover:translate-x-1 transition-transform duration-300`}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
        >
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Ready to get started? Create your anonymous message board now.
          </p>
          <motion.button
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
