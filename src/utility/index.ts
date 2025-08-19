export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validarCNPJ(cnpj: string): boolean {
  const numerosCNPJ = cnpj.replace(/\D/g, '');

  if (numerosCNPJ.length !== 14 || /^(\d)\1{13}$/.test(numerosCNPJ)) {
    return false;
  }

  let tamanho = numerosCNPJ.length - 2;
  let numeros = numerosCNPJ.substring(0, tamanho);
  const digitos = numerosCNPJ.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = numerosCNPJ.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }

  return true;
}

export function isEmailValido(email: string): boolean {
  if (!email) {
    return false;
  }

  // Expressão regular para validar a maioria dos formatos de e-mail comuns.
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

  return emailRegex.test(email);
}

export function randomString(
  size: number,
  characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string {
  let result = '';
  const charSize = characters.length;

  for (let i = 0; i < size; i++) {
    // Escolhe um caractere aleatório do conjunto fornecido
    const index = Math.floor(Math.random() * charSize);
    result += characters.charAt(index);
  }

  return result;
}
