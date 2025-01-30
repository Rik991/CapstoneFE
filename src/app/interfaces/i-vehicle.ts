export interface iVehicle {
  id: number;
  marca: string;
  modello: string;
  tipiMotore: string[];
  carrozzeria: string;
  inizioProduzione: number;
  fineProduzione?: number;
}
