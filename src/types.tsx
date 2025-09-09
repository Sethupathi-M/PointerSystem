export interface IReward {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isLocked: boolean;
}


export enum ListType {
  MY_DAY = "my-day",
  FAVOURITES = "favourites",
  IDENTITY = "identity",
  REWARDS = "rewards",
}


export enum DrawerType {
  REWARD_DETAILS = "rewardDetails",
  TASK_DETAILS = "taskDetails",
  ADD_IDENTITY = "addIdentity",
}

export interface IdentityItem {
  id: string;
  title: string;
  description: string;
  requiredPoints: number;
} 

enum TaskType {
  Default = 0,
  Counter = 1,
}

export interface TaskItemPayload {
  identityId: string;
  name: string;
  description: string;
  type: TaskType;
  defaultPoints: number;
}


export interface INavItem {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  count: number | null;
  listType: ListType;
}
