"use client"
import Image from "next/image";
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks";
import  AnimatedTestimonialsDemo  from "@/components/Testimonials";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {

  const faq = [
    {
      question: "How do I send an anonymous message on Hushboard?",
      answer: "To send an anonymous message, simply visit the unique link provided to you by the person you want to message. Type your message in the box and hit 'Send.' The message will be sent anonymously without revealing your identity."
    },
    {
      question: "Can I see who sent the message to me?",
      answer: "No, messages on Hushboard are completely anonymous. You won't be able to see who sent you the message, ensuring privacy for both parties."
    },
    {
      question: "Can I delete messages or responses I receive?",
      answer: "Yes you can delete messages or responses that you recieve."
    },
    {
      question: "Is there a limit to how many messages I can receive?",
      answer: "No, there is no limit to the number of messages you can receive. You can continue to receive messages as long as your link is active."
    },
    {
      question: "Can I share my link with multiple people?",
      answer: "Yes, you can share your unique link with as many people as you like. Each person who receives the link can send you anonymous messages, and their identity will remain hidden."
    }
  ];
  


  return (
    <div className="">
      <Hero />
      <HowItWorks />
      <AnimatedTestimonialsDemo />

      <section className="py-14 md:py-20 px-[4%]">
        <div className="max-w-5xl mx-auto"> 
        <h1 className="text-4xl md:text-6xl text-center">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="mt-10">
         {
          faq.map((item,index)=>{
            return (
              <AccordionItem value={`item-${index}`} key={item.question}>
              <AccordionTrigger className="md:text-xl text-md">{item.question}</AccordionTrigger>
              <AccordionContent className="md:text-md text-xs">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
       
            )
          })
         }
            </Accordion>

        </div>
        
      </section>
    </div>


  );
}
