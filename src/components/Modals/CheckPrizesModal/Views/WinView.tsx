import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllPrizeTokenPrices,
  useLastCheckedPrizesTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { useSelectedCurrency } from '@shared/generic-react-hooks'
import { NetworkIcon, TokenAmount, TokenValue } from '@shared/react-components'
import { DrawWithTimestamps, SubgraphPrize, TokenWithAmount } from '@shared/types'
import { Button } from '@shared/ui'
import { getSimpleDate, NATIVE_ASSETS, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Address, formatUnits, parseEther } from 'viem'
import { useAccount } from 'wagmi'
import { winAnimation } from '../animations'

interface WinViewProps {
  prizePools: PrizePool[]
  draws: { [chainId: number]: DrawWithTimestamps[] }
  wins: { [chainId: number]: SubgraphPrize[] }
  onGoToAccount: () => void
}

export const WinView = (props: WinViewProps) => {
  const { prizePools, draws, wins, onGoToAccount } = props

  const t = useTranslations('Account.prizeChecking')

  const { address: userAddress } = useAccount()

  const { data: prizeTokens } = useAllPrizeTokenPrices(prizePools)

  const { lastCheckedPrizesTimestamps } = useLastCheckedPrizesTimestamps(userAddress as Address)

  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false)

  const prizes = useMemo(() => {
    const toDisplay: { chainId: number; token: TokenWithAmount; timestamp: number }[] = []
    let totalValue = 0

    if (!!userAddress) {
      for (const key in wins) {
        const chainId = parseInt(key)
        const prizePoolId = prizePools.find((pool) => pool.chainId === chainId)?.id
        const prizeToken = !!prizePoolId ? prizeTokens[prizePoolId] : undefined

        if (!!prizeToken) {
          const drawIdsToCheck = draws[chainId]?.map((d) => d.id) ?? []
          const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

          const groupedChainWins: { [txHash: `0x${string}`]: (typeof toDisplay)[number] } = {}

          wins[chainId].forEach((win) => {
            if (!!win.payout) {
              const value =
                parseFloat(formatUnits(win.payout, prizeToken.decimals)) * (prizeToken.price ?? 0)

              if (groupedChainWins[win.txHash] !== undefined) {
                groupedChainWins[win.txHash].token.amount += win.payout
                totalValue += value
              } else if (
                drawIdsToCheck.includes(win.drawId) &&
                win.timestamp > lastCheckedPrizesTimestamp
              ) {
                groupedChainWins[win.txHash] = {
                  chainId,
                  token: { ...prizeToken, amount: win.payout },
                  timestamp: win.timestamp
                }
                totalValue += value
              }
            }
          })

          toDisplay.push(...Object.values(groupedChainWins))
        }
      }
    }

    toDisplay.sort((a, b) => b.timestamp - a.timestamp)

    return { toDisplay, totalAmount: parseEther(totalValue.toString()) }
  }, [draws, wins, userAddress, prizeTokens])

  const transitionIn = classNames('transition-opacity duration-700 opacity-0', {
    'opacity-100': isAnimationComplete
  })

  return (
    <div className='flex flex-col items-center px-8'>
      <Header
        token={{ ...NATIVE_ASSETS[NETWORK.mainnet], amount: prizes.totalAmount }}
        className={transitionIn}
      />
      <div
        className={classNames(
          'w-full max-h-[28vh] flex flex-col gap-4 my-12 overflow-auto transition-opacity',
          transitionIn
        )}
      >
        {prizes.toDisplay.map((prize, i) => (
          <PrizeRow
            key={`prize-${i}-${prize.timestamp}`}
            chainId={prize.chainId}
            timestamp={prize.timestamp}
            prizeToken={prize.token}
          />
        ))}
      </div>
      <Lottie
        animationData={winAnimation}
        loop={false}
        className='w-full h-auto -my-20 pointer-events-none md:-my-40'
        onComplete={() => setIsAnimationComplete(true)}
      />
      <Button onClick={onGoToAccount} className={classNames('mx-auto', transitionIn)}>
        {t('viewAccount')}
      </Button>
    </div>
  )
}

interface HeaderProps {
  token: TokenWithAmount
  className?: string
}

const Header = (props: HeaderProps) => {
  const { token, className } = props

  const t = useTranslations('Account.prizeChecking')

  const { selectedCurrency } = useSelectedCurrency()

  return (
    <div className={classNames('flex flex-col items-center text-center', className)}>
      <span className='text-3xl font-grotesk font-medium text-gray-100'>
        {t('youWonX')} <TokenValue token={token} hideZeroes={true} />!
      </span>
      {selectedCurrency !== 'eth' && (
        <span className='text-pt-purple-100'>
          (<TokenAmount token={token} maximumFractionDigits={5} />)
        </span>
      )}
    </div>
  )
}

interface PrizeRowProps {
  chainId: number
  timestamp: number
  prizeToken: { chainId: number; address: Address; amount: bigint }
  className?: string
}

const PrizeRow = (props: PrizeRowProps) => {
  const { chainId, timestamp, prizeToken, className } = props

  const t = useTranslations('Account.prizeChecking')

  return (
    <div
      className={classNames(
        'w-full flex items-center justify-between px-3 py-2 bg-pt-transparent rounded-lg',
        className
      )}
    >
      <div className='flex gap-2 items-center'>
        <NetworkIcon chainId={chainId} className='w-4 h-4' />
        <span className='text-sm text-pt-purple-300'>{getSimpleDate(timestamp)}</span>
      </div>
      <span className='font-medium'>
        <TokenValue token={prizeToken} /> {t('xWon')}
      </span>
    </div>
  )
}
