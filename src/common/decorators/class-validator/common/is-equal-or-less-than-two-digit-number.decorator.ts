import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsEqualToOrLessThanTwoDigitNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEqualToOrLessThanTwoDigitNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'number' || isNaN(value)) {
            return false;
          }
          const stringValue = value.toString();
          return stringValue.length <= 2;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a 1-digit or 2-digits number`;
        },
      },
    });
  };
}
