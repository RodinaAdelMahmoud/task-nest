// import { IDepartmentModel } from '@common/schemas/mongoose/department/department.type';

// export async function rootDepartmentInitialize(departmentModel: IDepartmentModel) {
//   const rootDepartmentName = {
//     en: 'Ministers Office',
//     ar: 'مكتب الوزير',
//   };

//   let rootDepartment = await departmentModel.findOne({ name: rootDepartmentName });

//   if (!rootDepartment) {
//     rootDepartment = await departmentModel.create({
//       name: rootDepartmentName,
//       level: 0,
//     });
//     console.log('Root Department initialized');
//   } else {
//     // If the department already exists, update its level to 0
//     rootDepartment.level = 0;
//     await rootDepartment.save();
//     console.log('Root Department level updated');
//   }

//   return rootDepartment;
// }
