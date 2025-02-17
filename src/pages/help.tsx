import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I download my purchased items?",
      answer:
        "After completing your purchase, go to your Orders page. You'll find download links for all your purchased items there.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards (Visa, MasterCard, American Express) and PayPal. All transactions are processed securely through Stripe.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all purchases. Contact our support team to process your refund.",
    },
    {
      question: "How do I become a seller?",
      answer:
        "To become a seller, log in to your account and visit the Seller Dashboard. You'll need to complete your profile and agree to our seller terms.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "We support most common digital file formats including PDF, PSD, AI, EPS, JPG, PNG, and ZIP archives.",
    },
  ];

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search help articles..." />
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        {[
          {
            title: "Getting Started",
            description: "Learn the basics of using our platform",
          },
          {
            title: "Buying Guide",
            description: "How to purchase and download products",
          },
          {
            title: "Seller Guide",
            description: "Start selling your digital products",
          },
          {
            title: "Account & Security",
            description: "Manage your account settings",
          },
        ].map((category) => (
          <Button
            key={category.title}
            variant="outline"
            className="h-auto p-4 flex flex-col items-start space-y-2"
          >
            <span className="text-lg font-semibold">{category.title}</span>
            <span className="text-sm text-muted-foreground">
              {category.description}
            </span>
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
