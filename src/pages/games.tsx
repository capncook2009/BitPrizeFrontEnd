import { SECONDS_PER_DAY } from "@shared/utilities";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getMessages } from "src/utils";
import { Layout } from "@components/Layout";
import { PlayCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useGameState } from "@hooks/useGameState";

interface ReferralPageProps {
  messages: IntlMessages;
}

// Dummy game data
const dummyGames: any[] = [
  {
    id: "1",
    name: "2048",
    lastScore: 0,
    highScore: 0,
    live: true,
    gameLink: "/games/2048/index.html",
    description:
      "Swipe (Up, Down, Left or Right) to move the tiles. When two tiles with the same number touch, they merge into one.",
    category: "Arcade",
    lastPlayed: "2 hours ago",
    thumbnail:
      "https://img.tapimg.net/market/images/c5aaa3f53d2ab02262899ca3cf3d968c.png/appicon",
  },
  {
    id: "2",
    name: "Puzzle Quest",
    lastScore: 0,
    highScore: 0,
    live: false,
    gameLink: "/games/2048/index.html",
    description: "Mind-bending puzzles and challenges",
    category: "Puzzle",
    thumbnail:
      "https://d1549tni64snpd.cloudfront.net/wp-content/uploads/2022/03/PQ3_752x430.jpg",
    lastPlayed: "1 day ago",
  },
  {
    id: "3",
    name: "Racing Legends",
    lastScore: 0,
    highScore: 0,
    live: false,
    gameLink: "/games/2048/index.html",
    description: "High-speed racing action",
    category: "Racing",
    thumbnail: "https://i.ytimg.com/vi/k33q-lCJfRE/maxresdefault.jpg",
    lastPlayed: "3 days ago",
  },

  {
    id: "6",
    name: "Math Challenge",
    lastScore: 0,
    highScore: 0,
    live: false,
    gameLink: "/games/2048/index.html",
    description: "Test your math skills",
    category: "Educational",
    thumbnail:
      "https://play-lh.googleusercontent.com/_DU2hOQqlZfXvfSly9_aNiBGORZEv0cfyWEl6EMXK-ut9lVeBcs2wktRdKBXa13OvS9J",
    lastPlayed: "5 hours ago",
  },
];

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

  const [currentGame, setCurrGame] = useState("");

  const referralCode = "";
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
  };

  const handleGamePlay = (gameLink) => {
    console.log("game ", gameLink);
    setCurrGame(gameLink);
    openModal();
  };

  const [isOpen, setIsOpen] = useState(false);

  const { gameState, bestScore } = useGameState({
    userId: "",
    initialState: {},
  });

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
    <Layout className="gap-6 lg:gap-8">
      <div className="w-full mx-auto space-y-6 px-4 lg:px-0">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          {/* <div className="w-48 h-48 mx-auto">
            <Image
              src="/partyPopperEmoji.svg"
              alt="Cabana Party Popper Emoji"
              width={300}
              height={300}
              priority={true}
            />
          </div> */}
          <h1 className="text-2xl font-bold">Play & Increase your chance</h1>
          <p className="text-gray-600 text-sm">
            {/* Share the code with a friend and be eligible for $20 coupon with
            referral program */}
          </p>
        </div>

        {/* Referral Code Section */}
        {/* <div className="rounded-lg border bg-gray-50 shadow-sm p-4">
          <div className="flex items-center justify-between bg-white rounded-lg border p-2">
            <span className="font-mono text-lg">{referralCode}</span>
            <button
              onClick={handleCopy}
              className="bg-pt-purple-500 text-white px-6 py-2 rounded-lg hover:bg-pt-purple-400 transition-colors"
            >
              Copy
            </button>
          </div>
        </div> */}

        {/* Claimed Section */}
        {/* <div className="space-y-4">
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
        </div> */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dummyGames.map((game, index) => (
            <div
              key={game.id}
              className="group overflow-hidden rounded-xl bg-pt-purple-600 shadow-sm transition-all hover:shadow-lg"
            >
              {/* Game Thumbnail with Overlay */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-0 w-full p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm sm:text-sm">
                        {game.category}
                      </span>
                      <RatingStars rating={game.rating} />
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Game Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {game.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {game.description}
                  </p>
                </div>

                {/* Scores */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
                    <p className="text-xs text-gray-500">Last Score</p>
                    <p className="text-sm font-semibold text-gray-900 sm:text-base">
                      {index === 0
                        ? gameState?.score
                        : game.lastScore.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-indigo-50 p-2 sm:p-3">
                    <p className="text-xs text-indigo-600">High Score</p>
                    <p className="text-sm font-semibold text-indigo-600 sm:text-base">
                      {index === 0
                        ? bestScore
                        : game.highScore.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 sm:text-sm">
                    {/* {game.lastPlayed} */}
                  </span>
                  <button
                    onClick={() => handleGamePlay(game.gameLink)}
                    disabled={!game.live}
                    className="flex items-center space-x-1 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{game.live ? "Play" : "Arriving soon"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              src={currentGame}
              className="w-full h-full border-0"
              allow="fullscreen"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
