import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [CommonModule,MatDatepickerModule, MatInputModule, MatSelectModule, MatMomentDateModule],
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.scss'
})
export class SampleComponent {

}
