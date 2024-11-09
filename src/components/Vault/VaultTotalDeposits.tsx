import { Vault } from "@generationsoftware/hyperstructure-client-js";
import {
  useVaultBalance,
  useVaultShareData,
} from "@generationsoftware/hyperstructure-react-hooks";
import { useVaultDataReader } from "@hooks/useVaultDataReader";
import { TokenAmount, TokenValueAndAmount } from "@shared/react-components";
import { Spinner } from "@shared/ui";
import { formatBigIntForDisplay } from "@shared/utilities";
import classNames from "classnames";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

interface VaultTotalDepositsProps {
  vault: Vault;
  className?: string;
  valueClassName?: string;
  amountClassName?: string;
  totalDeposits?: any;
}

export const VaultTotalDeposits = (props: VaultTotalDepositsProps) => {
  const { vault, className, valueClassName, amountClassName, totalDeposits } =
    props;

  const { data: shareData } = useVaultShareData(vault);

  // if (!isFetchedTotalDeposits) {
  //   return <Spinner />
  // }

  if (!totalDeposits) {
    return <>?</>;
  }

  if (totalDeposits === "0" && !!shareData && shareData.totalSupply > 0n) {
    return (
      <span
        className={classNames("text-xs md:text-sm", className, amountClassName)}
      >
        <TokenAmount
          token={{ ...shareData, amount: shareData.totalSupply }}
          hideZeroes={true}
        />
      </span>
    );
  }

  //@ts-ignore
  const shiftedAmount = formatUnits(totalDeposits, vault.decimals);

  console.log("deposit test ", { shiftedAmount });
  return (
    <span className={classNames("text-pt-purple-200", amountClassName)}>
      {formatBigIntForDisplay(totalDeposits, 18)} {vault.tokenData?.symbol}
    </span>
  );
};
