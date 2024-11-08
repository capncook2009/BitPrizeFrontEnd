import { Vault } from "@generationsoftware/hyperstructure-client-js";
import {
  useSelectedVault,
  useTokenPermitSupport,
  useVaultExchangeRate,
  useVaultTokenData,
} from "@generationsoftware/hyperstructure-react-hooks";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import {
  MODAL_KEYS,
  useIsModalOpen,
  useMiscSettings,
} from "@shared/generic-react-hooks";
import { createDepositTxToast } from "@shared/react-components";
import { Modal } from "@shared/ui";
import { LINKS, lower } from "@shared/utilities";
import classNames from "classnames";
import { useAtom, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { ReactNode, useMemo, useState } from "react";
import { walletSupportsPermit } from "src/utils";
import { TransactionReceipt } from "viem";
import { useAccount } from "wagmi";
import { useSupportedPrizePools } from "@hooks/useSupportedPrizePools";
import {
  depositFormShareAmountAtom,
  depositFormTokenAddressAtom,
  depositFormTokenAmountAtom,
} from "./DepositForm";
import { DepositTxButton } from "./DepositTxButton";
import { DepositWithPermitTxButton } from "./DepositWithPermitTxButton";
import { DepositZapTxButton } from "./DepositZapTxButton";
import { ConfirmingView } from "./Views/ConfirmingView";
import { ErrorView } from "./Views/ErrorView";
import { MainView } from "./Views/MainView";
import { ReviewView } from "./Views/ReviewView";
import { SuccessView } from "./Views/SuccessView";
import { WaitingView } from "./Views/WaitingView";

export type DepositModalView =
  | "main"
  | "review"
  | "waiting"
  | "confirming"
  | "success"
  | "error";

export interface DepositModalProps {
  onClose?: () => void;
  refetchUserBalances?: () => void;
  onSuccessfulApproval?: () => void;
  onSuccessfulDeposit?: (
    chainId: number,
    txReceipt: TransactionReceipt
  ) => void;
  onSuccessfulDepositWithPermit?: (
    chainId: number,
    txReceipt: TransactionReceipt
  ) => void;
  onSuccessfulDepositWithZap?: (
    chainId: number,
    txReceipt: TransactionReceipt
  ) => void;
}

export const DepositModal = (props: DepositModalProps) => {
  const {
    onClose,
    refetchUserBalances,
    onSuccessfulApproval,
    onSuccessfulDeposit,
    onSuccessfulDepositWithPermit,
    onSuccessfulDepositWithZap,
  } = props;

  const t_toasts = useTranslations("Toasts.transactions");

  const { connector } = useAccount();

  const addRecentTransaction = useAddRecentTransaction();

  const { vault } = useSelectedVault();

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.deposit, {
    onClose,
  });

  const [view, setView] = useState<DepositModalView>("main");

  const [depositTxHash, setDepositTxHash] = useState<string>();

  const [formTokenAddress, setFormTokenAddress] = useAtom(
    depositFormTokenAddressAtom
  );
  const setFormTokenAmount = useSetAtom(depositFormTokenAmountAtom);
  const setFormShareAmount = useSetAtom(depositFormShareAmountAtom);

  const { data: vaultToken } = useVaultTokenData(vault!);

  const { data: tokenPermitSupport } = useTokenPermitSupport(
    vault?.chainId!,
    formTokenAddress ?? vaultToken?.address!
  );

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault!);

  const { isActive: isPermitDepositsDisabled } = useMiscSettings(
    "permitDepositsDisabled"
  );

  const prizePools = useSupportedPrizePools();

  const prizePool = useMemo(() => {
    if (!!vault) {
      return Object.values(prizePools).find(
        (prizePool) => prizePool.chainId === vault.chainId
      );
    }
  }, [prizePools, vault]);

  const createToast = () => {
    if (!!vault && !!depositTxHash && view === "confirming") {
      createDepositTxToast({
        vault: vault,
        txHash: depositTxHash,
        addRecentTransaction,
        refetchUserBalances,
        intl: t_toasts,
      });
    }
  };

  const handleClose = () => {
    createToast();
    setIsModalOpen(false);
    setView("main");
    setFormTokenAddress(undefined);
    setFormTokenAmount("");
    setFormShareAmount("");
  };

  if (isModalOpen && !!vault) {
    const modalViews: Record<DepositModalView, ReactNode> = {
      main: <MainView vault={vault} prizePool={prizePool!} />,
      review: <ReviewView vault={vault} prizePool={prizePool!} />,
      waiting: <WaitingView vault={vault} closeModal={handleClose} />,
      confirming: (
        <ConfirmingView
          vault={vault}
          txHash={depositTxHash}
          closeModal={handleClose}
        />
      ),
      success: <SuccessView vault={vault} txHash={depositTxHash} />,
      error: <ErrorView setModalView={setView} />,
    };

    const isZapping =
      !!vaultToken &&
      !!formTokenAddress &&
      lower(vaultToken.address) !== lower(formTokenAddress);

    const modalFooterContent = !!vaultExchangeRate ? (
      <div
        className={classNames("flex flex-col items-center gap-6", {
          hidden: view !== "main" && view !== "review",
        })}
      >
        {isZapping ? (
          <DepositZapTxButton
            vault={vault}
            modalView={view}
            setModalView={setView}
            setDepositTxHash={setDepositTxHash}
            refetchUserBalances={refetchUserBalances}
            onSuccessfulApproval={onSuccessfulApproval}
            onSuccessfulDepositWithZap={onSuccessfulDepositWithZap}
          />
        ) : tokenPermitSupport === "eip2612" &&
          walletSupportsPermit(connector?.id) &&
          !isPermitDepositsDisabled ? (
          <DepositWithPermitTxButton
            vault={vault}
            modalView={view}
            setModalView={setView}
            setDepositTxHash={setDepositTxHash}
            refetchUserBalances={refetchUserBalances}
            onSuccessfulDeposit={onSuccessfulDeposit}
            onSuccessfulDepositWithPermit={onSuccessfulDepositWithPermit}
          />
        ) : (
          <DepositTxButton
            vault={vault}
            modalView={view}
            setModalView={setView}
            setDepositTxHash={setDepositTxHash}
            refetchUserBalances={refetchUserBalances}
            onSuccessfulApproval={onSuccessfulApproval}
            onSuccessfulDeposit={onSuccessfulDeposit}
          />
        )}
        {/* {view === 'review' && <DepositDisclaimer vault={vault} />} */}
      </div>
    ) : undefined;

    return (
      <Modal
        bodyContent={modalViews[view]}
        footerContent={modalFooterContent}
        onClose={handleClose}
        label="deposit-flow"
        mobileStyle="tab"
        className="isolate"
        bodyClassName="z-10"
      />
    );
  }

  return <></>;
};

interface DepositDisclaimerProps {
  vault: Vault;
}

const DepositDisclaimer = (props: DepositDisclaimerProps) => {
  const { vault } = props;

  const t_modals = useTranslations("TxModals");

  return (
    <span className="text-xs text-pt-purple-100 px-6">
      {t_modals.rich("depositDisclaimer", {
        tosLink: (chunks) => (
          <a
            href={LINKS.termsOfService}
            target="_blank"
            className="text-pt-purple-300"
          >
            {chunks}
          </a>
        ),
        vaultLink: (chunks) => (
          <a
            href={`/vault/${vault.chainId}/${vault.address}`}
            target="_blank"
            className="text-pt-purple-300"
          >
            {chunks}
          </a>
        ),
      })}
    </span>
  );
};
