import { CheckIcon } from '@heroicons/react/24/outline'
import { CURRENCY_ID, SUPPORTED_CURRENCIES, useSelectedCurrency } from '@shared/generic-react-hooks'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useSettingsModalView } from '@hooks/useSettingsModalView'

interface CurrencyViewProps {
  onCurrencyChange?: (id: CURRENCY_ID) => void
}

export const CurrencyView = (props: CurrencyViewProps) => {
  const { onCurrencyChange } = props

  const t = useTranslations('Settings')

  const currencies = Object.keys(SUPPORTED_CURRENCIES) as CURRENCY_ID[]

  return (
    <div className='flex flex-col items-center gap-4 px-4'>
      <span className='textl-lg font-semibold text-pt-purple-50 order-first md:text-xl'>
        {t('customizeCurrency')}
      </span>
      {currencies.map((id) => {
        return <CurrencyItem key={`curr-item-${id}`} id={id} onSelect={onCurrencyChange} />
      })}
    </div>
  )
}

interface CurrencyItemProps {
  id: CURRENCY_ID
  onSelect?: (id: CURRENCY_ID) => void
}

const CurrencyItem = (props: CurrencyItemProps) => {
  const { id, onSelect } = props

  const { setView: setSettingsModalView } = useSettingsModalView()

  const { selectedCurrency, setSelectedCurrency } = useSelectedCurrency()

  return (
    <div
      className={classNames(
        'w-full rounded-[6px] p-4 bg-pt-transparent hover:bg-pt-transparent/5 cursor-pointer select-none',
        { 'outline outline-2 outline-pt-teal-dark -order-1': id === selectedCurrency }
      )}
      onClick={() => {
        setSelectedCurrency(id)
        onSelect?.(id)
        setSettingsModalView('menu')
      }}
    >
      <span className='flex items-center justify-center gap-2 text-pt-purple-50'>
        {id === selectedCurrency && <CheckIcon className='h-4 w-4 text-inherit' />}
        {`${SUPPORTED_CURRENCIES[id].name} (${SUPPORTED_CURRENCIES[id].symbol})`}
      </span>
    </div>
  )
}
