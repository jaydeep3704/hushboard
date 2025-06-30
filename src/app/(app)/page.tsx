"use server"
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks";
import { Faqs } from "@/components/Faqs";

export default async function Home() {


  return (
    <div >
      <Hero />
      <HowItWorks />
      <Faqs/>
    </div>
  );
}
