import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-msg-success',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './msg-success.component.html',
  styleUrl: './msg-success.component.scss'
})
export class MsgSuccessComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
}
