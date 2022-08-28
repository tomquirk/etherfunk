const RE = /([A-Za-z]?)([a-z]+)/g;

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

/** Splits a camel-case or Pascal-case variable name into individual words.
 * @param {string} s
 * @returns {string[]}
 */
function splitWords(s: string) {
  const output = [];

  /*
	matches example: "oneTwoThree"
	["one", "o", "ne"]
	["Two", "T", "wo"]
	["Three", "T", "hree"]
	*/
  let match = RE.exec(s);
  while (match) {
    // output.push(match.join(""));
    output.push([match[1].toUpperCase(), match[2]].join(""));
    match = RE.exec(s);
  }

  return output;
}

export const formatVariableName = (variableName: string) => {
  try {
    return splitWords(variableName)
      .map((v) => {
        if (v.toLowerCase() === "id") return "ID";
        return v;
      })
      .join(" ");
  } catch (_) {
    return variableName;
  }
};
