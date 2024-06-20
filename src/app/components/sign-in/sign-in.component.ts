import { NgClass , CommonModule} from '@angular/common';
import { Component, Renderer2, signal } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
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
  constructor(private tokenService : TokenService,private renderer : Renderer2,private authService : AuthService, private fb : FormBuilder, private router : Router, private activatedRouter : ActivatedRoute){
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
    if(this.signInForm.valid){
      this.authService.login(this.signInForm.value).subscribe({
        next: (data : any) => {
          const token = data.token;
          if (token) {
            this.tokenService.setToken(token);
            this.router.navigateByUrl('/dashboard');
          } else {
            alert('Failed to retrieve token');
          }
        },
        error: (error)=> {
          alert('Invalid credentials');
        }
      });
    }
  }
  onSignUp(){
    if (this.signInForm.valid) {
      const user = this.signInForm.value;
      this.authService.register(user).subscribe({
        next : () => {
        alert('User registered successfully:');
        this.router.navigate(['/signIn']);
      },
      error : (error) => {
        alert('Error registering user');
        console.error('Error registering user:', error);
      }
    }
      );
    }
  }
  // clicked(event : Event){
  //   event.preventDefault();
  //   const button = event.target as HTMLElement;
  //   this.renderer.addClass(button, 'click');
  //   button.addEventListener('transitionend', () => {
  //     button.classList.remove('click');
  //   }, { once: true });
  // }
}
