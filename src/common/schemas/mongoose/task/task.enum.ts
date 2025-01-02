export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskPriorityScoreEnum {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum TaskStatusEnum {
  TO_DO = 'toDo',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
}

export enum TaskNotificationEnum {
  // TASK_CREATED = 'task.created',
  TASK_ASSIGNED_TO_YOU = 'task.assigned',
  TASK_UPDATED_FOR_BRANCH_MANAGER = 'task.updated.branchManager',
  TASK_CREATED_FOR_BRANCH_MANAGER = 'task.created.branchManager',
}
