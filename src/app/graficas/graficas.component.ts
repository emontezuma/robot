import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, GuardsCheckStart } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { Router } from '@angular/router';
import { DxChartComponent } from "devextreme-angular";
import { DatePipe } from '@angular/common'
import { DateAdapter } from '@angular/material/core';



@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css'],
  animations: [
    trigger('esquema', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(5px)' }),
        animate('0.15s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.15s', style({ opacity: 0, transform: 'translateY(5px)' }))
      ])
    ]),
    trigger('esquema_grafica', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(5px)' }),
        animate('0.15s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.15s', style({ opacity: 0, transform: 'translateY(5px)' }))
      ])
    ]),
    trigger('esquema_del', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(5px)' }),
        animate('0.25s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.25s', style({ opacity: 0, transform: 'translateY(5px)' }))
      ])
    ]),
    trigger('esquema_top', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(-15px)' }),
        animate('0.2s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.2s', style({ opacity: 0, transform: 'translateY(-15px)' }))
      ])
    ]),
    trigger('esquema_left', [
      transition(':enter', [
        style({ opacity: 0.3 }),
        animate('0.1s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.1s', style({ opacity: 0.3 }))
      ])
    ]),
    trigger('arriba', [
    transition(':enter', [
      style({ opacity: 0.3, transform: 'scale(0.3)' }),
      animate('0.1s', style({ opacity: 1, transform: 'scale(1)' })),
    ]),
    transition(':leave', [
      animate('0.1s', style({ opacity: 0.3, transform: 'scale(0.3)' }))
    ])
  ]),],
  
})

export class GraficasComponent implements OnInit {

  @ViewChild("txtBuscar", { static: false }) txtBuscar: ElementRef;
  @ViewChild("txtNombre", { static: false }) txtNombre: ElementRef;
  @ViewChild("txtDesde", { static: false }) txtDesde: ElementRef;
  @ViewChild("txtHasta", { static: false }) txtHasta: ElementRef;
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;
  @ViewChild("listaLineas", { static: false }) listaLineas: MatSelectionList;
  @ViewChild("listaMaquinas", { static: false }) listaMaquinas: MatSelectionList;
  @ViewChild("listaAreas", { static: false }) listaAreas: MatSelectionList;
  @ViewChild("listaFallas", { static: false }) listaFallas: MatSelectionList;
  @ViewChild("listaTecnicos", { static: false }) listaTecnicos: MatSelectionList;
  @ViewChild("listaPartes", { static: false }) listaPartes: MatSelectionList;
  @ViewChild("listaTurnos", { static: false }) listaTurnos: MatSelectionList;
  @ViewChild("listaLotes", { static: false }) listaLotes: MatSelectionList;
  @ViewChild("listaParos", { static: false }) listaParos: MatSelectionList;
  @ViewChild("listaClases", { static: false }) listaClases: MatSelectionList;
  @ViewChild("listaListad", { static: false }) listaListad: MatSelectionList;

  
  scrollingSubscription: Subscription;
  vistaCatalogo: Subscription;
  //URL_FOLDER = "http://localhost:8081/sigma/assets/datos/";  
  URL_FOLDER = "/robot/assets/datos/";  

