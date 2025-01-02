interface IPath {
  path: string[];
  weight: number;
}

export interface IBaseSearchIndex {
  index: string;
  paths: IPath[];
}
