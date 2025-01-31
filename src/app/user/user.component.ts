import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/i-user';
import { AuthService } from '../auth/auth.service';
import { AutopartsService } from '../services/autopart.service';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { iVehicle } from '../interfaces/i-vehicle';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user!: iUser | undefined;
  autoparts: iAutopartResponse[] = [];
  expanded: { [key: number]: boolean } = {}; //per espandere la card
  vehicles: iVehicle[] = [];
  brands: string[] = [];
  filteredModels: iVehicle[] = [];
  filters: any = {};
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

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
    this.autopartsSvc
      .getAllAutoparts(this.currentPage, this.pageSize)
      .subscribe({
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

  searchAutoparts(): void {
    this.autopartsSvc
      .searchAutoparts(this.filters, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.autoparts = response.content;
          this.totalItems = response.totalElements;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        },
        error: (err) => console.error('Error searching autoparts:', err),
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAutoparts();
    }
  }

  getPages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i);
  }

  toggleExpand(index: number) {
    this.expanded[index] = !this.expanded[index];
  }
}
