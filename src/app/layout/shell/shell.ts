import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {}
