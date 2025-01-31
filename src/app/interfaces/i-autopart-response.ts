import { Condizione } from './i-autopart';
import { IPriceInfo } from './i-price-info';
import { iResellerInfo } from './i-reseller-info';
import { IVehicleInfo } from './i-vehicle-info';

export interface iAutopartResponse {
  id: number;
  nome: string;
  codiceOe: string;
  descrizione: string;
  categoria: string;
  condizione: Condizione;
  immagine?: string;
  veicoliCompatibili: IVehicleInfo[];
  prezzi: IPriceInfo[];
  reseller: iResellerInfo;
}
