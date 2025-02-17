import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I download my purchased items?",
      answer:
        "After completing your purchase, go to your Orders page where you'll find download links for all your purchased items.",
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
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
