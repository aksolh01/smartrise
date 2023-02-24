export interface IPagination {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: any[];
}

export interface Pagination<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}
