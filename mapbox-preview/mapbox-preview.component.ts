import { Component, OnInit } from '@angular/core';
import { MapboxHttpService } from './mapbox-http.service';
import { Map, SymbolLayout } from 'mapbox-gl';
import { thaiLandCollection2 } from './thailand';
// import MapboxLanguage from '@mapbox/mapbox-gl-language';
import * as turf from '@turf/turf';
import { itemLawNoticeCircular } from '../../models/list-item-menu.models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationValidationMessageService } from 'app/shared/services/notification-validation-message.service';
import { Shell } from 'app/shell/shell.service';
import { of } from 'rxjs';
import { colorMap, dataListDistance, listDataRegionCode, listDataSearch } from './mapbox.model';
import { Units } from '@turf/turf';

declare var document: any;
@Component({
  selector: 'app-mapbox-preview',
  templateUrl: './mapbox-preview.component.html',
  styleUrls: ['./mapbox-preview.component.scss'],
})
export class MapboxPreviewComponent implements OnInit {
  itemMenu = itemLawNoticeCircular.itemMenu;
  formData!: FormGroup;
  mapbox: any;
  longitude = 100.5362069675423;
  latitude =  13.782944787589924;

  listDataSector: any[] = [];
  listDataProvince: any[] = [];
  listDataDistrict: any[] = [];
  listDataSubDistrict: any[] = [];
  deptList: any[] = [];

  mapMarkers: any = [];
  center: any = { lat: 13.782944787589924, long: 100.5362069675423 };

  right = true;
  left = true;
  tabHead = 1;
  userApprove = false;

  listPointInMap: any = [];
  selectPoint: any = [];

  constructor(
    private fb: FormBuilder,
    private service: MapboxHttpService,
    private notification: NotificationValidationMessageService,
    private shellService: Shell
  ) {
    this.createForm();
  }

  public get searchType() {
    return this.formData.controls['searchType'];
  }

  listDataSearch = listDataSearch.data
  colorMap = colorMap.data;
  dataListDistance = dataListDistance.data;
  listDataRegionCode = listDataRegionCode.data;

  listYear: any;
  agencyList: any = [{ value: 1, label: 'หน่วยงานทั้งหมด' }];
  typeList: any = [{ value: 1, label: 'ไม่ระบุ' }];

  ngOnInit(): void {
    this.getListSector();
    this.getListProvince();
    this.getListDashboardDeptName();
    const currentYear = new Date().getFullYear() + 543;
    const range = (start: any, stop: any, step: any) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    this.listYear = range(currentYear - 10, currentYear, 1);
    this.getLocation();
  }

  createForm(){
    this.formData = this.fb.group({

      searchType: [1],
      budgetYear: [new Date().getFullYear() + 543],

      provinceCode: [null],
      districtCode: [null],
      subDistrictCode: [null],

      regionCode: [1],
      distance: [10],

      latitude: [this.latitude],
      longitude: [this.longitude],

      deptId: [null],
      deptName: [null],
      deptSubId: [null],

      projId: [null],
      sectorId: [null],
    });
  }

  toRadData(value: number) {
    return value * (Math.PI / 180);
  }

  createMarker(latitude: any, longitude: any) {
    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

    const popup = new mapboxgl.Popup({ offset: 25 }).setText(
      'คุณอยู่ตรงนี้'
    );

    // create DOM element for the marker
    const el = document.createElement('div');
    el.id = 'marker';
    // create the marker
    // new mapboxgl.Marker(el)
    // .setLngLat([longitude, latitude])
    // .setPopup(popup) // sets a popup on this marker
    // .addTo(this.mapbox);
    var marker1 = new mapboxgl.Marker({
      color: '#ff5f00',
      draggable: false,
    })
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(this.mapbox);

    this.mapMarkers.push(marker1);
    // this.mapMarkers[0].remove()
  }

