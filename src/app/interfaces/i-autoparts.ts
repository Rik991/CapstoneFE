import { iVehicle } from './i-vehicle';

export interface iAutopart {
  id: number;
  nome: string;
  codiceOe: string;
  descrizione: string;
  categoria: string;
  immagine: string;
  veicoliCompatibili: iVehicle[];
}
