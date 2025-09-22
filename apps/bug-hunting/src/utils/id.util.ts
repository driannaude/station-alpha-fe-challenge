/**
 * Generates a unique identifier string using a custom character set.
 *
 * @param size - The desired length of the generated ID. Defaults to 8.
 * @returns A randomly generated string of the specified length.
 *
 * The function uses the `crypto.getRandomValues` method to generate a secure
 * random array of bytes. Each byte is then mapped to a character in the
 * `alphabet` string using a bitwise AND operation (`x & spread`). This operation
 * ensures that the value is within the range of 0 to 63 in this case, which corresponds to
 * the indices of the 64 characters in the `alphabet` string.
 */
export const generateNanoId = (size = 8): string => {
  // Character set to use in the ID
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
  const spread = alphabet.length - 1;
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => alphabet[x & spread]).join("");
};
