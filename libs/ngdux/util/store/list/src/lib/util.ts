function dec2hex(dec: number) {
  return dec.toString(16).padStart(2, '0');
}

function generateId(len?: number) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

function firstLetterLowerCase(string: string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function generateRandomStateName(serviceName: string) {
  const name = firstLetterLowerCase(serviceName).replace('Service', '');
  return `${name}-${generateId(12)}`;
}
