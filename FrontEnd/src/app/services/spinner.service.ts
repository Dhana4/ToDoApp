import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }

  spinner = signal<boolean>(false);
  get displaySpinner(){
    return this.spinner();
  }
  show(){
    this.spinner.set(true);
  }
  hide(){
    this.spinner.set(false);
  }
}
