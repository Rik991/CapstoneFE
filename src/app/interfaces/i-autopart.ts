import { iResellerInfo } from './i-reseller-info';

export enum Condizione {
  NUOVO = 'NUOVO',
  USATO = 'USATO',
  RICONDIZIONATO = 'RICONDIZIONATO',
}

export interface iAutopart {
  id?: number;
  nome: string;
  codiceOe: string;
  descrizione: string;
  categoria: string;
  condizione: Condizione;
  immagine?: string;
  prezzo: number;
  veicoliIds: number[]; // Nome corretto
  resellerId?: number;
}
