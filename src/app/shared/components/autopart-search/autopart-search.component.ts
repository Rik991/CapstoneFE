import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle.service';
import { iVehicle } from '../../../interfaces/i-vehicle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-autopart-search',
  templateUrl: './autopart-search.component.html',
  styleUrls: ['./autopart-search.component.scss'],
})
export class AutopartSearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  brands: string[] = [];
  filteredModels: iVehicle[] = [];
  private subscriptions: Subscription = new Subscription();
  isFiltersExpanded: boolean = false;

  @Output() searchChange = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private vehicleSvc: VehicleService) {
    this.searchForm = this.fb.group({
      codiceOe: [''],
      categoria: [''],
      marca: [''],
      modello: [''],
      minPrezzo: [''],
      maxPrezzo: [''],
      condizione: [''],
      search: [''],
    });
  }

  ngOnInit(): void {
    this.loadBrands();
    const formSub = this.searchForm.valueChanges.subscribe((filters) => {
      if (filters.search) {
        filters.search = filters.search.toLowerCase();
      }
      this.searchChange.emit(filters);
    });
    this.subscriptions.add(formSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  resetForm(): void {
    this.searchForm.reset({
      codiceOe: '',
      categoria: '',
      marca: '',
      modello: '',
      minPrezzo: '',
      maxPrezzo: '',
      condizione: '',
      search: '',
    });
    this.searchChange.emit(this.searchForm.value);
  }

  toggleAdvancedFilters(): void {
    this.isFiltersExpanded = !this.isFiltersExpanded;
  }
}
