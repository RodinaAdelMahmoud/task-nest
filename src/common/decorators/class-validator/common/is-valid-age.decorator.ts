import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { differenceInYears, isValid } from 'date-fns';

export function IsValidAge(validationOptions?: ValidationOptions): PropertyDecorator {
  validationOptions = {
    message: 'Invalid age',
    ...validationOptions,
  };

  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: 'IsValidAge',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!isValid(new Date(value))) {
            return false; // Invalid date format
          }

          const birthDate = new Date(value);
          const currentDate = new Date();
          const age = differenceInYears(currentDate, birthDate);

          // Adjust the age range as needed
          return age >= 18 && age <= 99;
        },
      },
    });
  };
}
