import { Component } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { WarningDialogComponent } from '../warning_dialog/warning_dialog.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { mathRouteNames, mathTitles } from '../app.routes';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from '../navigation_bar/navigation_bar.component';

@Component({
  selector: 'math',
  standalone: true,
  templateUrl: './math.component.html',
  styleUrls: ['./math.component.css'],
  imports: [RouterLink, RouterLinkActive, CommonModule, NavigationBarComponent],
})
export class MathComponent {
  mathRoutesNames = mathRouteNames;
  mathTitles = mathTitles;
  constructor() {}
}
