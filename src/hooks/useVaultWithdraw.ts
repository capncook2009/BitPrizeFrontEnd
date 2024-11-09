import { useState, useCallback } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { Address, parseEther } from "viem";
import { useNetworks } from "./useNetworks";
import { prizePoolABI } from "./addresses";
import { baseSepolia } from "viem/chains";

// Transaction status type
type TransactionStatus =
  | "idle"
  | "preparing"
  | "ready"
  | "waiting"
  | "processing"
  | "success"
  | "error";

interface TransactionResult {
  status: TransactionStatus;
  hash: string | null;
  error: Error | null;
  blockNumber: number | null;
}

export const useVaultWithdraw = (contractAddress: any) => {
  const { address: userAddress } = useAccount();

  const [transactions, setTransactions] = useState<
    Record<string, TransactionResult>
  >({});

  // Deposit Contract Interaction
  const {
    writeContract: withdrawTokens,
    data: withdrawTxHash,
    isError: isDepositError,
    error: depositError,
    status: depositStatus,
    isPending: isWaitingWithdrawal,
  } = useWriteContract();

  const {
    isLoading: isConfirmingWithdrawal,
    isSuccess: isSuccessfulWithdrawal,
    data,
    isError: isFailed,
  } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
    confirmations: 1,
  });

  // Deposit function
  const sendRedeemTransaction = useCallback(
    async (amount: any) => {
      console.log("withdraw amount ", amount);
      if (!userAddress) throw new Error("Wallet not connected");
      console.log("withdraw amount ", amount);
      try {
        withdrawTokens({
          address: contractAddress,
          abi: prizePoolABI,
          functionName: "withdraw",
          args: [amount],
          chainId: baseSepolia.id,
        });

        // return tx.hash;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Deposit failed: ${err.message}`);
      }
    },
    [userAddress]
  );

  return {
    sendRedeemTransaction,
    isWaitingWithdrawal,
    isConfirmingWithdrawal,
    isSuccessfulWithdrawal,
    withdrawTxHash,
    isFailed,
  };
};
