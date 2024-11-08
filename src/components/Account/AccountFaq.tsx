import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqData: FaqItem[] = [
  {
    question: "How do I change my password?",
    answer:
      "You can change your password by going to Account Settings and selecting 'Change Password'. Follow the prompts to enter your current password and set a new one.",
  },
  {
    question: "How can I update my email address?",
    answer:
      "To update your email address, navigate to Account Settings, click on 'Email Preferences', and follow the verification process to confirm your new email.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for payment.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "To delete your account, please contact our support team. Note that this action cannot be undone and all your data will be permanently removed.",
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
