import { BACKEND_API_URL } from "@constants/config";
import {
  useAllUserVaultBalances,
  useAllVaultSharePrices,
  useSelectedVaults,
} from "@generationsoftware/hyperstructure-react-hooks";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Address, formatUnits } from "viem";

/**
 * Returns a user's total balance in ETH
 * @param userAddress user address to get total balance for
 * @returns
 */
export const useUserTotalBalance = (userAddress: Address) => {
  const { vaults, isFetched: isFetchedVaultData } = useSelectedVaults();
  const [userData, setUserData] = useState<any>({});

  const { data: allVaultShareTokens, isFetched: isFetchedAllVaultShareTokens } =
    useAllVaultSharePrices(vaults);

  const { data: vaultBalances, isFetched: isFetchedVaultBalances } =
    useAllUserVaultBalances(vaults, userAddress);

  useEffect(() => {
    if (!userAddress) {
      return;
    }

    console.log("loading user Data");

    async function load() {
      const res = await axios.get(
        `${BACKEND_API_URL}/api/bitprize/getUserData?walletAddress=${userAddress?.toLowerCase()}`
      );
      const data = res.data;
      if (!data?.error) {
        setUserData(data?.result);
      }
    }

    load();
  }, [userAddress]);

  const isFetched =
    isFetchedVaultData &&
    isFetchedAllVaultShareTokens &&
    isFetchedVaultBalances &&
    !!allVaultShareTokens &&
    !!vaultBalances &&
    !!vaults.underlyingTokenAddresses &&
    Object.values(allVaultShareTokens).some(
      (token) => token.price !== undefined
    );

  const data: any = useMemo(() => {
    if (isFetched) {
      let totalBalance: number = 0;
      for (const vaultId in vaultBalances) {
        const decimals = vaultBalances[vaultId].decimals;
        if (!isNaN(decimals)) {
          const shareBalance = vaultBalances[vaultId].amount;

          const sharePrice = allVaultShareTokens[vaultId]?.price ?? 0;

          const formattedShareBalance = formatUnits(shareBalance, decimals);
          totalBalance += Number(formattedShareBalance) * sharePrice;
        }
      }
      return totalBalance;
    } else {
      return undefined;
    }
  }, [
    isFetchedVaultData,
    isFetchedAllVaultShareTokens,
    allVaultShareTokens,
    isFetchedVaultBalances,
    vaultBalances,
    vaults,
  ]);

  return { ...data, userData, isFetched };
};
