import { baseSepolia } from "viem/chains";

export const prizePoolAddress = "0x9C645A4F7d79C7e005a80d19BcE76459bf963C0F";
export const prizePoolABI = [
  {
    inputs: [
      { internalType: "address", name: "_usdcToken", type: "address" },
      { internalType: "address", name: "_bitToken", type: "address" },
      { internalType: "address", name: "_yieldContract", type: "address" },
      { internalType: "address", name: "_rng", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "DrawStarted", type: "event" },
  { anonymous: false, inputs: [], name: "DrawStopped", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "YieldDistributed",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balances",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bitToken",
    outputs: [{ internalType: "contract Bit", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "depositors",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPotentialReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalDeposits",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalParticipants",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "getUserDeposit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "getWinPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isDrawActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rng",
    outputs: [
      {
        internalType: "contract RandomNumberGenerator",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startDraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stopDraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdcToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "yieldContract",
    outputs: [
      { internalType: "contract IYieldContract", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export const bitTokenAddress = "0x9BFCA8A69Fae0fc9cB1B6c6B37516991F3DF05eE";
export const mockUSDC = "0x5B2eb1f24B900432D90207cbFa6187C48651a0F8";

export const currentVault = {
  id: 1,
  chainId: baseSepolia.id,
  address: prizePoolAddress,
  name: "USDC ",
  tokenData: {
    symbol: "USDC",
    address: mockUSDC, // vault address
    decimals: 18,
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    price: 1,
    totalSupply: 1000000000000000000000000n,
  },
  decimals: 18,
  winChance: 10,
  prizeValue: 1000,
  bonusReward: 200,
  vaultTotalDeposits: 20000,
  tokenLogoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
  symbol: "USDC",
  shareData: {
    address: bitTokenAddress,
    decimals: 18,
    symbol: "BITS",
    name: "Bits",
    totalSupply: 1000000000000000n,
  },
};
