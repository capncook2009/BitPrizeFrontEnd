import { PromotionInfo } from '@shared/types'
import { Address, PublicClient } from 'viem'
import { twabRewardsABI } from '../abis/twabRewards'
import { TWAB_REWARDS_ADDRESSES } from '../constants'
import { getSimpleMulticallResults } from './multicall'
import { getSecondsSinceEpoch } from './time'

/**
 * Returns promotion info for the given promotion IDs
 * @param publicClient a public Viem client to query through
 * @param promotionIds the promotion IDs to query info for
 * @param options optional settings
 * @returns
 */
export const getPromotions = async (
  publicClient: PublicClient,
  promotionIds: bigint[],
  options?: { twabRewardsAddress?: Address }
) => {
  const promotions: { [id: string]: PromotionInfo | undefined } = {}

  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]

  if (!!twabRewardsAddress) {
    if (promotionIds.length > 0) {
      const calls = promotionIds.map((promotionId) => ({
        functionName: 'getPromotion',
        args: [promotionId]
      }))

      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        twabRewardsAddress,
        twabRewardsABI,
        calls
      )

      promotionIds.forEach((promotionId, i) => {
        const result: PromotionInfo | undefined = multicallResults[i]
        const promotionInfo = typeof result === 'object' ? result : undefined
        promotions[promotionId.toString()] = promotionInfo
      })
    }
  } else {
    console.warn(`No TWAB rewards contract set for chain ID ${chainId}`)
  }

  return promotions
}

/**
 * Returns a user's claimable rewards for the given promotions
 * @param publicClient a public Viem client to query through
 * @param userAddress the address to query rewards for
 * @param promotions info for the promotions to consider
 * @param options optional settings
 * @returns
 */
export const getClaimableRewards = async (
  publicClient: PublicClient,
  userAddress: Address,
  promotions: {
    [id: string]: { startTimestamp?: bigint; numberOfEpochs?: number; epochDuration?: number }
  },
  options?: { twabRewardsAddress?: Address }
) => {
  const claimableRewards: { [id: string]: { [epochId: number]: bigint } } = {}
  const promotionEpochs: { [id: string]: number[] } = {}

  const chainId = await publicClient.getChainId()

  const twabRewardsAddress = options?.twabRewardsAddress ?? TWAB_REWARDS_ADDRESSES[chainId]

  if (!!twabRewardsAddress) {
    Object.entries(promotions).forEach(([id, info]) => {
      const epochs = getPromotionEpochs(info)
      if (epochs.length > 0) {
        promotionEpochs[id] = epochs
      }
    })

    const promotionIds = Object.keys(promotionEpochs)
    if (promotionIds.length > 0) {
      const calls = promotionIds.map((id) => ({
        functionName: 'getRewardsAmount',
        args: [userAddress, BigInt(id), promotionEpochs[id]]
      }))

      const multicallResults = await getSimpleMulticallResults(
        publicClient,
        twabRewardsAddress,
        twabRewardsABI,
        calls
      )

      promotionIds.forEach((id, i) => {
        const result: bigint[] | undefined = multicallResults[i]
        const epochRewards = typeof result === 'object' ? result : undefined
        if (!!epochRewards) {
          promotionEpochs[id].forEach((epochId, j) => {
            if (epochRewards[j] > 0n) {
              if (claimableRewards[id] === undefined) {
                claimableRewards[id] = {}
              }
              claimableRewards[id][epochId] = epochRewards[j]
            }
          })
        }
      })
    }
  } else {
    console.warn(`No TWAB rewards contract set for chain ID ${chainId}`)
  }

  return claimableRewards
}

/**
 * Returns valid epochs for a given promotion
 * @param info promotion info
 * @returns
 */
export const getPromotionEpochs = (info: {
  startTimestamp?: bigint
  numberOfEpochs?: number
  epochDuration?: number
}) => {
  const epochs: number[] = []

  if (!!info.startTimestamp && !!info.epochDuration && !!info.numberOfEpochs) {
    const currentTimestamp = getSecondsSinceEpoch()

    for (let i = 0; i < info.numberOfEpochs; i++) {
      const epochEndsAt = Number(info.startTimestamp) + info.epochDuration * (i + 1)
      if (epochEndsAt > currentTimestamp) {
        break
      } else {
        epochs.push(i)
      }
    }
  }

  return epochs
}
