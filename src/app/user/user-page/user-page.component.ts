import { Component, OnDestroy, OnInit } from '@angular/core';
import { iUser } from '../../interfaces/i-user';
import { AuthService } from '../../auth/auth.service';
import { FavouriteService } from '../../services/favourite.service';
import { iAutopartResponse } from '../../interfaces/i-autopart-response';
import { AutopartsService } from '../../services/autopart.service';
import { environment } from '../../../environments/environment.development';

import { Subscription } from 'rxjs';
import { IFavourite } from '../../interfaces/i-favourite';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  user!: iUser;
  favouriteAutoparts: iAutopartResponse[] = [];
  imgUrl: string = environment.imgUrl;
  favouriteIds: Set<number> = new Set<number>();
  userRole: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authSvc: AuthService,
    private favouriteSvc: FavouriteService,
    private autopartsSvc: AutopartsService
  ) {}

  ngOnInit(): void {
    // Ottieni l'utente corrente
    this.subscriptions.add(
      this.authSvc.user$.subscribe((user) => {
        if (user) {
          this.user = user;
          this.userRole = this.authSvc.getUserRole();
          this.loadFavourites();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadFavourites(): void {
    this.favouriteSvc.getFavouriteByUser().subscribe({
      next: (favourites: IFavourite[]) => {
        favourites.forEach((fav) => {
          this.favouriteIds.add(fav.autopartId);
          this.loadAutopartDetails(fav.autopartId);
        });
      },
      error: (err) =>
        console.error('Errore nel caricamento dei preferiti', err),
    });
  }

  loadAutopartDetails(autopartId: number): void {
    this.autopartsSvc.getAutopartById(autopartId).subscribe({
      next: (autopart: iAutopartResponse) => {
        // Evita duplicati (opzionale)
        if (!this.favouriteAutoparts.find((a) => a.id === autopart.id)) {
          this.favouriteAutoparts.push(autopart);
        }
      },
      error: (err) =>
        console.error('Errore nel caricamento dei dettagli del ricambio', err),
    });
  }

  toggleFavourite(autopartId: number): void {
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
}
