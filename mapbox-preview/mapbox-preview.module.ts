import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapboxPreviewRoutingModule } from './mapbox-preview-routing.module';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "app/shared/shared.module";
import { ModalModule } from 'ngx-bootstrap-th';
import { MapboxPreviewComponent } from './mapbox-preview.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { NgxChartsModule }from '@swimlane/ngx-charts';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@NgModule({
  declarations: [MapboxPreviewComponent],
  imports: [
    CommonModule,
    MapboxPreviewRoutingModule,
    NgbModule,
    TranslateModule,
    SharedModule,
    ModalModule,
    NzLayoutModule,
    NzTabsModule,
    NgxChartsModule,
    NzIconModule,
    NzProgressModule,
    NzButtonModule,
    NzRadioModule
  ]
})
export class MapboxPreviewModule { }
