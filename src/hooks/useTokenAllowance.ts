import { useReadContract, useAccount, useReadContracts } from "wagmi";
import { useState, useEffect, useMemo } from "react";
import { Address, erc20Abi, formatEther, formatUnits } from "viem";
import { mockUSDC, prizePoolABI, prizePoolAddress } from "./addresses";
import { baseSepolia } from "viem/chains";
import { Vault } from "@generationsoftware/hyperstructure-client-js";

// Define types for user data
interface UserData {
  balance: string;
  isActive: boolean;
  lastAction: string;
  referralCount: number;
}

interface TotalBalance {
  totalSupply: string;
  circulatingSupply: string;
  lockedAmount: string;
}

interface UseContractDataProps {
  contractAddress: any;
  refreshInterval?: number; // in milliseconds
  decimals?: number;
}

export const useTokenAllowance = (userAddress: any, vault: Vault) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // const [allowance, setAllowance] = useState<any>(0);

  // token token allowance
  const args: any = [!userAddress ? "0x" : userAddress, vault?.address || "0x"];

  const {
    data: allowance,
    refetch: refetchAllowance,
    isFetched,
    isError,
  } = useReadContract({
    address: vault.tokenData?.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: args,
    chainId: baseSepolia.id,
  });

  console.log("allowance test ", {
    address: vault.tokenData?.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: args,
    chainId: baseSepolia.id,
    allowance,
    isFetched,
    isError,
  });

  // Update loading state
  useEffect(() => {
    refetchAllowance();
    // refetchTotal();
  }, [userAddress, isLoading]);

  // Provide formatted values and loading states
  return {
    allowance,
    isFetched,
    isLoading,
    error,
    refetch: async () => {
      // Function to manually refetch data if needed
      try {
        setIsLoading(true);
        refetchAllowance();
        // The actual refetch will be handled by wagmi
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to refetch data"));
      } finally {
        setIsLoading(false);
      }
    },
  };
};
