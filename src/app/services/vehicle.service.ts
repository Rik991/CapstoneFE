import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { iVehicle } from '../interfaces/i-vehicle';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  vehicleUrl = environment.vehicleUrl;

  constructor(private http: HttpClient) {}

  getAllVehicles(): Observable<iVehicle[]> {
    return this.http.get<iVehicle[]>(this.vehicleUrl);
  }

  getAllVehicleBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.vehicleUrl}/marche`);
  }

  getVehicleModelsByBrand(brand: string): Observable<iVehicle[]> {
    return this.http.get<iVehicle[]>(`${this.vehicleUrl}/bymarca`, {
      params: { marca: brand },
    });
  }
}
