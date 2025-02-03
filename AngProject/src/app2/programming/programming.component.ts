import { Component } from '@angular/core';
import { programmingRouteNames } from '../app.routes';
import { programmingTitles } from '../app.routes';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationBarComponent } from '../navigation_bar/navigation_bar.component';

@Component({
  selector: 'programming',
  standalone: true,
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.css'],
  imports: [RouterLink, RouterLinkActive, CommonModule, NavigationBarComponent],
})
export class ProgrammingComponent {
  programmingRouteNames = programmingRouteNames;
  programmingTitles = programmingTitles;
  constructor() {}
}
