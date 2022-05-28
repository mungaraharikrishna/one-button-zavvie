import { Injectable } from '@angular/core';
import { FieldNameService } from './field-name.service';
import { PlatformDataService } from './platform-data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  isbuyer:boolean = false;
  isseller:boolean = false;
  prevSellerOnly: boolean = false;
  express:boolean = false;


  constructor(private pds: PlatformDataService,
  private fns: FieldNameService,
  private router: Router) {
    this.pds.currentBuyerStatus.subscribe(newstatus => this.isbuyer = newstatus);
    this.pds.currentSellerStatus.subscribe(newstatus => this.isseller = newstatus);
    this.pds.currentPrevSellerOnly.subscribe(newstatus => this.prevSellerOnly = newstatus);
    this.pds.activateExpressRouteStatus.subscribe(newstatus => this.express = newstatus);
  }

  //////////////////////////////////////////
  // Returns a Component's Next / Back routes
  // Also home | success | ppstart | photos
  ///////////////////////////////////////////
  BASEPATH = () => this.pds.getData('home');

  bridgeSS = () => {
    let ss = this.fns.FieldNames.sellerSolutions.SellerSolutions;
    let ssCheckArray = this.pds.getUserData(ss);
    return ssCheckArray.includes("Bridge")  ? true : false;
  }

  bridgeOnly = () => {
    let ss = this.fns.FieldNames.sellerSolutions.SellerSolutions;
    let ssCheckArray = this.pds.getUserData(ss);
    return ssCheckArray && ssCheckArray.length == 1 && ssCheckArray.includes("Bridge") ? true : false;
  }

  goto = {
    home: () => this.router.navigate([this.BASEPATH()], { queryParamsHandling: 'preserve' }),
    success: () => this.router.navigate([this.BASEPATH() + '/success'], { queryParamsHandling: 'preserve' }),
    ppstart: () => this.express
      ? this.router.navigate([this.BASEPATH() + '/property/1'], { queryParamsHandling: 'preserve' })
      : (this.isseller && !this.isbuyer)
        ? this.router.navigate([this.BASEPATH() + '/solutions/2'], { queryParamsHandling: 'preserve' })
        : this.router.navigate([this.BASEPATH() + '/solutions/1'], { queryParamsHandling: 'preserve' }),
    photos: () => this.router.navigate([this.BASEPATH() + '/photos/1'], { queryParamsHandling: 'preserve' }),
    //
    // each component
    buyerSolutions: { // (/solutions/1)
      next: () => (this.isbuyer && !this.isseller)
          ? this.router.navigate([this.BASEPATH() + '/general-info'], { queryParamsHandling: 'preserve' }) // Buyer Only
          : (this.isbuyer && this.isseller && this.prevSellerOnly)
            ? this.router.navigate([this.BASEPATH() + '/general-info'], { queryParamsHandling: 'preserve' })
            : this.router.navigate([this.BASEPATH() + '/solutions/2'], { queryParamsHandling: 'preserve' }),
      back: () => this.router.navigate([this.BASEPATH() + '/solutions/2'], { queryParamsHandling: 'preserve' })
    },
    sellerSolutions: { // (/solutions/2)
      back: () => this.router.navigate([this.BASEPATH() + '/solutions/1'], { queryParamsHandling: 'preserve' }),
      next: () => (this.isbuyer && this.isseller && this.prevSellerOnly) // if seller only becomes both
        ? this.router.navigate([this.BASEPATH() + '/solutions/1'], { queryParamsHandling: 'preserve' })
        : this.router.navigate([this.BASEPATH() + '/general-info'], { queryParamsHandling: 'preserve' })
    },
    generalInfo: {
      back: () => (this.isbuyer && !this.isseller)
        ? this.router.navigate([this.BASEPATH() + '/solutions/1'], { queryParamsHandling: 'preserve' }) // Buyer Only
        : (this.isbuyer && this.isseller && this.prevSellerOnly)
          ? this.router.navigate([this.BASEPATH() + '/solutions/1'], { queryParamsHandling: 'preserve' })
          : this.router.navigate([this.BASEPATH() + '/solutions/2'], { queryParamsHandling: 'preserve' }),
      next: () => (!this.isbuyer && this.isseller)
        ? this.router.navigate([this.BASEPATH() + '/property/1'], { queryParamsHandling: 'preserve' }) // Seller Only
        : this.router.navigate([this.BASEPATH() + '/buyer-info/1'], { queryParamsHandling: 'preserve' }),
    },
    buyerInfo: {
      back: () => this.router.navigate([this.BASEPATH() + '/general-info'], { queryParamsHandling: 'preserve' }),
      next: () => (this.isseller)
        ? this.router.navigate([this.BASEPATH() + '/property/1'], { queryParamsHandling: 'preserve' })
        : this.router.navigate([this.BASEPATH() + '/success'], { queryParamsHandling: 'preserve' })
    },
    confirmAddress: { // /property/1
      back: () => (this.isbuyer) // Buyer too?
        ? this.bridgeSS()
          ? this.router.navigate([this.BASEPATH() + '/buyer-info/2'], { queryParamsHandling: 'preserve' }) // Bridge SS
          : this.router.navigate([this.BASEPATH() + '/buyer-info/1'], { queryParamsHandling: 'preserve' }) // No Bridge SS
        : this.router.navigate([this.BASEPATH() + '/general-info'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/property/2'], { queryParamsHandling: 'preserve' })
    },
    property1: { // /property/2
      back: () => this.router.navigate([this.BASEPATH() + '/property/1'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/property/3'], { queryParamsHandling: 'preserve' })
    },
    property2: { // /property/3
      back: () => this.router.navigate([this.BASEPATH() + '/property/2'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/property/4'], { queryParamsHandling: 'preserve' })
    },
    property3: { // /property/4
      back: () => this.router.navigate([this.BASEPATH() + '/property/3'], { queryParamsHandling: 'preserve' }),
      next: () => this.bridgeOnly()
        ? this.router.navigate([this.BASEPATH() + '/seller-info/2'], { queryParamsHandling: 'preserve' }) // if BRIDGE Only
        : this.router.navigate([this.BASEPATH() + '/property/5'], { queryParamsHandling: 'preserve' })
    },
    property4: { // /property/5
      back: () => this.router.navigate([this.BASEPATH() + '/property/4'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/interior/1'], { queryParamsHandling: 'preserve' })
    },
    interior1: {
      back: () => this.router.navigate([this.BASEPATH() + '/property/4'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/interior/2'], { queryParamsHandling: 'preserve' })
    },
    interior2: {
      back: () => this.router.navigate([this.BASEPATH() + '/interior/1'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/interior/3'], { queryParamsHandling: 'preserve' })
    },
    interior3: {
      back: () => this.router.navigate([this.BASEPATH() + '/interior/2'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/interior/4'], { queryParamsHandling: 'preserve' })
    },
    interior4: {
      back: () => this.router.navigate([this.BASEPATH() + '/interior/3'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/interior/5'], { queryParamsHandling: 'preserve' })
    },
    interior5: {
      back: () => this.router.navigate([this.BASEPATH() + '/interior/4'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/interior/6'], { queryParamsHandling: 'preserve' })
    },
    interior6: {
      back: () => this.router.navigate([this.BASEPATH() + '/interior/5'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/interior/7'], { queryParamsHandling: 'preserve' })
    },
    interior7: {
      back: () => this.router.navigate([this.BASEPATH() + '/interior/6'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/exterior/1'], { queryParamsHandling: 'preserve' })
    },
    exterior1: {
      back: () => this.router.navigate([this.BASEPATH() + '/interior/7'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/exterior/2'], { queryParamsHandling: 'preserve' })
    },
    exterior2: {
      back: () => this.router.navigate([this.BASEPATH() + '/exterior/1'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/exterior/3'], { queryParamsHandling: 'preserve' })
    },
    exterior3: {
      back: () => this.router.navigate([this.BASEPATH() + '/exterior/2'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/seller-info/1'], { queryParamsHandling: 'preserve' })
    },
    homeownerinfo1: { // /seller-info/1
      back: () => this.router.navigate([this.BASEPATH() + '/exterior/3'], { queryParamsHandling: 'preserve' }),
      next: () => this.bridgeSS()
        ? this.router.navigate([this.BASEPATH() + '/seller-info/2'], { queryParamsHandling: 'preserve' }) // if BRIDGE checked
        : this.router.navigate([this.BASEPATH() + '/success'], { queryParamsHandling: 'preserve' })
    },
    sellerInfo2: {
      back: () => this.bridgeOnly()
        ? this.router.navigate([this.BASEPATH() + '/property/4'], { queryParamsHandling: 'preserve' })
        : this.router.navigate([this.BASEPATH() + '/seller-info/1'], { queryParamsHandling: 'preserve' }),
      next: () => this.router.navigate([this.BASEPATH() + '/success'], { queryParamsHandling: 'preserve' })
    }
  }
  getNav = () => this.goto;
}
