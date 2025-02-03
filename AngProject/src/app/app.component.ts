import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './navigation_bar/navigation_bar.component';
import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private dialogService: DialogService) {}

  openDialog(component: any) {
    this.dialogService.openDialog('50%', '36%', component);
  }
}
