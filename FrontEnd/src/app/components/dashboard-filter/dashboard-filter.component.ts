import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatMomentDateModule} from '@angular/material-moment-adapter';

@Component({
  selector: 'app-dashboard-filter',
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule, MatDatepickerModule, MatInputModule, MatSelectModule, CommonModule, MatMomentDateModule],
  templateUrl: './dashboard-filter.component.html',
  styleUrl: './dashboard-filter.component.scss'
})
export class DashboardFilterComponent {
  @Output() filterApplied = new EventEmitter<{status: string, fromDate: Date | null, toDate: Date | null}>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      selectedStatus: ['all'],
      selectedFromDate: [null],
      selectedToDate: [null]
    });
  }

  applyFilter() {
    const { selectedStatus, selectedFromDate, selectedToDate } = this.filterForm.value;
    this.filterApplied.emit({ status: selectedStatus, fromDate: selectedFromDate, toDate: selectedToDate });
  }

  resetFilter() {
    this.filterForm.reset({
      selectedStatus: 'all',
      selectedFromDate: null,
      selectedToDate: null
    });
    this.applyFilter();
  }
}
