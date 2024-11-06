import { formatUnits } from 'viem'

/**
 * Calculates the odds of a user winning any prize on any one draw for a specific vault
 * @param userShares the amount of shares the user has deposited in the vault
 * @param totalShares the total amount of shares deposited in the vault
 * @param decimals the decimals of the vault
 * @param vaultPercentageContribution the percentage of the prize pool contributed by the vault
 * @param numPrizes the number of prizes expected from a draw
 * @returns
 */
export const calculateOdds = (
  userShares: bigint,
  totalShares: bigint,
  decimals: number,
  vaultPercentageContribution: number,
  numPrizes: number
): number => {
  if (!userShares || !totalShares || decimals === undefined || !vaultPercentageContribution) {
    return 0
  }

  const userSharesFloat = Number(formatUnits(userShares, decimals))
  const totalSharesFloat = Number(formatUnits(totalShares, decimals))

  if (userSharesFloat >= totalSharesFloat) {
    return 1 - Math.pow(1 - vaultPercentageContribution, numPrizes || 4)
  }

  const userPercentageShares = userSharesFloat / totalSharesFloat

  return 1 - Math.pow(1 - userPercentageShares * vaultPercentageContribution, numPrizes || 4)
}

/**
 * Calculates the union of many probability distributions
 *
 * P(A | B) = P(A) + P(B) - P(A & B)
 * @param vals probabilities from 0 to 1 (ex: 0.2, 1, 0.5, 0.33)
 * @returns
 */
export const calculateUnionProbability = (vals: number[]) => {
  let result = vals[0]

  for (let i = 1; i < vals.length; i++) {
    result = result + vals[i] - result * vals[i]
  }

  return result
}
