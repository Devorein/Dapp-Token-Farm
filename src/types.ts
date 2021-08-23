export interface Input<I, N, T> {
  indexed: I,
  internalType: T,
  name: N,
  type: T
}

export interface ApprovalEvent {
  anonymous: boolean
  inputs: [
    Input<true, "_owner", "address">,
    Input<true, "_spender", "address">,
    Input<false, "_value", "uint256">,
  ],
  name: "Approval",
  type: "event"
}

export interface TransferEvent{
  anonymous: boolean
  inputs: [
    Input<true, "_from", "address">,
    Input<true, "_to", "address">,
    Input<false, "_value", "uint256">,
  ]
  name: "Transfer",
  type: "event"
}

export interface Network {
  events: {
    [key: string]: ApprovalEvent | TransferEvent
  }
  links: Record<string, any>
  address: string
  transactionHash: string
}