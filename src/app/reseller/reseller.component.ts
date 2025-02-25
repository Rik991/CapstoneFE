import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { iReseller } from '../interfaces/i-reseller';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { AutopartsService } from '../services/autopart.service';
import { environment } from '../../environments/environment.development';
import { ResellerService } from '../services/reseller.service';
import { ActivatedRoute, Router } from '@angular/router';
import { iRating } from '../interfaces/i-rating';
import { RatingService } from '../services/rating.service';
import { UserService } from '../services/user.service';
import { FavouriteService } from '../services/favourite.service'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrls: ['./reseller.component.scss'],
})
export class ResellerComponent implements OnInit, OnDestroy {
  reseller!: iReseller;
  autoparts: iAutopartResponse[] = [];
  imgUrl: string = environment.imgUrl;
  userRole: string | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;

  // Proprietà per verificare se l'utente è il proprietario (reseller)
  isOwner: boolean = false;

  // Proprietà per la gestione del nuovo rating da inviare
  newRating: iRating = {
    rating: 5,
    comment: '',
    resellerId: 0,
    userId: 0,
  };

  // Proprietà per le recensioni
  reviews: iRating[] = [];
  showReviews: boolean = false;
  // Proprietà per rendere il form di valutazione retrattile (per utenti cliente)
  showRatingForm: boolean = false;

  // Proprietà per la gestione dei preferiti
  favouriteIds: Set<number> = new Set<number>();

  // Per l'anteprima delle immagini
  selectedImageUrl: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authSvc: AuthService,
    private autopartSvc: AutopartsService,
    private resellerSvc: ResellerService,
    private route: ActivatedRoute,
    private ratingSvc: RatingService,
    private userService: UserService,
    private favouriteSvc: FavouriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Sottoscrizione per ottenere l'utente autenticato
    this.subscriptions.add(
      this.authSvc.user$.subscribe((user) => {
        if (user) {
          this.newRating.userId = user.id;
          this.userRole = this.authSvc.getUserRole();
        }
      })
    );

    // Carica i dati del reseller
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        const resellerId = Number(idParam);
        this.loadResellerData(resellerId);
      } else {
        const user = this.authSvc.getCurrentUser();
        if (user) {
          this.loadResellerData(user.id!);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadResellerData(resellerId: number): void {
    this.resellerSvc.getResellerById(resellerId).subscribe({
      next: (reseller) => {
        this.reseller = reseller;
        this.newRating.resellerId = reseller.id!;
        const currentUser = this.authSvc.getCurrentUser();
        this.isOwner = currentUser ? currentUser.id === reseller.id : false;
        // Aggiorna il rating medio
        this.ratingSvc.getAverageRating(reseller.id!).subscribe({
          next: (avg) => (this.reseller.ratingMedio = avg),
          error: (err) =>
            console.error('Errore nel caricamento del rating medio:', err),
        });
        this.loadAutoparts();
        this.loadFavourites();
      },
      error: (err) => console.error('Error loading reseller:', err),
    });
  }

  private loadAutoparts(): void {
    if (!this.reseller?.id) {
      console.error('Reseller ID not available');
      return;
    }
    this.isLoading = true;
    this.autopartSvc
      .getByReseller(this.reseller.id, this.currentPage - 1, this.pageSize)
      .subscribe({
        next: (page) => {
          this.autoparts = page.content;
          this.totalItems = page.totalElements;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading autoparts:', err);
          this.isLoading = false;
        },
      });
  }

  deleteAutopart(autopartId: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.autopartSvc.deleteAutopart(autopartId).subscribe({
        next: () => {
          this.autoparts = this.autoparts.filter((a) => a.id !== autopartId);
          alert('Autopart deleted');
        },
        error: (err) => console.error('Error deleting autopart:', err),
      });
    }
  }

  submitRating(): void {
    if (this.newRating.rating < 1 || this.newRating.rating > 5) {
      alert('Il voto deve essere compreso tra 1 e 5');
      return;
    }
    this.ratingSvc.submitRating(this.newRating).subscribe({
      next: () => {
        alert('Valutazione inviata con successo!');
        this.ratingSvc.getAverageRating(this.newRating.resellerId).subscribe({
          next: (avg) => (this.reseller.ratingMedio = avg),
          error: (err) =>
            console.error('Errore nel caricamento del rating medio:', err),
        });
      },
      error: (err) => {
        console.error("Errore durante l'invio della valutazione:", err);
        alert("Errore durante l'invio della valutazione");
      },
    });
  }

  toggleReviews(): void {
    if (!this.showReviews) {
      this.ratingSvc.getRatingsForReseller(this.reseller.id!).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.showReviews = true;
        },
        error: (err) =>
          console.error('Impossibile visualizzare recensioni', err),
      });
    } else {
      this.showReviews = false;
    }
  }

  toggleRatingForm(): void {
    this.showRatingForm = !this.showRatingForm;
  }

  // Metodi per i preferiti
  loadFavourites(): void {
    this.favouriteSvc.getFavouriteByUser().subscribe({
      next: (favourites: any[]) => {
        favourites.forEach((fav) => {
          this.favouriteIds.add(fav.autopartId);
        });
      },
      error: (err) =>
        console.error('Errore nel caricamento dei preferiti', err),
    });
  }

  toggleFavourite(autopartId: number): void {
    if (this.favouriteIds.has(autopartId)) {
      this.favouriteSvc.removeFavourite(autopartId).subscribe({
        next: () => {
          this.favouriteIds.delete(autopartId);
          alert('Ricambio rimosso dai preferiti');
        },
        error: (err) =>
          console.error('Errore nella rimozione del preferito', err),
      });
    } else {
      this.favouriteSvc.addFavourite(autopartId).subscribe({
        next: () => {
          this.favouriteIds.add(autopartId);
          alert('Ricambio aggiunto ai preferiti');
        },
        error: (err) => console.error('Impossibile aggiungere preferito', err),
      });
    }
  }

  openLightbox(url: string): void {
    this.selectedImageUrl = url;
  }

  closeLightbox(): void {
    this.selectedImageUrl = null;
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
}
