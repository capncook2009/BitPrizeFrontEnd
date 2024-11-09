import { SECONDS_PER_DAY } from "@shared/utilities";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getMessages } from "src/utils";
import { Layout } from "@components/Layout";
import ConfettiExplosion from "react-confetti-explosion";
import { useState } from "react";
import { useAccount } from "wagmi";

interface ReferralPageProps {
  messages: IntlMessages;
}

export const getStaticProps: GetStaticProps<ReferralPageProps> = async ({
  locale,
}) => {
  const messages = await getMessages(locale);

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY,
  };
};

export default function ReferralPage() {
  const t = useTranslations("Common");
  const [isExploding, setIsExploding] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { address } = useAccount();

  const referralCode = "2389HDFHRH";
  const claimedReferrals = [
    {
      date: "16 AUG 2023",
      entries: [
        { name: "Jhon doe", time: "11:07:32", amount: 20 },
        { name: "Jane Smith", time: "10:01:12", amount: 20 },
      ],
    },
    {
      date: "14 AUG 2023",
      entries: [{ name: "Gota Sa", time: "14:01:12", amount: 20 }],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setIsExploding(true);
    setIsCopied(true);

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Layout className="gap-6 lg:gap-8">
      <div className="w-full max-w-md mx-auto space-y-6 px-4 lg:px-0">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Refer & Earn</h1>
          <p className="text-gray-600 text-sm">
            Share the code with a friend and be eligible for $20 coupon with
            referral program
          </p>
        </div>

        {/* Referral Code Section */}
        <div className="rounded-lg border bg-gray-50 shadow-sm p-4">
          <div className="flex items-center justify-between bg-white rounded-lg border p-2">
            <span className="font-mono text-lg">{referralCode}</span>
            <div className="relative">
              {isExploding && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <ConfettiExplosion
                    force={0.6}
                    duration={2000}
                    particleCount={50}
                    width={1000}
                  />
                </div>
              )}
              <button
                onClick={handleCopy}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isCopied
                    ? "bg-green-500 hover:bg-green-400"
                    : "bg-pt-purple-500 hover:bg-pt-purple-400"
                } text-white`}
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Claimed Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Claimed</h2>
            <span className="text-sm text-gray-500">Coupon total: $60</span>
          </div>

          {claimedReferrals.map((dateGroup, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm text-gray-500">{dateGroup.date}</div>
              {dateGroup.entries.map((entry, entryIndex) => (
                <div
                  key={entryIndex}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-gray-500">{entry.time}</div>
                  </div>
                  <div className="font-semibold">${entry.amount}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
