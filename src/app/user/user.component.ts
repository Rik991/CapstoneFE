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
  }

  loadAutoparts(): void {
    const filters = {
      ...this.currentFilters,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.autopartsSvc.searchAutoparts(filters).subscribe({
      next: (response) => {
        this.autoparts = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error: (err) => console.error('Error loading autoparts:', err),
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
      .map((x, i) => i + 1);
  }

  toggleExpand(index: number) {
    this.expanded[index] = !this.expanded[index];
  }
}
