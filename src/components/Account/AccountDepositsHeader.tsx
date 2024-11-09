import { CurrencyValue } from "@shared/react-components";
import { Spinner } from "@shared/ui";
import { lower, NETWORK, shorten } from "@shared/utilities";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { Address, formatUnits } from "viem";
import { useAccount, useEnsName } from "wagmi";
import { WALLET_NAMES } from "@constants/config";
import { useUserTotalBalance } from "@hooks/useUserTotalBalance";
import { useVaultDataReader } from "@hooks/useVaultDataReader";
import { currentVault } from "@hooks/addresses";

interface AccountDepositsHeaderProps {
  address?: Address;
  className?: string;
}

export const AccountDepositsHeader = (props: AccountDepositsHeaderProps) => {
  const { address, className } = props;

  const t = useTranslations("Account");

  const { address: _userAddress } = useAccount();
  const userAddress = address ?? _userAddress;

  const vault: any = currentVault;
  const { userDeposits }: any = useVaultDataReader(userAddress, vault);

  const {
    data: totalBalance,
    isFetched: isFetchedTotalBalance,
    userData,
  } = useUserTotalBalance(userAddress!);

  const { data: ensName } = useEnsName({
    chainId: NETWORK.mainnet,
    address: userAddress,
  });

  return (
    <div
      className={classNames(
        "flex flex-col items-center gap-1 md:gap-2",
        className
      )}
    >
      <span className="text-sm text-pt-purple-100 md:text-base">
        {/* {isExternalUser
          ? t("externalAccountDeposits", {
              account:
                WALLET_NAMES[lower(address)]?.name ??
                ensName ??
                shorten(address),
            })
          : t("yourDeposits")} */}
        {t("yourDeposits")}
      </span>

      <span className="text-[1.75rem] font-grotesk font-medium md:text-4xl">
        {!!userAddress && userDeposits !== undefined ? (
          formatUnits(userDeposits, 18)
        ) : (
          <Spinner />
        )}{" "}
        USDC
      </span>

      <span className="text-sm text-pt-purple-100 md:text-base">
        Collected Points
      </span>
      <span className="text-[1.75rem] font-grotesk font-medium md:text-4xl">
        {!userData?.points ? 0 : userData?.points}
      </span>
    </div>
  );
};
