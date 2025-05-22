import { Component } from '@angular/core';
import { TodoComponent } from './todo/todo.component';
import { AdminContactComponent } from './admin-contact/admin-contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todos = [];
}
