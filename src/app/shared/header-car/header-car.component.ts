import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-header-car',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './header-car.component.html',
  styleUrl: './header-car.component.scss'
})
export class HeaderCarComponent {

}
