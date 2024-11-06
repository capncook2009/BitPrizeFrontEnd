import { useTranslations } from "next-intl";

export const VaultsHeader = () => {
  const t = useTranslations("Vaults");

  return (
    <div className="text-center text-[1.75rem] font-grotesk font-bold md:text-4xl lg:text-5xl">
      {/* {t.rich('depositAndWin', {
        highlight: (chunks) => <span className='text-pt-teal'>{chunks}</span>
      })} */}
      <div className="flex flex-col items-center text-center mb-6 z-10 md:mt-6 md:mb-10">
        <h2 className="text-3xl font-medium md:text-5xl">
          Deposit Cash | Win Prizes
        </h2>
        {/* <h3 className='md:text-xl'>
            BitPrize is the first Bitcoin-native savings game. Deposit your BTC, earn yield, and get
            a chance to win big prizes - all without risking your principal. .
          </h3> */}
      </div>
    </div>
  );
};
