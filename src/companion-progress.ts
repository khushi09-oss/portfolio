export function companionPhase(discoveries: number): 0 | 1 | 2 {
  return discoveries >= 3 ? 2 : discoveries > 0 ? 1 : 0;
}

export function claimIsSupported(
  sourceVerified: boolean,
  claim: string,
): boolean {
  return sourceVerified && claim === "combine-ranks";
}

export const claims = [
  {
    id: "combine-ranks",
    text: "The retriever combines two ranked result lists.",
  },
  { id: "all-commits", text: "The retriever searches every commit in GitHub." },
  { id: "learns-visitors", text: "The retriever learns from every visitor." },
];
