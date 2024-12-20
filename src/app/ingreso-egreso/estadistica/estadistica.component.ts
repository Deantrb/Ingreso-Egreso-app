import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {IngresoEgreso} from "../../models/ingreso-egreso.model";
import * as echarts from 'echarts';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: ``
})
export class EstadisticaComponent implements OnInit {
  @ViewChild('chartContainer', {static: true}) chartContainer!: ElementRef;


  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  echartOptions = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 5
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {value: 1048, name: 'Ingreso'},
          {value: 735, name: 'Egreso'},
        ]
      }
    ]
  };

  constructor(private store: Store<AppStateWithIngreso>, private el: ElementRef) {
  }


  ngOnInit() {
    this.store.select('ingresosEgresos').subscribe(({items}) => this.generarEstadistica(items))

  }

  generarEstadistica(items: IngresoEgreso[]) {

    this.totalEgresos = 0
    this.totalIngresos = 0
    this.ingresos = 0
    this.egresos = 0

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto
        this.egresos++;
      }
    }
    this.echartOptions.series[0].data=[ {value: this.totalIngresos, name: 'Ingreso'}, {value: this.totalEgresos, name: 'Egreso'},]
    setTimeout(() => {
      const chartContainer = document.getElementById('chartContainer');
      const chart = echarts.init(chartContainer);
      chart.setOption(this.echartOptions);

    }, 1000)
  }
}
