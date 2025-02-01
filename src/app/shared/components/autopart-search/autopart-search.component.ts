import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { iSearchFilters } from '../../../interfaces/i-search-filters';
import { VehicleService } from '../../../services/vehicle.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

// shared/components/autopart-search/autopart-search.component.ts
@Component({
  selector: 'app-autopart-search',
  templateUrl: './autopart-search.component.html',
})
export class AutopartSearchComponent implements OnInit {
  @Output() searchChange = new EventEmitter<iSearchFilters>();

  searchForm: FormGroup;
  brands: string[] = [];

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    this.searchForm = this.fb.group({
      codiceOe: [''],
      marca: [''],
      modello: [''],
      minPrezzo: [''],
      maxPrezzo: [''],
      categoria: [''],
      condizione: [''],
      search: [''],
    });
  }

  ngOnInit(): void {
    this.loadBrands();

    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((values) => {
        this.searchChange.emit(values);
      });
  }

  private loadBrands(): void {
    this.vehicleService
      .getAllVehicleBrands()
      .subscribe((brands) => (this.brands = brands));
  }
}
