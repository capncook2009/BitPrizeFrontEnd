import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultFeeInfo } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'

interface VaultFeePercentageProps {
  vault: Vault
}

export const VaultFeePercentage = (props: VaultFeePercentageProps) => {
  const { vault } = props

  const { data: vaultFee, isFetched: isFetchedVaultFee } = useVaultFeeInfo(vault)

  if (!isFetchedVaultFee) {
    return <Spinner />
  }

  if (vaultFee === undefined) {
    return <>?</>
  }

  return <>{`${formatNumberForDisplay(vaultFee.percent / 1e7, { maximumFractionDigits: 2 })}%`}</>
}
