/* import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todoInput: string = '';
  imageInput: string = '';
  todos: { text: string; image?: string }[] = [];
  history: string[] = [];

  currentDate: Date = new Date();
  daysInMonth: number[] = [];

  constructor(private utils: UtilsService) { }

  ngOnInit() {
    this.history = this.utils.loadHistory();
    this.todos = this.utils.loadTodosFromLocalStorage();
    this.generateCalendarDays();
  }

  addTodo() {
    if (this.todoInput.trim()) {
      const newTodo = {
        text: this.todoInput,
        image: this.imageInput.trim() || undefined
      };
      this.todos.push(newTodo);
      this.utils.saveTodosToLocalStorage(this.todos);

      this.history = this.utils.addToHistory(this.todoInput, this.history);
      this.utils.saveHistory(this.history);

      this.todoInput = '';
      this.imageInput = '';
    }
  }

  saveTodos() {
    this.utils.saveTodos(this.todos);
  }

  clearHistory() {
    const confirmed = window.confirm('Möchtest du den Verlauf wirklich löschen?');
    if (confirmed) {
      this.history = [];
      this.utils.clearHistory();
    }
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
    this.utils.saveTodosToLocalStorage(this.todos);
  }

  getRandomColor() {
    return this.utils.getRandomRainbowColor();
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendarDays();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendarDays();
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }
  onImageCropped(cropped: string) {
    this.imageInput = cropped;
  }
  onImageReset() {
    this.imageInput = '';
  }
}
 */





import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from '../utils.service';
import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component'; // Adjust the path as needed
import { Router } from '@angular/router';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component'; // Adjust the path as needed
@Component({

  standalone: true,
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  imports: [CommonModule, FormsModule, CropperFunctionsComponent]
})
export class TodoComponent implements OnInit {
  todoInput: string = '';
  imageInput: string = '';
  todos: { text: string; image?: string }[] = [];
  history: string[] = [];

  currentDate: Date = new Date();
  daysInMonth: number[] = [];

  constructor(private utils: UtilsService) { }

  ngOnInit() {
    this.history = this.utils.loadHistory();
    this.todos = this.utils.loadTodosFromLocalStorage();
    this.generateCalendarDays();
  }

  addTodo() {
    if (this.todoInput.trim()) {
      const newTodo = {
        text: this.todoInput,
        image: this.imageInput.trim() || undefined
      };
      this.todos.push(newTodo);
      this.utils.saveTodosToLocalStorage(this.todos);

      this.history = this.utils.addToHistory(this.todoInput, this.history);
      this.utils.saveHistory(this.history);

      this.todoInput = '';
      this.imageInput = '';
    }
  }

  saveTodos() {
    this.utils.saveTodos(this.todos);
  }

  clearHistory() {
    const confirmed = window.confirm('Möchtest du den Verlauf wirklich löschen?');
    if (confirmed) {
      this.history = [];
      this.utils.clearHistory();
    }
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
    this.utils.saveTodosToLocalStorage(this.todos);
  }

  getRandomColor() {
    return this.utils.getRandomRainbowColor();
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendarDays();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendarDays();
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }

  onImageCropped(cropped: string) {
    this.imageInput = cropped;
  }
  onImageError() {
    alert('Fehler beim Laden des Bildes. Bitte versuchen Sie es erneut.');
  }
  onImageReset() {
    this.imageInput = '';
  }
}
