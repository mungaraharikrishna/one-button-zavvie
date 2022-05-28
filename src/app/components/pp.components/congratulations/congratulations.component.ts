import { Component, OnInit } from '@angular/core';
import { ScrollDownService } from '../../../services/scroll-down.service';

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss']
})
export class CongratulationsComponent implements OnInit {
  thankYouMessage = false
  congratulations=true
  
  closeCard(){
    this.thankYouMessage = !this.thankYouMessage
    this.congratulations = !this.congratulations
  }
  constructor(private scrollDownService: ScrollDownService) { }
 
  ngOnInit(): void {
    this.scrollDownService.doScroll(350, false);
  }

}
