import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from './../../_services/authentication.service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  selectedPath='';
  constructor(
    private authService: AuthenticationService,
    private router:Router) { 
    this.router.events.subscribe((event:RouterEvent)=>{
      this.selectedPath=event.url;
    })
  }

  ngOnInit() {
  }

  openActividades() {
    this.router.navigateByUrl('/members/menu/actividad/seleccionarActividad');
  }

  openAgenda() {
    this.router.navigateByUrl('/members/menu/agenda/month');
  }


  openInformes() {
    this.router.navigate(["/members/menu/actividadesLectura/seleccionarInforme"]);
  }



  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
