import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Modal } from './components/modal/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Modal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'apispring-frontend';
}
