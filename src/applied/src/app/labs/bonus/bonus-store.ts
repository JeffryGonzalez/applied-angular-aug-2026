import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
};

// export type CustomerKeys =
type SortDirection = 'ascending' | 'descending';
type SortableColumns = keyof Omit<Customer, 'id'>;
export const COLUMNS: SortableColumns[] = ['firstName', 'lastName', 'age'] as const;

type BonusState = {
  customers: Customer[];
  sortingBy: SortableColumns;
  sortingDirection: SortDirection;
};
const fakeCustomers: Customer[] = [
  { id: '1', firstName: 'Ava', lastName: 'Anderson', age: 42 },
  { id: '2', firstName: 'Liam', lastName: 'Bennett', age: 23 },
  { id: '3', firstName: 'Mia', lastName: 'Carter', age: 12 },
  { id: '4', firstName: 'Noah', lastName: 'Davis', age: 32 },
  { id: '5', firstName: 'Emma', lastName: 'Evans', age: 19 },
  { id: '6', firstName: 'Oliver', lastName: 'Foster', age: 52 },
  { id: '7', firstName: 'Sophia', lastName: 'Garcia', age: 85 },
  { id: '8', firstName: 'Elijah', lastName: 'Harris', age: 24 },
  { id: '9', firstName: 'Isabella', lastName: 'Johnson', age: 17 },
  { id: '10', firstName: 'James', lastName: 'Morgan', age: 47 },
];
export const BonusStore = signalStore(
  withState<BonusState>({
    customers: fakeCustomers,
    sortingBy: 'lastName',
    sortingDirection: 'ascending',
  }),
  withMethods((store) => {
    return {
      setSorting: (by: SortableColumns, direction: SortDirection) =>
        patchState(store, { sortingBy: by, sortingDirection: direction }),
    };
  }),
  withComputed((store) => {
    return {
      list: computed(() => {
        const customers = store.customers();
        const sortingBy = store.sortingBy();
        const direction = store.sortingDirection();
        return sortCustomers(direction, sortingBy, customers);
      }),
    };
  }),
);

function sortCustomers(direction: SortDirection, column: SortableColumns, customers: Customer[]) {
  return customers.toSorted((a, b) => {
    const lhs =
      typeof a[column] === 'string' ? a[column].toLocaleString().toLocaleLowerCase() : a[column];
    const rhs =
      typeof b[column] === 'string' ? b[column].toLocaleString().toLocaleLowerCase() : b[column];
    if (direction === 'ascending') {
      return lhs > rhs ? 1 : lhs === rhs ? 0 : -1;
    } else {
      return lhs < rhs ? 1 : lhs === rhs ? 0 : -1;
    }
  });
}
