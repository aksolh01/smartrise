import { SortDirection } from './enums';

export class BaseParams {
    sort = 'createDate';
    sortDirection?: SortDirection;
    pageIndex = 1;
    pageSize = 0;
    search: string;
}
