import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          const cnpj = value.replace(/\D/g, '');
          if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
            return false;
          }

          let tamanho = cnpj.length - 2;
          let numeros = cnpj.substring(0, tamanho);
          const digitos = cnpj.substring(tamanho);
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
          numeros = cnpj.substring(0, tamanho);
          soma = 0;
          pos = tamanho - 7;

          for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) pos = 9;
          }

          resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
          return resultado === parseInt(digitos.charAt(1));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CNPJ válido`;
        },
      },
    });
  };
}
