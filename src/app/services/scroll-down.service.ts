import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollDownService {

  scrollDowns:any = [];

  constructor() { }

  addScrollDowns = (newScrollDowns:any) => {
    for (let item of newScrollDowns) {
      this.scrollDowns.push(item);
    }
  }

  doScroll = (time:number, elHeight:any) => {
    // Can't scrollDown until PP is visible in DOM
    let checkForPP = () => {
      let findpp = setInterval(() => {
        var pp:any = document.querySelector('#pp_top');
        if (pp) { // found the PP...do our stuff
          clearInterval(findpp);
          // we need to calculate the height of everything above our target area
          // Count any top margin/padding of .one-button-container
          // Count the top & bottom margins/padding of the OO + the OO height
          // Count the top margin/padding of the PP
          // Should scroll to just above Step 1, Step 2, etc in transbtns

          // the thing that will scroll
          let scrollingElement = document.scrollingElement || document.body;
        
          // .partner-header may not exist
          // it's either our element or 0
          let pheader:any = document.querySelector('.partner-header');
          let pheaderStyle:any = pheader && getComputedStyle(pheader);
          let pheaderHeight = pheader && pheader!.offsetHeight || 0;
          let pheaderTopMargin:number = pheader ? parseInt(pheaderStyle['margin-top']) : 0;
          let pheaderTopPadding:number = pheader ? parseInt(pheaderStyle['padding-top']) : 0;
          let pheaderBottomMargin:number = pheader ? parseInt(pheaderStyle['margin-bottom']) : 0;
          let pheaderBottomPadding:number = pheader ? parseInt(pheaderStyle['padding-bottom']) : 0;
          let pheaderTotalHeight:number = pheaderTopMargin + pheaderTopPadding + pheaderHeight + pheaderBottomMargin + pheaderBottomPadding;

          // pp element and height & top/bottom margins
          // let pp:any = document.querySelector('#pp_top');
          let ppStyle:any = getComputedStyle(pp);
          let ppTopMargin:number = parseInt(ppStyle['margin-top']);
          let ppTopPadding:number = parseInt(ppStyle['padding-top']);
          let ppTotalHeight:number = ppTopMargin + ppTopPadding;

          let onebtn:any = document.querySelector('.one-button-container');
          let obStyle:any = getComputedStyle(onebtn);
          let obTopMargin:number = parseInt(obStyle['margin-top']);
          let obTopPadding:number = parseInt(obStyle['padding-top']);
          let obTotalHeight:number = obTopMargin + obTopPadding;

          // oo element and height & top/bottom margins
          let oo:any = document.querySelector('.offer-optimizer');
          let ooHeight = oo ? oo.offsetHeight : 0;
          let ooStyle:any = oo ? getComputedStyle(oo) : null;
          let ooTopMargin:number = oo ? parseInt(ooStyle['margin-top']) : 0;
          let ooBottomMargin:number = oo ? parseInt(ooStyle['margin-bottom']) : 0;
          let ooTopPadding:number = oo ? parseInt(ooStyle['padding-top']) : 0;
          let ooBottomPadding:number = oo ? parseInt(ooStyle['padding-bottom']) : 0;
          let ooTotalHeight:number = ooTopMargin + ooTopPadding + ooHeight + ooBottomMargin + ooBottomPadding;

          // if .header exists (on WP site not localhost:4200) the app has a
          // negative margin that is hard to calculate precisely
          // it's 35
          let magic:number = (window.location.origin == 'http://localhost:4200')
            ? 0 : 35;

          let reveal_elHeight = 0;
          if (elHeight) {
            reveal_elHeight = elHeight;
          }
          let scrollHeight = pheaderTotalHeight + obTotalHeight + ppTotalHeight + ooTotalHeight + magic + reveal_elHeight;

          setTimeout(() => {
            scrollingElement.scrollTop = scrollHeight;
          }, time);
        } else { // PPs isn't there...check again
          checkForPP();
        }
      }, 200);
    }
    checkForPP();
  }

  ////////////////
  // Scroll Down
  ////////////////
  
  scrollDown = (id:any, newdata:any) => {
    for (let item of this.scrollDowns) {
      if (item.isArray) {
        for (let arrayitem of item) {
          if (arrayitem.key == id && arrayitem.value == newdata) {
            this.doScroll(100, arrayitem.height);
          }
        }
      } else {
        if (item.key == id && item.value == newdata) {
          this.doScroll(100, item.height);
        }
      }
    }
  }
}
