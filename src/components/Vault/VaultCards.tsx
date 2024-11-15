import { Vault } from "@generationsoftware/hyperstructure-client-js";
import classNames from "classnames";
import { VaultCard } from "./VaultCard";
import { currentVault } from "@hooks/addresses";

interface VaultsCardsProps {
  vaults: Vault[];
  className?: string;
}

export const VaultCards = (props: VaultsCardsProps) => {
  const { className } = props;

  const vaults: any = [currentVault];

  return (
    <div
      className={classNames(
        "w-full max-w-[36rem] flex flex-col gap-4",
        className
      )}
    >
      {vaults.map((vault) => (
        <VaultCard key={vault.id} vault={vault} />
      ))}
    </div>
  );
};
