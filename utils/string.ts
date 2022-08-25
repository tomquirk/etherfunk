export function truncateEthAddress(
  address: string,
  { truncateTo }: { truncateTo?: number } = {}
) {
  const effectiveTruncateTo = truncateTo ?? 6;
  const frontTruncate = effectiveTruncateTo + 2; // account for 0x

  return (
    address.substring(0, frontTruncate) +
    "..." +
    address.substring(address.length - effectiveTruncateTo, address.length)
  );
}
