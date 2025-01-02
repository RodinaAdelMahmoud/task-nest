import { CustomError, ErrorType } from '@common';

export const errorManager = {
  DUPLICATE_ROLE_NAME: new CustomError({
    localizedMessage: {
      en: 'Role Name Already Exists',
      ar: 'المسمي الوظيفي موجود بالفعل',
    },
    event: 'DUPLICATE_KEY',
    errorType: ErrorType.DUPLICATE,
  }),
  INVALID_ORGANISATION: new CustomError({
    localizedMessage: {
      en: 'Organisation Not Found',
      ar: 'المؤسسة غير موجود',
    },
    event: 'Not_Found',
    errorType: ErrorType.NOT_FOUND,
  }),
  ROLE_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Role Not Found',
      ar: 'المصدر غير موجود',
    },
    event: 'Not_Found',
    errorType: ErrorType.NOT_FOUND,
  }),
  ORGANISATION_ADMIN_PERMISSION_DENIED: new CustomError({
    localizedMessage: {
      en: "You can't assign an employee to an organisation you are not an admin of.",
      ar: 'لا يمكنك تعيين موظف في منظمة لست مشرفاً عليها.',
    },
    event: 'Permission_Denied',
    errorType: ErrorType.FORBIDDEN,
  }),
  INVALID_EMPLOYEE: new CustomError({
    localizedMessage: {
      en: 'Employee Not Found',
      ar: 'ألموظف غير موجود',
    },
    event: 'Not_Found',
    errorType: ErrorType.NOT_FOUND,
  }),
  CANNOT_DELETE_EMPLOYEE_ROLE: new CustomError({
    localizedMessage: {
      en: 'Cannot delete employee role',
      ar: 'لا يمكن حذف المسمي الوظيفي',
    },
    event: 'CANNOT_DELETE_EMPLOYEE_ROLE',
    errorType: ErrorType.CONFLICT,
  }),

  EMPLOYEE_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Employee Not Found',
      ar: 'الموظف غير موجود',
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
  EMAIL_ALREADY_EXSITS: new CustomError({
    localizedMessage: {
      en: 'Employee Already Exists',
      ar: 'الموظف موجود بالفعل',
    },
    event: 'EMAIL_ALREADY_EXSITS',
    errorType: ErrorType.INVALID,
  }),
  NOT_AUTHORIZED: new CustomError({
    localizedMessage: {
      en: 'Not Authorized',
      ar: 'غير مسموح',
    },
    event: 'NOT_AUTHORIZED',
    errorType: ErrorType.UNAUTHORIZED,
  }),

  PHONE_NUMBERS_EQUAL: new CustomError({
    localizedMessage: {
      en: 'Phone numbers cannot be equal',
      ar: 'لا يمكن أن تكون أرقام الهاتف متساوية',
    },
    errorType: ErrorType.INVALID,
    event: 'PHONE_NUMBERS_EQUAL',
  }),

  INVALID_COUNTRY: new CustomError({
    localizedMessage: {
      en: 'Country is invalid',
      ar: 'البلد غير صالح',
    },
    errorType: ErrorType.INVALID,
    event: 'VALIDATE_ADDRESS_FAILED',
  }),

  INVALID_CITY: new CustomError({
    localizedMessage: {
      en: 'City is invalid',
      ar: 'المدينة غير صالحة',
    },
    errorType: ErrorType.INVALID,
    event: 'VALIDATE_ADDRESS_FAILED',
  }),

  INVALID_NATIONALITY: new CustomError({
    localizedMessage: {
      en: 'Nationality is invalid',
      ar: 'الجنسية غير صالحة',
    },
    errorType: ErrorType.INVALID,
    event: 'VALIDATE_NATIONALITY_FAILED',
  }),

  PASSWORD_MISSMATCH: new CustomError({
    localizedMessage: {
      en: 'Incorrect password',
      ar: 'كلمة المرور غير صحيحة',
    },
    event: 'PASSWORD_MISSMATCH',
    errorType: ErrorType.FORBIDDEN,
  }),

  FILE_EXTENSION_REQUIRED: new CustomError({
    localizedMessage: {
      en: 'File extension is missing',
      ar: 'مطلوب امتداد الملف',
    },
    event: 'FILE_EXTENSION_REQUIRED',
    errorType: ErrorType.WRONG_INPUT,
  }),
};
