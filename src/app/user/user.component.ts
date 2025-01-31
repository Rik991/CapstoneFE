import { Component } from '@angular/core';
import { iUser } from '../interfaces/i-user';
import { AuthService } from '../auth/auth.service';
import { AutopartsService } from '../services/autopart.service';
import { iAutopart } from '../interfaces/i-autopart';
import { iVehicle } from '../interfaces/i-vehicle';
import { VehicleService } from '../services/vehicle.service';
import { iAutopartResponse } from '../interfaces/i-autopart-response';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user!: iUser | undefined;
  autoparts: iAutopartResponse[] = [];
  expanded: { [key: number]: boolean } = {}; //per espandere la card
  vehicles: iVehicle[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

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
  }

  loadAutoparts(): void {
    this.autopartsSvc
      .getAllAutoparts(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.autoparts = response.content;
          this.totalItems = response.totalElements;
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

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAutoparts();
  }

  toggleExpand(index: number) {
    this.expanded[index] = !this.expanded[index];
  }
}
