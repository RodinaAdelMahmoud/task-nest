// isObjectId.decorator.ts

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Regular expression to match MongoDB ObjectId format
          const objectIdRegex = /^[0-9a-fA-F]{24}$/;
          return typeof value === 'string' && objectIdRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ObjectId`;
        },
      },
    });
  };
}