  constructor
  (
    private _adapter: DateAdapter<any>,
    public servicio: ServicioService,
    private route: ActivatedRoute,
    public scroll: ScrollDispatcher,
    private http: HttpClient,
    public dialogo: MatDialog, 
    private router: Router, 
    public datepipe: DatePipe,
    private viewportRuler: ViewportRuler,
    
  ) {
    this.calcularColor = this.calcularColor.bind(this); 
    this.emit00 = this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      if (pantalla)
      {
        setTimeout(() => {
          this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
          this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;  
        }, 100);
      }
      else
      {
        this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
        this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;  
      }
    });

    this.emit10 = this.servicio.cambioColor.subscribe((estatus: any)=>
    {
      if (this.router.url.substr(0, 9) == "/graficas")
      {
        
        this.colorear();

      }
      
    });
   
    this.emit20 = this.servicio.mensajeError.subscribe((mensaje: any)=>
    {
      let mensajes = mensaje.split(";");
      if (mensajes[0] == 1)
      {
        this.pantalla = 1;
        this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2007]);
        this.errorMensaje = mensajes[1];
      }
    });

   
    this.emit30 = this.servicio.cambioIdioma.subscribe((data: boolean)=>
    {
      if (this.router.url.substr(0, 9) == "/graficas")
      {
        this.modelo = 11;
        this.graficando = true;
        this.filtrando = false;
        this.formateando = false;
        this.selTipoGrafico(this.grActual);
      }
      
    })

    this.emit40 = this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      
      //this.reajustarPantalla();
    });
    this.emit50 = this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
    });
    this.emit60 = this.servicio.vista.subscribe((accion: number)=>
    {
      if (accion >= 1000 && accion <= 2000)
      {
        this.modelo = 11;
        this.graficando = true;
        this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2173]);
        this.filtrando = false;
        this.formateando = false;
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
        this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
        this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;
        this.grActual = +this.servicio.rUsuario().preferencias_andon.substr(41, 1);
        if (accion==1010)
        {
          this.grActual = 1;
        }
        else if (accion==1020)
        {
          this.grActual = 2;
        }
        else if (accion==1030)
        {
          this.grActual = 3;
        }
        else if (accion==1040)
        {
          this.grActual = 4;
        }
        else if (accion==1050)
        {
          this.grActual = 5;
        }
        else if (accion==1060)
        {
          this.grActual = 6;
        }
        this.selTipoGrafico(this.grActual)
        this.iniLeerBD()
      }
    });
    this.emit70 = this.servicio.mostrarBarra.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 9) == "/graficas")
      {
        this.verTop = accion;
        if (!this.verTop)
        {
          setTimeout(() => {
            this.altoGrafica = this.servicio.rPantalla().alto - 156 ;  
          }, 200);
          
        }
        else
        {
          this.altoGrafica = this.servicio.rPantalla().alto - 250;
        }
        
        this.servicio.guardarVista(41, this.verTop ? 1: 0 );
      }
    });
    this.emit80 = this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    let accion = this.servicio.rVista();
    if (accion==1010)
    {
      this.grActual = 1;
    }
    else if (accion==1020)
    {
      this.grActual = 2;
    }
    else if (accion==1030)
    {
      this.grActual = 3;
    }
    else if (accion==1040)
    {
      this.grActual = 4;
    }
    else if (accion==1050)
    {
      this.grActual = 5;
    }
    else if (accion==1060)
    {
      this.grActual = 6;
    }
    this.rConfiguracion();
    this.selTipoGrafico(this.grActual);
  }

  ngOnInit() {
    this.servicio.validarLicencia(1)
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
    this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2173]);
  }

  ngOnDestroy() {

    if (this.emit00) {this.emit00.unsubscribe()}
    if (this.emit10) {this.emit10.unsubscribe()}
    if (this.emit20) {this.emit20.unsubscribe()}
    if (this.emit30) {this.emit30.unsubscribe()}
    if (this.emit40) {this.emit40.unsubscribe()}
    if (this.emit50) {this.emit50.unsubscribe()}
    if (this.emit60) {this.emit60.unsubscribe()}
    if (this.emit70) {this.emit70.unsubscribe()}
    if (this.emit80) {this.emit80.unsubscribe()}
    if (this.emit90) {this.emit90.unsubscribe()}
  }

  emit00: Subscription;
  emit10: Subscription;
  emit20: Subscription;
  emit30: Subscription;
  emit40: Subscription;
  emit50: Subscription;
  emit60: Subscription;
  emit70: Subscription;
  emit80: Subscription;
  emit90: Subscription;
  emit100: Subscription;

  variable: string = "mttr";
  variable_2: string = "mttrc";

  variable_o: string = "impacto";
  idGrafico: number = 0;
  
  cadSQLActual: string = "";
  consultaTemp: string = "0";
  consultaBuscada: boolean = false;
  
  modelo: number  = 0;
  offSet: number;
  verIrArriba: boolean = false;
  yaAgrupado: boolean = false;
  filtrarC: boolean = false;
  hayFiltro: boolean = false
  eliminar: boolean = false;
  editando: boolean = false;
  graficando: boolean = true;
  texto_boton: string = "#" + this.servicio.rColores().texto_boton;
  verBuscar: boolean = true;
  verTabla: boolean = false;
  cambioVista: boolean = true;
  movil: boolean = false;
  verGrafico: boolean = false;
  error01: boolean = false;
  error02: boolean = false;
  error03: boolean = false;
  error04: boolean = false;
  
  nCatalogo: string = this.servicio.rTraduccion()[1189]
  verBarra: string = "";
  nGrafica: string = "";
  ultimoReporte: string = "";
  nombreFile: string = "";
  ultimoID: number = 0;
  copiandoDesde: number = 0;
  textoBuscar: string = "";
  miGrafica: any = [];
  miGraficaTotal: any = [];
  miGraficaSF: any = [];
  tecnicos: any = [];
  partes: any = [];
  turnos: any = [];
  lotes: any = [];
  paros: any = [];
  clases: any = [];
  consultas: any = [];
  maquinas: any = [];
  parGrafica: any = [];
  graficaActual: number = 1;
  agrupacion: any;
  titulosGrupos: any;
  agrupandoGrafica: number = 0;
  resumenes: any = [];
  sub_titulo: string = "";
  formatoGrafico: any = {tipo: "fixedPoint", precision: 0};
  

  coloresArreglo = [ "#F2D7D5", "#D7BDE2", "#AED6F1", "#D5F5E3 ", "#F0B27A", "#F1948A", "#FAD7A0", "#D5DBDB", "#AEB6BF", "#45B39D", "#884EA0", "#D4AC0D", "#3498DB", "#ABB2B9", "#E74C3C", "#D4E6F1", "#FEF5E7", "#A9DFBF", "#C39BD3", "#FFAB91", "#99A3A4", "#ABEBC6", "#A569BD"]

  ///


  verTop: boolean = this.servicio.rUsuario().preferencias_andon.substr(40, 1) == "1";
  
  ultimaActualizacion = new Date();
  altoGrafica: number = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
  anchoGrafica: number = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;
  errorTitulo: string = "[" + this.servicio.rTraduccion()[6] + "]";
  errorMensaje: string = "";
  pantalla: number = 2;  
  miSeleccion: number = 1;
  iconoGeneral: string = "";
  icono_grafica: string = "";
  iconoVista: string = "";
  literalVista: string = this.servicio.rTraduccion()[1191];
  tituloBuscar: string = "";
  alarmados: number = 0;
  elTiempo: number = 0;
  despuesBusqueda: number = 0;
  enCadaSegundo: boolean = false;
  botElim: boolean = false;
  botGuar: boolean = false;
  botCan: boolean = false;
  contarTiempo: boolean = false;
  visualizarImagen: boolean = false;
  sondeo: number = 0;
  registros: any = [];
  opciones: any = [];
  arrFiltrado: any = [];
  detalle: any = [];
  titulos: any = [];
  ayudas: any = [];
  cronometro: any;
  leeBD: any;
  cadTextoY: string = "";
  actualIndice: number = 0;
  nombreReporte: string = this.servicio.rTraduccion()[2742];
  tituloReporte: string = this.servicio.rTraduccion()[2743];
  laSeleccion: any = [];
  configuracion: any = [];
  fallas: any = [];
  lineas: any = [];
  areas: any = [];
  agrupadores1: any = [];
  agrupadores2: any = [];
  arreImagenes: any = [];
  arreHover: any = [];
  notas: string = "";
  hoverp01: boolean = false;
  hoverp02: boolean = false;
  noLeer: boolean = false;
  operacioSel: boolean = false;
  maquinaSel: boolean = false;
  reparandoSel: boolean = false;
  abiertoSel: boolean = false;
  lineaSel: boolean = false;
  filtrando: boolean = false;
  formateando: boolean = false;
  faltaMensaje: string = "";
  responsableSel: boolean = false;
  fallaSel: boolean = false;
  rAlarmado: string = "N";
  horaReporte;
  mensajePadre: string = "";
  filtroOEE: string = "";
  fDesde: string = "";
  fHasta: string = "";
  URL_BASE = "/robot/api/upload.php"
  URL_IMAGENES = "/robot/assets/imagenes/";
  mostrarDetalle: boolean = false;
  grActual: number = 1; //+this.servicio.rUsuario().preferencias_andon.substr(41, 1);

  ayuda01 = this.servicio.rTraduccion()[2680]
  ayuda02 = this.servicio.rTraduccion()[2681]
  ayuda03 = this.servicio.rTraduccion()[2682]
  ayuda04 = this.servicio.rTraduccion()[2683]
  ayuda20 = ""
  

  botonera1: number = 1;
  boton01: boolean = true;
  boton02: boolean = true;
  boton03: boolean = true;
  boton04: boolean = true;

  bot1: boolean = true;
  bot2: boolean = true;
  bot3: boolean = true;
  bot4: boolean = true;
  bot5: boolean = true;
  bot6: boolean = true;
  bot7: boolean = true;

  guardarSel: boolean = true;
  bot1Sel: boolean = false;
  bot2Sel: boolean = false;
  bot3Sel: boolean = false;
  bot4Sel: boolean = false;
  bot5Sel: boolean = false;
  bot6Sel: boolean = false;
  bot7Sel: boolean = false;
  bot8Sel: boolean = false;

  maxmin: {startValue: number, endValue: number};
  maxmin_o: {startValue: number, endValue: number};

  boton11: boolean = true;
  boton12: boolean = true;
  boton13: boolean = false;

  animando: boolean = true;
  listoMostrar: boolean = true;

  literalSingular: string = "";
  literalSingularArticulo: string = "";
  literalPlural: string = "";

  ayuda11: string = "[" + this.servicio.rTraduccion()[7] + "]"

    irArriba() 
  {
    this.verIrArriba = false;
    document.querySelector('[cdkScrollable]').scrollTop = 0;    
  }

  miScroll(data: CdkScrollable) 
  {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
      if (scrollTop < 5) 
      {
        this.verIrArriba = false
      }
      else 
      {
        this.verIrArriba = true
        clearTimeout(this.cronometro);
        this.cronometro = setTimeout(() => {
          this.verIrArriba = false;
        }, 3000);
      }

    this.offSet = scrollTop;
  }


  salidaEfecto(evento: any)
  {
    if (evento.toState)
    {
      this.modelo = this.modelo > 10 ? (this.modelo - 10) : this.modelo;
    }
  }

  
  exportar()
  {
    let resp = [];
    if (this.miGrafica.length > 0)
    {
      let descripcion = "";
      let referencia = "";
      let acumulado = 0;
      for (var i = 0; i < this.miGraficaTotal.length; i++)
      {
        acumulado = acumulado + +this.miGraficaTotal[i][this.variable_2];
      }
      if (acumulado > 0)
      {
        for (var i = 0; i < this.miGraficaTotal.length; i++)
        {
          this.miGraficaTotal[i].porcentaje = +this.miGraficaTotal[i][this.variable_2] / acumulado * 100;
        }
        this.miGraficaTotal[this.miGraficaTotal.length - 1].porcentaje = 100;
      }
      if (this.graficaActual == 1)
      {
        descripcion = this.servicio.rTraduccion()[572];
      }
      else if (this.graficaActual == 2)
      {
        descripcion = this.servicio.rTraduccion()[3338];
        referencia = this.servicio.rTraduccion()[698];
      }
      else if (this.graficaActual == 3)
      {
        descripcion = this.servicio.rTraduccion()[3312];
      }
      
      else if (this.graficaActual == 4)
      {
        descripcion = this.servicio.rTraduccion()[3787];
        referencia = this.servicio.rTraduccion()[2691];
      }
      else if (this.graficaActual == 5)
      {
        descripcion = this.servicio.rTraduccion()[3788];
      }
      else if (this.graficaActual == 6)
      {
        descripcion = this.servicio.rTraduccion()[3721];
        referencia = this.servicio.rTraduccion()[1498];
      }
      else if (this.graficaActual == 7)
      {
        descripcion = this.servicio.rTraduccion()[728];
        referencia = this.servicio.rTraduccion()[2691];
      }
      else if (this.graficaActual == 8)
      {
        descripcion = this.servicio.rTraduccion()[1039];
        referencia = this.servicio.rTraduccion()[1546];
      }
      let titDisp = this.servicio.rTraduccion()[3722];
      let titParo = this.servicio.rTraduccion()[3723];
      if (this.grActual == 2)
      {
        titDisp = this.servicio.rTraduccion()[3792];
        titParo = this.servicio.rTraduccion()[3795];
        if (this.parGrafica.orden == 1)
        {
          titDisp = this.servicio.rTraduccion()[3793];
          titParo = this.servicio.rTraduccion()[3796];
        }
        else if (this.parGrafica.orden == 2)
        {
          titDisp = this.servicio.rTraduccion()[3794];
          titParo = this.servicio.rTraduccion()[3797];
        }
      }
      resp = this.miGraficaTotal.slice(); 
      resp.splice(0, 0, {a: this.servicio.rTraduccion()[558], b: descripcion, z: referencia, c: this.servicio.rTraduccion()[3748], d: this.servicio.rTraduccion()[3749], e: this.servicio.rTraduccion()[3750], f: titDisp, h: titParo, i: this.servicio.rTraduccion()[3786] })
      this.servicio.generarReporte(resp, this.tituloReporte, this.nombreFile + ".csv")
    }
    else
    {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[2010]
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
    }
  }

  mostrar(modo: number)
  {
    if (modo == 1 && this.registros.length == 0)
    {
      this.listoMostrar = true;
    }
    else if (this.registros.length > 0)
    {
      this.listoMostrar = false;
    }
  }
  
  rConfiguracion()
  {
    this.configuracion = [];
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.configuracion = resp[0]; 
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  buscarPeriodo(periodo: string, indice: number)
  {

  }

  
  leerBD()
  {
    
    if (this.noLeer || this.router.url.substr(0, 9) != "/graficas")
    {
      return;
    }
    let campos = {accion: 100, sentencia: this.cadSQLActual};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.arrFiltrado = resp;
      let arreTemp: any = this.arrFiltrado;
      let actualizar: boolean = false; 
      actualizar = JSON.stringify(this.registros) != JSON.stringify(arreTemp);
      if (actualizar)
      {
        if (resp.length == 0)
        {
          this.registros = [];
        }
        if (this.arrFiltrado.length == 0 && resp.length > 0)
        {
          this.registros = arreTemp;
        }
        else 
        {
          for (i = this.registros.length - 1; i >= 0; i--)
          {
            let hallado = false;
            for (var j = arreTemp.length - 1; j >= 0 ; j--)
            {
              if (this.registros[i].id ==  arreTemp[j].id)
              {
                if (this.registros[i].estatus !=  arreTemp[j].estatus || this.registros[i].nombre !=  arreTemp[j].nombre )
                {
                  this.registros[i].estatus = arreTemp[j].estatus;
                  this.registros[i].nombre = arreTemp[j].nombre;
                }
                if (this.miSeleccion == 2)
                {
                  if (this.registros[i].nlinea !=  arreTemp[j].nlinea)
                  {
                    this.registros[i].nlinea = arreTemp[j].nlinea;
                  }
                }
                hallado = true;
                break;
              }
            }
            if (!hallado)
            {
              this.registros.splice(i, 1);
            }
          }
          for (var i = 0; i < arreTemp.length; i++)
          {
            let agregar = true;
            for (var j = 0; j < this.registros.length; j++)
            {
              if (this.registros[j].id == arreTemp[i].id)
              {
                agregar = false
                break;              
              }
            }
            if (agregar)
            {
              this.registros.splice(i, 0, arreTemp[i])
              this.sondeo = arreTemp[i].id;
            }
          }
        }
      }
    });
    clearTimeout(this.leeBD);
    if (this.router.url.substr(0, 9) == "/graficas")
    {
      this.leeBD = setTimeout(() => {
        this.leerBD()
      },  +this.elTiempo);
    }
  }

  selectionChange(event){
    console.log('selection changed using keyboard arrow');
  }

  iniLeerBD()
  {
    if (!this.servicio.rConfig().visor_revisar_cada)
    {
      this.elTiempo = 5000;
    }
    else
    {
      this.elTiempo = +this.servicio.rConfig().visor_revisar_cada * 1000;
    }
    setTimeout(() => {
      this.leerBD();
    }, +this.elTiempo);
  }

  //Desde aqui
  selTipoGrafico(id: number)
  {
    this.grActual = id;
    this.servicio.guardarVista(42, id);
    let sentencia = "SELECT IFNULL(b.id, a.id) AS id, IFNULL(b.titulo, a.titulo) AS nombre, a.grafico - 100 AS nro, IFNULL(b.visualizar, a.visualizar) AS visualizar FROM " + this.servicio.rBD() + ".pu_graficos a LEFT JOIN " + this.servicio.rBD() + ".pu_graficos b ON a.grafico = b.grafico AND b.usuario = " + this.servicio.rUsuario().id + " WHERE a.grafico < 200 AND a.usuario = 0 AND a.activo = 'S' AND a.idioma = " + this.servicio.rIdioma().id + "  ORDER BY a.grafico;";
    this.icono_grafica = "i_tiemporeparacion";
    this.opciones = [];
      
    if (this.grActual == 1)
    {
      //this.opciones = [{id: 1, nombre: "MTTR por Linea"}, {id: 2, nombre: "MTTR por Máquina"}, {id: 3, nombre: "MTTR por Área"},  {id: 4, nombre: "MTTR por Falla"}, {id: 5, nombre: "MTTR por Tipo/máquina"}, {id: 6, nombre: "MTTR por Grupo 1/Máquina"}, {id: 7, nombre: "MTTR por Grupo 2/Máquina"}, {id: 8, nombre: "MTTR por Grupo 1/Falla"}, {id: 9, nombre: "MTTR por Grupo 2/Falla"}, {id: 10, nombre: "MTTR por Día"}, {id: 11, nombre: "MTTR por Semana"}, {id: 12, nombre: "MTTR por Mes"}, {id: 13, nombre: "MTTR por Técnico"}];
    }
    else if (this.grActual == 2)
    {
      sentencia = "SELECT IFNULL(b.id, a.id) AS id, IFNULL(b.titulo, a.titulo) AS nombre, a.grafico - 200 AS nro, IFNULL(b.visualizar, a.visualizar) AS visualizar FROM " + this.servicio.rBD() + ".pu_graficos a LEFT JOIN " + this.servicio.rBD() + ".pu_graficos b ON a.grafico = b.grafico AND b.usuario = " + this.servicio.rUsuario().id + " WHERE a.grafico >= 200 AND a.grafico < 300 AND a.usuario = 0 AND a.activo = 'S' AND a.idioma = " + this.servicio.rIdioma().id + "  ORDER BY a.grafico;";
    
      this.opciones = [];
      this.icono_grafica = "i_tiempofallas";
      //this.opciones = [{id: 1, nombre: "MTBF por Linea"}, {id: 2, nombre: "MTBF por Máquina"}, {id: 3, nombre: "MTBF por Área"},  {id: 4, nombre: "MTBF por Falla"}, {id: 5, nombre: "MTBF por Tipo/máquina"}, {id: 6, nombre: "MTBF por Grupo 1/Máquina"}, {id: 7, nombre: "MTBF por Grupo 2/Máquina"}, {id: 8, nombre: "MTBF por Grupo 1/Falla"}, {id: 9, nombre: "MTBF por Grupo 2/Falla"}, {id: 10, nombre: "MTBF por Día"}, {id: 11, nombre: "MTBF por Semana"}, {id: 12, nombre: "MTBF por Mes"}, {id: 13, nombre: "MTBF por Técnico"}];
    }
    
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.opciones = resp;
      this.aplicarConsulta(-1)
    });
    
  }

  opcionGrafica()
  {
    if (this.modelo != 0)
    {
      //this.modelo = 11;
    }
    
    let prefijo = this.servicio.rTraduccion()[2704]
    this.nombreReporte = this.servicio.rTraduccion()[2704]
    this.tituloReporte = this.servicio.rTraduccion()[2703]
    if (this.grActual == 2)
    {
      prefijo = this.servicio.rTraduccion()[2702]
      this.nombreReporte = this.servicio.rTraduccion()[2702]
      this.tituloReporte = this.servicio.rTraduccion()[2701]
    }
    if (this.graficaActual == 1)
    {
      prefijo = prefijo + this.servicio.rTraduccion()[572]
    }
    else if (this.graficaActual == 2)
    {
      prefijo = prefijo + this.servicio.rTraduccion()[2734]
    }
    else if (this.graficaActual == 3)
    {
      prefijo = prefijo + this.servicio.rTraduccion()[2724]
    }
    
    else if (this.graficaActual == 4)
    {
      prefijo = prefijo + this.servicio.rTraduccion()[2736]
    }
    else if (this.graficaActual == 5)
    {
      prefijo = prefijo + this.servicio.rTraduccion()[2733]
    }
    else if (this.graficaActual == 6)
    {
      prefijo = prefijo + this.servicio.rTraduccion()[2740]
    }
    else if (this.graficaActual == 7)
    {
      prefijo = prefijo + this.servicio.rTraduccion()[2728]
    }
    else if (this.graficaActual == 8)
    {
      prefijo = prefijo + this.servicio.rTraduccion()[2729]
    }
    this.nombreFile = prefijo;
  }

  preGraficar(id: number)
  {
    this.servicio.activarSpinner.emit(true);
    this.modelo = 11;
    this.miGrafica = [];
    this.parGrafica = [];
    let grafica = 0;
    if (id == -10)
    {
      for (var i = this.graficaActual - 2; i >= 0; i--)
      {
        if (this.opciones[i].visualizar=="S")
        {
          grafica = this.opciones[i].id;
          this.graficaActual = i + 1;
          break;
        }
      }
      if (grafica == 0)
      {
        for (i = this.opciones.length - 1; i >= 0; i--)
        {
          if (this.opciones[i].visualizar=="S")
          {
            grafica = this.opciones[i].id;
            this.graficaActual = i + 1;
            break;
          }
        } 
      }
    }
    else if (id == -5 || id == 0)
    {
      for (i = (id == 0 ? 0 : this.graficaActual); i < this.opciones.length; i++)
      {
        if (this.opciones[i].visualizar=="S")
        {
          grafica = this.opciones[i].id;
          this.graficaActual = i + 1;
          break;
        }
      }
      if (grafica == 0)
      {
        for (i = 0; i < this.opciones.length; i++)
        {
          if (this.opciones[i].visualizar=="S")
          {
            grafica = this.opciones[i].id;
            this.graficaActual = i + 1;
            break;
          }
        } 
      }
    }
    else 
    {
      if (id >= this.opciones.length)
      {
        id = 0;
      }
      grafica = this.opciones[id].id
      this.graficaActual = id + 1;
    }
    this.opcionGrafica()
    this.yaAgrupado = false;
    this.graficar(grafica);  
      
  }

  colorear()
  {
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_graficos WHERE id = " + this.idGrafico +  ";";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {

      resp[0].tipo_valor = resp[0].tipo_principal == "B" ? "bar" : resp[0].tipo_principal == "L" ? "spline" : "area";
      resp[0].tipo_valorFTQ = resp[0].oee_tipo[0] == "B" ? "bar" : resp[0].oee_tipo[0] == "L" ? "spline" : "area";
      resp[0].tipo_valorEFI = resp[0].oee_tipo[1] == "B" ? "bar" : resp[0].oee_tipo[1] == "L" ? "spline" : "area";
      resp[0].tipo_valorDIS = resp[0].oee_tipo[2] == "B" ? "bar" : resp[0].oee_tipo[2] == "L" ? "spline" : "area";
      resp[0].oee_colores = resp[0].oee_colores ? resp[0].oee_colores : ";;";
      
      let oee_colores = resp[0].oee_colores.split(";");
      resp[0].colorFTQ = oee_colores[0] ? ("#" + oee_colores[0]) : "";
      resp[0].colorEFI = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].colorDIS = oee_colores[2] ? ("#" + oee_colores[2]) : "";  


      resp[0].oee_tipoFTQ = resp[0].oee_tipo[0];
      resp[0].oee_tipoEFI = resp[0].oee_tipo[1];
      resp[0].oee_tipoDIS = resp[0].oee_tipo[2];

      resp[0].oee_selFTQ = resp[0].oee[0] == "S";
      resp[0].oee_selEFI = resp[0].oee[1] == "S";
      resp[0].oee_selDIS = resp[0].oee[2] == "S";

      
      resp[0].oee_etiFTQ = resp[0].oee[3];
      resp[0].oee_etiEFI = resp[0].oee[4];
      resp[0].oee_etiDIS = resp[0].oee[5];



      resp[0].oee_nombre = resp[0].oee_nombre ? resp[0].oee_nombre : ";;";
      oee_colores = resp[0].oee_nombre.split(";");
      resp[0].oee_nombreFTQ = oee_colores[0];
      resp[0].oee_nombreEFI = oee_colores[1];
      resp[0].oee_nombreDIS = oee_colores[2];

      oee_colores = resp[0].textos_adicionales.split(";");
      resp[0].adic21 = oee_colores[0];
      resp[0].adic22 = oee_colores[1];
      

      resp[0].esperado_esquema =!resp[0].esperado_esquema ? ";;" : resp[0].esperado_esquema;
      oee_colores = resp[0].esperado_esquema.split(";");
      resp[0].dividir_colores = oee_colores[0] ? oee_colores[0] : "N";
      resp[0].color_bajo = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].color_alto = oee_colores[2] ? ("#" + oee_colores[2]) : "";  
      
      resp[0].adicionales_colores = resp[0].adicionales_colores ? resp[0].adicionales_colores : ";;;;;";
      oee_colores = resp[0].adicionales_colores.split(";");
      resp[0].coladic1 = oee_colores[0] ? ("#" + oee_colores[0]) : "";
      resp[0].coladic2 = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].coladic3 = oee_colores[2] ? ("#" + oee_colores[2]) : "";    
      resp[0].coladic4 = oee_colores[3] ? ("#" + oee_colores[3]) : "";    
      resp[0].coladic5 = oee_colores[4] ? ("#" + oee_colores[4]) : "";    
      resp[0].coladic6 = oee_colores[5] ? ("#" + oee_colores[5]) : "";    
      
      if (!resp[0].sub_titulo || resp[0].sub_titulo == "")
      {
        resp[0].sub_titulo = this.sub_titulo;
      }
      
      this.parGrafica = resp[0];
      let cadTextoY = "";
      if (this.parGrafica.texto_y)
      { 
        cadTextoY = this.parGrafica.texto_y.split(";");
      }
      this.actualIndice = +this.parGrafica.orden;
      this.parGrafica.texto_y2 = cadTextoY[+this.actualIndice];
      this.parGrafica.overlap = (this.parGrafica.overlap == "R" ? "rotate" : "stagger");
      this.parGrafica.color_barra = (!this.parGrafica.color_barra ? "" : "#" + this.parGrafica.color_barra);
      this.parGrafica.etiqueta_color = (!this.parGrafica.etiqueta_color ? "" : "#" + this.parGrafica.etiqueta_color);
      this.parGrafica.etiqueta_fondo = (!this.parGrafica.etiqueta_fondo ? "" : "#" + this.parGrafica.etiqueta_fondo);
      this.parGrafica.etiqueta_formato = !this.parGrafica.etiqueta_formato ? 0 : this.parGrafica.etiqueta_formato;
      this.parGrafica.color_fondo = (!this.parGrafica.color_fondo ? "" : "#" + this.parGrafica.color_fondo);
      this.parGrafica.color_fondo_barras = (!this.parGrafica.color_fondo_barras ? "" : "#" + this.parGrafica.color_fondo_barras);
      this.parGrafica.color_letras = (!this.parGrafica.color_letras ? "" : "#" + this.parGrafica.color_letras);
      this.parGrafica.color_leyenda = (!this.parGrafica.color_leyenda ? "" : "#" + this.parGrafica.color_leyenda);
      this.parGrafica.color_leyenda_fondo = (!this.parGrafica.color_leyenda_fondo ? "" : "#" + this.parGrafica.color_leyenda_fondo);
      this.parGrafica.color_spiline = (!this.parGrafica.color_spiline ? "" : "#" + this.parGrafica.color_spiline);
      this.parGrafica.grueso_spiline = (this.parGrafica.grueso_spiline == "0" ? "1" : this.parGrafica.grueso_spiline);

    

    if (this.parGrafica.color_barra.length == 0)
    {
      this.parGrafica.color_barra = "#" + this.servicio.rColores().texto_boton; 
      this.parGrafica.color_barra_borde = "#" + this.servicio.rColores().borde_boton; 
    }

    if (this.parGrafica.color_spiline.length == 0)
    {
      this.parGrafica.color_spiline = "#" + this.servicio.rColores().texto_boton; 
    }

    if (this.parGrafica.etiqueta_color.length == 0)
    {
      this.parGrafica.etiqueta_color = "#" + this.servicio.rColores().texto_boton; 
      this.parGrafica.etiqueta_fondo = "#" + this.servicio.rColores().fondo_boton; 
    }
    if (this.parGrafica.color_fondo.length == 0)
    {
      this.parGrafica.color_fondo = "#" + this.servicio.rColores().fondo_tarjeta; 
    }
    if (this.parGrafica.color_fondo_barras.length == 0)
    {
      this.parGrafica.color_fondo_barras = "transparent";
    }

    if (this.parGrafica.color_letras.length == 0)
    {
      this.parGrafica.color_letras = "#" + this.servicio.rColores().texto_tarjeta; 
    }
    if (this.parGrafica.color_leyenda.length == 0)
    {
      this.parGrafica.color_leyenda = "#" + this.servicio.rColores().texto_boton;
    }
    if (this.parGrafica.color_leyenda_fondo.length == 0)
    {
      this.parGrafica.color_leyenda_fondo = "#" + this.servicio.rColores().fondo_boton;;
    }
  })
  }

  agregados(indice)
  {
    if (indice == 6)
    {
      this.yaAgrupado = true;
      this.graficar(this.agrupandoGrafica);
    }
    else if (this.agrupacion[indice] != 0)
    {
      this.buscarPeriodo(this.agrupacion[indice], indice)
    }
    else
    {
      this.agregados(indice + 1);
    }
    
  }
  
  graficar(id: number)
  {
    
    this.servicio.activarSpinnerSmall.emit(true);
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_graficos WHERE id = " + id +  ";";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {

      if (resp.length == 0)
      {
        this.servicio.activarSpinnerSmall.emit(false);
        this.servicio.activarSpinner.emit(false);
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[2667]
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        return;
      }
      resp[0].adicionales = resp[0].adicionales ? resp[0].adicionales : "0;0;0;0;0;0;0";
      resp[0].adicionales = resp[0].adicionales == "NNNNNN" ? "0;0;0;0;0;0;0" : resp[0].adicionales;
      let oee_colores = resp[0].adicionales.split(";");
      resp[0].adic1 = oee_colores[0] ? oee_colores[0] : "0";
      resp[0].adic2 = oee_colores[1] ? oee_colores[1] : "0";
      resp[0].adic3 = oee_colores[2] ? oee_colores[2] : "0";
      resp[0].adic4 = oee_colores[3] ? oee_colores[3] : "0";
      resp[0].adic5 = oee_colores[4] ? oee_colores[4] : "0";
      resp[0].adic6 = oee_colores[5] ? oee_colores[5] : "0";
      resp[0].adic7 = oee_colores[6] ? oee_colores[6] : "0";

      
      resp[0].adicionales_titulos = resp[0].adicionales_titulos ? resp[0].adicionales_titulos : ";;;;;";
      let titulos = resp[0].adicionales_titulos.split(";");
      resp[0].tadic1 = titulos[0] ? titulos[0] : "";
      resp[0].tadic2 = titulos[1] ? titulos[1] : "";
      resp[0].tadic3 = titulos[2] ? titulos[2] : "";
      resp[0].tadic4 = titulos[3] ? titulos[3] : "";
      resp[0].tadic5 = titulos[4] ? titulos[4] : "";
      resp[0].tadic6 = titulos[5] ? titulos[5] : "";

      
      if (oee_colores.length > 0 && !this.yaAgrupado && this.grActual==99)
      {
        this.resumenes = [];
        this.agrupandoGrafica = id;
        this.titulosGrupos = titulos;
        this.agrupacion = oee_colores;
        this.agregados(0)
        return;
      }
      else if (oee_colores.length == 0)
      {
        this.resumenes = [];
      }
      
      
      resp[0].oee_tipoFTQ = resp[0].oee_tipo[0];
      resp[0].oee_tipoEFI = resp[0].oee_tipo[1];
      resp[0].oee_tipoDIS = resp[0].oee_tipo[2];

      resp[0].oee_selFTQ = resp[0].oee[0] == "S";
      resp[0].oee_selEFI = resp[0].oee[1] == "S";
      resp[0].oee_selDIS = resp[0].oee[2] == "S";
      
      resp[0].oee_etiFTQ = resp[0].oee[3];
      resp[0].oee_etiEFI = resp[0].oee[4];
      resp[0].oee_etiDIS = resp[0].oee[5];

      resp[0].oee_etiFTQ = resp[0].oee_etiFTQ != "S" && resp[0].oee_etiFTQ != "N" ? "N" : resp[0].oee_etiFTQ;
      resp[0].oee_etiEFI = resp[0].oee_etiEFI != "S" && resp[0].oee_etiEFI != "N" ? "N" : resp[0].oee_etiEFI;
      resp[0].oee_etiDIS = resp[0].oee_etiDIS != "S" && resp[0].oee_etiDIS != "N" ? "N" : resp[0].oee_etiDIS;

      resp[0].tipo_valor = resp[0].tipo_principal == "B" ? "bar" : resp[0].tipo_principal == "L" ? "spline" : "area";
      

      resp[0].tipo_valorFTQ = resp[0].oee_tipo[0] == "B" ? "bar" : resp[0].oee_tipo[0] == "L" ? "spline" : "area";
      resp[0].tipo_valorEFI = resp[0].oee_tipo[1] == "B" ? "bar" : resp[0].oee_tipo[1] == "L" ? "spline" : "area";
      resp[0].tipo_valorDIS = resp[0].oee_tipo[2] == "B" ? "bar" : resp[0].oee_tipo[2] == "L" ? "spline" : "area";
      resp[0].colorFTQ = "";
      resp[0].colorEFI = "";
      resp[0].colorDIS = "";
      resp[0].oee_colores = resp[0].oee_colores ? resp[0].oee_colores : ";;";
      
      oee_colores = resp[0].oee_colores.split(";");
      resp[0].colorFTQ = oee_colores[0] ? ("#" + oee_colores[0]) : "";
      resp[0].colorEFI = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].colorDIS = oee_colores[2] ? ("#" + oee_colores[2]) : "";

      resp[0].oee_nombre = resp[0].oee_nombre ? resp[0].oee_nombre : ";;";
      oee_colores = resp[0].oee_nombre.split(";");
      resp[0].oee_nombreFTQ = oee_colores[0];
      resp[0].oee_nombreEFI = oee_colores[1];
      resp[0].oee_nombreDIS = oee_colores[2];
    
      oee_colores = resp[0].textos_adicionales.split(";");
      resp[0].adic21 = oee_colores[0];
      resp[0].adic22 = oee_colores[1];
    
      resp[0].esperado_esquema =!resp[0].esperado_esquema ? ";;" : resp[0].esperado_esquema;
      oee_colores = resp[0].esperado_esquema.split(";");
      resp[0].dividir_colores = oee_colores[0] ? oee_colores[0] : "N";
      resp[0].color_bajo = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].color_alto = oee_colores[2] ? ("#" + oee_colores[2]) : "";  
      
      resp[0].adicionales_colores = resp[0].adicionales_colores ? resp[0].adicionales_colores : ";;;;;";
      oee_colores = resp[0].adicionales_colores.split(";");
      resp[0].coladic1 = oee_colores[0] ? ("#" + oee_colores[0]) : "";
      resp[0].coladic2 = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].coladic3 = oee_colores[2] ? ("#" + oee_colores[2]) : "";    
      resp[0].coladic4 = oee_colores[3] ? ("#" + oee_colores[3]) : "";    
      resp[0].coladic5 = oee_colores[4] ? ("#" + oee_colores[4]) : "";    
      resp[0].coladic6 = oee_colores[5] ? ("#" + oee_colores[5]) : ""; 
      
      if (!resp[0].sub_titulo || resp[0].sub_titulo == "")
      {
        resp[0].sub_titulo = this.sub_titulo;
      }
         
      this.parGrafica = resp[0];
      let cadTextoY = "";
      if (this.parGrafica.texto_y)
      { 
        cadTextoY = this.parGrafica.texto_y.split(";");
      }
      this.actualIndice = +this.parGrafica.orden;
      this.parGrafica.texto_y2 = cadTextoY[+this.actualIndice];
      if (!this.parGrafica.texto_y2)
      {
        this.parGrafica.texto_y2 = cadTextoY[+this.actualIndice];
      }
      this.parGrafica.overlap = (this.parGrafica.overlap == "R" ? "rotate" : "stagger");
      this.parGrafica.color_barra = (!this.parGrafica.color_barra ? "" : "#" + this.parGrafica.color_barra);
      this.parGrafica.color_barra_borde = (!this.parGrafica.color_barra_borde ? "" : "#" + this.parGrafica.color_barra_borde);
      this.parGrafica.color_esperado = (!this.parGrafica.color_esperado ? "" : "#" + this.parGrafica.color_esperado);
      this.parGrafica.etiqueta_color = (!this.parGrafica.etiqueta_color ? "" : "#" + this.parGrafica.etiqueta_color);
      this.parGrafica.etiqueta_fondo = (!this.parGrafica.etiqueta_fondo ? "" : "#" + this.parGrafica.etiqueta_fondo);
      this.parGrafica.color_fondo = (!this.parGrafica.color_fondo ? "" : "#" + this.parGrafica.color_fondo);
      this.parGrafica.color_fondo_barras = (!this.parGrafica.color_fondo_barras ? "" : "#" + this.parGrafica.color_fondo_barras);
      this.parGrafica.color_letras = (!this.parGrafica.color_letras ? "" : "#" + this.parGrafica.color_letras);
      this.parGrafica.color_leyenda = (!this.parGrafica.color_leyenda ? "" : "#" + this.parGrafica.color_leyenda);
      this.parGrafica.color_leyenda_fondo = (!this.parGrafica.color_leyenda_fondo ? "" : "#" + this.parGrafica.color_leyenda_fondo);
      this.parGrafica.color_spiline = (!this.parGrafica.color_spiline ? "" : "#" + this.parGrafica.color_spiline);
      this.parGrafica.titulo_spiline = (this.parGrafica.grueso_spiline == "0" ? "1" : this.parGrafica.grueso_spiline);
      
      if (this.parGrafica.color_barra.length == 0)
      {
        this.parGrafica.color_barra = "#" + this.servicio.rColores().texto_boton; 
      }
      if (this.parGrafica.color_barra_borde.length == 0)
      {
        this.parGrafica.color_barra_borde = this.parGrafica.color_barra
      }

      if (this.parGrafica.color_spiline.length == 0)
      {
        this.parGrafica.color_spiline = "#" + this.servicio.rColores().texto_boton; 
      }

      if (this.parGrafica.color_esperado.length == 0)
      {
        this.parGrafica.color_esperado = "#" + this.servicio.rColores().texto_boton; 
      }

      if (this.parGrafica.etiqueta_color.length == 0)
      {
        this.parGrafica.etiqueta_color = "#" + this.servicio.rColores().texto_boton; 
        this.parGrafica.etiqueta_fondo = "#" + this.servicio.rColores().fondo_boton; 
      }
      if (this.parGrafica.color_fondo.length == 0)
      {
        this.parGrafica.color_fondo = "#" + this.servicio.rColores().fondo_tarjeta; 
      }
      if (this.parGrafica.color_fondo_barras.length == 0)
      {
        this.parGrafica.color_fondo_barras = "transparent";
      }

      if (this.parGrafica.color_letras.length == 0)
      {
        this.parGrafica.color_letras = "#" + this.servicio.rColores().texto_tarjeta; 
      }
      if (this.parGrafica.color_leyenda.length == 0)
      {
        this.parGrafica.color_leyenda = "#" + this.servicio.rColores().texto_boton;
      }
      if (this.parGrafica.color_leyenda_fondo.length == 0)
      {
        this.parGrafica.color_leyenda_fondo = "#" + this.servicio.rColores().fondo_boton;;
      }

      this.idGrafico = this.parGrafica.id;
      this.parGrafica.overlap = (this.parGrafica.overlap == "R" || this.parGrafica.overlap == "rotate" ? "rotate" : "stagger");
        //MTTR
        //Buscar la consulta actual o por defecto
        let sentencia = "";
        let tHaving = "";
        
        let ordenDatos = " 4 DESC";
        if (this.grActual == 1)
        {
          if (this.parGrafica.orden == 1)
          {
            ordenDatos = " 5 DESC";
          }
          else if (this.parGrafica.orden == 2)
          {
             ordenDatos = " 6 DESC";
          }
          if (this.parGrafica.incluir_ceros == "N")
          {
            tHaving = " HAVING piezas_m > 0 ";
          }
          if (this.parGrafica.orden_grafica == "N")
          {
            ordenDatos = " 4 ";
            if (this.parGrafica.orden == 1)
            {
              ordenDatos = " 6 ";
            }
            else if (this.parGrafica.orden == 2)
            {
              ordenDatos = " 7 ";
            }
          }
          else  if (this.parGrafica.orden_grafica == "A")
          {
            ordenDatos = " 1 ";
          }
          sentencia = "SELECT a.id, IFNULL(a.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nombre, '' AS referencia, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, IFNULL(i.disponible, 0) AS disponible_m, IFNULL(i.paros, 0) AS paros_m, 0 AS porcentaje FROM " + this.servicio.rBD() + ".cat_turnos a LEFT JOIN (SELECT i.turno, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.turno) AS i ON i.turno = a.id " + tHaving + " ORDER BY " + ordenDatos;
          if (this.graficaActual == 2)
          {
            sentencia = "SELECT a.id, IFNULL(a.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nombre, a.referencia, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, IFNULL(i.disponible, 0) AS disponible_m, IFNULL(i.paros, 0) AS paros_m, 0 AS porcentaje FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN (SELECT i.equipo, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.equipo) AS i ON i.equipo = a.id " + tHaving + " ORDER BY " + ordenDatos;
          }   
          else if (this.graficaActual == 3)
          {
            sentencia = "SELECT 0 AS id, i.dia AS nombre, '' AS referencia, SUM(i.produccion) AS piezas_m, SUM(i.sacos) AS sacos_m, SUM(i.tarimas) AS tarimas_m, SUM(i.tiempo_disponible) AS disponible_m, SUM(i.paro) AS paros_m, 0 AS porcentaje FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY nombre " + tHaving + " ORDER BY " + ordenDatos;
          } 
          else if (this.graficaActual == 4)
          {
            sentencia = "SELECT 0 AS id, CONCAT(YEAR(i.dia), '/', WEEK(i.dia)) AS nombre, STR_TO_DATE(CONCAT(DATE_FORMAT(i.dia,'%x/%v'), ' Monday'), '%x/%v %W') AS referencia, SUM(i.produccion) AS piezas_m, SUM(i.sacos) AS sacos_m, SUM(i.tarimas) AS tarimas_m, SUM(i.tiempo_disponible) AS disponible_m, SUM(i.paro) AS paros_m, 0 AS porcentaje FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY nombre " + tHaving + " ORDER BY " + ordenDatos;
          }  
          else if (this.graficaActual == 5)
          {
            sentencia = "SELECT 0 AS id, CONCAT(YEAR(i.dia), '/', MONTH(i.dia)) AS nombre, '' AS referencia, SUM(i.produccion) AS piezas_m, SUM(i.sacos) AS sacos_m, SUM(i.tarimas) AS tarimas_m, SUM(i.tiempo_disponible) AS disponible_m, SUM(i.paro) AS paros_m, 0 AS porcentaje FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY nombre " + tHaving + " ORDER BY " + ordenDatos;
          }
          else if (this.graficaActual == 6)
          {
            sentencia = "SELECT a.id, IFNULL(a.numero, '" + this.servicio.rTraduccion()[8] + "') AS nombre, b.notas, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, IFNULL(i.disponible, 0) AS disponible_m, IFNULL(i.paros, 0) AS paros_m, 0 AS porcentaje FROM " + this.servicio.rBD() + ".lotes a LEFT JOIN " + this.servicio.rBD() + ".equipos_objetivo b ON a.id = b.lote LEFT JOIN (SELECT i.orden, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.orden) AS i ON i.orden = a.id " + tHaving + " ORDER BY " + ordenDatos;
          } 
          else if (this.graficaActual == 7)
          {
            sentencia = "SELECT a.id, IFNULL(a.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nombre, a.referencia, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, IFNULL(i.disponible, 0) AS disponible_m, IFNULL(i.paros, 0) AS paros_m, 0 AS porcentaje FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN (SELECT i.parte, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.parte) AS i ON i.parte = a.id " + tHaving + " ORDER BY " + ordenDatos;
          }   
          else if (this.graficaActual == 8)
          {
            sentencia = "SELECT a.id, IFNULL(a.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nombre, a.referencia, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, IFNULL(i.disponible, 0) AS disponible_m, IFNULL(i.paros, 0) AS paros_m, 0 AS porcentaje FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN (SELECT i.operador, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.operador) AS i ON i.operador = a.id " + tHaving + " ORDER BY " + ordenDatos;
          }
        }

        else if (this.grActual == 2)
        {
          let ordenDatos = " 7 DESC";
          if (this.parGrafica.incluir_ceros == "N")
          {
            tHaving = " HAVING disponible_m > 0 ";
          }
          if (this.parGrafica.orden_grafica == "N")
          {
            ordenDatos = " 7 ";
          }
          else  if (this.parGrafica.orden_grafica == "A")
          {
            ordenDatos = " 1 ";
          }
          let cadTiempo = "IFNULL(i.disponible / 3600, 0) AS disponible_m, IFNULL(i.paros / 3600, 0) AS paros_m, "
          let cadTiempo2 = "SUM(i.tiempo_disponible / 3600) AS disponible_m, SUM(i.paro / 3600) AS paros_m, "
          if (this.parGrafica.orden == 1)
          {
            cadTiempo = "IFNULL(i.disponible / 60, 0) AS disponible_m, IFNULL(i.paros / 60, 0) AS paros_m, ";
            cadTiempo2 = "SUM(i.tiempo_disponible / 60) AS disponible_m, SUM(i.paro / 60) AS paros_m, ";
          }
          else if (this.parGrafica.orden == 2)
          {
            cadTiempo= "IFNULL(i.disponible, 0) AS disponible_m, IFNULL(i.paros, 0) AS paros_m, ";
            cadTiempo2 = "SUM(i.tiempo_disponible) AS disponible_m, SUM(i.paro) AS paros_m, ";
          }
          sentencia = "SELECT a.id, IFNULL(a.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nombre, '' AS referencia, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, " + cadTiempo + "0 AS porcentaje FROM " + this.servicio.rBD() + ".cat_turnos a LEFT JOIN (SELECT i.turno, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.turno) AS i ON i.turno = a.id " + tHaving + " ORDER BY " + ordenDatos;
          if (this.graficaActual == 2)
          {
            sentencia = "SELECT a.id, IFNULL(a.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nombre, a.referencia, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, " + cadTiempo + "0 AS porcentaje FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN (SELECT i.equipo, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.equipo) AS i ON i.equipo = a.id " + tHaving + " ORDER BY " + ordenDatos;
          }   
          else if (this.graficaActual == 3)
          {
            sentencia = "SELECT 0 AS id, i.dia AS nombre, '' AS referencia, SUM(i.produccion) AS piezas_m, SUM(i.sacos) AS sacos_m, SUM(i.tarimas) AS tarimas_m, " + cadTiempo2 + "0 AS porcentaje FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY nombre " + tHaving + " ORDER BY " + ordenDatos;
          } 
          else if (this.graficaActual == 4)
          {
            sentencia = "SELECT 0 AS id, CONCAT(YEAR(i.dia), '/', WEEK(i.dia)) AS nombre, STR_TO_DATE(CONCAT(DATE_FORMAT(i.dia,'%x/%v'), ' Monday'), '%x/%v %W') AS referencia, SUM(i.produccion) AS piezas_m, SUM(i.sacos) AS sacos_m, SUM(i.tarimas) AS tarimas_m, " + cadTiempo2 + "0 AS porcentaje FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY nombre " + tHaving + " ORDER BY " + ordenDatos;
          }  
          else if (this.graficaActual == 5)
          {
            sentencia = "SELECT 0 AS id, CONCAT(YEAR(i.dia), '/', MONTH(i.dia)) AS nombre, '' AS referencia, SUM(i.produccion) AS piezas_m, SUM(i.sacos) AS sacos_m, SUM(i.tarimas) AS tarimas_m, " + cadTiempo2 + "0 AS porcentaje FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY nombre " + tHaving + " ORDER BY " + ordenDatos;
          }
          else if (this.graficaActual == 6)
          {
            sentencia = "SELECT a.id, IFNULL(a.numero, '" + this.servicio.rTraduccion()[8] + "') AS nombre, b.notas, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, " + cadTiempo + "0 AS porcentaje FROM " + this.servicio.rBD() + ".lotes a LEFT JOIN " + this.servicio.rBD() + ".equipos_objetivo b ON a.id = b.lote LEFT JOIN (SELECT i.orden, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.orden) AS i ON i.orden = a.id " + tHaving + " ORDER BY " + ordenDatos;
          } 
          else if (this.graficaActual == 7)
          {
            sentencia = "SELECT a.id, IFNULL(a.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nombre, a.referencia, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, " + cadTiempo + "0 AS porcentaje FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN (SELECT i.parte, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.parte) AS i ON i.parte = a.id " + tHaving + " ORDER BY " + ordenDatos;
          }   
          else if (this.graficaActual == 8)
          {
            sentencia = "SELECT a.id, IFNULL(a.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nombre, a.referencia, IFNULL(i.piezas, 0) AS piezas_m, IFNULL(i.sacos, 0) AS sacos_m, IFNULL(i.tarimas, 0) AS tarimas_m, " + cadTiempo + "0 AS porcentaje FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN (SELECT i.operador, SUM(i.paro) AS paros, SUM(i.produccion) AS piezas, SUM(i.tiempo_disponible) AS disponible, SUM(i.sacos) AS sacos, SUM(i.tarimas) AS tarimas FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' " + this.filtroOEE + " GROUP BY i.operador) AS i ON i.operador = a.id " + tHaving + " ORDER BY " + ordenDatos;
          }
        }
       

        this.cadSQLActual = sentencia;
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          
          if (this.resumenes.length > 0 && this.grActual <= 2)
          {
            this.miGraficaTotal = this.resumenes.concat(JSON.parse(JSON.stringify(resp)));
          }
          else
          {
            this.miGraficaTotal = JSON.parse(JSON.stringify(resp));
          }
          if (this.modelo == 0)
          {
            this.modelo = 1;
          }
          if (resp.length > 0)
          {
            
            if (this.grActual == 1)
            {
              this.variable_2 = "piezas_m";
              if (this.parGrafica.orden == 1)
              {
                this.variable_2 = "sacos_m";
              }
              else if (this.parGrafica.orden == 2)
              {
                this.variable_2 = "tarimas_m";
              }
            }
            else if (this.grActual == 2)
            {
              this.variable_2 = "disponible_m";
            }

            let limitar = 0;
            let agrupado;
            let total = 0;
            if (+this.parGrafica.maximo_barraspct > 0 && +this.parGrafica.maximo_barraspct < 100)
            {
              let pct = +this.parGrafica.maximo_barraspct / 100;
              for (var i = 0; i < resp.length; i++)
              {
                total = total + +resp[i][this.variable_2];
              }
              let pcAcum = 0;
              for (var i = 0; i < resp.length; i++)
              {
                pcAcum = pcAcum + +resp[i][this.variable_2];
                if (pcAcum / total >= pct)
                {
                  limitar = i + 1;
                  break;
                }
              }
            }
            if (+this.parGrafica.maximo_barras > 0)
            {
              if (limitar > +this.parGrafica.maximo_barras || limitar == 0)
              {
                limitar= +this.parGrafica.maximo_barras;
              }
            }
            if (limitar + 1 >= resp.length && this.parGrafica.agrupar == "S")
            {
              limitar = 0;
            }
            else if (limitar  >= resp.length)
            {
              limitar = 0;
            }
            
            if (limitar > 0)
            {
              if (this.parGrafica.agrupar == "S")
              {
                let faltante1 = 0;
                let faltante2 = 0;
                let faltante3 = 0;
                let faltante4 = 0;
                let faltante5 = 0;
                let totalAgr = 0;
                for (var i = limitar; i < resp.length; i++)
                {
                  faltante1 = faltante1 + +resp[i].piezas_m;
                  faltante2 = faltante2 + +resp[i].sacos_m;
                  faltante3 = faltante3 + +resp[i].tarimas_m;
                  faltante4 = faltante4 + +resp[i].disponible_m;
                  faltante5 = faltante5 + +resp[i].paros_m;
                }
                totalAgr = resp.length - limitar;
                agrupado = {id: 0, nombre: (!this.parGrafica.agrupar_texto || this.parGrafica.agrupar_texto.length==0 ? this.servicio.rTraduccion()[2790] : this.parGrafica.agrupar_texto) + " (" + totalAgr + ")", referencia: "", piezas_m: faltante1, sacos_m: faltante2, tarimas_m: faltante3, disponible_m: faltante4, paros_m: faltante5, porcentaje: 0  }
              }
              resp.splice(limitar);
              if (this.parGrafica.agrupar == "S")
              {
                if (this.parGrafica.agrupar_posicion == "P")
                {
                  resp.unshift(agrupado);
                }
                else 
                {
                  resp.push(agrupado);
                  if (this.parGrafica.agrupar_posicion == "N")
                  {
                    //Se vuelve a ordenar
                    if (this.parGrafica.orden_grafica)
                    {
                      if (this.parGrafica.orden_grafica == "A")
                      {
                        resp.sort(this.ordenarALF(this.variable_2))
                      }
                      else if (this.parGrafica.orden_grafica == "N")
                      {
                        resp.sort(this.ordenarNum(this.variable_2, 1))
                      }
                      else
                      {
                        resp.sort(this.ordenarNum(this.variable_2, -1))
                      }
                    }
                    else
                    {
                      resp.sort(this.ordenarNum(this.variable_2, 1))
                    }
                  }
                }
              }
              
            }
            //Calcular el maxmin de la grafica
            let valmax = 0;
            let valmax2 = 0;
            let acumulado = 0;
            for (var i = 0; i < resp.length; i++)
            {
              acumulado = acumulado + +resp[i][this.variable_2];
              if (+resp[i][this.variable_2] > valmax)
              {
                valmax = +resp[i][this.variable_2];                    
              }
            }
            if (acumulado > 0)
            {
              let porcentaje = 0;
              for (var i = 0; i < resp.length; i++)
              {
                porcentaje = porcentaje + +resp[i][this.variable_2]; 
                resp[i].porcentaje = porcentaje / acumulado * 100;
              }
              resp[resp.length - 1].porcentaje = 100;
            }
            
            
            this.maxmin = {startValue: 0, endValue: valmax };
            this.maxmin_o = {startValue: 0, endValue: valmax2 };
            
            if (this.resumenes.length > 0 && this.grActual == 1)
            {
              this.formatoGrafico.precision = !this.parGrafica.etiqueta_formato ? 0 : +this.parGrafica.etiqueta_formato;
              this.miGrafica = this.resumenes.concat(resp);
              
            }
            else
            {
                this.formatoGrafico.precision = !this.parGrafica.etiqueta_formato ? 0 : +this.parGrafica.etiqueta_formato;
                this.miGrafica = resp;
            }
            
            
          }
          else
          {
            this.servicio.activarSpinnerSmall.emit(false);
            this.servicio.activarSpinner.emit(false);
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[2668]
            mensajeCompleto.tiempo = 1000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
          this.modelo = 1;
        })
    })
  }

  ordenarNum(campo: string, orden: number) 
  {
    
    let propiedad = campo;
    let sortOrder = orden;
    return function (a,b) 
    {
      let result = (+a[propiedad] < +b[propiedad]) ? -1 : (+a[propiedad] > +b[propiedad]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  ordenarALF(campo: string) 
  {
    let propiedad = campo;
    let sortOrder = 1;
    return function (a,b) 
    {
      let result = (a[propiedad] < b[propiedad]) ? -1 : (a[propiedad] > b[propiedad]) ? 1 : 0;
      return result * sortOrder;
    }
  }


filtrar()
{
  this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2791]);
  this.listarConsultas()
  this.filtrando = true;
  this.formateando = false;
  this.filtrarC = false;
  this.graficando = false;
  this.bot4Sel = false;
  this.bot7Sel = false;
  this.guardarSel = false;
  this.modelo = 12;
  this.buscarConsulta(this.servicio.rConsulta());
}

buscarConsulta(id: number)
{
  this.botElim = false;
  this.botGuar = false;
  this.botCan = false;
  this.consultaTemp = '' + id;
  this.listarLineas();
  this.listarMaquinas();
  this.listarAreas();
  this.listarFallas();
  this.listarTecnicos();
  this.listarPartes();
  this.listarTurnos();
  this.listarLotes();
  this.listarParos();
  this.listarClases();
  let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".consultas_cab WHERE id = " + id;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length > 0)
    { 
      if (!resp[0].filtroori)
      {
        resp[0].filtroori = "N";
      }
      if (!resp[0].nombre)
      {
        this.botElim = false;  
      }     
      else if (resp[0].nombre == "")
      {
        this.botElim = false;  
      }
      else if (resp[0].usuario != + this.servicio.rUsuario().id)
      {
        this.botElim = false;  
      }
      else
      {
        this.botElim = true;
      }
      this.consultaBuscada = false;
      this.detalle = resp[0]; 
      let cadTextoY = "";
      if (this.detalle.texto_y)
      { 
        cadTextoY = this.detalle.texto_y.split(";");
      }

      
      this.actualIndice = +this.detalle.orden;
      this.detalle.texto_y2 = cadTextoY[+this.actualIndice];
      
      this.detalle.periodo = +this.detalle.periodo;
      if (this.detalle.periodo==8)
      {
        this.detalle.desde = new Date(this.detalle.desde);
        this.detalle.hasta = new Date(this.detalle.hasta);
      }
    }
    else
    {
      this.detalle.nombre = "";
      this.detalle.defecto = "N";
      this.detalle.id = "0";
      this.detalle.periodo = 1;
      this.detalle.publico = "N";
      this.detalle.desde = "";
      this.detalle.hasta = "";
      this.detalle.filtrolin = "S";
      this.detalle.filtroori = "S";
      this.detalle.filtromaq = "S";
      this.detalle.filtroare = "S";
      this.detalle.filtrofal = "S";
      this.detalle.filtrotec = "S";
      this.detalle.filtronpar = "S";
      this.detalle.filtrotur = "S";
      this.detalle.filtroord = "S";      
      this.detalle.filtropar = "S";  
      this.detalle.filtrocla = "S";     
      this.consultaBuscada = false; 
    }
    this.detalle.selMaquinasT = "S";
    this.detalle.selFallasT = "S";
    this.detalle.selTurnosT = "S";
    this.detalle.selLotesT = "S";
    this.detalle.selLineasT = "S";
    this.detalle.selAreasT = "S";
    this.detalle.selPartesT = "S";
    this.detalle.selTecnicosT = "S";
    this.detalle.selParosT = "S";
    this.detalle.selClasesT = "S";
    setTimeout(() => {
      this.txtNombre.nativeElement.focus();  
    }, 200);
  }, 
  error => 
    {
      console.log(error)
    })
}


