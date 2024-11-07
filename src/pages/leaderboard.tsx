import { SECONDS_PER_DAY } from "@shared/utilities";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getMessages } from "src/utils";
import { Layout } from "@components/Layout";

interface LeaderboardPageProps {
  messages: IntlMessages;
}

export const getStaticProps: GetStaticProps<LeaderboardPageProps> = async ({
  locale,
}) => {
  const messages = await getMessages(locale);

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY,
  };
};

export default function LeaderboardPage() {
  const t = useTranslations("Common");

  // Mock data
  const leaderboardData = [
    {
      rank: 1,
      name: "Julia Walkers",
      username: "@juliaw",
      points: 3450,
      avatar: "/doge.png",
    },
    {
      rank: 2,
      name: "Thomas Due",
      username: "@duet",
      points: 3350,
      avatar: "/doge.png",
    },
    {
      rank: 3,
      name: "Mike Grah",
      username: "@mikegrah",
      points: 2920,
      avatar: "/doge.png",
    },
  ];

  return (
    <Layout className="gap-6 lg:gap-8">
      <div className="w-full max-w-md mx-auto space-y-6 px-4 lg:px-0">
        {/* Podium view */}
        <div className="grid grid-cols-3 justify-center items-end gap-4 mt-8">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <div
              key={user.username}
              className={`flex flex-col items-center ${
                index === 1 ? "order-first" : ""
              }`}
            >
              <div
                className={`relative ${
                  index === 0 ? "w-24 h-24" : "w-16 h-16"
                }`}
              >
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <p className="font-medium text-sm mt-2">{user.name}</p>
              <p className="text-sm text-gray-600">{user.points} Point</p>
            </div>
          ))}
        </div>

        {/* List view */}
        <div className="space-y-4 mt-8">
          {leaderboardData.map((user) => (
            <div
              key={user.username}
              className="flex items-center gap-4 bg-white p-3 rounded-lg"
            >
              <span className="w-6 text-gray-500">{user.rank}</span>
              <div className="relative w-10 h-10">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
              <p className="font-medium">{user.points} Point</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
