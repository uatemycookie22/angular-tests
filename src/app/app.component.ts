import {Component} from '@angular/core';
import {KissService} from "./kiss.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test1';
  inputValue = '';

  constructor(private kissService: KissService) {

  }

  onClick() {
    this.kissService.kiss()
  }
}
