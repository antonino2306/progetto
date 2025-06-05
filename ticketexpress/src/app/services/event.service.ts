import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { ErrorService } from './error.service'; // aggiungi questo import
import {
  firstValueFrom,
  Observable,
  map,
  catchError,
  BehaviorSubject,
} from 'rxjs';

export interface Event {
  eventID: number;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  backgroundImage: string;
}

export interface Show {
  showID: number;
  startDate: any;
  endDate: any;
  price: number;
  availableTickets: number;
  totalTickets: number;
  locationName: string;
  locationCity: string;
  locationAddress: string;
  locationMaxCapacity: number;
  locationCoords: string;
}

export interface Artist {
  artistID: number;
  name: string;
  type: string;
  genre: string;
  image: string;
  popularity: number;
}

export interface Category {
  categoryID: number;
  name: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  popularEvents: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);
  upComingEvents: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);
  categories: Category[] = [];
  private baseUrl: string = 'http://localhost:3000/events'; // URL del backend per gli eventi
  // private baseUrl = 'http://147.163.216.19:3000/events'; // URL del backend per il carrello

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private errorService: ErrorService // aggiungi qui
  ) {
    this.fetchEvents();
  }

  // Metodo 1: ritorno una promise
  fetchEvents(): Promise<{ upComingEvents: Event[]; popularEvents: Event[] }> {
    return firstValueFrom(
      this.http.get<any>(this.baseUrl, { withCredentials: true })
    )
      .then((response: any) => {
        if (response.success) {
          this.upComingEvents.next(response.upComingEvents);
          this.popularEvents.next(response.popularEvents);
          return {
            upComingEvents: response.upComingEvents,
            popularEvents: response.popularEvents,
          };
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(
            response.message || 'Errore durante il recupero degli eventi'
          );
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(
          err.error.message || 'Errore durante il recupero degli eventi'
        );
      });
  }

  fetchCategories(): Promise<Category[]> {
    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/categories`, {
        withCredentials: true,
      })
    )
      .then((response: any) => {
        if (response.success) {
          return response.categories;
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(
            response.message || 'Errore durante il recupero delle categorie'
          );
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(
          err.error.message || 'Errore durante il recupero delle categorie'
        );
      });
  }

  // Metodo 2: ritorno un observable
  fetchEventsByCategory(category: string): Promise<Event[]> {
    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/category/${category}`, {
        withCredentials: true,
      })
    )
      .then((response: any) => {
        if (response.success) {
          return response.events;
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(
            response.message ||
              'Errore durante il recupero degli eventi per categoria'
          );
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(
          err.error.message ||
            'Errore durante il recupero degli eventi per categoria'
        );
      });
  }

  fetchEventDetails(id: number): Observable<Show[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(
        map((response: any) => {
          if (response.success) {
            return response.events;
          } else {
            this.errorService.handleHttpError(response); // aggiunto
            throw new Error(
              response.message ||
                "Errore durante il recupero dei dettagli dell'evento"
            );
          }
        }),
        catchError((err) => {
          this.errorService.handleHttpError(err); // aggiunto
          throw new Error(
            err.error.message ||
              "Errore durante il recupero dei dettagli dell'evento"
          );
        })
      );
  }

  fetchArtists(eventID: number): Promise<Artist[]> {
    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/${eventID}/artists`, {
        withCredentials: true,
      })
    )
      .then((response: any) => {
        if (response.success) {
          return response.artists;
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(
            response.message || 'Errore durante il recupero degli artisti'
          );
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(
          err.error.message || 'Errore durante il recupero degli artisti'
        );
      });
  }

  searchEvents(params: {
    title?: string;
    location?: string;
    date?: number;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  }): Observable<Event[]> {
    let queryParams = new URLSearchParams();

    if (params.title) queryParams.append('title', params.title);
    if (params.location) queryParams.append('location', params.location);
    if (params.date) queryParams.append('date', params.date.toString());
    if (params.minPrice)
      queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.category) queryParams.append('category', params.category);

    const queryString = queryParams.toString();

    return this.http
      .get<any>(
        `${this.baseUrl}/search${queryString ? '?' + queryString : ''}`,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => {
          if (response.success) {
            console.log(response.events);
            return response.events;
          } else {
            this.errorService.handleHttpError(response); // aggiunto
            throw new Error(
              response.message || 'Errore durante la ricerca degli eventi'
            );
          }
        }),
        catchError((err) => {
          this.errorService.handleHttpError(err); // aggiunto
          throw new Error(
            err.error.message || 'Errore durante la ricerca degli eventi'
          );
        })
      );
  }

  addToFavorites(showID: number): Promise<boolean> {
    return firstValueFrom(
      this.http.post<any>(
        `${this.baseUrl}/add-to-favorites`,
        { showID },
        { withCredentials: true }
      )
    )
      .then((response: any) => {
        if (response.success) {
          this.userService.fetchFavorites();
          return response.success;
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(
            response.message || "Errore durante l'aggiunta ai preferiti"
          );
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(
          err.error.message || "Errore durante l'aggiunta ai preferiti"
        );
      });
  }

  removeFromFavorites(showID: number): Promise<boolean> {
    return firstValueFrom(
      this.http.post<any>(
        `${this.baseUrl}/remove-from-favorites`,
        { showID },
        { withCredentials: true }
      )
    )
      .then((response: any) => {
        if (response.success) {
          this.userService.fetchFavorites();
          return response.success;
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(
            response.message || 'Errore durante la rimozione dai preferiti'
          );
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(
          err.error.message || 'Errore durante la rimozione dai preferiti'
        );
      });
  }

  getEventInfoByID(eventID: number): Promise<Event> {
     return firstValueFrom(
      this.http.get<any>(
        `${this.baseUrl}/event-info/${eventID}`,
        { withCredentials: true }
      )
    )
      .then((response: any) => {
        if (response.success) {
          return response.event;
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(
            response.message || 'Errore durante il recupero delle informazioni dell\'evento'
          );
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(
          err.error.message || 'Errore durante il recupero delle informazioni dell\'evento'
        );
      });
  }

  getEventInfo(showID: number): Promise<Event> {
    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/search-by-show/${showID}`, {
        withCredentials: true,
      })
    )
      .then((response: any) => {
        if (response.success) {
          console.log(response.event);
          return response.event;
        } else {
          this.errorService.handleHttpError(response); // aggiunto
          throw new Error(
            response.message ||
              "Errore durante il recupero delle informazioni dell'evento"
          );
        }
      })
      .catch((err) => {
        this.errorService.handleHttpError(err); // aggiunto
        throw new Error(
          err.error.message ||
            "Errore durante il recupero delle informazioni dell'evento"
        );
      });
  }
}
