import { Component, OnInit } from '@angular/core';
import { iUser } from '../interfaces/i-user';
import { AuthService } from '../auth/auth.service';
import { AutopartsService } from '../services/autopart.service';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { iVehicle } from '../interfaces/i-vehicle';
import { VehicleService } from '../services/vehicle.service';
import { environment } from '../../environments/environment.development';
import { Subscription } from 'rxjs';
import { FavouriteService } from '../services/favourite.service';
import { IFavourite } from '../interfaces/i-favourite';
import { iReseller } from '../interfaces/i-reseller';
import { ResellerService } from '../services/reseller.service';
import { iResellerInfo } from '../interfaces/i-reseller-info';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  imgUrl: string = environment.imgUrl;
  user!: iUser | undefined;
  autoparts: iAutopartResponse[] = [];
  expanded: boolean[] = [];
  infoExpanded: boolean[] = [];
  vehicles: iVehicle[] = [];
  brands: string[] = [];
  filteredModels: iVehicle[] = [];
  filters: any = {};
  currentPage: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;
  totalPages: number = 0;
  currentFilters: any = {};
  selectedImageUrl: string | null = null;
  favouriteIds: Set<number> = new Set<number>(); // Per tenere traccia dei preferiti
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authSvc: AuthService,
    private autopartsSvc: AutopartsService,
    private favouriteSvc: FavouriteService,
    private resellerSvc: ResellerService
  ) {}

  ngOnInit(): void {
    // Gestione della subscription per ottenere l'utente corrente
    const userSub = this.authSvc.user$.subscribe((user) => {
      this.user = user;
    });
    this.subscriptions.add(userSub);
    this.loadFavourites();
    this.loadAutoparts();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getFullStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return Array(emptyStars).fill(0);
  }

  openLightbox(url: string): void {
    this.selectedImageUrl = url;
  }

  closeLightbox(): void {
    this.selectedImageUrl = null;
  }

  loadFavourites(): void {
    this.favouriteSvc.getFavouriteByUser().subscribe({
      next: (favourites: IFavourite[]) => {
        // Popola il set favouriteIds con gli autopartId ricevuti
        favourites.forEach((fav) => {
          this.favouriteIds.add(fav.autopartId);
        });
      },
      error: (err) =>
        console.error('Errore nel caricamento dei preferiti', err),
    });
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

  loadResellerInfo(autopart: iAutopartResponse): void {
    this.resellerSvc.getResellerInfoById(autopart.reseller.id).subscribe({
      next: (reseller: iResellerInfo) => {
        autopart.reseller = reseller;
      },
      error: (err) => console.error('Error loading reseller info:', err),
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

  toggleExpand(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }

  toggleInfo(index: number): void {
    this.infoExpanded[index] = !this.infoExpanded[index];
  }

  //toggle per fare add e remove del favourite

  toggleFavourite(autoparId: number) {
    if (this.favouriteIds.has(autoparId)) {
      this.favouriteSvc.removeFavourite(autoparId).subscribe({
        next: () => {
          this.favouriteIds.delete(autoparId);
          alert('Ricambio rimosso ai preferiti');
        },
        error: (err) => console.error('Errore nella rimozione del preferito'),
      });
    } else {
      this.favouriteSvc.addFavourite(autoparId).subscribe({
        next: () => {
          this.favouriteIds.add(autoparId);
          alert('Ricambio aggiunto ai preferiti');
        },
        error: (err) => console.error('Impossibile aggiungere preferito'),
      });
    }
  }
}
