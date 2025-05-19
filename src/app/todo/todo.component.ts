
// todo.component.ts (vereinfachte Version, eigenständige Komponente)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <input [(ngModel)]="todoInput" placeholder="Neuer Task" />
      <button (click)="addTodo()">➕ Hinzufügen</button>
      <ul>
        <li *ngFor="let todo of todos; let i = index">
          {{ todo }} <button (click)="removeTodo(i)">🗑️</button>
        </li>
      </ul>
    </div>
  `
})
export class TodoComponent {
  todoInput = '';
  todos: string[] = [];

  addTodo() {
    if (this.todoInput.trim()) {
      this.todos.push(this.todoInput.trim());
      this.todoInput = '';
    }
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
  }
}
