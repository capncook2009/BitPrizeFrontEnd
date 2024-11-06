import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useApproveSignature,
  useSendDepositTransaction,
  useSendDepositWithPermitTransaction,
  useTokenAllowance,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { TransactionButton } from '@shared/react-components'
import { Button } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { parseUnits, TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'
import { DepositModalView } from '.'
import { isValidFormInput } from '../TxFormInput'
import { depositFormTokenAmountAtom } from './DepositForm'

interface DepositWithPermitTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: DepositModalView) => void
  setDepositTxHash: (txHash: string) => void
  refetchUserBalances?: () => void
  onSuccessfulDeposit?: (chainId: number, txReceipt: TransactionReceipt) => void
  onSuccessfulDepositWithPermit?: (chainId: number, txReceipt: TransactionReceipt) => void
}

export const DepositWithPermitTxButton = (props: DepositWithPermitTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setDepositTxHash,
    refetchUserBalances,
    onSuccessfulDeposit,
    onSuccessfulDepositWithPermit
  } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const { data: tokenData } = useVaultTokenData(vault)
  const decimals = vault.decimals ?? tokenData?.decimals

  const {
    data: allowance,
    isFetched: isFetchedAllowance,
    refetch: refetchTokenAllowance
  } = useTokenAllowance(vault.chainId, userAddress!, vault.address, tokenData?.address!)

  const {
    data: userTokenBalance,
    isFetched: isFetchedUserTokenBalance,
    refetch: refetchUserTokenBalance
  } = useTokenBalance(vault.chainId, userAddress!, tokenData?.address!)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(vault, userAddress!)

  const { refetch: refetchUserVaultDelegationBalance } = useUserVaultDelegationBalance(
    vault,
    userAddress!
  )

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)

  const isValidFormTokenAmount =
    decimals !== undefined ? isValidFormInput(formTokenAmount, decimals) : false

  const depositAmount = isValidFormTokenAmount ? parseUnits(formTokenAmount, decimals!) : 0n

  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [isReadyToSendTxAfterSigning, setIsReadyToSendTxAfterSigning] = useState<boolean>(false)

  const {
    signature,
    deadline,
    isWaiting: isWaitingApproval,
    signApprove,
    refetch: refetchNonces
  } = useApproveSignature(depositAmount, vault, {
    onSuccess: () => {
      setIsApproved(true)
      setIsReadyToSendTxAfterSigning(true)
    },
    onError: () => setModalView('error')
  })

  const {
    isWaiting: isWaitingDepositWithPermit,
    isConfirming: isConfirmingDepositWithPermit,
    isSuccess: isSuccessfulDepositWithPermit,
    txHash: depositWithPermitTxHash,
    isError: isError,
    txReceipt: txReceipt,
    sendDepositWithPermitTransaction
  } = useSendDepositWithPermitTransaction(depositAmount, vault, signature!, deadline!, {
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: (txReceipt) => {
      setIsApproved(false)
      refetchNonces()
      refetchUserTokenBalance()
      refetchUserVaultTokenBalance()
      refetchUserVaultDelegationBalance()
      refetchVaultBalance()
      refetchTokenAllowance()
      refetchUserBalances?.()
      onSuccessfulDepositWithPermit?.(vault.chainId, txReceipt)
      setModalView('success')
    },
    onError: () => {
      setModalView('error')
    }
  })

  const {
    isWaiting: isWaitingDeposit,
    isConfirming: isConfirmingDeposit,
    isSuccess: isSuccessfulDeposit,
    txHash: depositTxHash,
    sendDepositTransaction
  } = useSendDepositTransaction(depositAmount, vault, {
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: (txReceipt) => {
      refetchUserTokenBalance()
      refetchUserVaultTokenBalance()
      refetchUserVaultDelegationBalance()
      refetchVaultBalance()
      refetchTokenAllowance()
      refetchUserBalances?.()
      onSuccessfulDeposit?.(vault.chainId, txReceipt)
      setModalView('success')
    },
    onError: () => {
      setModalView('error')
    }
  })

  useEffect(() => {
    if (isReadyToSendTxAfterSigning && isApproved && !!sendDepositWithPermitTransaction) {
      sendDepositWithPermitTransaction()
      setIsReadyToSendTxAfterSigning(false)
    }
  }, [isReadyToSendTxAfterSigning, isApproved, sendDepositWithPermitTransaction])

  useEffect(() => {
    if (
      !!depositWithPermitTxHash &&
      isConfirmingDepositWithPermit &&
      !isWaitingDepositWithPermit &&
      !isSuccessfulDepositWithPermit
    ) {
      setDepositTxHash(depositWithPermitTxHash)
      setModalView('confirming')
    } else if (
      !!depositTxHash &&
      isConfirmingDeposit &&
      !isWaitingDeposit &&
      !isSuccessfulDeposit
    ) {
      setDepositTxHash(depositTxHash)
      setModalView('confirming')
    }
  }, [depositWithPermitTxHash, isConfirmingDepositWithPermit, depositTxHash, isConfirmingDeposit])

  const isDataFetched =
    !isDisconnected &&
    !!userAddress &&
    !!tokenData &&
    isFetchedUserTokenBalance &&
    !!userTokenBalance &&
    isFetchedAllowance &&
    allowance !== undefined &&
    !!depositAmount &&
    decimals !== undefined &&
    chain?.id === vault.chainId

  const depositEnabled =
    isDataFetched && userTokenBalance.amount >= depositAmount && isValidFormTokenAmount

  console.log('deposit test ', { isDataFetched, isApproved, allowance, depositEnabled })

  // No deposit amount set
  if (depositAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {t_modals('enterAnAmount')}
      </Button>
    )
  }

  // Prompt to review deposit
  if (isDataFetched && modalView === 'main') {
    return (
      <Button onClick={() => setModalView('review')} fullSized={true} disabled={false}>
        {t_modals('reviewDeposit')}
      </Button>
    )
  }

  // Deposit button
  if (isDataFetched && allowance >= depositAmount) {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingDeposit || isConfirmingDeposit}
        isTxSuccess={isSuccessfulDeposit}
        write={sendDepositTransaction}
        txHash={depositTxHash}
        txDescription={t_modals('depositTx', { symbol: tokenData?.symbol ?? '?' })}
        fullSized={true}
        disabled={false}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        intl={{ base: t_modals, common: t_common }}
      >
        {t_modals('confirmDeposit')}
      </TransactionButton>
    )
  }

  // Sign + deposit with permit button
  return (
    <TransactionButton
      chainId={vault.chainId}
      isTxLoading={isWaitingApproval || isWaitingDepositWithPermit || isConfirmingDepositWithPermit}
      isTxSuccess={isSuccessfulDepositWithPermit}
      write={isApproved ? sendDepositWithPermitTransaction : signApprove}
      txHash={depositWithPermitTxHash}
      txDescription={t_modals('depositTx', { symbol: tokenData?.symbol ?? '?' })}
      fullSized={true}
      disabled={false}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      intl={{ base: t_modals, common: t_common }}
    >
      {t_modals('confirmDeposit')}
    </TransactionButton>
  )
}
