import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/i-user';
import { AuthService } from '../auth/auth.service';
import { AutopartsService } from '../services/autopart.service';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { iVehicle } from '../interfaces/i-vehicle';
import { VehicleService } from '../services/vehicle.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  imgUrl: string = environment.imgUrl;
  user!: iUser | undefined;
  autoparts: iAutopartResponse[] = [];
  expanded: { [key: number]: boolean } = {}; //per espandere la card
  vehicles: iVehicle[] = [];
  brands: string[] = [];
  filteredModels: iVehicle[] = [];
  filters: any = {};
  currentPage: number = 1;
  pageSize: number = 12;
  totalItems: number = 0;
  totalPages: number = 0;
  currentFilters: any = {};

  constructor(
    private authSvc: AuthService,
    private autopartsSvc: AutopartsService,
    private vehicleSvc: VehicleService
  ) {}

  ngOnInit(): void {
    this.authSvc.user$.subscribe((user) => {
      this.user = user;
    });

    this.loadAutoparts();
    this.loadVehicles();
    this.loadBrands();
  }

  loadAutoparts(): void {
    // Copia i filtri correnti
    const filters = { ...this.currentFilters };

    // Se il filtro condizione è valorizzato, convertilo in maiuscolo (oppure esegui eventuali altre conversioni)
    if (filters.condizione) {
      filters.condizione = filters.condizione.toUpperCase();
    }

    // Aggiungi parametri di paginazione e ordinamento (personalizza se necessario)
    filters.page = this.currentPage - 1;
    filters.size = this.pageSize;
    filters.sortBy = filters.sortBy || 'nome';
    filters.sortDir = filters.sortDir || 'asc';

    this.autopartsSvc.searchAutoparts(filters).subscribe({
      next: (response) => {
        this.autoparts = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error: (err) => console.error('Error loading autoparts:', err),
    });
  }

  loadVehicles(): void {
    this.vehicleSvc.getAllVehicles().subscribe({
      next: (vehicles) => (this.vehicles = vehicles),
      error: (err) => console.error('Error loading vehicles:', err),
    });
  }

  loadBrands(): void {
    this.vehicleSvc.getAllVehicleBrands().subscribe({
      next: (brands) => (this.brands = brands),
      error: (err) => console.error('Error loading brands:', err),
    });
  }

  onBrandSelected(event: any): void {
    const brand = event.target.value;
    this.vehicleSvc.getVehicleModelsByBrand(brand).subscribe({
      next: (models) => (this.filteredModels = models),
      error: (err) => console.error('Error loading models:', err),
    });
  }

  onSearchChange(filters: any): void {
    if (filters.search) {
      filters.search = filters.search.toLowerCase();
    }
    this.currentFilters = filters;
    this.currentPage = 1; // resetta la pagina al cambio dei filtri
    this.loadAutoparts();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAutoparts();
    }
  }

  getPages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  toggleExpand(index: number) {
    this.expanded[index] = !this.expanded[index];
  }
}
