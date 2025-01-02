import { PipelineStage } from 'mongoose';

export function getTaskPipeline(): PipelineStage[] {
  return [
    {
      $lookup: {
        from: 'employees',
        let: { employeeId: '$issuedBy' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', { $ifNull: ['$$employeeId', null] }],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              profilePictureUrl: 1,
            },
          },
        ],
        as: 'issuedBy',
      },
    },
    {
      $unwind: { path: '$issuedBy', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'branches',
        let: { branchId: '$branch' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', { $ifNull: ['$$branchId', null] }],
              },
            },
          },
          {
            $project: {
              _id: 1,
              branchName: 1,
            },
          },
        ],
        as: 'branch',
      },
    },
    {
      $unwind: { path: '$branch', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'employees',
        localField: 'issuedTo',
        foreignField: '_id',
        as: 'issuedTo',
      },
    },
    {
      $addFields: {
        priority: '$priority.level',
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        branch: 1,
        dueDate: 1,
        issuedBy: 1,
        'issuedTo._id': 1,
        'issuedTo.name': 1,
        'issuedTo.profilePictureUrl': 1,
        priority: 1,
        referenceUrl: 1,
        createdAt: 1,
        status: 1,
      },
    },
  ];
}

export function getTasksPipeline(): PipelineStage[] {
  return [
    {
      $lookup: {
        from: 'employees',
        let: { employeeId: '$issuedBy' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', { $ifNull: ['$$employeeId', null] }],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              profilePictureUrl: 1,
            },
          },
        ],
        as: 'issuedBy',
      },
    },
    {
      $unwind: { path: '$issuedBy', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'branches',
        let: { branchId: '$branch' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', { $ifNull: ['$$branchId', null] }],
              },
            },
          },
          {
            $project: {
              _id: 1,
              branchName: 1,
            },
          },
        ],
        as: 'branch',
      },
    },
    {
      $unwind: { path: '$branch', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'employees',
        localField: 'issuedTo',
        foreignField: '_id',
        as: 'issuedTo',
      },
    },
    {
      $addFields: {
        priority: '$priority.level',
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        branch: 1,
        dueDate: 1,
        issuedBy: 1,
        'issuedTo._id': 1,
        'issuedTo.name': 1,
        'issuedTo.profilePictureUrl': 1,
        priority: 1,
        referenceUrl: 1,
        createdAt: 1,
        status: 1,
      },
    },
  ];
}
