/**
 * @description used to return subset of the entire response data
 */
export abstract class PaginationQuery {
  itemsPerPage: number = 10; // specifies how many last activities to return [0 means everything should be returned]
  page: number = 1; // specifies where to start from
}
