import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent]
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    // De Observable (this.httpClient.get) voert een http get-verzoek uit.
    // Definieer het type data: <{places: Place[]}>
    // Subscribe om de request te triggeren. 
    // Na antwoord server wordt de next callback aangeroepen met de responseData.
    const subscription = this.httpClient
      .get<{places: Place[]}>('http://localhost:3000/places')
      .subscribe({ 
        next: (responseData) => {
          console.log(responseData.places);
          this.places.set(responseData.places);
        },
        error: (error) => { // Zie app.js
          console.log(error);
          this.error.set('Something went wrong fetching the places. Please try again later.');
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });

    // Opruimen http-subscription.
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // Subscribe om de request te triggeren. 
  onSelectPlace(selectedPlace: Place) {
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id
    }).subscribe({
      next: (responseData) => console.log(responseData)
    });
  }
}
