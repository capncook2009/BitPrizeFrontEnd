import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export interface ImportedBadgeProps {
  intl?: { text?: string }
}

export const ImportedBadge = (props: ImportedBadgeProps) => {
  const { intl } = props

  return (
    <div className='flex gap-0.5 items-center bg-pt-warning-light text-pt-warning-dark px-3 py-0.5 rounded-[6px]'>
      <ExclamationTriangleIcon className='h-4 w-4 text-inherit' />
      <span className='text-sm font-medium'>{intl?.text ?? 'Imported'}</span>
    </div>
  )
}
