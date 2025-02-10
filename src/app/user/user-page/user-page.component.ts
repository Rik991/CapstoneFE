import { Component } from '@angular/core';
import { iUser } from '../../interfaces/i-user';
import { AuthService } from '../../auth/auth.service';
import { FavouriteService } from '../../services/favourite.service';
import { IFavourite } from '../../interfaces/i-favourite';
import { iAutopartResponse } from '../../interfaces/i-autopart-response';
import { AutopartsService } from '../../services/autopart.service';
import { environment } from '../../../environments/environment.development';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { UserService } from '../../services/user.service';

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

  isOwner: boolean = false;

  //reactiveform per l'edit dello user
  userForm!: FormGroup;
  editMode: boolean = false;
  selectedAvatar?: File;

  constructor(
    private authSvc: AuthService,
    private favouriteSvc: FavouriteService,
    private autopartSvc: AutopartsService,
    private userSvc: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authSvc.user$.subscribe((user) => {
      this.user = user as iUser;
      this.userRole = this.authSvc.getUserRole();
    });

    this.userForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
    //inizializzato il form carico i dati dello user o con la route o con il metodo nell'authSvc
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        const userId = Number(idParam);
        this.loadUserData(userId);
      } else {
        const user = this.authSvc.getCurrentUser();
        if (user) {
          this.loadUserData(user.id!);
          console.log(user.id);
        }
      }
    });

    this.loadFavourites();
  }

  private loadUserData(userId: number): void {
    this.userSvc.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        const currentUser = this.authSvc.getCurrentUser();
        this.isOwner = currentUser ? currentUser.id === user.id : false;
        this.initForm();
      },
      error: (err) => console.error('Errore nel caricamento dello user', err),
    });
  }

  //metodo per precaricare il form
  initForm(): void {
    this.userForm.patchValue({
      email: this.user.email,
      username: this.user.username,
      name: this.user.name,
      surname: this.user.surname,
      phoneNumber: this.user.phoneNumber,
    });
  }

  //toggle per editare solo se si è autorizzati
  toggleEdit(): void {
    if (this.userRole === 'ROLE_USER' && this.isOwner) {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        this.initForm(), (this.selectedAvatar = undefined);
      }
    }
  }
  // Gestisce la selezione di un nuovo avatar
  onAvatarSelected(event: any): void {
    if (event.target.files?.length) {
      this.selectedAvatar = event.target.files[0];
    }
  }

  //all'invio del form se sono autorizzato aggiorno i campi
  onSubmit(): void {
    if (this.userForm.valid && this.user.id && this.isOwner) {
      const updatedData = this.userForm.getRawValue();
      this.userSvc
        .updateUser(this.user.id, updatedData, this.selectedAvatar)
        .subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.editMode = false;
            this.initForm();
            this.selectedAvatar = undefined;
          },
          error: (err) => console.error('Errore durante la modifica', err),
        });
    }
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
