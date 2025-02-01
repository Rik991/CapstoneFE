import { Condizione } from './i-autopart';

export interface iSearchFilters {
  codiceOe?: string;
  categoria?: string;
  marca?: string;
  modello?: string;
  minPrezzo?: number;
  maxPrezzo?: number;
  condizione?: Condizione;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
