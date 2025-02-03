import { Component } from '@angular/core';
import { VariablesService } from '../services/variables.service';
import { NavigationBarComponent } from '../navigation_bar/navigation_bar.component';

@Component({
  selector: 'home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NavigationBarComponent],
})
export class HomeComponent {
  currentRoute: string = '';
  constructor(private variableService: VariablesService) {}

  async ngOnInit(): Promise<void> {
    if (this.variableService.get_pop_up()) {
      if (typeof alert !== 'undefined') {
        alert('To view courses, please sign in first');
      }
    }
  }
}
