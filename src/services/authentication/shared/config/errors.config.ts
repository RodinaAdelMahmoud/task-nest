import { CustomError, ErrorType } from '@common';

export const errorManager = {
  INCORRECT_EMAIL_OR_PASSWORD: new CustomError({
    localizedMessage: {
      en: 'Incorrect Email or password',
      ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    },
    event: 'LOGIN_FAILED',
    errorType: ErrorType.UNAUTHORIZED,
  }),

  INVALID_SESSION: new CustomError({
    localizedMessage: {
      en: 'Invalid Session',
      ar: 'جلسة غير صالحة',
    },
    event: 'INVALID_SESSION',
    errorType: ErrorType.UNAUTHORIZED,
  }),

  ADMIN_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Admin Not Found',
      ar: 'المستخدم غير موجود',
    },
    event: 'Not_Found',
    errorType: ErrorType.NOT_FOUND,
  }),

  EMPLOYEE_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Employee Not Found',
      ar: 'المستخدم غير موجود',
    },
    event: 'Not_Found',
    errorType: ErrorType.NOT_FOUND,
  }),

  USER_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'User Not Found',
      ar: 'المستخدم غير موجود',
    },
    event: 'Not_Found',
    errorType: ErrorType.NOT_FOUND,
  }),

  MAX_ATTEMPTS_EXCEEDED: new CustomError({
    localizedMessage: {
      en: 'You have exceeded the maximum number of attempts, please try again later',
      ar: 'لقد تجاوزت الحد الأقصى لعدد المحاولات ، يرجى المحاولة مرة أخرى لاحقًا',
    },
    event: 'MAX_ATTEMPTS_EXCEEDED',
    errorType: ErrorType.FORBIDDEN,
  }),

  INCORRECT_EMAIL: new CustomError({
    localizedMessage: {
      en: 'Incorrect Email',
      ar: 'البريد الإلكتروني غير صحيح',
    },
    event: 'INVALID_EMAIL',
    errorType: ErrorType.WRONG_REQUEST,
  }),

  INVALID_ACCESS_TOKEN: new CustomError({
    localizedMessage: {
      en: 'Invalid access token',
      ar: 'رمز الوصول غير صالح',
    },
    event: 'INVALID_ACCESS_TOKEN',
    errorType: ErrorType.UNAUTHORIZED,
  }),

  INCORRECT_CODE: new CustomError({
    localizedMessage: {
      en: 'Incorrect code',
      ar: 'الرمز غير صحيح',
    },
    event: 'INCORRECT_CODE',
    errorType: ErrorType.WRONG_REQUEST,
  }),

  FILE_EXTENSION_REQUIRED: new CustomError({
    localizedMessage: {
      en: 'File extension is missing',
      ar: 'مطلوب امتداد الملف',
    },
    event: 'FILE_EXTENSION_REQUIRED',
    errorType: ErrorType.WRONG_INPUT,
  }),

  EMAIL_ALREADY_EXISTS: new CustomError({
    localizedMessage: {
      en: 'Email Already Exists',
      ar: 'البريد الإلكتروني موجود بالفعل',
    },
    event: 'EMAIL_ALREADY_EXISTS',
    errorType: ErrorType.WRONG_INPUT,
  }),
  CATEGORY_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'category Not Found',
      ar: 'الفئة غير موجودة',
    },
    event: 'Not_Found',
    errorType: ErrorType.WRONG_INPUT,
  }),
};
