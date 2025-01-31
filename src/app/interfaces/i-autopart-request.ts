export interface iAutopartRequest {
  nome: string;
  codiceOe: string;
  descrizione: string;
  categoria: string;
  condizione: string;
  immagine?: string;
  prezzo: number;
  veicoliCompatibiliIds: number[];
}
