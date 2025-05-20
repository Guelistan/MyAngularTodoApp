import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { UtilsService } from '../utils.service';
import { ImageEditor } from '../image-editor';
interface Todo {
  text: string;
  image?: string;
  color?: string;
  date?: Date;
  dueDate?: Date;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, CameraFunctionsComponent, CropperFunctionsComponent],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  todoInput = '';
  todoDateInput = '';
  todos: Todo[] = [];
  editIndex = -1;

  imageInput: any;
  history: any[] = [];
  currentDate: Date = new Date();
  daysInMonth: any[] = [];

  showCamera = false;
  imageToEdit: string | null = null;
  croppedImage: string | null = null;
  isBlackAndWhite = false;
  backgroundColor = '#ffffff';
  selectedImage: HTMLImageElement | null = null;

  isDarkMode = signal(false);

  constructor(private utilsService: UtilsService) {
    this.todos = this.utilsService.loadTodosFromLocalStorage();
    this.history = this.utilsService.loadHistory();
  }

  addTodo() {
    if (this.todoInput.trim()) {
      const color = this.utilsService.getRandomRainbowColor();
      this.todos.push({ text: this.todoInput.trim(), color, date: this.currentDate });
      this.todoInput = '';



      this.todos.push({
        text: this.todoInput,
        image: this.imageInput,
        dueDate: new Date(this.todoDateInput)
      });
      this.todoInput = '';
      this.imageInput = '';
      this.todoDateInput = '';
    }
  }

  removeTodo(index: number) {
    const removed = this.todos.splice(index, 1)[0];
    if (removed) {
      this.addToHistory(removed.text); // oder das ganze Objekt speichern
    }
    if (this.editIndex === index) {
      this.editIndex = -1;
    }
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

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.todos[index].image = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onCameraImage(event: any) {
    const image = typeof event === 'string' ? event : event?.image || event?.target?.result || '';
    if (image) {
      this.croppedImage = image;
    }
  }

  onCropped(image: string) {
    this.croppedImage = image;
  }

  ImageEditor:ImageEditor | null = null;
  editImage(index: number) {
    this.editIndex = index;
    this.imageToEdit = this.todos[index].image || null;
  }

  saveImage() {
    if (this.editIndex >= 0 && this.croppedImage) {
      this.todos[this.editIndex].image = this.croppedImage;
      this.editIndex = -1;
      this.imageToEdit = null;
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
    document.body.classList.toggle('dark-mode', this.isDarkMode());
  }

  toggleBlackAndWhite(): void {
    this.isBlackAndWhite = !this.isBlackAndWhite;
    document.body.classList.toggle('black-and-white', this.isBlackAndWhite);
  }

  // Platzhalter für Kalenderfunktionen
  previousMonth() { }
  nextMonth() { }
  isToday(_day: any) { return false; }

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
}
