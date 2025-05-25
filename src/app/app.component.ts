import { Component } from '@angular/core'; // Importiert das Component-Dekorator von Angular
import { TodoComponent } from './todo/todo.component'; // Importiert die Todo-Komponente
import { AdminContactComponent } from './admin-contact/admin-contact.component'; // Importiert die AdminContact-Komponente

@Component({
  selector: 'app-root', // Definiert den Selektor für die Hauptkomponente
  standalone: true, // Gibt an, dass die Komponente eigenständig ist
  // imports: [TodoComponent, AdminContactComponent], // <-- Komponenten importieren (auskommentiert)
  templateUrl: './app.component.html', // Pfad zum HTML-Template
  styleUrls: ['./app.component.css'] // Pfad zur CSS-Datei
})
export class AppComponent {
  todos = []; // Array für ToDo-Elemente
  showCalendar: any; // Variable für Kalender-Anzeige (Typ beliebig)
  showCropper: any; // Variable für Bild-Cropper (Typ beliebig)

  // Methode, die aufgerufen wird, wenn eine Datei ausgewählt wurde
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement; // Typumwandlung auf HTMLInputElement
    if (input.files && input.files.length > 0) { // Prüft, ob Dateien vorhanden sind
      const file = input.files[0]; // Nimmt die erste Datei
      const reader = new FileReader(); // Erstellt einen FileReader zum Lesen der Datei
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.showCropper = e.target?.result as string; // Setzt die Bild-URL für den Cropper
      };
      reader.readAsDataURL(file); // Liest die Datei als DataURL ein
    }
  }
}