buscarConsultaID()
{
  let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".consultas_cab WHERE (usuario = " + this.servicio.rUsuario().id + ") AND nombre = '" + this.detalle.nombre + "'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length > 0)
    {
      this.detalle.id = resp[0].id  
    }
    else
    {
      this.detalle.id = 0; 
    }
    this.guardar(1)
  })
}

regresar()
{
  this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2173]);
  this.modelo = 11;
  this.graficando = true;
  this.filtrando = false;
  this.formateando = false;

}


listarConsultas()
  {
    let sentencia = "SELECT id, nombre, general, usuario FROM " + this.servicio.rBD() + ".consultas_cab WHERE (usuario = " + this.servicio.rUsuario().id + ") OR (general = 'S' AND NOT ISNULL(nombre)) ORDER BY nombre;";
    this.consultas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      for (var i = 0; i < resp.length; i++) 
      {
        if (!resp[i].nombre)
        {
          resp[i].nombre = " [" + this.servicio.rTraduccion()[2032] + "]";
        }
        else if (resp[i].nombre == "")
        {
          resp[i].nombre = " [" + this.servicio.rTraduccion()[2032] + "]";
        }
      }
      this.consultas = resp;
    });
  }

   cConsulta(event: any) 
  {
    this.eliminar = event.value != 0;
    this.buscarConsulta(event.value);
  }

  eliminarConsulta()
  {
    this.bot7Sel = false;
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[2033], mensaje: this.servicio.rTraduccion()[2034], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[1981], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_eliminar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result.accion)
      {
        if (result.accion == 1) 
        {
          let sentencia = "DELETE FROM " + this.servicio.rBD() + ".consultas_cab WHERE id = " + this.detalle.id + ";DELETE FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.detalle.id + ";"
          let campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe(resp =>
          {
            if (this.servicio.rConsulta() == this.detalle.id)
            {
              this.servicio.aConsulta(0);
            }
            this.botElim = false;
            this.detalle.id = 0;
            this.detalle.nombre = "";
            this.detalle.defecto = "N";
            this.detalle.id = "0";
            this.detalle.periodo = 1;
            this.detalle.publico = "N";
            this.detalle.desde = "";
            this.detalle.hasta = "";
            this.detalle.filtrolin = "S";
            this.detalle.filtroori = "S";
            this.detalle.filtromaq = "S";
            this.detalle.filtroare = "S";
            this.detalle.filtrofal = "S";
            this.detalle.filtrotec = "S";
            this.detalle.filtronpar = "S";
            this.detalle.filtrotur = "S";
            this.detalle.filtroord = "S";
            this.detalle.filtropar = "S";
            this.detalle.filtrocla = "S";      
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[2008]
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            setTimeout(() => {
              this.txtNombre.nativeElement.focus();  
            }, 200);
          });
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381]
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381]
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  listarLineas()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_lineas a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 10 AND b.consulta = " + this.consultaTemp + " ORDER BY seleccionado DESC, a.nombre;"
    this.lineas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.lineas = resp;
        }, 300);
      
    });
  }

  listarMaquinas()
  {
    let sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 20 AND b.consulta = " + this.consultaTemp + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id ORDER BY seleccionado DESC, nombre;"
    this.maquinas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.maquinas = resp;
        }, 300);
    });
  }

  listarPartes()
  {
    let sentencia = "SELECT a.id, IF(ISNULL(a.referencia), a.nombre, CONCAT(a.nombre, '" + this.servicio.rTraduccion()[2637] + "', a.referencia, ')')) AS nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 60 AND b.consulta = " + this.consultaTemp + " WHERE a.tipo = 0 ORDER BY seleccionado DESC, nombre;"
    this.partes = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.partes = resp;
      }, 300);
    });
  }

  listarTurnos()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_turnos a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 70 AND b.consulta = " + this.consultaTemp + " ORDER BY seleccionado DESC, a.nombre;"
    this.turnos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.turnos = resp;
      }, 300);
    });
  }

  listarLotes()
  {
    let sentencia = "SELECT a.id, CONCAT(a.numero, ' / ', c.nombre) AS nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".lotes a LEFT JOIN " + this.servicio.rBD() + ".cat_partes c ON a.parte = c.id LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 80 AND b.consulta = " + this.consultaTemp + " WHERE a.estatus = 'A' AND a.creacion >= DATE_ADD(NOW(), INTERVAL - 12 MONTH) ORDER BY seleccionado DESC, nombre;"
    this.lotes = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.lotes = resp;
      }, 300);
    });
  }

  listarParos()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 100 AND b.consulta = " + this.consultaTemp + " WHERE a.tabla = 45 ORDER BY seleccionado DESC, a.nombre;"
    
    if (this.grActual == 6)
    {
      sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 120 AND b.consulta = " + this.consultaTemp + " WHERE a.tabla = 105 ORDER BY seleccionado DESC, a.nombre;"
    
    }
    this.paros = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.paros = resp;
        }, 300);
    });
  }

  listarClases()
  {
    let sentencia = "SELECT a.secuencia AS id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.secuencia AND b.tabla = 110 AND b.consulta = " + this.consultaTemp + " WHERE a.tabla = 1100 ORDER BY seleccionado DESC, a.nombre;"
    this.clases = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.clases = resp;
        }, 300);
    });
  } 

  listarAreas()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_areas a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 30 AND b.consulta = " + this.consultaTemp + " ORDER BY seleccionado DESC, a.nombre;"
    this.areas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.areas = resp;
      }, 300);
    });
  }

  listarFallas()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_fallas a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 40 AND b.consulta = " + this.consultaTemp + " ORDER BY seleccionado DESC, a.nombre;"
    this.fallas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
          setTimeout(() => {
            this.fallas = resp;
          }, 300);
      
    });
  }

  listarTecnicos()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 50 AND b.consulta = " + this.consultaTemp + " WHERE a.rol = 'O' ORDER BY seleccionado DESC, a.nombre;"
    this.tecnicos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
          setTimeout(() => {
            this.tecnicos = resp;
          }, 300);
      
    });
  }

  cancelar()
  {
    this.bot4Sel = false;
    this.eliminar = this.detalle.id != 0;
    this.buscarConsulta(this.detalle.id);
  }

  seleccion(tipo: number, event: any) 
  {
    this.botGuar = true;
    this.botCan = true;
    if (tipo == 1)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.lineas.length; i++) 
        {
          this.lineas[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrolin = "N";  
        }, 100);
      }
    }
    else if (tipo == 2)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.maquinas.length; i++) 
        {
          this.maquinas[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtromaq = "N";  
        }, 100);
      }
    }
    else if (tipo == 3)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.areas.length; i++) 
        {
          this.areas[i].seleccionado = event.value==1;
        }
        setTimeout(() => {
          this.detalle.filtroare = "N";  
        }, 100);
      }
    }
    else if (tipo == 4)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.fallas.length; i++) 
        {
          this.fallas[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrofal = "N";  
        }, 100);
      }
    }
    else if (tipo == 5)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.tecnicos.length; i++) 
        {
          this.tecnicos[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrotec = "N";  
        }, 100);
      }
    }

    else if (tipo == 7)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.partes.length; i++) 
        {
          this.partes[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtronpar = "N";  
        }, 100);
      }
    }
    else if (tipo == 6)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.turnos.length; i++) 
        {
          this.turnos[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrotur = "N";   
        }, 100);
      }
    }
    else if (tipo == 8)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.lotes.length; i++) 
        {
          this.lotes[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtroord = "N";   
        }, 100);
      }
    }
    else if (tipo == 9)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.paros.length; i++) 
        {
          this.paros[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtropar = "N";   
        }, 100);
      }
    }
    else if (tipo == 10)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.clases.length; i++) 
        {
          this.clases[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrocla = "N";   
        }, 100);
      }
    }
  }

  guardar(id: number)
  {
    this.guardarSel = false;
    let errores = 0;
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.error04 = false;
    this.faltaMensaje = this.servicio.rTraduccion()[127];
    if (!this.detalle.nombre && id == 1)
    {
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[2172];      
    }
    else if ((!this.detalle.nombre || this.detalle.nombre=="") && id == 1)
    {
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[2172];      
    }
    if (this.detalle.periodo == "8")
    {
      if (!this.detalle.desde) 
      {
        errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1480];      
      }

      if (!this.detalle.hasta) 
      {
        errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1479];      
      }


      if (this.detalle.desde && this.detalle.hasta) 
      {
        if (this.detalle.desde > this.detalle.hasta)
        {
          errores = errores + 1;
          this.error04 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1481]
        }
      }
    
      
    }
    
  if (id== 1 && !this.consultaBuscada)
    {
      this.consultaBuscada = true;
      this.buscarConsultaID();
      return;
    }
    this.consultaBuscada = false;
    if (errores > 0)
    {
      setTimeout(() => {
        if (this.error01)
        {
          this.txtNombre.nativeElement.focus();
        }
        else if (this.error02)
        {
          this.txtDesde.nativeElement.focus();
        }
        else if (this.error03)
        {
          this.txtHasta.nativeElement.focus();
        }
      }, 300);
      return;
    }
    this.editando = false;
    this.faltaMensaje = "";
    if (id == 0 && !this.detalle.nombre)
    {
      this.detalle.publico = "N";
    }

    this.botGuar = false;
    this.botCan = false;
    
    let previa = "";
    if (!this.detalle.nombre)
    {
      previa = "DELETE FROM " + this.servicio.rBD() + ".consultas_cab WHERE (ISNULL(nombre) OR nombre = '') AND usuario = " + this.servicio.rUsuario().id + ";";
    }
    let previa2 = "";
    if (this.detalle.defecto == "S")
    {
      previa2 = "UPDATE " + this.servicio.rBD() + ".consultas_cab SET defecto = 'N', actualizacion = NOW() WHERE usuario = " + this.servicio.rUsuario().id + ";";
    }
    let nuevo = true
    let sentencia = previa + previa2 + "INSERT INTO " + this.servicio.rBD() + ".consultas_cab (usuario, " + (id == 1 ? "nombre, " : "") + "publico, periodo, defecto, filtrolin, filtroori, filtromaq, filtroare, filtrofal, filtrotec, filtronpar, filtrotur, filtroord, filtropar, filtrocla" + (this.detalle.periodo != 8 ? ")" : ", desde, hasta, actualizacion)") + " VALUES (" + this.servicio.rUsuario().id + ", '" + (id == 1 ? this.detalle.nombre + "', '" : "") + this.detalle.publico + "', '" + this.detalle.periodo + "', '" + this.detalle.defecto + "', '" + this.detalle.filtrolin + "', '" + this.detalle.filtroori + "', '" + this.detalle.filtromaq + "', '" + this.detalle.filtroare + "', '" + this.detalle.filtrofal + "', '" + this.detalle.filtrotec + "', '" + this.detalle.filtronpar + "', '" + this.detalle.filtrotur + "', '" + this.detalle.filtroord + "', '" + this.detalle.filtropar + "', '" + this.detalle.filtrocla + "'" + (this.detalle.periodo != 8 ? ");" : ", '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "', '" +  this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "', NOW());")
    if (+this.detalle.id > 0)
    {
      nuevo = false;
      sentencia = previa2 + "UPDATE " + this.servicio.rBD() + ".consultas_cab SET " + (id == 1 ? "nombre = '" + this.detalle.nombre + "', " : "") + "actualizacion = NOW(), publico = '" + this.detalle.publico + "', periodo = '" + this.detalle.periodo + "', defecto = '" + this.detalle.defecto + "', filtrolin = '" + this.detalle.filtrolin + "', filtroori = '" + this.detalle.filtroori + "', filtromaq = '" + this.detalle.filtromaq + "', filtroare = '" + this.detalle.filtroare + "', filtrofal = '" + this.detalle.filtrofal + "', filtrotec = '" + this.detalle.filtrotec + "', filtronpar = '" + this.detalle.filtronpar + "', filtrotur = '" + this.detalle.filtrotur + "', filtroord = '" + this.detalle.filtroord + "', filtropar = '" + this.detalle.filtropar + "', filtrocla = '" + this.detalle.filtrocla + "'" + (this.detalle.periodo != 8 ? "" : ", desde = '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "', hasta = '" +  this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "' ") + " WHERE id = " + +this.detalle.id + ";";
    }
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (nuevo)
      {
        sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".consultas_cab;";
        campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          this.detalle.id = resp[0].nuevoid
          this.guardar_2(id);
          if (this.detalle.defecto == "S")
          {
            this.servicio.aConsulta(this.detalle.id);
          }
          setTimeout(() => {
            this.txtNombre.nativeElement.focus();  
          }, 200);
        })
      }
      else
      {
        this.guardar_2(id);
      }
    })
  }

  guardar_2(id: number)
  {
    let sentencia = "DELETE FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + +this.detalle.id + ";";
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let cadTablas = "INSERT INTO " + this.servicio.rBD() + ".consultas_det (consulta, tabla, valor) VALUES";
      if (this.listaLineas)
      {
        for (var i = 0; i < this.listaLineas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas +  "(" + this.detalle.id + ", 10,  " + this.listaLineas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaMaquinas)
      {
        for (var i = 0; i < this.listaMaquinas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 20,  " + this.listaMaquinas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaAreas)
      {
        for (var i = 0; i < this.listaAreas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 30,  " + this.listaAreas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaFallas)
      {
        for (var i = 0; i < this.listaFallas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 40,  " + this.listaFallas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaTecnicos)
      {
        for (var i = 0; i < this.listaTecnicos.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 50,  " + this.listaTecnicos.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaPartes)
      {
        for (var i = 0; i < this.listaPartes.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 60,  " + this.listaPartes.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaTurnos)
      {
        for (var i = 0; i < this.listaTurnos.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 70,  " + this.listaTurnos.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaLotes)
      {
        for (var i = 0; i < this.listaLotes.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 80,  " + this.listaLotes.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaParos)
      {
        if (this.grActual == 5)
        {
          for (var i = 0; i < this.listaParos.selectedOptions.selected.length; i++) 
          {
            cadTablas = cadTablas + "(" + this.detalle.id + ", 100,  " + this.listaParos.selectedOptions.selected[i].value + "),";
          }
        }
        else if (this.grActual == 6)
        {
          for (var i = 0; i < this.listaParos.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 120,  " + this.listaParos.selectedOptions.selected[i].value + "),";
        }
        }
        
      }
      if (this.listaClases)
      {
        for (var i = 0; i < this.listaClases.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 110,  " + this.listaClases.selectedOptions.selected[i].value + "),";
        }
      }
      if (cadTablas != "INSERT INTO " + this.servicio.rBD() + ".consultas_det (consulta, tabla, valor) VALUES")
      {
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (id == 0)
          {
            this.modelo = 11;
            this.servicio.aConsulta(this.detalle.id);
            this.graficando = true;
            this.filtrando = false;
            this.formateando = false;
            this.aplicarConsulta(-1);
            
          }
        });
      }
      else
      {
        if (id == 0)
        {
          this.modelo = 11;
          this.servicio.aConsulta(this.detalle.id);
          this.graficando = true;
          this.filtrando = false;
          this.formateando = false;
          this.aplicarConsulta(-1);
          
        }
      }
      
    })
    this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2173]);
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = this.servicio.rTraduccion()[2009]
    mensajeCompleto.tiempo = 2000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
  }

  guardarF(id: number)
  {
    this.detalle.color_letras = this.detalle.color_letras ? this.detalle.color_letras.substr(1) : "";
    this.detalle.etiqueta_color = this.detalle.etiqueta_color ? this.detalle.etiqueta_color.substr(1) : "";
    this.detalle.etiqueta_fondo = this.detalle.etiqueta_fondo ? this.detalle.etiqueta_fondo.substr(1) : "";
    this.detalle.etiqueta_formato = !this.detalle.etiqueta_formato ? 0 : this.detalle.etiqueta_formato
    this.detalle.color_leyenda = this.detalle.color_leyenda ? this.detalle.color_leyenda.substr(1) : "";
    this.detalle.color_leyenda_fondo = this.detalle.color_leyenda_fondo ? this.detalle.color_leyenda_fondo.substr(1) : "";
    this.detalle.color_fondo_barras = this.detalle.color_fondo_barras ? this.detalle.color_fondo_barras.substr(1) : "";
    this.detalle.color_fondo = this.detalle.color_fondo ? this.detalle.color_fondo.substr(1) : "";
    this.detalle.color_barra = this.detalle.color_barra ? this.detalle.color_barra.substr(1) : "";

    this.detalle.oee_colores = (this.detalle.colorFTQ ? this.detalle.colorFTQ.substr(1) : "") + ";" + (this.detalle.colorEFI ? this.detalle.colorEFI.substr(1) : "") + ";" + (this.detalle.colorDIS ? this.detalle.colorDIS.substr(1) : "");
    
    this.detalle.color_barra_borde = this.detalle.color_barra_borde ? this.detalle.color_barra_borde.substr(1) : "";
    this.detalle.color_spiline = this.detalle.color_spiline ? this.detalle.color_spiline.substr(1) : "";
    this.detalle.color_esperado = this.detalle.color_esperado ? this.detalle.color_esperado.substr(1) : "";
    this.detalle.titulo_fuente = (!this.detalle.titulo_fuente) ? 20 : this.detalle.titulo_fuente > 99 ? 99 : this.detalle.titulo_fuente;
    this.detalle.subtitulo_fuente = (!this.detalle.subtitulo_fuente) ? 15 : this.detalle.subtitulo_fuente > 99 ? 99 : this.detalle.subtitulo_fuente;
    this.detalle.texto_x_fuente = (!this.detalle.texto_x_fuente) ? 10 : this.detalle.texto_x_fuente > 99 ? 99 : this.detalle.texto_x_fuente;
    this.detalle.texto_y_fuente = (!this.detalle.texto_y_fuente) ? 10 : this.detalle.texto_y_fuente > 99 ? 99 : this.detalle.texto_y_fuente;
    this.detalle.texto_z_fuente = (!this.detalle.texto_z_fuente) ? 10 : this.detalle.texto_z_fuente > 99 ? 99 : this.detalle.texto_z_fuente;
    this.detalle.etiqueta_fuente = (!this.detalle.etiqueta_fuente) ? 10 : this.detalle.etiqueta_fuente > 99 ? 99 : this.detalle.etiqueta_fuente;
    this.detalle.alto = (!this.detalle.alto) ? 0 : this.detalle.alto > 999999 ? 999999 : this.detalle.alto;
    this.detalle.ancho = (!this.detalle.ancho) ? 0 : this.detalle.ancho > 999999 ? 999999 : this.detalle.ancho;
    this.detalle.margen_arriba = (!this.detalle.margen_arriba) ? 0 : this.detalle.margen_arriba > 99 ? 99 : this.detalle.margen_arriba;
    this.detalle.margen_abajo = (!this.detalle.margen_abajo) ? 0 : this.detalle.margen_abajo > 99 ? 99 : this.detalle.margen_abajo;

    this.detalle.tadic1 = !this.detalle.tadic1 ? "" : this.detalle.tadic1;
    this.detalle.tadic2 = !this.detalle.tadic2 ? "" : this.detalle.tadic2;
    this.detalle.tadic3 = !this.detalle.tadic3 ? "" : this.detalle.tadic3;
    this.detalle.tadic4 = !this.detalle.tadic4 ? "" : this.detalle.tadic4;
    this.detalle.tadic5 = !this.detalle.tadic5 ? "" : this.detalle.tadic5;
    this.detalle.tadic6 = !this.detalle.tadic6 ? "" : this.detalle.tadic6;
    this.detalle.adic1 = !this.detalle.adic1 ? "0" : this.detalle.adic1;
    this.detalle.adic2 = !this.detalle.adic2 ? "0" : this.detalle.adic2;
    this.detalle.adic3 = !this.detalle.adic3 ? "0" : this.detalle.adic3;
    this.detalle.adic4 = !this.detalle.adic4 ? "0" : this.detalle.adic4;
    this.detalle.adic5 = !this.detalle.adic5 ? "0" : this.detalle.adic5;
    this.detalle.adic6 = !this.detalle.adic6 ? "0" : this.detalle.adic6;

    this.detalle.coladic1 = this.detalle.coladic1 ? this.detalle.coladic1.substr(1) : "";
    this.detalle.coladic2 = this.detalle.coladic2 ? this.detalle.coladic2.substr(1) : "";
    this.detalle.coladic3 = this.detalle.coladic3 ? this.detalle.coladic3.substr(1) : "";
    this.detalle.coladic4 = this.detalle.coladic4 ? this.detalle.coladic4.substr(1) : "";
    this.detalle.coladic5 = this.detalle.coladic5 ? this.detalle.coladic5.substr(1) : "";
    this.detalle.coladic6 = this.detalle.coladic6 ? this.detalle.coladic6.substr(1) : "";
    
    this.detalle.color_alto = this.detalle.color_alto ? this.detalle.color_alto.substr(1) : "";
    this.detalle.color_bajo = this.detalle.color_bajo ? this.detalle.color_bajo.substr(1) : "";

    this.detalle.margen_izquierda = (!this.detalle.margen_izquierda) ? 0 : this.detalle.margen_izquierda > 99 ? 99 : this.detalle.margen_izquierda;
    this.detalle.margen_derecha = (!this.detalle.margen_derecha) ? 0 : this.detalle.margen_derecha > 99 ? 99 : this.detalle.margen_derecha;
    this.detalle.grueso_esperado = (!this.detalle.grueso_esperado) ? 1 : this.detalle.grueso_esperado > 10 ? 10 : this.detalle.grueso_esperado;
    this.detalle.grueso_spiline = (!this.detalle.grueso_spiline) ? 1 : this.detalle.grueso_spiline > 10 ? 10 : this.detalle.grueso_spiline;
    this.detalle.maximo_barras = (!this.detalle.maximo_barras) ? 0 : this.detalle.maximo_barras > 100 ? 100 : this.detalle.maximo_barras;
    this.detalle.maximo_barraspct = (!this.detalle.maximo_barraspct) ? 0 : this.detalle.maximo_barraspct > 99 ? 99 : this.detalle.maximo_barraspct;
    this.detalle.valor_esperado = (!this.detalle.valor_esperado) ? 0 : this.detalle.valor_esperado;
    
    let cadOEE = "NNNNNN";

    this.detalle.oee_tipo = this.detalle.oee_tipoFTQ + this.detalle.oee_tipoEFI + this.detalle.oee_tipoDIS

    this.detalle.oee_nombre = this.detalle.oee_nombreFTQ + ";" + this.detalle.oee_nombreEFI + ";" + this.detalle.oee_nombreDIS;
    this.detalle.adicionales_titulos = this.detalle.tadic1 + ";" +this.detalle.tadic2 + ";" +this.detalle.tadic3 + ";" +this.detalle.tadic4 + ";" +this.detalle.tadic5 + ";" +this.detalle.tadic6
    
    this.detalle.adicionales = this.detalle.adic1 + ";" +this.detalle.adic2 + ";" +this.detalle.adic3 + ";" +this.detalle.adic4 + ";" +this.detalle.adic5 + ";" +this.detalle.adic6 + ";" +this.detalle.adic7
    
    this.detalle.adicionales_colores = this.detalle.coladic1 + ";" +this.detalle.coladic2 + ";" +this.detalle.coladic3 + ";" +this.detalle.coladic4 + ";" +this.detalle.coladic5 + ";" +this.detalle.coladic6
  
    this.detalle.esperado_esquema = (!this.detalle.dividir_colores ? "N" : this.detalle.dividir_colores) + ";" + this.detalle.color_bajo + ";" + this.detalle.color_alto 

    cadOEE = (this.detalle.oee_selFTQ ? "S" : "N") + (this.detalle.oee_selEFI ? "S" : "N") + (this.detalle.oee_selDIS ? "S" : "N");
    cadOEE = cadOEE + (this.detalle.oee_etiFTQ ? this.detalle.oee_etiFTQ : "N");
    cadOEE = cadOEE + (this.detalle.oee_etiEFI ? this.detalle.oee_etiEFI : "N");
    cadOEE = cadOEE + (this.detalle.oee_etiDIS ? this.detalle.oee_etiDIS : "N");

    let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".pu_graficos WHERE grafico = " + (this.grActual * 100 + this.graficaActual) +  " AND usuario = " + this.servicio.rUsuario().id; 
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let esNuevo = false;
      if (resp.length == 0)
      {
        esNuevo = true;
        sentencia = "INSERT INTO " + this.servicio.rBD() + ".pu_graficos (grafico, usuario) VALUES(" + (this.grActual * 100 + this.graficaActual) + ", " + this.servicio.rUsuario().id + ");"
      }
      else
      {
        sentencia = "";
      }
    
      let cadTextoY = "";
      if (this.detalle.texto_y)
      { 
        cadTextoY = this.detalle.texto_y.split(";");
      }
      if (this.actualIndice == 0)
      {
        this.detalle.texto_y = this.detalle.texto_y2 + ";" + (cadTextoY[1] ? cadTextoY[1] : "")  + ";" + (cadTextoY[2] ? cadTextoY[2] : "") + ";" + (cadTextoY[3] ? cadTextoY[3] : "");
      }
      else if (this.actualIndice == 1)
      {
        this.detalle.texto_y = (cadTextoY[0] ? cadTextoY[0] : "") + ";" + this.detalle.texto_y2 + ";" + (cadTextoY[2] ? cadTextoY[2] : "") + ";" + (cadTextoY[3] ? cadTextoY[3] : "");
      }
      else if (this.actualIndice == 2)
      {
        this.detalle.texto_y = (cadTextoY[0] ? cadTextoY[0] : "") + ";" + (cadTextoY[1] ? cadTextoY[1] : "") + ";" + this.detalle.texto_y2 + ";" + (cadTextoY[3] ? cadTextoY[3] : "");
      }
      else if (this.actualIndice == 3)
      {
        this.detalle.texto_y = (cadTextoY[0] ? cadTextoY[0] : "") + ";" + (cadTextoY[1] ? cadTextoY[1] : "") + ";" + (cadTextoY[2] ? cadTextoY[2] : "") + ";" + this.detalle.texto_y2
      }

      this.detalle.mostrar_argumentos = !this.detalle.mostrar_argumentos ? "S" : this.detalle.mostrar_argumentos;

      let adicional = this.detalle.adic21 + ";" + this.detalle.adic22
      adicional = !adicional ? ";" : adicional;

      sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".pu_graficos SET visualizar = '" + this.detalle.visualizar + "', titulo = '" + this.detalle.titulo + "', orden = " + (!this.detalle.orden ? "0" : this.detalle.orden) + ", tipo_principal = '" + this.detalle.tipo_principal + "', oee_tipo = '" + this.detalle.oee_tipo + "', oee_nombre = '" + this.detalle.oee_nombre + "', oee = '" + cadOEE + "', oee_colores = '" + this.detalle.oee_colores + "', titulo_fuente = " + this.detalle.titulo_fuente + ", sub_titulo = '" + this.detalle.sub_titulo + "', subtitulo_fuente = " + this.detalle.subtitulo_fuente + ", texto_x = '" + this.detalle.texto_x + "', texto_x_fuente = " + this.detalle.texto_x_fuente + ", texto_y = '" + this.detalle.texto_y + "', texto_y_fuente = " + this.detalle.texto_y_fuente + ", texto_z = '" + this.detalle.texto_z + "', texto_z_fuente = " + this.detalle.texto_z_fuente + ", etiqueta_mostrar = '" + this.detalle.etiqueta_mostrar + "', etiqueta_fuente = " + this.detalle.etiqueta_fuente + ", etiqueta_leyenda = '" + this.detalle.etiqueta_leyenda + "', etiqueta_color = '" + this.detalle.etiqueta_color + "', etiqueta_fondo = '" + this.detalle.etiqueta_fondo + "', etiqueta_formato = " + +this.detalle.etiqueta_formato + ", ancho = " + this.detalle.ancho + ", alto = " + this.detalle.alto + ", margen_arriba = " + this.detalle.margen_arriba + ", margen_abajo = " + this.detalle.margen_abajo + ", margen_izquierda = " + this.detalle.margen_izquierda + ", margen_derecha = " + this.detalle.margen_derecha + ", maximo_barras = " + this.detalle.maximo_barras + ", maximo_barraspct = " + this.detalle.maximo_barraspct + ", agrupar = '" + this.detalle.agrupar + "', agrupar_posicion = '" + this.detalle.agrupar_posicion + "', agrupar_texto = '" + this.detalle.agrupar_texto + "', fecha = NOW(), color_fondo_barras = '" + this.detalle.color_fondo_barras + "', color_letras = '" + this.detalle.color_letras + "', color_fondo = '" + this.detalle.color_fondo + "', color_leyenda_fondo = '" + this.detalle.color_leyenda_fondo + "', color_leyenda = '" + this.detalle.color_leyenda + "', ver_esperado = '" + this.detalle.ver_esperado + "', valor_esperado = " + +this.detalle.valor_esperado + ", grueso_esperado = " + this.detalle.grueso_esperado + ", color_esperado = '" + this.detalle.color_esperado + "', texto_esperado = '" + this.detalle.texto_esperado + "', incluir_ceros = '" + this.detalle.incluir_ceros + "', orden_grafica = '" + this.detalle.orden_grafica + "', color_barra = '" + this.detalle.color_barra + "', color_barra_borde = '" + this.detalle.color_barra_borde + "', ver_leyenda = '" + this.detalle.ver_leyenda + "', overlap = '" + this.detalle.overlap + "', colores_multiples = '" + this.detalle.colores_multiples + "', color_spiline = '" + this.detalle.color_spiline + "', adicionales = '" + this.detalle.adicionales + "', esperado_esquema = '" + this.detalle.esperado_esquema + "', adicionales_colores = '" + this.detalle.adicionales_colores + "', adicionales_titulos = '" + this.detalle.adicionales_titulos + "', grueso_spiline = " + this.detalle.grueso_spiline + ", textos_adicionales = '" + adicional + "', mostrar_argumentos = '" + this.detalle.mostrar_argumentos + "' WHERE grafico = " + (this.grActual * 100 + this.graficaActual) +  " AND usuario = " + this.servicio.rUsuario().id, 
      sentencia = sentencia.replace(/null/g, '');
      campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe(resp =>
      {
        this.graficando = true;
        this.formateando = false;
        sentencia = "SELECT id, titulo AS nombre, visualizar FROM " + this.servicio.rBD() + ".pu_graficos WHERE usuario = " + this.servicio.rUsuario().id + " AND grafico = " + (this.grActual * 100 + this.graficaActual);
        campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          if (resp.length>0)
          {
            resp[0].nro = this.graficaActual
            this.opciones[this.graficaActual - 1] = resp[0];
            this.modelo = 11;
            this.preGraficar(this.graficaActual - 1);
          }
          
        })
        this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2173]);
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[2666]
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        
      })
    })
  }

  cambiando(evento: any)
  {
    this.botGuar = true;
    this.botCan = true;
    if (evento.value == 8)
    {
      if (!this.detalle.desde)
      {
        this.detalle.desde = new Date();
      }
      if (!this.detalle.hasta)
      {
        this.detalle.hasta = new Date();
      }
    }
  }

  cambiarDescripcion(evento: any)
  {
    let cadTextoY = "";
    if (this.detalle.texto_y)
    { 
      cadTextoY = this.detalle.texto_y.split(";");
    }
    if (this.actualIndice == 0)
    {
      this.detalle.texto_y = this.detalle.texto_y2 + ";" + (cadTextoY[1] ? cadTextoY[1] : "")  + ";" + (cadTextoY[2] ? cadTextoY[2] : "") + ";" + (cadTextoY[3] ? cadTextoY[3] : "");
    }
    else if (this.actualIndice == 1)
    {
      this.detalle.texto_y = (cadTextoY[0] ? cadTextoY[0] : "") + ";" + this.detalle.texto_y2 + ";" + (cadTextoY[2] ? cadTextoY[2] : "") + ";" + (cadTextoY[3] ? cadTextoY[3] : "");
    }
    else if (this.actualIndice == 2)
    {
      this.detalle.texto_y = (cadTextoY[0] ? cadTextoY[0] : "") + ";" + (cadTextoY[1] ? cadTextoY[1] : "") + ";" + this.detalle.texto_y2 + ";" + (cadTextoY[3] ? cadTextoY[3] : "");
    }
    else if (this.actualIndice == 3)
    {
      this.detalle.texto_y = (cadTextoY[0] ? cadTextoY[0] : "") + ";" + (cadTextoY[1] ? cadTextoY[1] : "") + ";" + (cadTextoY[2] ? cadTextoY[2] : "") + ";" + this.detalle.texto_y2
    }
    this.detalle.texto_y2 = cadTextoY[+evento.value];
    this.actualIndice = +evento.value;
  }

  aplicarConsulta(id: number)
  {
    this.ayuda20 = "";
    this.filtroOEE = "";
    
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".consultas_cab WHERE id = " + this.servicio.rConsulta() + ";"
    if (this.servicio.rConsulta() == 0)
    {
      sentencia = "SELECT * FROM " + this.servicio.rBD() + ".consultas_cab WHERE usuario = " + this.servicio.rUsuario().id + " AND (defecto = 'S' OR ISNULL(nombre) OR nombre = '') ORDER BY actualizacion DESC LIMIT 1"
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let desde = new Date();
      let hasta = new Date();
      this.hayFiltro = false;
      if (resp.length > 0)
      { 
        this.ayuda20 = this.servicio.rTraduccion()[2174] + (resp[0].nombre ? resp[0].nombre : this.servicio.rTraduccion()[2175]);
        this.servicio.aConsulta(resp[0].id)
        this.hayFiltro = true;
        if (resp[0].periodo == "2")
        {
          if (desde.getDay()==0) 
          {
            //domingo
            desde.setDate(desde.getDate() - 6);
          }
          else 
          {
            desde.setDate(desde.getDate() - (desde.getDay() - 1));
          }
        }
        else if (resp[0].periodo == "3")
        {
          let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";         
          desde = new Date(nuevaFecha);
        
        }
        else if (resp[0].periodo == "4")
        {
          let nuevaFecha = this.servicio.fecha(1, '' , "yyyy") + "/01/01";         
          desde = new Date(nuevaFecha);
        }
        else if (resp[0].periodo == "5")
        {
          desde = new Date();
          if (desde.getDay() == 0) 
          {
            desde.setDate(desde.getDate() - 13);
            hasta.setDate(hasta.getDate() - 7);
          }
          else 
          {
            hasta.setDate(hasta.getDate() - (hasta.getDay()));
            desde.setDate(desde.getDate() - (desde.getDay() - 1) - 7);
          }
          
          }
        else if (resp[0].periodo == "6")
        {
          let mesTemp = new Date(this.datepipe.transform(new Date(desde), "yyyy/MM") + "/01");
          mesTemp.setDate(mesTemp.getDate() - 1);
          desde = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy/MM") + "/01");
          hasta = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy/MM/dd"));
        }
        else if (resp[0].periodo == "7")
        {
          let mesTemp = new Date(this.datepipe.transform(new Date(desde), "yyyy") + "/01/01");
          mesTemp.setDate(mesTemp.getDate() - 1);
          desde = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy") + "/01/01");
          hasta = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy") + "/12/31");
          }
        else if (resp[0].periodo == "9")
        {
          desde.setDate(desde.getDate() - 1);
          hasta.setDate(hasta.getDate() - 1);
        }
        if (resp[0].periodo == "8")
        {
          desde = new Date(this.datepipe.transform(new Date(resp[0].desde), "yyyy/MM/dd"));
          hasta = new Date(this.datepipe.transform(new Date(resp[0].hasta), "yyyy/MM/dd"));     
        }
        
        if (resp[0].filtromaq == "N")
        {
          this.filtroOEE = this.filtroOEE + " AND i.equipo IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 20) "
        }
        if (resp[0].filtrotec == "N")
        {
          this.filtroOEE = this.filtroOEE + " AND i.operador IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 50) "
        } 
        if (resp[0].filtronpar == "N")
        {
          this.filtroOEE = this.filtroOEE + " AND i.parte IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 60) "
          
        } 
        if (resp[0].filtrotur == "N")
        {
          this.filtroOEE = this.filtroOEE + " AND i.turno IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 70) "
        }
        if (resp[0].filtroord == "N")
        {
          this.filtroOEE = this.filtroOEE + " AND i.orden IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 80) "
        } 
        if (resp[0].filtroord == "N")
        {
          this.filtroOEE = this.filtroOEE + " AND i.orden IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 80) "
        } 
      } 
      else
      {
        let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";         
        desde = new Date(nuevaFecha);
      }
      this.fHasta = this.datepipe.transform(hasta, "yyyy/MM/dd");
      this.fDesde = this.datepipe.transform(desde, "yyyy/MM/dd");  
      this.sub_titulo = this.servicio.rTraduccion()[602] + this.datepipe.transform(desde, "dd-MMM-yyyy") + this.servicio.rTraduccion()[610] + this.datepipe.transform(hasta, "dd-MMM-yyyy");
      this.preGraficar(id == -1 ? (this.graficaActual - 1) : id)
    })
  }
  
  formatear()
  {
    this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2792]);
    this.filtrando = false;
    this.formateando = true;
    this.filtrarC = false;
    this.graficando = false;
    this.bot4Sel = false;
    this.bot7Sel = false;
    this.guardarSel = false;
    this.modelo = 13;
    this.buscarGrafica(1);
  }

  buscarGrafica(accion: number)
  {
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_graficos WHERE id = " + this.idGrafico;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        resp[0].oee_tipoFTQ = resp[0].oee_tipo[0];
        resp[0].oee_tipoEFI = resp[0].oee_tipo[1];
        resp[0].oee_tipoDIS = resp[0].oee_tipo[2];

        resp[0].oee_selFTQ = resp[0].oee[0] == "S";
        resp[0].oee_selEFI = resp[0].oee[1] == "S";
        resp[0].oee_selDIS = resp[0].oee[2] == "S";

        
        resp[0].oee_etiFTQ = resp[0].oee[3];
        resp[0].oee_etiEFI = resp[0].oee[4];
        resp[0].oee_etiDIS = resp[0].oee[5];

        resp[0].oee_etiFTQ = resp[0].oee_etiFTQ != "S" && resp[0].oee_etiFTQ != "N" ? "N" : resp[0].oee_etiFTQ;
        resp[0].oee_etiEFI = resp[0].oee_etiEFI != "S" && resp[0].oee_etiEFI != "N" ? "N" : resp[0].oee_etiEFI;
        resp[0].oee_etiDIS = resp[0].oee_etiDIS != "S" && resp[0].oee_etiDIS != "N" ? "N" : resp[0].oee_etiDIS;

        resp[0].color_letras = resp[0].color_letras ? ("#" + resp[0].color_letras) : "";
        resp[0].etiqueta_color = resp[0].etiqueta_color ? ("#" + resp[0].etiqueta_color) : "";
        resp[0].etiqueta_fondo = resp[0].etiqueta_fondo ? ("#" + resp[0].etiqueta_fondo) : "";
        resp[0].color_leyenda = resp[0].color_leyenda ? ("#" + resp[0].color_leyenda) : "";
        resp[0].color_leyenda_fondo = resp[0].color_leyenda_fondo ? ("#" + resp[0].color_leyenda_fondo) : "";
        resp[0].color_fondo_barras = resp[0].color_fondo_barras ? ("#" + resp[0].color_fondo_barras) : "";
        resp[0].color_fondo = resp[0].color_fondo ? ("#" + resp[0].color_fondo) : "";
        resp[0].color_spiline = resp[0].color_spiline ? ("#" + resp[0].color_spiline) : "";
        resp[0].color_esperado = resp[0].color_esperado ? ("#" + resp[0].color_esperado) : "";
        resp[0].color_barra = resp[0].color_barra ? ("#" + resp[0].color_barra) : "";
        resp[0].color_barra_borde = resp[0].color_barra_borde ? ("#" + resp[0].color_barra_borde) : "";
        resp[0].tipo_valor = resp[0].tipo_principal == "B" ? "bar" : resp[0].tipo_principal == "L" ? "spline" : "area";
        resp[0].tipo_valorFTQ = resp[0].oee_tipo[0] == "B" ? "bar" : resp[0].oee_tipo[0] == "L" ? "spline" : "area";
        resp[0].tipo_valorEFI = resp[0].oee_tipo[1] == "B" ? "bar" : resp[0].oee_tipo[1] == "L" ? "spline" : "area";
        resp[0].tipo_valorDIS = resp[0].oee_tipo[2] == "B" ? "bar" : resp[0].oee_tipo[2] == "L" ? "spline" : "area";
        resp[0].oee_colores = resp[0].oee_colores ? resp[0].oee_colores : ";;";
        let oee_colores = resp[0].oee_colores.split(";");
        resp[0].colorFTQ = oee_colores[0] ? ("#" + oee_colores[0]) : "";
        resp[0].colorEFI = oee_colores[1] ? ("#" + oee_colores[1]) : "";
        resp[0].colorDIS = oee_colores[2] ? ("#" + oee_colores[2]) : "";

        resp[0].oee_nombre = resp[0].oee_nombre ? resp[0].oee_nombre : ";;";
        oee_colores = resp[0].oee_nombre.split(";");
        resp[0].oee_nombreFTQ = oee_colores[0];
        resp[0].oee_nombreEFI = oee_colores[1];
        resp[0].oee_nombreDIS = oee_colores[2];
        
        oee_colores = resp[0].textos_adicionales.split(";");
        resp[0].adic21 = oee_colores[0];
        resp[0].adic22 = oee_colores[1];
      
        resp[0].esperado_esquema =!resp[0].esperado_esquema ? ";;" : resp[0].esperado_esquema;
        oee_colores = resp[0].esperado_esquema.split(";");
        resp[0].dividir_colores = oee_colores[0] ? oee_colores[0] : "N";
        resp[0].color_bajo = oee_colores[1] ? ("#" + oee_colores[1]) : "";
        resp[0].color_alto = oee_colores[2] ? ("#" + oee_colores[2]) : "";  
      
        resp[0].adicionales_colores = resp[0].adicionales_colores ? resp[0].adicionales_colores : ";;;;;";
        oee_colores = resp[0].adicionales_colores.split(";");
        resp[0].coladic1 = oee_colores[0] ? ("#" + oee_colores[0]) : "";
        resp[0].coladic2 = oee_colores[1] ? ("#" + oee_colores[1]) : "";
        resp[0].coladic3 = oee_colores[2] ? ("#" + oee_colores[2]) : "";    
        resp[0].coladic4 = oee_colores[3] ? ("#" + oee_colores[3]) : "";    
        resp[0].coladic5 = oee_colores[4] ? ("#" + oee_colores[4]) : "";    
        resp[0].coladic6 = oee_colores[5] ? ("#" + oee_colores[5]) : "";    

        resp[0].adicionales = resp[0].adicionales ? resp[0].adicionales : "0;0;0;0;0;0;0";
        resp[0].adicionales = resp[0].adicionales == "NNNNNN" ? "0;0;0;0;0;0;0" : resp[0].adicionales;
        oee_colores = resp[0].adicionales.split(";");
        resp[0].adic1 = oee_colores[0] ? oee_colores[0] : "0";
        resp[0].adic2 = oee_colores[1] ? oee_colores[1] : "0";
        resp[0].adic3 = oee_colores[2] ? oee_colores[2] : "0";
        resp[0].adic4 = oee_colores[3] ? oee_colores[3] : "0";
        resp[0].adic5 = oee_colores[4] ? oee_colores[4] : "0";
        resp[0].adic6 = oee_colores[5] ? oee_colores[5] : "0";
        resp[0].adic7 = oee_colores[6] ? oee_colores[6] : "0";

        
        resp[0].adicionales_titulos = resp[0].adicionales_titulos ? resp[0].adicionales_titulos : ";;;;;";
        oee_colores = resp[0].adicionales_titulos.split(";");
        resp[0].tadic1 = oee_colores[0] ? oee_colores[0] : "";
        resp[0].tadic2 = oee_colores[1] ? oee_colores[1] : "";
        resp[0].tadic3 = oee_colores[2] ? oee_colores[2] : "";
        resp[0].tadic4 = oee_colores[3] ? oee_colores[3] : "";
        resp[0].tadic5 = oee_colores[4] ? oee_colores[4] : "";
        resp[0].tadic6 = oee_colores[5] ? oee_colores[5] : "";
      

        this.detalle = resp[0];
        let cadTextoY = "";
        if (this.detalle.texto_y)
        { 
          cadTextoY = this.detalle.texto_y.split(";");
        }
        this.actualIndice = +this.detalle.orden;
        this.detalle.texto_y2 = cadTextoY[+this.actualIndice];
        
      }
      
    });

    sentencia = "SELECT titulo FROM " + this.servicio.rBD() + ".pu_graficos WHERE grafico = " + (this.grActual * 100 + this.graficaActual) +  " AND usuario = 0 AND idioma = " + this.servicio.rIdioma().id;
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length>0)
      {
        this.nGrafica = resp[0].titulo;
      }
      if (accion==0)
      {
        this.detalle = resp[0];
        let cadTextoY = "";
        if (this.detalle.texto_y)
        { 
          cadTextoY = this.detalle.texto_y.split(";");
        }
        this.actualIndice = +this.detalle.orden;
        this.detalle.texto_y2 = cadTextoY[+this.actualIndice];
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[2669]
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    });
  }

  predeterminados()
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3406], mensaje: this.servicio.rTraduccion()[3407], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3408], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_recuperar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result.accion)
      {
        if (result.accion == 1) 
        {
          let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_graficos WHERE grafico = " + (this.grActual * 100 + this.graficaActual) +  " AND usuario = 0 AND idioma = " + this.servicio.rIdioma().id;
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (resp.length > 0)
            {
              this.botGuar = true;
              this.botCan = true;
              resp[0].oee_tipoFTQ = resp[0].oee_tipo[0];
              resp[0].oee_tipoEFI = resp[0].oee_tipo[1];
              resp[0].oee_tipoDIS = resp[0].oee_tipo[2];

              resp[0].oee_selFTQ = resp[0].oee[0] == "S";
              resp[0].oee_selEFI = resp[0].oee[1] == "S";
              resp[0].oee_selDIS = resp[0].oee[2] == "S";

              resp[0].oee_etiFTQ = resp[0].oee[3];
              resp[0].oee_etiEFI = resp[0].oee[4];
              resp[0].oee_etiDIS = resp[0].oee[5];
              resp[0].oee_etiFTQ = resp[0].oee_etiFTQ != "S" && resp[0].oee_etiFTQ != "N" ? "N" : resp[0].oee_etiFTQ;
              resp[0].oee_etiEFI = resp[0].oee_etiEFI != "S" && resp[0].oee_etiEFI != "N" ? "N" : resp[0].oee_etiEFI;
              resp[0].oee_etiDIS = resp[0].oee_etiDIS != "S" && resp[0].oee_etiDIS != "N" ? "N" : resp[0].oee_etiDIS;

              resp[0].color_letras = resp[0].color_letras ? ("#" + resp[0].color_letras) : "";
              resp[0].etiqueta_color = resp[0].etiqueta_color ? ("#" + resp[0].etiqueta_color) : "";
              resp[0].etiqueta_fondo = resp[0].etiqueta_fondo ? ("#" + resp[0].etiqueta_fondo) : "";
              resp[0].color_leyenda = resp[0].color_leyenda ? ("#" + resp[0].color_leyenda) : "";
              resp[0].color_leyenda_fondo = resp[0].color_leyenda_fondo ? ("#" + resp[0].color_leyenda_fondo) : "";
              resp[0].color_fondo_barras = resp[0].color_fondo_barras ? ("#" + resp[0].color_fondo_barras) : "";
              resp[0].color_fondo = resp[0].color_fondo ? ("#" + resp[0].etiqueta_fondo) : "";
              resp[0].color_spiline = resp[0].color_spiline ? ("#" + resp[0].color_spiline) : "";
              resp[0].color_esperado = resp[0].color_esperado ? ("#" + resp[0].color_esperado) : "";
              resp[0].color_barra = resp[0].color_barra ? ("#" + resp[0].color_barra) : "";
              resp[0].color_barra_borde = resp[0].color_barra_borde ? ("#" + resp[0].color_barra_borde) : "";

              resp[0].tipo_valor = resp[0].tipo_principal == "B" ? "bar" : resp[0].tipo_principal == "L" ? "spline" : "area";
              resp[0].tipo_valorFTQ = resp[0].oee_tipo[0] == "B" ? "bar" : resp[0].oee_tipo[0] == "L" ? "spline" : "area";
              resp[0].tipo_valorEFI = resp[0].oee_tipo[1] == "B" ? "bar" : resp[0].oee_tipo[1] == "L" ? "spline" : "area";
              resp[0].tipo_valorDIS = resp[0].oee_tipo[2] == "B" ? "bar" : resp[0].oee_tipo[2] == "L" ? "spline" : "area";
              resp[0].oee_colores = resp[0].oee_colores ? resp[0].oee_colores : ";;";
              let oee_colores = resp[0].oee_colores.split(";");
              resp[0].colorFTQ = oee_colores[0] ? ("#" + oee_colores[0]) : "";
              resp[0].colorEFI = oee_colores[1] ? ("#" + oee_colores[1]) : "";
              resp[0].colorDIS = oee_colores[2] ? ("#" + oee_colores[2]) : "";

              resp[0].oee_nombre = resp[0].oee_nombre ? resp[0].oee_nombre : ";;";
              oee_colores = resp[0].oee_nombre.split(";");
              resp[0].oee_nombreFTQ = oee_colores[0];
              resp[0].oee_nombreEFI = oee_colores[1];
              resp[0].oee_nombreDIS = oee_colores[2];
      
              oee_colores = resp[0].textos_adicionales.split(";");
              resp[0].adic21 = oee_colores[0];
              resp[0].adic22 = oee_colores[1];
      
              resp[0].esperado_esquema =!resp[0].esperado_esquema ? ";;" : resp[0].esperado_esquema;
              oee_colores = resp[0].esperado_esquema.split(";");
              resp[0].dividir_colores = oee_colores[0] ? oee_colores[0] : "N";
              resp[0].color_bajo = oee_colores[1] ? ("#" + oee_colores[1]) : "";
              resp[0].color_alto = oee_colores[2] ? ("#" + oee_colores[2]) : "";  
      
              resp[0].adicionales_colores = resp[0].adicionales_colores ? resp[0].adicionales_colores : ";;;;;";
              oee_colores = resp[0].adicionales_colores.split(";");
              resp[0].coladic1 = oee_colores[0] ? ("#" + oee_colores[0]) : "";
              resp[0].coladic2 = oee_colores[1] ? ("#" + oee_colores[1]) : "";
              resp[0].coladic3 = oee_colores[2] ? ("#" + oee_colores[2]) : "";    
              resp[0].coladic4 = oee_colores[3] ? ("#" + oee_colores[3]) : "";    
              resp[0].coladic5 = oee_colores[4] ? ("#" + oee_colores[4]) : "";    
              resp[0].coladic6 = oee_colores[5] ? ("#" + oee_colores[5]) : "";    

              resp[0].adicionales = resp[0].adicionales ? resp[0].adicionales : "0;0;0;0;0;0;0";
              resp[0].adicionales = resp[0].adicionales == "NNNNNN" ? "0;0;0;0;0;0;0" : resp[0].adicionales;
              oee_colores = resp[0].adicionales.split(";");
              resp[0].adic1 = oee_colores[0] ? oee_colores[0] : "0";
              resp[0].adic2 = oee_colores[1] ? oee_colores[1] : "0";
              resp[0].adic3 = oee_colores[2] ? oee_colores[2] : "0";
              resp[0].adic4 = oee_colores[3] ? oee_colores[3] : "0";
              resp[0].adic5 = oee_colores[4] ? oee_colores[4] : "0";
              resp[0].adic6 = oee_colores[5] ? oee_colores[5] : "0";
              resp[0].adic7 = oee_colores[6] ? oee_colores[6] : "0";

              
              resp[0].adicionales_titulos = resp[0].adicionales_titulos ? resp[0].adicionales_titulos : ";;;;;";
        
              oee_colores = resp[0].adicionales_titulos.split(";");
              resp[0].tadic1 = oee_colores[0] ? oee_colores[0] : "";
              resp[0].tadic2 = oee_colores[1] ? oee_colores[1] : "";
              resp[0].tadic3 = oee_colores[2] ? oee_colores[2] : "";
              resp[0].tadic4 = oee_colores[3] ? oee_colores[3] : "";
              resp[0].tadic5 = oee_colores[4] ? oee_colores[4] : "";
              resp[0].tadic6 = oee_colores[5] ? oee_colores[5] : "";
      
      
              this.detalle = resp[0];
              let cadTextoY = "";
              if (this.detalle.texto_y)
              { 
                cadTextoY = this.detalle.texto_y.split(";");
              }
              this.actualIndice = +this.detalle.orden;
              this.detalle.texto_y2 = cadTextoY[+this.actualIndice];
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[2670]
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
            
          })
        }
      }
    });
    }

  cancelarF()
  {
    this.bot4Sel = false;
    this.botGuar = false;
    this.botCan = false;
    this.buscarGrafica(0);
  }  

  calcularColor(arg: any) {
    let seguir1 = false;
    let seguir2 = false;
    let seguir3 = false;
    
    if ((this.parGrafica.adic1 != 0 && this.parGrafica.coladic1) || (this.parGrafica.adic2 != 0 && this.parGrafica.coladic2) || (this.parGrafica.adic3 != 0 && this.parGrafica.coladic3) || (this.parGrafica.adic4 != 0 && this.parGrafica.coladic4) || (this.parGrafica.adic5 != 0 && this.parGrafica.coladic5) || (this.parGrafica.adic6 != 0 && this.parGrafica.coladic6))
    {
      seguir1 = true
    }
    if (this.parGrafica.valor_esperado && this.parGrafica.dividir_colores == "S" && this.parGrafica.color_alto && this.parGrafica.color_bajo)
    {
      seguir2 = true
    }
    if (!seguir2 && this.parGrafica.colores_multiples=="S")
    {
      seguir3 = true;
    }
    if (!seguir1 && !seguir2 && !seguir3)
    {
      return;
    }
    if (seguir2)
    {
      if(+arg.value > +this.parGrafica.valor_esperado ) {
        return { color: this.parGrafica.color_alto };
      }         
      else { 
        return { color: this.parGrafica.color_bajo };
      }
    }
    else if (seguir1)
    {
      if (arg.index == 0 && this.parGrafica.adic1 != 0 && this.parGrafica.coladic1)
      {
        return { color: this.parGrafica.coladic1};
      }
      else if (arg.index == 1 && this.parGrafica.adic2 != 0 && this.parGrafica.coladic2)
      {
        return { color: this.parGrafica.coladic2};
      }
      else if (arg.index == 2 && this.parGrafica.adic3 != 0 && this.parGrafica.coladic3)
      {
        return { color: this.parGrafica.coladic3};
      }
      else if (arg.index == 3 && this.parGrafica.adic4 != 0 && this.parGrafica.coladic4)
      {
        return { color: this.parGrafica.coladic4};
      }
      else if (arg.index == 4 && this.parGrafica.adic5 != 0 && this.parGrafica.coladic5)
      {
        return { color: this.parGrafica.coladic5};
      }
      else if (arg.index == 5 && this.parGrafica.adic6 != 0 && this.parGrafica.coladic6)
      {
        return { color: this.parGrafica.coladic6};
      }
      else if (seguir3)
      {
        return { color: this.coloresArreglo[arg.index % this.coloresArreglo.length]};
      }
    }
    else if (seguir3)
    {
      return { color: this.coloresArreglo[arg.index % this.coloresArreglo.length]};
      
    }
  }

  terminaGrafico(e: any)
  {
    setTimeout(() => {
      this.servicio.activarSpinnerSmall.emit(false);
      this.servicio.activarSpinner.emit(false);
    }, 200);
  }

  calcularPCT(arg: any)
  {
    return arg.valueText + "%";
  }

}
