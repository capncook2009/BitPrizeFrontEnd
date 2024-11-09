import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqData: FaqItem[] = [
  {
    question:
      "BitPrize claims to be “loss-less” lottery ? There is no free-lunch in finance.",
    answer:
      "How BitPrize works is you pool cash in a smart contract that deposits this pool in one of the safest globally provided yield sources on the Ethereum blockchain. The yield generated is accumulated and distributed to randomly selected 5 users every 2 weeks.",
  },
  {
    question: "Ok, so what are the risks?",
    answer:
      "We deposit assets in battle tested smart contracts securing over $20B usd. Large corporations and banks use these products.",
  },
  {
    question:
      "I have deposited $10 only. Is there a way I can increase my winning odds?",
    answer:
      "To be clear, nothing is assured. But yes since this product was created for financial freedom for a global audience - you can play games and get on the weekly leaderboard. That should help your odds.",
  },
  {
    question: "Can I share the app with my friends? Does that help ?",
    answer: "Yes, the more users you bring helps your odds in weekly prizes.",
  },
  {
    question: "Is BitPrize a bank ?",
    answer:
      "NOOO. We are a modern global fin-tech application that incentivizes savings (yes) but with prizes. We never hold your money.",
  },
];

export default function AccountFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-pt-purple-50">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-pt-purple-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left bg-pt-purple-700 hover:bg-pt-purple-600 flex justify-between items-center"
              onClick={() => toggleFaq(index)}
            >
              <span className="font-medium text-pt-purple-50">
                {faq.question}
              </span>
              <span className="ml-6 text-pt-purple-200">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <div className="px-6 py-4 bg-pt-purple-600">
                <p className="text-pt-purple-300">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
