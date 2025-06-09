export type MaskPattern = string | string[];

/**
 * Cria uma função que aplica máscara conforme o tamanho do valor.
 */
export function createMask(masks: MaskPattern) {
  const maskArray = Array.isArray(masks) ? masks : [masks];

  // Descobrir o máximo de dígitos que a máscara aceita
  const maxDigits = Math.max(...maskArray.map(mask => (mask.match(/0/g) || []).length));

  return (value: string): string => {
    if (!value) return '';

    // Remove tudo que não for dígito
    let digits = value.replace(/\D/g, '');

    // Limita o número máximo de dígitos
    digits = digits.substring(0, maxDigits);

    // Escolhe a máscara com base na quantidade de dígitos
    let chosenMask = maskArray[maskArray.length - 1];

    for (const mask of maskArray) {
      const digitCount = (mask.match(/0/g) || []).length;
      if (digits.length <= digitCount) {
        chosenMask = mask;
        break;
      }
    }

    let result = '';
    let digitIndex = 0;

    for (let i = 0; i < chosenMask.length; i++) {
      if (chosenMask[i] === '0') {
        if (digitIndex < digits.length) {
          result += digits[digitIndex];
          digitIndex++;
        } else {
          break;
        }
      } else {
        
        if (digitIndex < digits.length) {
          result += chosenMask[i];
        }
      }
    }

    return result;
  };
}

export const telefoneMask = createMask([
  '0000-0000',
  '00000-0000',
  '(00) 0000-0000',
  '(00) 00000-0000',
  '00(00)0000-0000',
  '00(00) 0 0000-0000'
]);

export const cepMask = createMask([
  '00000-000',
]);


