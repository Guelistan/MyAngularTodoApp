import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { UtilsService } from '../utils.service';
import { ImageEditor } from '../image-editor';
import { CalendarComponent } from '../calendar/calendar.component';
import { RouterLink, RouterOutlet } from '@angular/router';

interface Todo {
  text: string;
  image?: string;
  color?: string;
  date?: Date;
  dueDate?: Date;
  id: number;
  titel: string;
  description: string;
  completed: boolean;
}

/**
 * Die TodoComponent verwaltet die Anzeige und Bearbeitung von ToDos.
 *
 * @component
 * @selector app-todo
 *
 * @property {Todo[]} todos - Liste der aktuellen ToDos.
 * @property {string} todoInput - Eingabefeld für neuen ToDo-Text.
 * @property {string} todoDateInput - Eingabefeld für das Fälligkeitsdatum eines neuen ToDos.
 * @property {number} editIndex - Index des aktuell bearbeiteten ToDos, -1 wenn kein ToDo bearbeitet wird.
 * @property {string} imageInput - Temporärer Speicher für das Bild eines neuen ToDos.
 * @property {string[]} history - Verlauf der gelöschten ToDos.
 * @property {Date} currentDate - Aktuelles Datum.
 * @property {boolean} showCropper - Steuert die Sichtbarkeit des Bild-Croppers.
 * @property {boolean} showCamera - Steuert die Sichtbarkeit der Kamera-Komponente.
 * @property {boolean} showCalendar - Steuert die Sichtbarkeit des Kalenders.
 * @property {string | null} imageToEdit - Bild, das aktuell bearbeitet wird.
 * @property {string | null} croppedImage - Das zuletzt zugeschnittene Bild.
 * @property {boolean} isBlackAndWhite - Steuert den Schwarz-Weiß-Modus.
 * @property {string} backgroundColor - Hintergrundfarbe für ToDos.
 * @property {any} saveImage - Platzhalter für gespeicherte Bilder.
 * @property {boolean} showTodos - Steuert die Sichtbarkeit der ToDo-Liste.
 * @property {any} newTodo - Platzhalter für ein neues ToDo.
 * @property {string | null} image - Temporäres Bild für die Bearbeitung.
 * @property {ImageEditor} imageEditor - Instanz des Bildeditors.
 * @property {Todo[]} todosToShow - Gefilterte ToDos zur Anzeige.
 * @property {boolean} showImage - Steuert die Anzeige von Bildern in ToDos.
 *
 * @method toggleCalendar - Öffnet oder schließt den Kalender.
 * @method toggleCropper - Öffnet oder schließt den Bild-Cropper.
 * @method toggleCamera - Öffnet oder schließt die Kamera-Komponente.
 * @method onDragOver - Verhindert das Standardverhalten beim Drag&Drop.
 * @method onDrop - Lädt ein Bild per Drag&Drop in das Eingabefeld.
 * @method addTodo - Fügt ein neues ToDo zur Liste hinzu.
 * @method removeTodo - Entfernt ein ToDo aus der Liste und fügt es dem Verlauf hinzu.
 * @method onFileSelected - Lädt ein Bild aus einer Datei für ein ToDo.
 * @method onCameraImage - Setzt das Bild aus der Kamera zur Bearbeitung.
 * @method onCropped - Speichert das zugeschnittene Bild im ToDo.
 * @method editImage - Öffnet den Cropper für das Bild eines ToDos.
 * @method openCropperFromImage - Öffnet den Cropper für ein beliebiges Bild.
 * @method toggle - Schaltet die Sichtbarkeit von Cropper, Kamera oder Kalender.
 * @method toggleBlackAndWhite - Aktiviert oder deaktiviert den Schwarz-Weiß-Modus.
 * @method saveTodos - Speichert die ToDos im LocalStorage.
 * @method clearHistory - Löscht den Verlauf der gelöschten ToDos.
 * @method addToHistory - Fügt einen ToDo-Text dem Verlauf hinzu.
 * @method toggleCollapse - Blendet die ToDo-Liste ein oder aus.
 * @method onImageChanged - Aktualisiert das aktuelle Bild.
 * @method cropImage - Schneidet das aktuelle Bild mit dem ImageEditor zu.
 *
 * @constructor Lädt ToDos und Verlauf aus dem LocalStorage.
 * @ngOnInit Initialisiert die Anzeige der ToDo-Liste.
 */ @Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CameraFunctionsComponent,
    CropperFunctionsComponent,
    CalendarComponent,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})

