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

export const useVaultDeposit = (contractAddress: any) => {
  const { address: userAddress } = useAccount();

  const [transactions, setTransactions] = useState<
    Record<string, TransactionResult>
  >({});

  // Deposit Contract Interaction
  const {
    writeContract: depositTokens,
    data: depositTxHash,
    isError: isDepositError,
    error: depositError,
    status: depositStatus,
    isPending: isWaitingDeposit,
  } = useWriteContract();

  const {
    isLoading: isConfirmingDeposit,
    isSuccess: isSuccessfulDeposit,
    data,
    isError: isFailed,
  } = useWaitForTransactionReceipt({
    hash: depositTxHash,
    confirmations: 1,
  });

  // Deposit function
  const deposit = useCallback(
    async (amount: any) => {
      if (!userAddress) throw new Error("Wallet not connected");

      try {
        depositTokens({
          address: contractAddress,
          abi: prizePoolABI,
          functionName: "deposit",
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
    deposit,
    isWaitingDeposit,
    isConfirmingDeposit,
    isSuccessfulDeposit,
    depositTxHash,
    isFailed,
  };
};
