import { Vault } from "@generationsoftware/hyperstructure-client-js";
import {
  // useSendApproveTransaction,
  useSendDepositTransaction,
  // useTokenAllowance,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  // useVaultTokenData,
} from "@generationsoftware/hyperstructure-react-hooks";
import {
  useAddRecentTransaction,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { ApprovalTooltip, TransactionButton } from "@shared/react-components";
import { Button } from "@shared/ui";
import { useAtomValue } from "jotai";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Address, parseUnits, TransactionReceipt } from "viem";
import { useAccount, useBalance } from "wagmi";
import { DepositModalView } from ".";
import { isValidFormInput } from "../TxFormInput";
import { depositFormTokenAmountAtom } from "./DepositForm";
import { currentVault } from "@hooks/addresses";
import { useTokenAllowance } from "@hooks/useTokenAllowance";
import { useApprove } from "@hooks/useApprove";
import { useVaultDeposit } from "@hooks/useVaultDeposit";
import { useVaultDataReader } from "@hooks/useVaultDataReader";

interface DepositTxButtonProps {
  vault: Vault;
  modalView: string;
  setModalView: (view: DepositModalView) => void;
  setDepositTxHash: (txHash: string) => void;
  refetchUserBalances?: () => void;
  onSuccessfulApproval?: () => void;
  onSuccessfulDeposit?: (
    chainId: number,
    txReceipt: TransactionReceipt
  ) => void;
}

