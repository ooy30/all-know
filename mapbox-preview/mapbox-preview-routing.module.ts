import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapboxPreviewComponent } from './mapbox-preview.component';

const routes: Routes = [
  {
    path: '',
    component: MapboxPreviewComponent
  }
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapboxPreviewRoutingModule { }
