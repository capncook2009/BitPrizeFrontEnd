import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllPrizeTokenPrices,
  usePublicClientsByChain
} from '@generationsoftware/hyperstructure-react-hooks'
import { SortIcon, VaultBadge } from '@shared/react-components'
import { Win } from '@shared/types'
import { Table, TableProps } from '@shared/ui'
import { getSimpleDate } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { AccountWinAmount } from './AccountWinAmount'
import { AccountWinButtons } from './AccountWinButtons'

type SortId = 'date' | 'amount'

interface AccountWinningsTableProps extends Omit<TableProps, 'data' | 'keyPrefix'> {
  wins: Win[]
  prizePools: PrizePool[]
}

export const AccountWinningsTable = (props: AccountWinningsTableProps) => {
  const { wins, prizePools, className, innerClassName, headerClassName, rowClassName, ...rest } =
    props

  const publicClients = usePublicClientsByChain()

  const { data: prizeTokens } = useAllPrizeTokenPrices(prizePools)

  const t_common = useTranslations('Common')
  const t_account = useTranslations('Account')

  const baseNumWins = 10
  const [numWins, setNumWins] = useState<number>(baseNumWins)

  const [sortBy, setSortBy] = useState<SortId>('date')
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')

  const handleHeaderClick = (id: SortId) => {
    if (sortBy === id) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortDirection('desc')
      setSortBy(id)
    }
  }

  const getDirection = (id: SortId) => {
    if (sortBy === id) return sortDirection
  }

  const getWinValue = (win: Win) => {
    const prizePoolId = prizePools.find((pool) => pool.chainId === win.chainId)?.id
    const prizeToken = !!prizePoolId ? prizeTokens[prizePoolId] : undefined

    if (!prizeToken?.price) return 0

    return parseFloat(formatUnits(win.payout, prizeToken.decimals)) * prizeToken.price
  }

  const sortedWins = useMemo(() => {
    if (sortBy === 'amount') {
      const sortedByAmount = [...wins].sort((a, b) => getWinValue(b) - getWinValue(a))
      return sortDirection === 'desc' ? sortedByAmount : sortedByAmount.reverse()
    } else {
      return sortDirection === 'desc' ? wins : [...wins].reverse()
    }
  }, [wins, prizeTokens, sortBy, sortDirection])

  const tableData: TableProps['data'] = {
    headers: {
      date: {
        content: (
          <SortableHeader
            content={t_account('winHeaders.date')}
            onClick={() => handleHeaderClick('date')}
            direction={getDirection('date')}
          />
        )
      },
      prizeVault: { content: t_account('winHeaders.prizeVault'), position: 'center' },
      winnings: {
        content: (
          <SortableHeader
            content={t_account('winHeaders.winnings')}
            onClick={() => handleHeaderClick('amount')}
            direction={getDirection('amount')}
          />
        ),
        position: 'center'
      },
      info: {
        content: <span className='w-24 text-center'>{t_account('winHeaders.moreInfo')}</span>,
        position: 'right'
      }
    },
    rows: sortedWins
      .slice(0, numWins)
      .map((win) => {
        const winId = `${win.chainId}-${win.txHash}`
        const prizePool = prizePools.find((prizePool) => prizePool.chainId === win.chainId)

        if (!!prizePool) {
          const vault = new Vault(win.chainId, win.vault, publicClients[win.chainId])

          const cells: TableProps['data']['rows'][0]['cells'] = {
            date: { content: getSimpleDate(win.timestamp) },
            prizeVault: {
              content: (
                <Link href={`/vault/${vault.chainId}/${vault.address}`}>
                  <VaultBadge vault={vault} onClick={() => {}} />
                </Link>
              ),
              position: 'center'
            },
            winnings: {
              content: (
                <AccountWinAmount
                  prizePool={prizePool}
                  amount={win.payout}
                  amountClassName='text-sm'
                />
              ),
              position: 'center'
            },
            info: { content: <AccountWinButtons win={win} />, position: 'right' }
          }
          return { id: winId, cells }
        } else {
          return { id: winId, cells: {} }
        }
      })
      .filter((row) => Object.keys(row.cells).length > 0)
  }

  return (
    <div
      className={classNames(
        'w-full flex flex-col bg-pt-bg-purple-dark rounded-t-2xl rounded-b-[2.5rem]',
        className
      )}
    >
      <Table
        data={tableData}
        keyPrefix='accountWinningsTable'
        className='w-full bg-transparent'
        innerClassName={classNames('!gap-3', innerClassName)}
        headerClassName={classNames('pl-8 pr-4', headerClassName)}
        rowClassName={classNames('pl-8 pr-4 py-4 rounded-3xl', rowClassName)}
        {...rest}
      />
      {wins.length > numWins && (
        <span
          className='w-full flex pb-4 justify-center text-pt-purple-300 cursor-pointer'
          onClick={() => setNumWins(numWins + baseNumWins)}
        >
          {t_common('showMore')}
        </span>
      )}
    </div>
  )
}

interface SortableHeaderProps {
  content: ReactNode
  onClick: () => void
  direction?: 'desc' | 'asc'
  append?: ReactNode
}

const SortableHeader = (props: SortableHeaderProps) => {
  const { content, onClick, direction, append } = props

  return (
    <div className='flex gap-1 items-center'>
      <div onClick={onClick} className='flex gap-1 items-center cursor-pointer select-none'>
        <SortIcon direction={direction} className='w-4 h-auto shrink-0' />
        {content}
      </div>
      {append}
    </div>
  )
}
