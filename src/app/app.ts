import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControlFlow } from './control-flow/control-flow';

@Component({
  imports: [RouterOutlet,ControlFlow],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  status = signal("not Started")
  handleSwitch(event:Event){
    const target = event.target as HTMLSelectElement
    this.status.set(target.value)
  }
}
