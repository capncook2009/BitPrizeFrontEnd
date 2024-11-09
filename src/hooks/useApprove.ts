import { useState, useCallback } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { Address, erc20Abi, formatUnits, parseEther, parseUnits } from "viem";
import { useNetworks } from "./useNetworks";
import { Vault } from "@generationsoftware/hyperstructure-client-js";

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

// Contract ABI for deposit and withdraw
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

interface UseContractTransactionsProps {
  contractAddress: Address;
}

const CONTRACT_ADDRESS = "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2";
export const useApprove = (depositAmount: any, vault: Vault) => {
  const { address: userAddress } = useAccount();
  const chain = useNetworks();

  const [transactions, setTransactions] = useState<
    Record<string, TransactionResult>
  >({});

  // Deposit Contract Interaction
  const {
    writeContract: approveTrx,
    data: trxHash,
    isError: isDepositError,
    error: depositError,
    status: depositStatus,
    isPending: isWaitingApproval,
  } = useWriteContract();

  const {
    isLoading: isConfirmingApproval,
    isSuccess: isSuccessfulApproval,
    data,
    isError: isFailed,
  } = useWaitForTransactionReceipt({
    hash: trxHash,
    confirmations: 1,
  });

  // Deposit function
  const approve = useCallback(async () => {
    if (!userAddress) throw new Error("Wallet not connected");

    try {
      console.log("approve test ", depositAmount);
      approveTrx({
        //@ts-ignore
        address: vault.tokenData?.address,
        abi: erc20Abi,
        functionName: "approve",
        //@ts-ignore
        args: [vault.address, depositAmount],
      });

      // return tx.hash;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Deposit failed: ${err.message}`);
    }
  }, [userAddress, depositAmount]);

  return {
    approve,
    isWaitingApproval,
    isConfirmingApproval,
    isSuccessfulApproval,
    trxHash,
  };
};
