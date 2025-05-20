import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';

interface Todo {
  text: string;
  image?: string; // base64 oder URL
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, CameraFunctionsComponent, CropperFunctionsComponent],
  template: `
    <div>
      <input [(ngModel)]="todoInput" placeholder="Neuer Task" (input)="onInput($event)" />
      <button (click)="addTodo()">➕ Hinzufügen</button>
      <ul>
        <li *ngFor="let todo of todos; let i = index" class="todo-card">
          <div>
            <strong>{{ todo.text }}</strong>
            <div *ngIf="todo.image">
              <img [src]="todo.image" alt="Todo Bild" style="max-width:200px;display:block;margin:auto;" />
            </div>
            <div *ngIf="editIndex === i">
              <input type="file" (change)="onFileSelected($event, i)" />
              <button (click)="editImage(i)">Bild ändern</button>
              <app-camera-functions (imageTaken)="onCameraImage($event, i)">
              </app-camera-functions>
              <app-cropper-functions [imageSrc]="todos[i].image ?? ''" (cropped)="onCropped($event, i)">
              </app-cropper-functions>
            </div>
            <button (click)="removeTodo(i)">🗑️</button>
            <button (click)="editIndex = i">Bild bearbeiten</button>
            <button *ngIf="editIndex === i" (click)="editIndex = -1">Fertig</button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .todo-card { border: 1px solid #ccc; margin: 10px 0; padding: 10px; border-radius: 8px; }
  `]
})
export class TodoComponent {
  todoInput = '';
  todos: Todo[] = [];
  editIndex = -1;

  addTodo() {
    if (this.todoInput.trim()) {
      this.todos.push({ text: this.todoInput.trim() });
      this.todoInput = '';
    }
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
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

  onCameraImage(event: any, index: number) {
    // If event is a string (base64 image), use it directly; otherwise, extract image data
    const image = typeof event === 'string' ? event : event?.image || event?.target?.result || '';
    if (image) {
      this.todos[index].image = image;
    }
  }

  onCropped(image: string, index: number) {
    this.todos[index].image = image;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const value = input?.value ?? '';
    console.log('Input event:', value);
  }

  editImage(index: number) {
    this.editIndex = index;
  }
}