export const DepositTxButton = (props: DepositTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setDepositTxHash,
    refetchUserBalances,
    onSuccessfulApproval,
    onSuccessfulDeposit,
  } = props;

  const t_common = useTranslations("Common");
  const t_modals = useTranslations("TxModals");
  const t_tooltips = useTranslations("Tooltips");

  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const addRecentTransaction = useAddRecentTransaction();

  const { address: userAddress, chain, isDisconnected } = useAccount();

  const { refetch } = useVaultDataReader(userAddress, vault);

  // const { data: tokenData } = useVaultTokenData(vault)
  // const vault: any = currentVault;
  //:todo fix decimals
  const decimals = vault?.decimals;

  // const {
  //   data: allowance,
  //   isFetched: isFetchedAllowance,
  //   refetch: refetchTokenAllowance,
  // } = useTokenAllowance(
  //   vault.chainId,
  //   userAddress as Address,
  //   vault.address,
  //   vault.tokenData?.address as Address
  // );
  const {
    allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchTokenAllowance,
  } = useTokenAllowance(userAddress, vault);

  console.log("deposit test allowance ", { allowance, isFetchedAllowance });

  // const {
  //   data: userTokenBalance,
  //   isFetched: isFetchedUserTokenBalance,
  //   refetch: refetchUserTokenBalance,
  // } = useTokenBalance(
  //   vault.chainId,
  //   userAddress as Address,
  //   vault?.tokenAddress as Address
  // );

  const {
    data: userTokenBalance,
    isFetched: isFetchedUserTokenBalance,
    refetch: refetchUserTokenBalance,
  } = useBalance({
    chainId: vault.chainId,
    address: userAddress as Address,
    token: vault?.tokenAddress as Address,
  });

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  );

  const { refetch: refetchUserVaultDelegationBalance } =
    useUserVaultDelegationBalance(vault, userAddress as Address);

  const { refetch: refetchVaultBalance } = useVaultBalance(vault);

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom);

  const isValidFormTokenAmount =
    decimals !== undefined
      ? isValidFormInput(formTokenAmount, decimals)
      : false;

  const depositAmount = isValidFormTokenAmount
    ? parseUnits(formTokenAmount, decimals as number)
    : 0n;

  const {
    isWaitingApproval,
    isConfirmingApproval,
    isSuccessfulApproval,
    trxHash: approvalTxHash,
    approve: sendApproveTransaction,
  } = useApprove(depositAmount, vault);

  useEffect(() => {
    refetchTokenAllowance();
  }, [isConfirmingApproval, isSuccessfulApproval, depositAmount]);

  // const {
  //   isWaiting: isWaitingDeposit,
  //   isConfirming: isConfirmingDeposit,
  //   isSuccess: isSuccessfulDeposit,
  //   txHash: depositTxHash,
  //   sendDepositTransaction,
  // } = useSendDepositTransaction(depositAmount, vault, {
  //   onSend: () => {
  //     setModalView("waiting");
  //   },
  //   onSuccess: (txReceipt) => {
  //     refetchUserTokenBalance();
  //     refetchUserVaultTokenBalance();
  //     refetchUserVaultDelegationBalance();
  //     refetchVaultBalance();
  //     refetchTokenAllowance();
  //     refetchUserBalances?.();
  //     onSuccessfulDeposit?.(vault.chainId, txReceipt);
  //     setModalView("success");
  //   },
  //   onError: () => {
  //     setModalView("error");
  //   },
  // });

  const {
    isWaitingDeposit,
    isConfirmingDeposit,
    isSuccessfulDeposit,
    depositTxHash,
    deposit: sendDepositTransaction,
  } = useVaultDeposit(vault.address);

  useEffect(() => {
    if (
      !!depositTxHash &&
      isConfirmingDeposit &&
      !isWaitingDeposit &&
      !isSuccessfulDeposit
    ) {
      setDepositTxHash(depositTxHash);
      setModalView("confirming");
    }

    if (isSuccessfulDeposit) {
      refetchUserTokenBalance();
      refetchUserVaultTokenBalance();
      refetchUserVaultDelegationBalance();
      refetchVaultBalance();
      refetchTokenAllowance();
      refetchUserBalances?.();
      // onSuccessfulDeposit?.(vault.chainId, txReceipt);
      setModalView("success");

      setTimeout(() => {
        refetch();
      }, 2000);
      setTimeout(() => {
        refetch();
      }, 4000);
    }
  }, [depositTxHash, isConfirmingDeposit]);

  const isDataFetched =
    !isDisconnected &&
    !!userAddress &&
    // !!tokenData &&
    isFetchedUserTokenBalance &&
    !!userTokenBalance &&
    isFetchedAllowance &&
    allowance !== undefined &&
    !!depositAmount &&
    decimals !== undefined &&
    chain?.id === vault.chainId;

  const approvalEnabled =
    isDataFetched &&
    userTokenBalance.value >= depositAmount &&
    isValidFormTokenAmount;

  const depositEnabled =
    isDataFetched &&
    userTokenBalance.value >= depositAmount &&
    allowance >= depositAmount &&
    isValidFormTokenAmount;

  // No deposit amount set
  if (depositAmount === 0n) {
    return (
      <Button color="transparent" fullSized={true} disabled={true}>
        {t_modals("enterAnAmount")}
      </Button>
    );
  }

  // Needs approval
  if (isDataFetched && allowance < depositAmount) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingApproval || isConfirmingApproval}
        isTxSuccess={isSuccessfulApproval}
        write={sendApproveTransaction}
        txHash={approvalTxHash}
        txDescription={t_modals("approvalTx", {
          symbol: vault.tokenData?.symbol ?? "?",
        })}
        fullSized={true}
        disabled={false}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        innerClassName="flex gap-2 items-center"
        intl={{ base: t_modals, common: t_common }}
      >
        {t_modals("approvalButton", { symbol: vault.tokenData?.symbol ?? "?" })}
        <ApprovalTooltip
          tokenSymbol={vault?.tokenData?.symbol || ""}
          intl={t_tooltips}
          className="whitespace-normal"
        />
      </TransactionButton>
    );
  }

  // Prompt to review deposit
  if (isDataFetched && modalView === "main") {
    return (
      <Button
        onClick={() => setModalView("review")}
        fullSized={true}
        disabled={false}
      >
        {t_modals("reviewDeposit")}
      </Button>
    );
  }

  console.log("trx test ", {
    sendDepositTransaction,
    isWaitingDeposit,
    isConfirmingDeposit,
  });

  // Deposit button
  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingDeposit || isConfirmingDeposit}
      isTxSuccess={isSuccessfulDeposit}
      write={() => sendDepositTransaction(depositAmount)}
      txHash={depositTxHash}
      txDescription={t_modals("depositTx", {
        symbol: vault.tokenData?.symbol ?? "?",
      })}
      fullSized={true}
      disabled={false}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      intl={{ base: t_modals, common: t_common }}
    >
      {t_modals("confirmDeposit")}
    </TransactionButton>
  );
};
