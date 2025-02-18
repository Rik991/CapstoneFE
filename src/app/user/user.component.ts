import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AutopartsService } from '../services/autopart.service';
import { FavouriteService } from '../services/favourite.service';
import { ResellerService } from '../services/reseller.service';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { iUser } from '../interfaces/i-user';
import { IFavourite } from '../interfaces/i-favourite';
import { iResellerInfo } from '../interfaces/i-reseller-info';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  imgUrl: string = environment.imgUrl;
  user: iUser | undefined;
  autoparts: iAutopartResponse[] = [];
  expanded: boolean[] = [];
  infoExpanded: boolean[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;
  totalPages: number = 0;
  currentFilters: any = {};
  selectedImageUrl: string | null = null;
  favouriteIds: Set<number> = new Set<number>();
  userRole: string | null = null;
  private subscriptions: Subscription = new Subscription();
  isLoading = false;

  constructor(
    private authSvc: AuthService,
    private autopartsSvc: AutopartsService,
    private favouriteSvc: FavouriteService,
    private resellerSvc: ResellerService
  ) {}

  ngOnInit(): void {
    const userSub = this.authSvc.user$.subscribe((user) => {
      this.user = user;
      this.userRole = this.authSvc.getUserRole();
    });
    this.subscriptions.add(userSub);
    this.loadFavourites();
    this.loadAutoparts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getFullStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0); // Arrotonda direttamente per riempire correttamente
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.1 && rating % 1 <= 0.4; // Mostra mezza stella solo se fra 0.1 e 0.4
  }

  getEmptyStars(rating: number): number[] {
    const fullStars = Math.round(rating); // Arrotonda per eccesso quando >= 0.5
    const halfStar = this.hasHalfStar(rating) ? 1 : 0;
    return Array(5 - fullStars - halfStar).fill(0); // Completa con stelle vuote
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
        favourites.forEach((fav) => {
          this.favouriteIds.add(fav.autopartId);
        });
      },
      error: (err) =>
        console.error('Errore nel caricamento dei preferiti', err),
    });
  }

  loadAutoparts(): void {
    this.isLoading = true;
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
        this.isLoading = false;
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
    this.currentPage = 1;
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

  toggleExpand(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }

  toggleInfo(index: number): void {
    this.infoExpanded[index] = !this.infoExpanded[index];
  }

  toggleFavourite(autoparId: number): void {
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
