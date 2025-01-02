import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

export function IsNumericOrSpecialCharacters(validationOptions?: ValidationOptions): PropertyDecorator {
  validationOptions = {
    message: 'The value must contain only numbers and special characters',
    ...validationOptions,
  };

  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: 'IsNumericOrSpecialCharacters',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const specialCharactersRegex = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
          if (typeof value !== 'string') {
            return false; // If value is not a string, return false
          }
          return specialCharactersRegex.test(value); // Check if value contains only numbers and special characters
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only numbers and special characters`;
        },
      },
    });
  };
}
