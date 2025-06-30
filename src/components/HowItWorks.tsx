"use client";
import React from "react";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Share2, Link, MessageSquareMore } from "lucide-react";
import { motion } from "framer-motion";

const cardInfo = [
  {
    title: "Generate Your Link",
    description: "Create your anonymous message within one click",
    icon: <Link />,
  },
  {
    title: "Share it anywhere",
    description: "Post your link on social media or share it privately",
    icon: <Share2 />,
  },
  {
    title: "Receive Feedback",
    description: "Get honest, anonymous messages instantly",
    icon: <MessageSquareMore />,
  },
];

const HowItWorks = () => {
  return (
    <section
      className="h-screen mt-10 px-[4%] flex items-center"
      id="how-it-works"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="md:text-6xl text-4xl text-center md:text-start">
          How It Works?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 mt-8">
          {cardInfo.map((card, i) => (
            <motion.div
              key={card.title}
              className="hiw-card"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card className="p-8 hover:scale-[1.03] transition-transform duration-300 ease-in-out">
                <CardTitle className="text-lg md:text-2xl flex justify-between items-center">
                  {card.title}
                  <span>{card.icon}</span>
                </CardTitle>
                <CardDescription className="text-sm md:text-md">
                  {card.description}
                </CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
