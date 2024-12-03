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
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // De Observable (this.httpClient.get) voert een http get-verzoek uit.
    const subscription = this.httpClient
      .get<{places: Place[]}>('http://localhost:3000/places')
      // Subscribe om de request te triggeren. 
      .subscribe({ 
        // Wanneer de server een antwoord terugstuurt, wordt de next callback aangeroepen met de ontvangen data (responseData).
        next: (responseData) => {
          console.log(responseData);
        }
      });

    // Clean up http subscription.
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
