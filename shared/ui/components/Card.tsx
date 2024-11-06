import classNames from 'classnames'
import { Card as FlowbiteCard, CardProps as FlowbiteCardProps } from 'flowbite-react'

export type CardProps = FlowbiteCardProps & {
  className?: string
  wrapperClassName?: string
}

export const Card = (props: CardProps) => {
  const { className, wrapperClassName, ...rest } = props

  return (
    <FlowbiteCard
      theme={{
        root: {
          base: 'flex bg-pt-transparent rounded-lg shadow-md',
          children: classNames('flex h-full flex-col justify-center px-8 py-6 md:py-8', className)
        }
      }}
      className={classNames(wrapperClassName)}
      {...rest}
    />
  )
}
