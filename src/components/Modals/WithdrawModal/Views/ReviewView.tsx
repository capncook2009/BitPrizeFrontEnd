import { Vault } from "@generationsoftware/hyperstructure-client-js";
import {
  useToken,
  useVaultSharePrice,
  useVaultTokenAddress,
} from "@generationsoftware/hyperstructure-react-hooks";
import { PrizePoolBadge, TokenIcon } from "@shared/react-components";
import { Token, TokenWithLogo } from "@shared/types";
import { Spinner } from "@shared/ui";
import {
  formatBigIntForDisplay,
  formatNumberForDisplay,
  lower,
} from "@shared/utilities";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useTranslations } from "next-intl";
import { Address } from "viem";
import { NetworkFees, NetworkFeesProps } from "../../NetworkFees";
import {
  withdrawFormShareAmountAtom,
  withdrawFormTokenAddressAtom,
  withdrawFormTokenAmountAtom,
  withdrawZapMinReceivedAtom,
  withdrawZapPriceImpactAtom,
} from "../WithdrawForm";
import { baseSepolia } from "viem/chains";
import { useAccount, useBalance } from "wagmi";
import { getRoundedDownFormattedTokenAmount } from "src/utils";
import { useVaultDataReader } from "@hooks/useVaultDataReader";
import { currentVault } from "@hooks/addresses";

interface ReviewViewProps {
  vault: Vault;
}

export const ReviewView = (props: ReviewViewProps) => {
  const { vault } = props;

  const t_common = useTranslations("Common");
  const t_modals = useTranslations("TxModals");

  const formTokenAddress = useAtomValue(withdrawFormTokenAddressAtom);

  const { data: vaultTokenAddress } = useVaultTokenAddress(vault);

  const isZapping =
    !!vaultTokenAddress &&
    !!formTokenAddress &&
    lower(vaultTokenAddress) !== lower(formTokenAddress);

  const feesToShow: NetworkFeesProps["show"] = isZapping
    ? ["approve", "withdrawWithZap"]
    : ["withdraw"];

  return (
    <div className="flex flex-col gap-6">
      <span className="text-xl font-semibold text-center">
        {t_modals("confirmWithdrawal")}
      </span>
      <PrizePoolBadge
        chainId={vault.chainId}
        hideBorder={true}
        intl={t_common}
        className="!py-1 mx-auto"
      />
      <BasicWithdrawForm vault={vault} />
      <NetworkFees vault={vault} show={feesToShow} />
    </div>
  );
};

interface BasicWithdrawFormProps {
  vault: Vault;
}

const BasicWithdrawForm = (props: BasicWithdrawFormProps) => {
  const { vault } = props;

  const t_txModals = useTranslations("TxModals");

  const formShareAmount = useAtomValue(withdrawFormShareAmountAtom);
  const formTokenAddress = useAtomValue(withdrawFormTokenAddressAtom);
  const formTokenAmount = useAtomValue(withdrawFormTokenAmountAtom);

  // const withdrawZapPriceImpact = useAtomValue(withdrawZapPriceImpactAtom);
  // const withdrawZapMinReceived = useAtomValue(withdrawZapMinReceivedAtom);

  // const { data: vaultTokenAddress } = useVaultTokenAddress(vault);

  const tokenAddress = vault.tokenData?.address; //formTokenAddress ?? vaultTokenAddress;
  const { data: token } = useToken(vault.chainId, tokenAddress!);

  // const { data: share } = useVaultSharePrice(vault);

  // if (!share || !token) {
  //   return <></>;
  // }

  // const shareInfo = {
  //   ...share,
  //   amount: formShareAmount,
  //   logoURI: vault.logoURI,
  // };

  const tokenInfo: any = {
    ...token,
    amount: formTokenAmount,
    logoURI: vault.tokenLogoURI,
  };

  return (
    <div className="w-full flex flex-col">
      {/* <BasicWithdrawFormInput
        token={shareInfo}
        fallbackLogoTokenAddress={vaultTokenAddress}
        className='mb-0.5'
      /> */}
      <BasicWithdrawFormInput token={tokenInfo} className="my-0.5" />
      {true && (
        <div className="flex flex-col p-2 text-xs text-pt-purple-100">
          <div className="flex gap-2 items-center">
            {/* <span className="font-semibold">{t_txModals("priceImpact")}</span> */}
            <span className="h-3 grow border-b border-dashed border-pt-purple-50/30" />
            {/* {withdrawZapPriceImpact !== undefined ? (
              <span>{`${
                withdrawZapPriceImpact > 0 ? "+" : ""
              }${formatNumberForDisplay(withdrawZapPriceImpact, {
                maximumFractionDigits: 2,
              })}%`}</span>
            ) : (
              <Spinner />
            )} */}
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold">
              {/* {t_txModals("minimumReceived")} */}
            </span>
            <span className="h-3 grow border-b border-dashed border-pt-purple-50/30" />
            {/* <span>
              {formatBigIntForDisplay(withdrawZapMinReceived, tokenInfo.decimals, {
                maximumFractionDigits: 5
              })}{' '}
              {tokenInfo.symbol}
            </span> */}
          </div>
        </div>
      )}
    </div>
  );
};

interface BasicWithdrawFormInputProps {
  token: Token & Partial<TokenWithLogo> & { amount: string };
  fallbackLogoTokenAddress?: Address;
  className?: string;
}

// TODO: this should probably include token value like in the main view
const BasicWithdrawFormInput = (props: BasicWithdrawFormInputProps) => {
  const { token, fallbackLogoTokenAddress, className } = props;

  const { address: userAddress } = useAccount();
  const vault: any = currentVault;
  const { userDeposits }: any = useVaultDataReader(userAddress, vault);

  return (
    <div
      className={classNames(
        "bg-pt-transparent p-3 rounded-lg border border-transparent md:p-4",
        className
      )}
    >
      <div className="flex justify-between gap-6">
        <span
          title={token.amount}
          className="text-lg font-semibold bg-transparent text-pt-purple-50 whitespace-nowrap overflow-hidden overflow-ellipsis md:text-2xl"
        >
          {getRoundedDownFormattedTokenAmount(
            userDeposits || 0n,
            token.decimals
          )}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <TokenIcon
            token={{ ...token, logoURI: vault.tokenLogoURI }}
            fallbackToken={{
              chainId: token.chainId,
              address: fallbackLogoTokenAddress,
            }}
          />
          <span className="text-lg font-semibold md:text-2xl">
            {token.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};
