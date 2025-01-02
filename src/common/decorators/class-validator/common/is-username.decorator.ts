import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsUsername(validationOptions?: ValidationOptions): PropertyDecorator {
  validationOptions = {
    message: 'Please enter a valid name without spaces or special characters',
    ...validationOptions,
  };

  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: 'IsUserName',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          const trimmedValue = value.trim();
          const isMatched = /^[a-zA-Z]+$/.test(trimmedValue) && trimmedValue.length > 0;

          return isMatched;
        },
      },
    });
  };
}
