import { Component } from '@angular/core';
import { iUser } from '../../interfaces/i-user';
import { AuthService } from '../../auth/auth.service';
import { FavouriteService } from '../../services/favourite.service';
import { IFavourite } from '../../interfaces/i-favourite';
import { iAutopartResponse } from '../../interfaces/i-autopart-response';
import { AutopartsService } from '../../services/autopart.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent {
  user!: iUser;
  favouriteIds: Set<number> = new Set<number>();
  favouriteAutoparts: iAutopartResponse[] = [];
  imgUrl: string = environment.imgUrl;
  userRole: string | null = null;

  constructor(
    private authSvc: AuthService,
    private favouriteSvc: FavouriteService,
    private autopartSvc: AutopartsService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.user = user as iUser;
      this.userRole = this.authSvc.getUserRole();
    });
    this.loadFavourites();
  }

  loadFavourites(): void {
    this.favouriteSvc.getFavouriteByUser().subscribe({
      next: (favourites: IFavourite[]) => {
        // Popola il set favouriteIds con gli autopartId ricevuti
        favourites.forEach((fav) => {
          this.favouriteIds.add(fav.autopartId);
          this.loadAutopartDetails(fav.autopartId);
        });
      },
      error: (err) =>
        console.error('Errore nel caricamento dei preferiti', err),
    });
  }

  toggleFavourite(autopartId: number) {
    if (this.favouriteIds.has(autopartId)) {
      this.favouriteSvc.removeFavourite(autopartId).subscribe({
        next: () => {
          this.favouriteIds.delete(autopartId);
          this.favouriteAutoparts = this.favouriteAutoparts.filter(
            (autopart) => autopart.id !== autopartId
          );
          alert('Ricambio rimosso ai preferiti');
        },
        error: (err) =>
          console.error('Errore nella rimozione del preferito', err),
      });
    } else {
      this.favouriteSvc.addFavourite(autopartId).subscribe({
        next: () => {
          this.favouriteIds.add(autopartId);
          this.loadAutopartDetails(autopartId);
          alert('Ricambio aggiunto ai preferiti');
        },
        error: (err) => console.error('Impossibile aggiungere preferito', err),
      });
    }
  }

  loadAutopartDetails(autopartId: number): void {
    this.autopartSvc.getAutopartById(autopartId).subscribe({
      next: (autopart: iAutopartResponse) => {
        this.favouriteAutoparts.push(autopart);
      },
      error: (err) =>
        console.error('Errore nel caricamento dei dettagli del ricambio', err),
    });
  }
}
