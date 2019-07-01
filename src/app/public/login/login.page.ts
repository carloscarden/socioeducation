import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../_services/authentication.service';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  data = '';
  showFooter = true;
  self=this;

  keyboardShowHandler(e){         
     this.showFooter=false;
  };

  keyboardHideHandler(e){
     this.showFooter=true;
  };

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
    ) {
          window.addEventListener('native.keyboardshow', this.keyboardShowHandler);
          window.addEventListener('native.keyboardhide', this.keyboardHideHandler);
     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

     // reset login status
     this.authService.logout();

     // reset login status
     this.authService.logout();

     // get return url from route parameters or default to '/'
     
     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }
  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authService.login(this.f.username.value, this.f.password.value).pipe(first())
    .subscribe(
        data => {
           this.loading=false;
           this.error='';
           this.router.navigate(['/members/menu/agenda/month']);
        },
        error => {
            this.error = "El usuario o la contraseña es incorrecta";
            this.loading = false;
        });;
  }

}
