import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Interface für Card-Daten
export interface Card {
  id?: number;
  title: string;
  description: string;
  image: string;
  contactId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = 'https://api.example.com/cards'; // URL der API
  private localCards: Card[] = []; // Lokales Array als Fallback oder Zwischenspeicher

  constructor(private http: HttpClient) { }

  // Holt alle Karten aus dem lokalen Array (kann auch angepasst werden für API)
  getCards(): Observable<Card[]> {
    return of(this.localCards);
  }

  // Fügt eine neue Karte hinzu (an API senden und lokal speichern)
  addCard(card: Card): Observable<Card> {
    this.localCards.push(card); // Lokal speichern
    return this.http.post<Card>(`${this.apiUrl}`, card); // An API senden
  }

  // Aktualisiert eine bestehende Karte
  updateCard(card: Card): Observable<Card> {
    const index = this.localCards.findIndex(c => c.id === card.id);
    if (index !== -1) this.localCards[index] = card; // Lokal aktualisieren
    return this.http.put<Card>(`${this.apiUrl}/${card.id}`, card); // API-Update
  }

  // Löscht eine Karte lokal (nicht auf API)
  deleteCard(id: number): Observable<void> {
    this.localCards = this.localCards.filter(c => c.id !== id);

    return this.http.delete<void>(`${this.apiUrl}/${id}`);

  }
}
