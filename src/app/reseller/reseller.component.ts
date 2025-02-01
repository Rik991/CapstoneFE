import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { iReseller } from '../interfaces/i-reseller';
import { iAutopartResponse } from '../interfaces/i-autopart-response';
import { AutopartsService } from '../services/autopart.service';
import { IPage } from '../interfaces/i-page';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrls: ['./reseller.component.scss'],
})
export class ResellerComponent implements OnInit {
  autoparts: iAutopartResponse[] = [];
  reseller!: iReseller;
  imgUrl: string = environment.imgUrl;

  constructor(
    private authSvc: AuthService,
    private autopartSvc: AutopartsService
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.reseller = user as iReseller;
      if (this.reseller && this.reseller.id) {
        this.loadAutoparts();
      }
    });
  }

  private loadAutoparts(): void {
    if (!this.reseller || !this.reseller.id) {
      console.error('Reseller ID is not available');
      return;
    }

    this.autopartSvc.getByReseller(this.reseller.id).subscribe({
      next: (page: IPage<iAutopartResponse>) => {
        this.autoparts = page.content;
        console.log('Autoparts loaded:', this.autoparts); // Debug
      },
      error: (err) => console.error('Error loading autoparts:', err),
    });
  }

  deleteAutopart(autopartId: number): void {
    if (confirm('Sei sicuro di voler eliminare questo ricambio?')) {
      this.autopartSvc.deleteAutopart(autopartId).subscribe({
        //mi iscrivo all'Observable del service (il metodo restituisce un Observable come tutti gli altri)
        next: () => {
          //in caso la richiesta http ha successo parte il next che gestisce la risposta, con il filter creiamo un array che non contiene il ricambio eliminato
          this.autoparts = this.autoparts.filter((a) => a.id !== autopartId);
          alert('Ricambio eliminato');
        },
        error: (err) => console.error('Errore durante la cancellazione:', err),
      });
    }
  }
}
