import { CustomError, ErrorType } from '@common';

export const errorManager = {
  TASK_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Task Not Found',
      ar: 'التكليف غير موجود',
    },
    event: 'Not_Found',
    errorType: ErrorType.NOT_FOUND,
  }),
  INVALID_ORGANISATION: new CustomError({
    localizedMessage: {
      en: 'Organisation is invalid',
      ar: 'المنظمة غير صالح',
    },
    errorType: ErrorType.INVALID,
    event: 'INVALID_ORGANISATION',
  }),

  FILE_EXTENSION_REQUIRED: new CustomError({
    localizedMessage: {
      en: 'File extension is missing',
      ar: 'مطلوب امتداد الملف',
    },
    event: 'FILE_EXTENSION_REQUIRED',
    errorType: ErrorType.WRONG_INPUT,
  }),

  NO_PERMISSIONS_OVER_EMPLOYEE: new CustomError({
    localizedMessage: {
      en: "You don't have permissions over the assignee",
      ar: 'ليس لديك صلاحيات علي الشخص المعين',
    },
    event: 'NO_PERMISSIONS_OVER_EMPLOYEE',
    errorType: ErrorType.FORBIDDEN,
  }),

  NOT_BRANCH_OR_REGION_MANAGER: new CustomError({
    localizedMessage: {
      en: 'Only Region and Branch Managers can view this resource',
      ar: 'يمكن لمدير الفرع و مدير المنطقة  فقط رؤية هذا المصدر',
    },
    event: 'NOT_BRANCH_OR_REGION_MANAGER',
    errorType: ErrorType.FORBIDDEN,
  }),

  EMPLOYEE_NOT_IN_BRANCH: new CustomError({
    localizedMessage: {
      en: 'Employee not in the selected branch',
      ar: 'الموظف ليس بالفرع المختار',
    },
    event: 'EMPLOYEE_NOT_IN_BRANCH',
    errorType: ErrorType.FORBIDDEN,
  }),

  NO_PERMISSION_TO_ASSIGN: new CustomError({
    localizedMessage: {
      en: "You don't have permission to assign employees to tasks",
      ar: 'غير مصرح لك بتعيين اشخاص علي المهام',
    },
    event: 'NO_PERMISSION_TO_ASSIGN',
    errorType: ErrorType.FORBIDDEN,
  }),

  INVALID_DATE: new CustomError({
    localizedMessage: {
      en: 'The selected date has already passed',
      ar: 'التاريخ المختار قد مر بالفعل',
    },
    event: 'INVALID_DATE',
    errorType: ErrorType.CONFLICT,
  }),
};
