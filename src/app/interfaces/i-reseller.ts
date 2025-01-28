import { iUser } from './i-user';

export interface iReseller extends Partial<iUser> {
  ragioneSociale: string;
  partitaIva: string;
}