  createCircleRadius(latitude: any, longitude: any, length: number) {
    var center = [longitude, latitude];
    var radius = this.toRadData(length);
    console.log('length',length);

    var units = 'kilometers';
    var options: { steps: number,units:  Units,properties:any } = {
      steps: 64,
      units: 'kilometers',
      properties: {test: 'test'}
    };
    // var options = { steps: 10,units:"kilometers", properties: { foo: 'bar' } };
    // * var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
    var circle = turf.circle(center, length, options);

    // var circle = turf.circle(center, radius);
    console.log('circle', circle);

    this.mapbox.addSource('circle', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [circle],
      },
    });

    this.mapbox.addLayer({
      id: 'circle-fill',
      type: 'fill',
      source: 'circle',
      paint: {
        'fill-color': 'red',
        'fill-opacity': 0.05,
      },
    });

    this.mapbox.addLayer({
      id: 'circle-line',
      type: 'line',
      source: 'circle',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'red',
        'line-width': 0.5,
      },
    });
  }

  getLocation(): void {
    console.log(navigator.geolocation);
    this.shellService.setLoader = of(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.userApprove = true;
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.latitude = position.coords.latitude;

          console.log('longitude,latitude', longitude, latitude);
          this.createMap(latitude, longitude);
          this.createMarker(latitude, longitude);
          this.shellService.setLoader = of(false);
        },
        (err) => {
          this.userApprove = false;
          console.error(err.message, this.center);
          this.notification.notifyMsg('WARNING', err.message);
          this.createMap(this.center.lat, this.center.long);
          this.centerMap(this.center.lat, this.center.long, 5);
          this.shellService.setLoader = of(false);
        }
      );
    } else {
      console.log('No support for geolocation');
    }
  }

  createMap(latitude: any, longitude: any) {
    //style mapbox://styles/mapbox/streets-v11
    // ------------------------------ Language Control-----------------------------------------------
    // map.addControl(new mapboxgl.NavigationControl());
    // map.addControl(new MapboxLanguage({  defaultLanguage: 'th'}));
    // var MapboxLanguage = require('@mapbox/mapbox-gl-language');
    // this.mapbox.addControl(new mapboxgl.NavigationControl());
    // ------------------------------END Language-----------------------------------------------
    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
    mapboxgl.accessToken = 'pk.eyJ1Ijoib295MzAiLCJhIjoiY2wwcnlhaHR6MDgzcjNrcW9tNDM1b2JzaSJ9.R4K78DtGWIfW_Tx3Y_hgDQ';

    this.mapbox = new mapboxgl.Map({
      zoom: 8,
      container: 'map',
      center: [longitude, latitude],
      style: 'mapbox://styles/mapbox/dark-v10',
    });
    this.mapbox.on('click', (e:any) => {
      console.log(e);

    });
    this.mapbox.on('load', () => {
      this.mapbox.addSource('route', {
        type: 'geojson',
        data: thaiLandCollection2.data,
      });

      this.mapbox.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 1,
        },
      });

      this.mapbox.addSource('maine', {
        type: 'geojson',
        data: thaiLandCollection2.data,
      });

      this.addLayerMapFullColor();
    });
  }

  centerMap(latitude: any, longitude: any, zoom: any) {
    this.mapbox.flyTo({
      center: [longitude, latitude],
      zoom: zoom,
    });
  }

  searchData() {
    this.mapbox.removeLayer('maine-layer');
      this.removeLayer('circle-line');
      this.removeLayer('circle-fill');
      this.removeSource('circle');

    const event = this.formData.value['searchType'];
    if (event == 1) {
      this.addLayerMapFullColor();
      if (this.userApprove) {
        this.createCircleRadius(
          this.latitude,
          this.longitude,
          this.formData.value['distance']
        );
        this.centerMap(this.latitude, this.longitude, 10);
      } else {
        this.notification.notifyMsg(
          'WARNING',
          'ไม่สามารถค้นหาได้เนื่องจากไม่ได้รับอณุญาติการเข้าถึงตำแหน่ง'
        );
      }
    } else if (event == 3) {
      // this.centerMap(this.center.lat, this.center.long, 5);
      if (this.formData.value['regionCode']) {
        this.mapbox.addLayer({
          id: 'maine-layer',
          type: 'fill',
          source: 'maine', // reference the data source'#fff'
          layout: {},
          paint: {
            'fill-color': [
              'match',
              ['get', 'SECTOR'],
              this.formData.value['regionCode'],
              this.colorMap[this.formData.value['regionCode']],
              /* other */ this.colorMap[0],
            ],
            'fill-opacity': 0.3,
          },
        });
        this.changeListSector(this.formData.value['regionCode']);
      } else {
        this.addLayerMapFullColor();
      }
    } else {
      this.centerMap(this.center.lat, this.center.long, 5);
      this.addLayerMapFullColor();
    }

    this.findData();
  }

  checkSearchType(searchType : number,valible :string){
    if(searchType == this.formData.value['searchType']){
      return this.formData.value[valible]
    }
    return null
  }

  public get requestParams() {
    var request = {}
    if(this.formData.value['searchType']){request = Object.assign(request, { searchType : this.formData.value['searchType'] })}
    if(this.formData.value['budgetYear']){request = Object.assign(request, { budgetYear: this.formData.value['budgetYear'] })}
    if(this.checkSearchType(4,'provinceCode')){request = Object.assign(request, { provinceCode: this.checkSearchType(4,'provinceCode') })}
    if(this.checkSearchType(4,'districtCode')){request = Object.assign(request, { districtCode: this.checkSearchType(4,'districtCode') })}
    if(this.checkSearchType(4,'subDistrictCode')){request = Object.assign(request, { subDistrictCode: this.checkSearchType(4,'subDistrictCode') })}
    if(this.checkSearchType(3,'regionCode')){request = Object.assign(request, { regionCode: this.checkSearchType(3,'regionCode') })}
    if(this.checkSearchType(1,'distance')){request = Object.assign(request, { distance: this.checkSearchType(1,'distance') })}
    if(this.latitude){request = Object.assign(request, { latitude: [this.latitude] })}
    if(this.longitude){request = Object.assign(request, { longitude: [this.longitude] })}
    if(this.formData.value['deptId']){request = Object.assign(request, { deptId: this.formData.value['deptId'] })}
    if(this.formData.value['deptId']){request = Object.assign(request, { deptName: this.deptList.find(data =>data.deptId = this.formData.value['deptId']).deptName })}
    if(this.formData.value['deptSubId']){request = Object.assign(request, { deptSubId: this.formData.value['deptSubId'] })}
    if(this.formData.value['projId']){request = Object.assign(request, { projId: this.formData.value['projId'] })}
    if(this.formData.value['sectorId']){request = Object.assign(request, { sectorId: this.formData.value['sectorId'] })}
    return request;
  }

  async findData() {
    try {
      this.shellService.setLoader = of(true);
      return await this.service
        .getListEgpProjectByLatLong(this.requestParams)
        .toPromise()
        .then(async (response) => {
          const listData = response.data;
          this.listPointInMap = listData;
          this.selectPoint = null;
          this.createCirclePoints(listData);
          this.shellService.setLoader = of(false);
          console.log(response);
        });
    } catch (error) {
      console.error(error);
      this.shellService.setLoader = of(false);
    }

  }

  createCirclePoints(listValue: any) {
    this.removeLayer('cluster-count');
    this.removeLayer('circlesPoint');
    this.removeSource('points-circle');

    if (listValue.length > 0) {
      var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
      var features = [];
      const listData = listValue.reduce((r:any, a:any) => { r[a.latitude.concat(',').concat(a.longitude)] = [...r[a.latitude.concat(',').concat(a.longitude)] || [], a]; return r; }, {});

      for (const key in listData) {
        console.log('key',key);
        console.log('listData',listData[key]);
        console.log('map',listData[key].map((data:any)=> data.projName));
        console.log('map',listData[key].map((data:any)=> data.projName).join('<br>'));
        features.push(
          turf.point([listData[key][0].longitude, listData[key][0].latitude], {
            projName:listData[key].length > 1 ? listData[key].map((data:any,index:number)=>(index+1)+'.'+ data.projName).join('<br>') : listData[key].map((data:any,index:number)=> data.projName).join('<br>'),
            length: listData[key].length > 1 ? listData[key].length : ''
          })
        );
      }

      console.log('features', features);

      this.mapbox.addSource('points-circle', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features,
        },
      });
      this.mapbox.addLayer({
        id: 'circlesPoint',
        source: 'points-circle',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#fff',
          'circle-opacity': 1,
          'circle-stroke-width': 7,
          'circle-stroke-color': 'black',
        },
      });

      this.mapbox.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'points-circle',
        layout: {
          'text-field': ['get', 'length'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        // filter: ["==", "modelId", 1]
      });

      this.mapbox.on('click', 'circlesPoint', (e: any) => {
        console.log(e.features);
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.projName;
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.mapbox);
      });
    }
  }

  changeListSector(event: any) {
    this.centerMap(
      this.listDataRegionCode[event - 1].lat,
      this.listDataRegionCode[event - 1].long,
      6
    );
  }

  async toggleSidebar(id: any) {
    const elem = document.getElementById(id);
    if (id == 'right') {
      document.getElementById('icon-right').classList.toggle('transform-icon');
      const collapsed = elem?.classList.toggle('collapsed-right');
      const padding: any = {};
      padding[id] = collapsed ? 0 : 300;
      console.log('collapsed', collapsed, elem);
      this.right = collapsed;
      this.mapbox.easeTo({
        padding: padding,
        duration: 10000,
      });
    }
    if (id == 'left') {
      document.getElementById('icon-left').classList.toggle('transform-icon');
      const collapsed = await elem?.classList.toggle('collapsed-left');
      const padding: any = {};
      padding[id] = collapsed ? 0 : 300;
      console.log('collapsed', collapsed, elem);

      this.mapbox.easeTo({
        padding: padding,
        duration: 10000,
      });
    }
  }

  valueHeight(data: any) {
    const number = Number(data) - 90;
    return number;
  }

  clearFormDataChang(searchType: any) {
    // this.formData.reset();
    // this.formData.controls['searchType'].setValue(searchType);
  }

  addLayerMapFullColor() {
    this.mapbox.addLayer({
      id: 'maine-layer',
      type: 'fill',
      source: 'maine',
      layout: {},
      paint: {
        'fill-color': [
          'match',
          ['get', 'SECTOR'],
          1,
          this.colorMap[1],
          2,
          this.colorMap[2],
          3,
          this.colorMap[3],
          4,
          this.colorMap[4],
          5,
          this.colorMap[5],
          6,
          this.colorMap[6],
          /* other */ this.colorMap[0],
        ],
        'fill-opacity': 0.1,
      },
    });
  }

  selectDataPoint(costId: string) {
    const find = this.listPointInMap.find((data: any) => data.costId == costId);
    this.selectPoint = find;
  }

  removeLayer(key: string) {
    const layer = this.mapbox
      .getStyle()
      .layers.filter((data: any) => data.id == key);
    if (layer.length > 0) {
      this.mapbox.removeLayer(key);
    }
  }

  removeSource(source: string) {
    for (const key in this.mapbox.getStyle().sources) {
      if (key == source) {
        this.mapbox.removeSource(source);
      }
    }
  }

  async getListSector(): Promise<any> {
    try {
      this.shellService.setLoader = of(true);
      return await this.service
        .getListSector({ status: 'N' })
        .toPromise()
        .then(async (response) => {
          this.listDataSector = response.data;
          this.shellService.setLoader = of(false);
          console.log(response);
        });
    } catch (error) {
      console.error(error);
    }
  }

  async getListDashboardDeptName(): Promise<any> {
    try {
      this.shellService.setLoader = of(true);
      return await this.service
        .getListDashboardDeptName({ budgetYear: this.formData.value['budgetYear'] })
        .toPromise()
        .then(async (response) => {
          this.deptList = response.data;
          this.shellService.setLoader = of(false);
          console.log(response);
        });
    } catch (error) {
      console.error(error);
    }
  }

  async getListProvince(): Promise<any> {
    try {
      this.shellService.setLoader = of(true);
      return await this.service
        .getListProvince()
        .toPromise()
        .then(async (response) => {
          this.listDataProvince = response.data;
          this.shellService.setLoader = of(false);
        });
    } catch (error) {
      console.error(error);
    }
  }

  async getListDistrict(provinceId: any): Promise<any> {
    try {
      this.shellService.setLoader = of(true);
      return await this.service
        .getListDistrict({ provinceId })
        .toPromise()
        .then(async (response) => {
          this.listDataDistrict = response.data;
          this.shellService.setLoader = of(false);
        });
    } catch (error) {
      console.error(error);
    }
  }

  async getListSubDistrict(provinceId: any, districtId: any): Promise<any> {
    try {
      this.shellService.setLoader = of(true);
      return await this.service
        .getListSubDistrict({ provinceId, districtId })
        .toPromise()
        .then(async (response) => {
          this.listDataSubDistrict = response.data;
          this.shellService.setLoader = of(false);
        });
    } catch (error) {
      console.error(error);
    }
  }

  changeProvince(event: any) {
    if (event) {
      this.getListDistrict(event);
    }
    this.listDataDistrict = [];
    this.listDataSubDistrict = [];
    this.formData.controls['districtCode'].setValue(null);
    this.formData.controls['subDistrictCode'].setValue(null);
  }

  changeDistrict(event: any) {
    if (event) {
      this.getListSubDistrict(this.formData.value['provinceCode'], event);
    }
    this.listDataSubDistrict = [];
    this.formData.controls['subDistrictCode'].setValue(null);
  }
}
