
import { Injectable } from '@angular/core';

export interface TodoItem {
  text: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private readonly maxHistoryItems = 10;
  private readonly todosKey = 'todos';
  private readonly historyKey = 'todoHistory';

  constructor() { }

  getRandomRainbowColor(): string {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  saveTodos(todos: TodoItem[]): void {
    fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todos)
    })
      .then(response => response.text())
      .then(data => console.log('Server-Antwort:', data))
      .catch(error => console.error('Fehler beim Speichern auf Server:', error));
  }

  saveTodosToLocalStorage(todos: TodoItem[]): void {
    localStorage.setItem(this.todosKey, JSON.stringify(todos));
  }

  loadTodosFromLocalStorage(): TodoItem[] {
    try {
      const data = localStorage.getItem(this.todosKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Fehler beim Laden der Todos:', error);
      return [];
    }
  }

  addToHistory(task: string, historyList: string[]): string[] {
    const timestamp = new Date().toLocaleDateString() + ' um ' + new Date().toLocaleTimeString();
    const entry = `${task} - Erledigt am: ${timestamp}`;
    const updatedList = [...historyList, entry];

    return updatedList.slice(-this.maxHistoryItems); // kürzt sauber von hinten
  }

  saveHistory(history: string[]): void {
    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  loadHistory(): string[] {
    try {
      const data = localStorage.getItem(this.historyKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Fehler beim Laden des Verlaufs:', error);
      return [];
    }
  }

  clearHistory(): void {
    localStorage.removeItem(this.historyKey);
  }
}
