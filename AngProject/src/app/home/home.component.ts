import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../services/dialog.service';
import { Location } from '@angular/common';
import { WarningDialogComponent } from '../warning_dialog/warning_dialog.component';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VariablesService } from '../services/variables.service';
import { MatDialogRef } from '@angular/material/dialog';
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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private variableService: VariablesService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.variableService.get_pop_up()) {
      if (typeof alert !== 'undefined') {
        alert('To view courses, please sign in first');
      }
    }
  }
}
