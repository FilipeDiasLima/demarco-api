export interface PaginationParams {
  page: number;
  itemsPerPage: number;
  search?: string | null;
  showRemoved?: boolean;
}
