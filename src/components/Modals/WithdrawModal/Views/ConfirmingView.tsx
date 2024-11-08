import { Vault } from "@generationsoftware/hyperstructure-client-js";
import { useVaultShareData } from "@generationsoftware/hyperstructure-react-hooks";
import { PrizePoolBadge } from "@shared/react-components";
import { Button, ExternalLink, Spinner } from "@shared/ui";
import { getBlockExplorerName, getBlockExplorerUrl } from "@shared/utilities";
import { useTranslations } from "next-intl";

interface ConfirmingViewProps {
  vault: Vault;
  closeModal: () => void;
  txHash?: string;
}

export const ConfirmingView = (props: ConfirmingViewProps) => {
  const { vault, txHash, closeModal } = props;

  const t_common = useTranslations("Common");
  const t_modals = useTranslations("TxModals");

  const { data: share } = useVaultShareData(vault);

  const name = getBlockExplorerName(vault.chainId);

  return (
    <div className="flex flex-col gap-6">
      <span className="text-lg font-semibold text-center">
        {t_modals("submissionNotice")}
      </span>
      <PrizePoolBadge
        chainId={vault.chainId}
        hideBorder={true}
        intl={t_common}
        className="!py-1 mx-auto"
      />
      <span className="text-sm text-center md:text-base">
        {/* {t_modals('withdrawingFrom', { vault: share?.symbol ?? '?' })} */}
        Withdrawing...
      </span>
      <Spinner size="lg" className="mx-auto after:border-y-pt-teal" />
      <div className="flex flex-col w-full justify-end h-24 gap-4 md:h-36 md:gap-6">
        {!!txHash && (
          <ExternalLink
            href={getBlockExplorerUrl(vault.chainId, txHash, "tx")}
            size="sm"
            className="mx-auto text-pt-purple-100"
          >
            {t_common("viewOn", { name })}
          </ExternalLink>
        )}
        <Button fullSized={true} color="transparent" onClick={closeModal}>
          {t_common("close")}
        </Button>
      </div>
    </div>
  );
};
