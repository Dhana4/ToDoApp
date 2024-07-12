import { NgClass , CommonModule} from '@angular/common';
import { Component, Renderer2, signal } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/login.service';
import { TokenService } from '../../../shared/services/token.service';
import { ToastrService } from 'ngx-toastr';
import { Tokens } from '../../../shared/interfaces/tokens';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, CommonModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm : FormGroup;
  isSignIn = signal<boolean>(false);
  isSignUp = signal<boolean>(false);
  constructor(private toastr : ToastrService,private tokenService : TokenService,private renderer : Renderer2,private authService : AuthService, private fb : FormBuilder, private router : Router, private activatedRouter : ActivatedRoute){
    this.signInForm = this.fb.group({
      UserName : ['',Validators.required],
      Password : ['',Validators.required]
    });
  }
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateRouteState(this.router.url);
      }
    }); 
    this.updateRouteState(this.router.url);
  }
  updateRouteState(url: string) {
    this.isSignUp.set(url.includes("signUp"));
    this.isSignIn.set(url.includes("signIn"));
  }
  onSignIn(){
    this.signInForm.markAllAsTouched();
    if(this.signInForm.valid){
      this.authService.login(this.signInForm.value).subscribe({
        next: (data : Tokens) => {
          if (data) {
            this.tokenService.setToken(data);
            this.router.navigateByUrl('/auth/dashboard');
          } else {
            this.toastr.error('Failed to retrive tokens','Error');
          }
        },
        error: (error)=> {
          const errorMessage = error.error?.message || 'Invalid credentials';
          this.toastr.error(errorMessage, 'Error');
        }
      });
    }
  }
  onSignUp(){
    this.signInForm.markAllAsTouched();
    if (this.signInForm.valid) {
      const user = this.signInForm.value;
      this.authService.register(user).subscribe({
        next : () => {
        this.toastr.success('User registered successfully', 'Sucess');
        this.router.navigate(['/unauth/signIn']);
      },
      error : (error) => {
        if(error.status === 400){
          this.toastr.error('User already exist', 'Error');
        }
        else{
          this.toastr.error('Error in registering user', 'Error');
        }
        console.error('Error registering user:', error);
      }
    }
      );
    }
  }
}
