import { Component, Input } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from '../description/description.component';
import { SubmissionsComponent } from '../submissions/submissions.component';

@Component({
  selector: 'left-workspace',
  standalone: true,
  imports: [
    MatToolbar,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    DescriptionComponent,
    SubmissionsComponent,
  ],
  templateUrl: './left-workspace.component.html',
  styleUrl: './left-workspace.component.css',
})
export class LeftWorkspaceComponent {
  @Input() selectedNavItem: string;
  @Input() loading_submission: boolean;
  parent_route: string = '';
  constructor(private router: Router) {
    this.selectedNavItem = 'description_page';
    this.loading_submission = true;
  }

  ngOnInit() {
    this.parent_route = this.router.url.split('/').slice(0, -1).join('/');
  }
}
