import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsEightDigitNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEightDigitNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'number' || isNaN(value)) {
            return false;
          }
          const stringValue = value.toString();
          return stringValue.length === 8;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an 8-digit number`;
        },
      },
    });
  };
}
