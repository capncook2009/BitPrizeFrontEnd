import { Button } from "@shared/ui";
import { SECONDS_PER_DAY } from "@shared/utilities";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { getMessages } from "src/utils";
import { CheckPrizesBanner } from "@components/Account/CheckPrizesBanner";
import { Layout } from "@components/Layout";
import { PrizePoolDisplay } from "@components/Prizes/PrizePoolDisplay";
import { PrizePoolWinners } from "@components/Prizes/PrizePoolWinners";
import { PrizesHeader } from "@components/Prizes/PrizesHeader";
import { useState } from "react";
import { useGameState } from "@hooks/useGameState";

interface PrizesPageProps {
  messages: IntlMessages;
}

export const getStaticProps: GetStaticProps<PrizesPageProps> = async ({
  locale,
}) => {
  const messages = await getMessages(locale);

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY,
  };
};

export default function PrizesPage() {
  const t = useTranslations("Common");

  const [isOpen, setIsOpen] = useState(false);

  const {} = useGameState({ userId: "", initialState: {}, apiEndpoint: "" });

  const openModal = () => {
    setIsOpen(true);
    // Request fullscreen when opening modal
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    // Exit fullscreen when closing modal
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <Layout className="gap-8">
      <CheckPrizesBanner />
      <PrizesHeader />
      <Link href="/vaults" passHref={true}>
        <Button>{t("depositToWin")}</Button>
      </Link>
      {/* display test game card here  */}

      <Button onClick={openModal}>Test Gameplay</Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="w-full h-full relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full hover:bg-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Game container */}
            <iframe
              src="/games/2048/index.html"
              className="w-full h-full border-0"
              allow="fullscreen"
            />
          </div>
        </div>
      )}

      <PrizePoolDisplay className="mt-8" />
      <PrizePoolWinners className="mt-8" />
    </Layout>
  );
}
