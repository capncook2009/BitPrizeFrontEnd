import { useReadContract, useAccount, useReadContracts } from "wagmi";
import { useState, useEffect, useMemo } from "react";
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

export const useVaultDataReader = (userAddress: any, vault: Vault) => {
  // const { address: userAddress } = useAccount();
  const [error, setError] = useState<Error | null>(null);
  // const [allowance, setAllowance] = useState<any>(0);

  // Get user data
  const {
    data: results,
    isError: isUserDataError,
    isFetched,
    isLoading,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        address: vault.address,
        abi: prizePoolABI,
        functionName: "getUserDeposit",
        args: userAddress ? [userAddress] : undefined,
        chainId: baseSepolia.id,
      },
      {
        address: vault.address,
        abi: prizePoolABI,
        functionName: "getTotalParticipants",
        args: [],
        chainId: baseSepolia.id,
      },
      {
        address: vault.address,
        abi: prizePoolABI,
        functionName: "getTotalDeposits",
        args: [],
        chainId: baseSepolia.id,
      },
      {
        address: vault.address,
        abi: prizePoolABI,
        functionName: "isDrawActive",
        args: [],
        chainId: baseSepolia.id,
      },
      {
        address: vault.address,
        abi: prizePoolABI,
        functionName: "getWinPercentage",
        args: userAddress ? [userAddress] : undefined,
        chainId: baseSepolia.id,
      },
    ],
  });

  // Update loading state
  useEffect(() => {
    refetch();
  }, [userAddress, isLoading]);

  const userDeposits = useMemo(() => {
    return !results?.[0]?.result ? 0n : results?.[0]?.result;
  }, [results]);

  const totalUsers = useMemo(() => {
    return !results?.[1]?.result ? 0n : results?.[1]?.result;
  }, [results]);
  const totalDeposits = useMemo(() => {
    return !results?.[2]?.result ? 0n : results?.[2]?.result;
  }, [results]);

  const isActicve = useMemo(() => {
    return !results?.[3]?.result ? 0n : results?.[3]?.result;
  }, [results]);

  const winChance = useMemo(() => {
    return !results?.[4]?.result ? 0n : results?.[4]?.result;
  }, [results]);

  console.log("data reader test ", {
    userDeposits,
    totalUsers,
    totalDeposits,
    isActicve,
    winChance,
  });
  // Provide formatted values and loading states
  return {
    userDeposits,
    totalUsers,
    totalDeposits,
    isActicve,
    winChance,

    isLoading,
    error,
    refetch: async () => {
      // Function to manually refetch data if needed
      try {
        refetch();
        // The actual refetch will be handled by wagmi
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to refetch data"));
      } finally {
      }
    },
  };
};
