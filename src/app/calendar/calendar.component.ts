import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// Define the Todo interface if not imported from elsewhere
export interface Todo {
  title: string;
  dueDate?: string | Date;
  // Add other properties as needed
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentDate = new Date();
  daysInMonth: Date[] = [];
  @Input() todos: Todo[] = [];
  hasTodoForDay(day: Date): boolean {
    return this.todos.some(todo =>
      todo.dueDate && new Date(todo.dueDate).toDateString() === day.toDateString()
    );
  }

  todosForDay(day: Date): Todo[] {
    return this.todos.filter(todo =>
      todo.dueDate && new Date(todo.dueDate).toDateString() === day.toDateString()
    );
  }

  constructor() {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];

    // Optional: Leere Felder für den ersten Wochentag
    const startDay = firstDay.getDay(); // 0 = Sonntag
    for (let i = 0; i < startDay; i++) {
      days.push(null as any); // Platzhalter
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    this.daysInMonth = days;
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
}
