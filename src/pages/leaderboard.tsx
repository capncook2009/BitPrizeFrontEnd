import { SECONDS_PER_DAY } from "@shared/utilities";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { getMessages } from "src/utils";
import { Layout } from "@components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_API_URL } from "@constants/config";
import { useAccount } from "wagmi";

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

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const { address } = useAccount();

  useEffect(() => {
    async function load() {
      const res = await axios.get(
        `${BACKEND_API_URL}/api/bitprize/getLeaderboard`
      );
      const data = res.data;

      setLeaderboard(data?.result);
    }

    load();
  }, [address]);

  return (
    <Layout className="gap-6 lg:gap-8">
      <div className="w-full max-w-md mx-auto space-y-6 px-4 lg:px-0">
        {/* Podium view */}
        <div className="grid grid-cols-3 justify-center items-end gap-4 mt-8">
          {leaderboard.slice(0, 3).map((user, index) => (
            <div
              key={user?.username}
              className={`flex flex-col items-center ${
                index === 1 ? "order-first" : ""
              }`}
            >
              <div
                className={`relative ${
                  index === 0 ? "w-24 h-24" : "w-16 h-16"
                }`}
              >
                <img
                  src={user?.profilePic}
                  alt={user.name}
                  className="rounded-full object-cover"
                />
              </div>
              <p className="font-medium text-sm mt-2">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.points} Point</p>
            </div>
          ))}
        </div>

        {/* List view */}
        <div className="space-y-4 mt-8">
          {leaderboard.map((user) => (
            <div
              key={user.username}
              className="flex items-center gap-4 bg-white p-3 rounded-lg"
            >
              <span className="w-6 text-gray-500">{user.rank}</span>
              <div className="relative w-10 h-10">
                <img
                  src={user.profilePic}
                  alt={user.name}
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
