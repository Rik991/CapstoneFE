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
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';

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

    // debounce per la ricerca
    const searchControlSub = this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(500),
        filter((value: string) => !value || value.length >= 3) // Filtro, vuoto o almeno 3 caratteri per partire
      )
      .subscribe((value) => {
        if (value) {
          const currentFilters = this.searchForm.value;
          currentFilters.search = (value as string).toLowerCase();
          this.searchChange.emit(currentFilters);
        } else if (value === '') {
          const currentFilters = this.searchForm.value;
          currentFilters.search = '';
          this.searchChange.emit(currentFilters);
        }
      });

    this.subscriptions.add(searchControlSub);

    // altri campi di ricerca
    const otherFieldsSub = this.searchForm.valueChanges
      .pipe(
        debounceTime(300), // Debounce più breve per gli altri campi
        distinctUntilChanged((prev, curr) => {
          // Ignora i cambiamenti del campo 'search' qui, poiché lo gestiamo separatamente
          const prevWithoutSearch = { ...prev, search: null };
          const currWithoutSearch = { ...curr, search: null };
          return (
            JSON.stringify(prevWithoutSearch) ===
            JSON.stringify(currWithoutSearch)
          );
        })
      )
      .subscribe((filters) => {
        // Non modifichiamo qui il valore di search, perché è gestito separatamente
        this.searchChange.emit(filters);
      });

    this.subscriptions.add(otherFieldsSub);
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
