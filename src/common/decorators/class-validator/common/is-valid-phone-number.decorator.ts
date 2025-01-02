import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { CustomError } from '@common/classes/custom-error.class';
import { ErrorType } from '@common/enums';

export function IsFirebasePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsFirebasePhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(value)) {
            throw new BadRequestException(
              new CustomError({
                localizedMessage: {
                  en: 'Invalid phone number format',
                  ar: 'صيغة رقم الهاتف غير صالحة',
                },
                errorType: ErrorType.INVALID,
                event: 'PHONE_NUMBER_VALIDATION_FAILED',
              }),
            );
          }
          return true;
        },
      },
    });
  };
}
