import { CustomError, ErrorType } from '@common';

export const errorManager = {
  ROLE_IN_USE: new CustomError({
    localizedMessage: {
      en: 'Role is assigned to an admin',
      ar: 'الدور قيد الاستخدام',
    },
    errorType: ErrorType.CONFLICT,
    event: 'ROLE_IN_USE',
  }),
  ADMIN_NOT_ACTIVE: new CustomError({
    localizedMessage: {
      en: 'Admin is not active',
      ar: 'المستخدم غير نشط',
    },
    errorType: ErrorType.INVALID,
    event: 'ADMIN_NOT_ACTIVE',
  }),
  ADMIN_SUSPEND_SELF: new CustomError({
    localizedMessage: {
      en: 'Admin cannot suspend himself',
      ar: 'لا يمكن للمسؤول تعليق نفسه',
    },
    errorType: ErrorType.CONFLICT,
    event: 'ADMIN_SUSPEND_SELF',
  }),
  ADMIN_NOT_SUSPENDED: new CustomError({
    localizedMessage: {
      en: 'Admin is not suspended',
      ar: 'المستخدم غير معلق',
    },
    errorType: ErrorType.INVALID,
    event: 'ADMIN_NOT_SUSPENDED',
  }),

  ADMIN_UNSUSPEND_SELF: new CustomError({
    localizedMessage: {
      en: 'Admin cannot unsuspend himself',
      ar: 'لا يمكن للمسؤول إلغاء تعليق نفسه',
    },
    errorType: ErrorType.CONFLICT,
    event: 'ADMIN_UNSUSPEND_SELF',
  }),
  ADMIN_DELETE_SELF: new CustomError({
    localizedMessage: {
      en: 'Admin cannot delete himself',
      ar: 'لا يمكن للمسؤول حذف نفسه',
    },
    errorType: ErrorType.CONFLICT,
    event: 'ADMIN_DELETE_SELF',
  }),
  ROLE_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Role not found',
      ar: 'الدور غير موجود',
    },
    errorType: ErrorType.NOT_FOUND,
    event: 'ROLE_NOT_FOUND',
  }),
  ROLE_ALREADY_EXISTS: new CustomError({
    localizedMessage: {
      en: 'Role already exists',
      ar: 'الدور موجود بالفعل',
    },
    errorType: ErrorType.CONFLICT,
    event: 'ROLE_ALREADY_EXISTS',
  }),
  ADMIN_EMAIL_EXISTS: new CustomError({
    localizedMessage: {
      en: 'Email already exists',
      ar: 'البريد الإلكتروني موجود بالفعل',
    },
    errorType: ErrorType.CONFLICT,
    event: 'ADMIN_EMAIL_EXISTS',
  }),
  ADMIN_ROLE_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Admin role not found',
      ar: 'الدور غير موجود',
    },
    errorType: ErrorType.NOT_FOUND,
    event: 'ADMIN_ROLE_NOT_FOUND',
  }),
  ADMIN_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Admin not found',
      ar: 'المستخدم غير موجود',
    },
    event: 'ADMIN_NOT_FOUND',
    errorType: ErrorType.NOT_FOUND,
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
