import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Movie {
  title: string;
  releaseYear: number;
  hero: string;
  watchDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  // Get movies in the watchlist
  getWatchlistMovies(): Observable<Movie[]> {
    const watchlistRef = collection(this.firestore, 'watchlist');
    return collectionData(watchlistRef, { idField: 'id' }) as Observable<Movie[]>;
  }

  // Add a movie to the watchlist
  addToWatchlist(movie: Movie) {
    const watchlistRef = collection(this.firestore, 'watchlist');
    return addDoc(watchlistRef, movie);
  }
}
