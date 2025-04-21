import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  
  title = 'Ponpandiyan-Finance-Proj';

  constructor(private router:Router){}

  ngOnInit(): void {
    this.router.navigateByUrl('welcome')
  }
}
