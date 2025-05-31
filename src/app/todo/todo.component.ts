import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { UtilsService } from '../utils.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ImageEditorService } from '../image-editor.service';

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
  imports: [
    CommonModule,
    FormsModule,
    CropperFunctionsComponent,
    CameraFunctionsComponent,
    CalendarComponent,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Input() showImage: boolean = false;

  todoInput = '';
  todoDateInput = '';
  editIndex = -1;
  imageInput: string = '';
  history: string[] = [];
  currentDate: Date = new Date();
  showCropper = false;
  showCamera = false;
  showCalendar = false;

  croppedImage: string | null = null;
  isBlackAndWhite = false;
  backgroundColor = '#ffffff';
  showTodos: boolean = true;
  image: string | null = null;
  imageToEdit: string | null = null;

  newTodo = {
    titel: '',
    description: '',
    image: ''
  };
  editTodo = {
    titel: '',
    description: '',
    image: ''
  };
  editMode = false;

  cropShape: string = 'square'; // oder 'circle', 'oval'

  constructor(
    private utilsService: UtilsService,
    private imageEditor: ImageEditorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
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
  }

  sanitizeId(text: string): string {
    return text.replace(/[^a-zA-Z0-9_-]/g, '_');
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

  saveTodos() {
    this.utilsService.saveTodosToLocalStorage(this.todos);
  }

  addToHistory(task: string) {
    this.history = this.utilsService.addToHistory(task, this.history);
    this.utilsService.saveHistory(this.history);
  }

  clearHistory() {
    this.utilsService.clearHistory();
    this.history = [];
  }

  toggle(section: 'cropper' | 'camera' | 'calendar') {
    this.showCropper = section === 'cropper' ? !this.showCropper : false;
    this.showCamera = section === 'camera' ? !this.showCamera : false;
    this.showCalendar = section === 'calendar' ? !this.showCalendar : false;
  }

  toggleBlackAndWhite() {
    this.isBlackAndWhite = !this.isBlackAndWhite;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('black-and-white', this.isBlackAndWhite);
    }
  }

  cropImage(): void {
    if (this.imageToEdit) {
      this.imageEditor.cropImage('file');
    } else {
      console.error('No image to crop');
    }
  }

  onCropped(croppedImage: string) {
    if (this.editIndex >= 0) {
      this.todos[this.editIndex].image = croppedImage;
      this.saveTodos();
    }
    this.resetCropper();
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

  editImage(index: number) {
    this.editIndex = index;
    this.imageToEdit = this.todos[index].image || '';
    this.showCropper = true;
    this.showCamera = false;
  }

  editImageFromCamera() {
    this.showCamera = true;
    this.showCropper = false;
    this.imageToEdit = null;
  }

  editImageFromFile() {
    this.showCamera = false;
    this.showCropper = true;
    this.imageToEdit = null;
  }

  editImageFromCropped() {
    this.showCamera = false;
    this.showCropper = true;
    this.imageToEdit = this.croppedImage || null;
  }

  onImageCropper(image: string) {
    this.showCropper = true;
    this.showCamera = false;
    this.croppedImage = null;
  }

  onCameraImage(image: string) {
    this.imageToEdit = image;
    this.showCropper = true;
    this.showCamera = false;
  }

  onImageChanged(newImage: string) {
    this.image = newImage;
  }

  toggleCollapse(): void {
    this.showTodos = !this.showTodos;
  }

  cancelCrop() {
    this.resetCropper();
  }

  resetCropper() {
    this.imageToEdit = null;
    this.showCropper = false;
    this.editIndex = -1;
  }
}
