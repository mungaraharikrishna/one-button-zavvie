import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferOptimizerComponent } from './components/oo.components/offer-optimizer/offer-optimizer.component';
import { PropertyProfilerComponent } from './components/pp.components/property-profiler/property-profiler.component';
import { AddressComponent } from './components/pp.components/address/address.component';
import { SellerSolutionsComponent } from './components/pp.components/seller-solutions/seller-solutions.component';
import { GeneralInfoComponent } from './components/pp.components/general-info/general-info.component';
import { PropertyComponent } from './components/pp.components/property/property.component';
import { PropertyTwoComponent } from './components/pp.components/property-two/property-two.component';
import { PropertyThreeComponent } from './components/pp.components/property-three/property-three.component';
import { PropertyFourComponent } from './components/pp.components/property-four/property-four.component';
import { InteriorComponent } from './components/pp.components/interior/interior.component';
import { ExteriorComponent } from './components/pp.components/exterior/exterior.component';
import { HomeOwnersInfoComponent } from './components/pp.components/home-owners-info/home-owners-info.component';
import { HomeOwnersInfoTwoComponent } from './components/pp.components/home-owners-info-two/home-owners-info-two.component';
import { HomeOwnersInfoThreeComponent } from './components/pp.components/home-owners-info-three/home-owners-info-three.component';
import { PhotosComponent } from './components/pp.components/photos/photos.component';
import { ExteriorTwoComponent } from './components/pp.components/exterior-two/exterior-two.component';
import { ExteriorThreeComponent } from './components/pp.components/exterior-three/exterior-three.component';
import { SuccessComponent } from './components/pp.components/success/success.component';
import { CongratulationsComponent } from './components/pp.components/congratulations/congratulations.component';
import { InteriorTwoComponent } from './components/pp.components/interior-two/interior-two.component';
import { InteriorThreeComponent } from './components/pp.components/interior-three/interior-three.component';
import { InteriorFourComponent } from './components/pp.components/interior-four/interior-four.component';
import { InteriorFiveComponent } from './components/pp.components/interior-five/interior-five.component';
import { InteriorSixComponent } from './components/pp.components/interior-six/interior-six.component';
import { InteriorSevenComponent } from './components/pp.components/interior-seven/interior-seven.component';
import { BuyerSolutionsComponent } from './components/pp.components/buyer-solutions/buyer-solutions.component';
import { BuyerInfoComponent } from './components/pp.components/buyer-info/buyer-info.component';
import { ConfirmComponent } from './components/cor.components/confirm/confirm.component';
import { ClientContactInfoComponent } from './components/lo.components/client-contact-info/client-contact-info.component';



let path:string = window.location.pathname;
let origin:string = window.location.origin;

if (origin != 'http://localhost:4200') {
  path = (path.charAt(0) == '/') ? path.substring(1) : path;
  path = (path.charAt(path.length-1) == '/') ? path.substring(0, path.length-1) : path;
} else {
  path = '';
}

const routes: Routes = [
  {
    path: path,
    component: OfferOptimizerComponent
  },
  {
    path: (origin == 'http://localhost:4200') ? 'solutions' : path + '/' + 'solutions',
    children:[
      {path: '1', component: BuyerSolutionsComponent},
      {path: '2', component: SellerSolutionsComponent}
    ]
  },{
    path: (origin == 'http://localhost:4200') ? 'general-info' : path + '/' + 'general-info',
    component: GeneralInfoComponent
  },{
    path: (origin == 'http://localhost:4200') ? 'buyer-info' : path + '/' + 'buyer-info',
    children:[
      { path: '1', component: BuyerInfoComponent},
    ]
  },{
    path: (origin == 'http://localhost:4200') ? 'property' : path + '/' + 'property',
    children: [
      { path: '1', component: AddressComponent},
      { path: '2', component: PropertyComponent },
      { path: '3', component: PropertyTwoComponent },
      { path: '4', component: PropertyThreeComponent },
      { path: '5', component: PropertyFourComponent },
    ]
  },{
    path: (origin == 'http://localhost:4200') ? 'interior' : path + '/' + 'interior',
    children:[
      { path: '1', component: InteriorComponent },
      { path: '2', component: InteriorTwoComponent },
      { path: '3', component: InteriorThreeComponent },
      { path: '4', component: InteriorFourComponent },
      { path: '5', component: InteriorFiveComponent },
      { path: '6', component: InteriorSixComponent },
      { path: '7', component: InteriorSevenComponent },
    ]
  },{
    path: (origin == 'http://localhost:4200') ? 'exterior' : path + '/' + 'exterior',
    children:[
      { path: '1', component: ExteriorComponent },
      { path: '2', component: ExteriorTwoComponent },
      { path: '3', component: ExteriorThreeComponent }
    ]  
  },{
    path: (origin == 'http://localhost:4200') ? 'seller-info' : path + '/' + 'seller-info',
    children:[
      { path: '1', component: HomeOwnersInfoComponent },
      { path: '2', component: HomeOwnersInfoTwoComponent },
      { path: '3', component: HomeOwnersInfoThreeComponent },
    ] 
  },{
    path: (origin == 'http://localhost:4200') ? 'photos' : path + '/' + 'photos',
    children:[
      { path: '1', component: PhotosComponent},
      { path: '2', component: CongratulationsComponent }
    ]
  },{
    path: (origin == 'http://localhost:4200') ? 'success' : path + '/' + 'success',
    component: SuccessComponent
  },{
    path: (origin == 'http://localhost:4200') ? 'collect-offers' : path + '/' + 'collect-offers',
    component: ConfirmComponent
  },
  {
    path: (origin == 'http://localhost:4200') ? 'client-contact-info' : path + '/' + 'client-contact-info',
    component: ClientContactInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
export const routingComponents = [
  OfferOptimizerComponent,
  PropertyProfilerComponent,
  AddressComponent,
  SellerSolutionsComponent,
  GeneralInfoComponent,
  BuyerInfoComponent,
  PropertyComponent,
  PropertyTwoComponent,
  PropertyThreeComponent,
  PropertyFourComponent,
  InteriorComponent,
  InteriorTwoComponent,
  InteriorThreeComponent,
  InteriorFourComponent,
  InteriorFiveComponent,
  InteriorSixComponent,
  InteriorSevenComponent,
  ExteriorComponent,
  ExteriorTwoComponent,
  ExteriorThreeComponent,
  HomeOwnersInfoComponent,
  HomeOwnersInfoTwoComponent,
  HomeOwnersInfoThreeComponent,
  PhotosComponent,
  SuccessComponent,
  CongratulationsComponent,
  BuyerSolutionsComponent,
  ConfirmComponent,
  ClientContactInfoComponent
]