export class TodoComponent implements OnInit {
  @Input() todos: Todo[] = [];
  todoInput = '';
  todoDateInput = '';
  editIndex = -1;

  imageInput: string = '';
  history: string[] = [];
  currentDate: Date = new Date();

  showCropper = false;
  showCamera = false;
  showCalendar = false;
  imageToEdit: string | null = null;
  croppedImage: string | null = null;
  isBlackAndWhite = false;
  backgroundColor = '#ffffff';
  saveImage: any;
  showTodos: boolean = true;
  newTodo: any;

  image: string | null = null;
  imageEditor: ImageEditor = new ImageEditor();

  todosToShow: Todo[] = [];
  @Input() showImage: boolean = false;

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  toggleCropper() {
    this.showCropper = !this.showCropper;
  }
  toggleCamera() {
    this.showCamera = !this.showCamera;
  }
  constructor(private utilsService: UtilsService) {
    this.todos = this.utilsService.loadTodosFromLocalStorage().map((item: any, idx: number) => ({
      text: item.text,
      image: item.image,
      color: item.color,
      date: item.date ? new Date(item.date) : undefined,
      dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
      id: item.id ?? Date.now() + idx,
      titel: item.titel ?? '',
      description: item.description ?? '',
      completed: item.completed ?? false
    }));
    this.history = this.utilsService.loadHistory();
  }

  ngOnInit() {
    this.showTodos = true;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageInput = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addTodo() {
    if (this.todoInput.trim()) {
      const color = this.utilsService.getRandomRainbowColor();
      this.todos.push({
        text: this.todoInput.trim(),
        color,
        date: this.currentDate,
        image: this.imageInput,
        dueDate: this.todoDateInput ? new Date(this.todoDateInput) : undefined,
        id: Date.now(),
        titel: '',
        description: '',
        completed: false
      });
      this.todoInput = '';
      this.imageInput = '';
      this.todoDateInput = '';
      this.saveTodos();
    }
  }

  removeTodo(index: number) {
    const removed = this.todos.splice(index, 1)[0];
    if (removed) {
      this.addToHistory(removed.text);
    }
    if (this.editIndex === index) {
      this.editIndex = -1;
    }
    this.saveTodos();
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.todos[index].image = e.target.result;
        this.saveTodos();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onCameraImage(image: string) {
    this.imageToEdit = image;
    this.showCropper = true;
    this.showCamera = false;
  }

  onCropped(cropped: string) {
    this.croppedImage = cropped;
    this.showCropper = false;
    if (this.editIndex >= 0 && this.croppedImage) {
      this.todos[this.editIndex].image = this.croppedImage;
      this.saveTodos();
      this.editIndex = -1;
      this.imageToEdit = null;
      this.croppedImage = null;
    }
  }

  editImage(index: number) {
    this.editIndex = index;
    this.imageToEdit = this.todos[index].image || null;
    this.showCropper = true;
    this.showCamera = false;
  }

  openCropperFromImage(image: string) {
    this.imageToEdit = image;
    this.showCropper = true;
  }

  toggle(section: 'cropper' | 'camera' | 'calendar') {
    this.showCropper = section === 'cropper' ? !this.showCropper : false;
    this.showCamera = section === 'camera' ? !this.showCamera : false;
    this.showCalendar = section === 'calendar' ? !this.showCalendar : false;
  }

  toggleBlackAndWhite() {
    this.isBlackAndWhite = !this.isBlackAndWhite;
    document.body.classList.toggle('black-and-white', this.isBlackAndWhite);
  }

  saveTodos() {
    this.utilsService.saveTodosToLocalStorage(this.todos);
  }

  clearHistory() {
    this.utilsService.clearHistory();
    this.history = [];
  }

  addToHistory(task: string) {
    this.history = this.utilsService.addToHistory(task, this.history);
    this.utilsService.saveHistory(this.history);
  }

  toggleCollapse(): void {
    this.showTodos = !this.showTodos;
  }

  onImageChanged(newImage: string) {
    this.image = newImage;
  }

  // Add this method to fix the missing cropImage error
  cropImage(): void {
    if (this.imageToEdit) {
      this.imageEditor.cropImage(this.imageToEdit);
    } else {
      console.error('No image to crop');
    }

    console.log('cropImage called');
  }
}

