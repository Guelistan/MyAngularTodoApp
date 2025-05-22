import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { UtilsService } from '../utils.service';
import { ImageEditor } from '../image-editor';
import { CalendarComponent } from '../calendar/calendar.component';

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

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, CameraFunctionsComponent, CropperFunctionsComponent, CalendarComponent],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
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
}
