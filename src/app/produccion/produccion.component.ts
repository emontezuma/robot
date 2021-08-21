import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { FijarequiComponent } from '../fijarequi/fijarequi.component';
import { Router } from '@angular/router';
import { SesionComponent } from '../sesion/sesion.component';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css'],
  animations: [
    trigger('esquema', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(5px)' }),
        animate('0.15s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0s', style({ opacity: 0, transform: 'translateY(5px)' }))
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
    trigger('esquema_top2', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(10px)' }),
        animate('0.2s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.2s', style({ opacity: 0, transform: 'translateY(10px)' }))
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
  ]),]
})

export class ProduccionComponent implements OnInit {

  @ViewChild("lstC0", { static: false }) lstC0: MatSelect;
  @ViewChild("txtT9", { static: false }) txtT9: ElementRef;
  @ViewChild("txtT10", { static: false }) txtT10: ElementRef;
  @ViewChild("contenedor", { static: false }) contenedor: ElementRef;
  scrollingSubscription: Subscription;
  vistaCatalogo: Subscription;
  //URL_FOLDER = "http://localhost:8081/sigma/assets/datos/";
  URL_FOLDER = "/robot/assets/datos/";

  @HostListener('window:resize', ['$event']) onResize() {
    // this.eliminarFiltros();
    // this.detenerConsultaStatus();
    // this.calcularPantalla();
    // this.procesarMapa();
    //setTimeout(() => location.reload(), 100);
  }


  constructor
  (
    public servicio: ServicioService,
    public scroll: ScrollDispatcher,
    public dialogo: MatDialog,
    private router: Router,
    public datepipe: DatePipe
    
  )
  {
    this.customizeText = this.customizeText.bind(this);   
    this.emit00 = this.servicio.mensajeError.subscribe((mensaje: any)=>
    {
      let mensajes = mensaje.split(";");
      if (mensajes[0] == 1)
      {
        this.pantalla = 1;
        this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2007]);
        this.errorMensaje = mensajes[1];
      }
    });

    this.emit10 = this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      this.altoPantalla= this.servicio.rPantalla().alto - 105;
      this.anchoPantalla = this.servicio.rPantalla().ancho - 10 + this.servicio.rAnchoSN();

      if (pantalla)
      {
        setTimeout(() => {
          this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
          this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 40;
          if (this.contenedor)
          {
            this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
          }
          this.verGraficoBottom = true;
        }, 100);
      }
      else
      {
        this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
        this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 40;
        setTimeout(() => {
          if (this.contenedor)
          {
            this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
          }
          this.verGraficoBottom = true;
        }, 100);
      }
    });
    this.emit10 = this.servicio.teclaEscape.subscribe((accion: boolean)=>
    {
      this.escapar();
    });

    
    this.escaner = this.servicio.escaneado.subscribe((cadena: string)=>
    {
      //Se escane a el lote
      //this.servicio.aEscanear(false);
    });
    this.emit20 = this.servicio.cambioTurno.subscribe((accion: boolean)=>
    {
      this.servicio.mensajeTurno.emit(this.servicio.rTurno().nombre);
    });

    this.emit30 = this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
    });
    this.emit40 = this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 11) == "/produccion")
      {
        this.cadaSegundo();
      }
    });
    this.emit50 = this.servicio.vista.subscribe((accion: number)=>
    {
      if (accion == 13)
      {
        this.rConfiguracion();
        this.seleccionarMaquina();
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
        this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
        if (this.contenedor)
        {
          this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
        }
        this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 40;
      }
    });
    this.emit60 = this.servicio.mostrarBarra.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 11) == "/produccion")
      {
        this.verTop = accion;
        this.servicio.guardarVista(42, this.verTop ? 1: 0 );
        if (!this.verTop)
        {
          this.verGraficoBottom = false;
          setTimeout(() => {
            this.altoGrafica = this.servicio.rPantalla().alto - 156 ;  
            if (this.contenedor)
            {
              this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
            }
            this.verGraficoBottom = true;
          }, 200);
          
        }
        else
        {
          this.altoGrafica = this.servicio.rPantalla().alto - 250;
          if (this.contenedor)
          {
            this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
          }
          this.verGraficoBottom = false;
          setTimeout(() => {
            this.altoGrafica = this.servicio.rPantalla().alto - 156 ;  
            this.verGraficoBottom = true;
          }, 200);  
        }
      }
    });
    this.emit70 = this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    
    
    this.emit80 = this.servicio.cambioColor.subscribe((estatus: any)=>
    {
      if (this.router.url.substr(0, 11) == "/produccion")
      {
        
        this.colorear();

      }
      
    });

    this.emit90 = this.servicio.hayParo.subscribe((switche: any)=>{
      this.verParo = switche
      if (!switche)
      {
        this.horaDesde = new Date();
        this.equipo.produccion = 0;
      }
    });
    this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
    this.cambiarTurno();
    this.rConfiguracion();
    this.calcularEtiquetas();    
    if (this.servicio.rTR() == "")
    {
      this.seleccionarMaquina();
    }
    else if (this.servicio.rTR().substr(0, 1) == "M")
    {
      this.equipoFijo = +this.servicio.rTR().substr(1);
      this.actualizarOperador()
      this.viendoResumen = false;
      this.lineaTiempo();
    }
    
    else if (this.servicio.rTR().substr(0, 1) == "L")
    {
      this.equipoFijo = 0;
      this.lineaActual = +this.servicio.rTR().substr(1);
      this.maquinas = [];
      this.verDetalle = true;
      this.cadCarrusel = this.servicio.rTraduccion()[434];
      this.viendoResumen = true;
    }
    else if (this.servicio.rTR().substr(0, 1) == "T")
    {
      this.equipoFijo = 0;
      this.lineaActual = 0;
      this.maquinas = [];
      this.verDetalle = true;
      this.cadCarrusel = this.servicio.rTraduccion()[434];
      this.viendoResumen = true;
    }
    
  }


  ngOnInit() 
  {
    this.servicio.validarLicencia(1)
    this.validarOpcion(380);
    this.actualizarOperador();
    //this.servicio.aEscanear(true);
    this.servicio.mensajeTurno.emit(this.servicio.rTurno().nombre);
    setTimeout(() => {
      this.miPantalla()
      if (this.contenedor)
      {
        this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
      }
      this.verGraficoBottom = true;  
    }, 300);
  }

  ngAfterViewInit()
  {
    if (this.contenedor)
    {
      this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
    }  
  }

  actualizarOperador()
  {
    if (this.equipoFijo == 0)
    {
      return;
    }
    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_maquinas SET oee_operador_actual = " + this.servicio.rOperador() + " WHERE id = " + this.equipoFijo;
      let campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
      });
  }

  miPantalla()
  {
      this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
      this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 40;
      this.verGraficoBottom = false;
      if (this.contenedor)
      {
        this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
      }
      setTimeout(() => {
        this.verGraficoBottom = true;
      }, 100);
  }

  ngOnDestroy() {

    if (this.escaner) 
    {
      this.escaner.unsubscribe()
    }
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
  

  cambiarTurno()
  {
    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_maquinas SET oee_turno_actual = " + this.servicio.rTurno().id + " WHERE id = " + this.equipoFijo + ";UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET iniciar_4 = 'S' WHERE equipo = " + this.equipoFijo;
      let campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
      })
  }
  ///ELVIS

  escaner: Subscription;
  vista: number  = 1;
  equipoFijo: number  = 0;
  verTocadas: number  = 1;
  rateEquipo: string  = "";
  cadenaAntes: string  = "";
  cadenaPaleta: string  = "";
  miColor: string = "";
  equipos: any[] =[];
  rHoraxhora: any = { plan: 0, plan_van: 0, buenas: 0, malas: 0, dia: null, desde: "", hasta: "", buenas_van: 0, malas_van: 0, paro: 0, disponible: 0, mantto: 0, arrastre: 0, pct: "", tipo: 0 };
  equipo: any = [];
  planes: any = [];
  maquinas: any = [];
  rates: any[] =[];
  oeeRates: any[] =[];
  horas: any = [];
  colores: any = [];
  enParo: boolean = false;
  pasado: boolean = false;
  verGraficoBottom: boolean = false;
  mostrandoAlerta: boolean = false;
  yaPlaneado: boolean = false;
  enCambio: boolean = false;
  verIndicadores: boolean = false;
  tiempoCongelado: boolean = false;
  entradaHXH: boolean = false;
  segLinea: number = 0;
  nroParteAntes: number = 0;
  verTotal: boolean = false;
  listoMostrar: boolean = false;
  verDetalle: boolean = false;
  intervalo: any;
  verParo: boolean = false;
  verNombre: boolean = false;
  mensajeRate: number = 0; 
  usuarioDetiene: number = 0;
  tiempoRate: string = "";
  trabajandoDesde: string = "";
  rangoDesde: string = "24";
  rangoHasta: string = "0";
  etiquetas = [];
  turnos = [];
  linea = [];
  turnoActual: number = 0;
  tripulaciones = [];
  tripulacionActual: number = 0;
  ultimoVan: number = 0;
  partes = [];
  partesF = [];
  parteActual: number = 0;
  lotes = [];
  lotesF = [];
  loteActual: number = 0;
  
  //Literales
  lit_EFI: string = this.servicio.rTraduccion()[575]
  lit_DIS: string = this.servicio.rTraduccion()[577]
  lit_FTQ: string = this.servicio.rTraduccion()[576]
  lit_OEE: string = this.servicio.rTraduccion()[536];
  lit_numOP: string = this.servicio.rTraduccion()[3317]
  lit_VAN: string = this.servicio.rTraduccion()[3316]
  lit_SKU: string = this.servicio.rTraduccion()[728]
  lit_plan: string = this.servicio.rTraduccion()[3315]
  lit_equipo: string = this.servicio.rTraduccion()[568]
  lit_SKUDes: string = this.servicio.rTraduccion()[559]
  lit_avance: string = this.servicio.rTraduccion()[3311]
  lit_titGrafico: string = this.servicio.rTraduccion()[3319]
  lit_subGrafico: string = "";
  coletilla: string = "";
  lit_ordenCompleta: string = this.servicio.rTraduccion()[3310]
  funcionando: boolean = true;
  mostrarDatos: boolean = false;
  verTop: boolean = this.servicio.rUsuario().preferencias_andon.substr(42, 1) == "1";
  altoGrafica: number = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
  anchoGrafica: number = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 40;
  //Botones
  lit_accion010: string = this.servicio.rTraduccion()[3321]
  lit_accion020: string = this.servicio.rTraduccion()[3313]
  lit_accion030: string = this.servicio.rTraduccion()[3324]
  lit_accion100: string = this.servicio.rTraduccion()[572]
  lit_accion110: string = this.servicio.rTraduccion()[3314]
  lit_accion120: string = this.servicio.rTraduccion()[3312]
  lit_bajoRate: string = this.servicio.rTraduccion()[3322]
  lit_sobreRate: string = this.servicio.rTraduccion()[3323]
  lit_estatusRate: string = "";
  lit_tripulacion: string = this.servicio.rTraduccion()[2102]
  lit_turno: string = this.servicio.rTraduccion()[572]
  
  lit_rateTeorico: string = this.servicio.rTraduccion()[3320]
  lit_rateActual: string = this.servicio.rTraduccion()[3318]
  
  parNumero: string = "";
  parIndicador: string = "1.1-1"
  parRate: string = "1.1-1"
  enHora: boolean = false;

  equipoActual: number = 0;
  segFaltan: number = 0;
  //Colores
  
  colorOEE: string = "yellowgreen";
  colorDIS: string = "yellowgreen";
  colorEFI: string = "yellowgreen";
  colorFTQ: string = "white";
  colorRate: string = "yellowgreen"
  colorEquipo: string = "yellowgreen"
  colorbRate: string = "#393939"
  //
  bgColorEFI: string = "";
  bColorEFI: string = "";
  bgColorFTQ: string = "";
  bColorFTQ: string = "";
  bgColorDIS: string = "";
  bColorDIS: string = "";
  bgColorOEE: string = "";
  bColorOEE: string = "";
  bbColorEFI: string = "";
  bbColorFTQ: string = "";
  bbColorDIS: string = "";
  bbColorOEE: string = "";
  bEstatus: string = "";
  bbEstatus: string = "";
  bfEstatus: string = "";
  //
  animadoOEE: boolean = true;
  animadoDIS: boolean = true;
  animadoFTQ: boolean = true;
  animadoEFI: boolean = true;
  animadoRate: boolean = true;
  animadoTodas: boolean = true;
  primeraVez: boolean = true
  //
  rateActual: number = 0;
  rateMinimo: number = 0;
  rateMaximo: number = 0;
  horaDesde;

  veces: number = 0;
  isHandset: boolean = false;
  verRates: boolean = false;
  uFecha: string = this.servicio.fecha(1, "", this.servicio.rIdioma().fecha_02);
  ////
  verInicioParo: boolean = false;
  uReporte: number = 0;
  inflado: boolean = false;
  leeBD: any;
  elTiempo: number = 0;
  sondeo: number = 0;
  mensajeTotal: string = "";
  ultimoMapa: string = "";

  llamadaLista: boolean = false;
  arreTiempos: any = [];
  arreTiempoEstado: any = [];
  arreHover: any = [];

  offSet: number;

  contar: boolean = false;
  verIrArriba: boolean = false;
  contarTiempo: boolean = false;
  empezando: boolean = true;
  movil: boolean = false;
  verBarra: string = "";
  ultimoReporte: string = "";
  ultimoID: number = 0;
  nuevoRegistro: string = ";"
  maestroActual: number = 0;
  altoPantalla: number = this.servicio.rPantalla().alto - 105;
  anchoPantalla: number = this.servicio.rPantalla().ancho - 10 + this.servicio.rAnchoSN();
  anchoMapa: number = this.anchoPantalla * 0.60;
  anchoMensaje: number = this.anchoPantalla - 13;
  anchoExcel: number = this.anchoPantalla * 0.40 - 20;;
  altoMapa: number = this.altoPantalla * 0.67;
  altoMensaje: number = this.altoPantalla * 0.33 - 10;
  altoExcel: number = this.altoPantalla * 0.67;
  errorTitulo: string = "[" + this.servicio.rTraduccion()[6] + "]";
  errorMensaje: string = "";
  pantalla: number = 2;
  modelo: number = 1;
  miSeleccion: number = 1;
  iconoGeneral: string = "";
  verMantenimiento: boolean = false;
  enCadaSegundo: boolean = false;
  cada3Segundos: number = 0
  cadCarrusel: string = this.servicio.rTraduccion()[437];
  lineaActual: number = 0;
  viendoResumen: boolean = false;
  enCarrusel: boolean = false;
  carruselMaquinas = [];
  tiempoCarrusel: number = 0;
  cuentaMapa: number = 0;
  cuentaMapaRotar: number = 0;
  registros: any = [];
  excels: any = [];
  arrFiltrado: any = [];
  cronometro: any;
  cada3Seg: any;
  laSeleccion: any = [];
  anchoColumnas: any = [];
  anchoColumnas2: any = [];
  configuracion: any = [];
  fotoStatus: any = [];  
  segExcel: number = 0;
  fallas: any = [];
  detalle: any = [];
  notas: string = "";
  enTecnico: boolean = false;
  hov01: boolean = false;
  hov02: boolean = false;
  hov03: boolean = false;
  hov04: boolean = false;
  hov05: boolean = false;
  hov06: boolean = false;
  hov07: boolean = false;
  hov08: boolean = false;
  hov09: boolean = false;
  hov10: boolean = false;
  hov11: boolean = false;
  hov12: boolean = false;
  hov13: boolean = false;
  hov14: boolean = false;
  hov15: boolean = false;
  editando: boolean = false;
  faltaMensaje: string = "";
  fallaSel: boolean = false;
  rAlarmado: string = "N";
  horaReporte;
  mensajeSinFiltro: string = "";
  URL_BASE = "/robot/api/upload.php"
  URL_IMAGENES = "/robot/assets/imagenes/";

  boton01: boolean = true;
  boton02: boolean = true;
  boton03: boolean = true;
  boton04: boolean = true;
  boton05: boolean = true;
  boton06: boolean = true;
  boton07: boolean = true;
  boton08: boolean = false;
  boton09: boolean = false;

  escapar()
  {
    if (this.modelo==2)
    {
      this.cancelar();
    }
  }



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
        this.verIrArriba = true;
        clearTimeout(this.cronometro);
        this.cronometro = setTimeout(() => {
          this.verIrArriba = false;
        }, 3000);
      }

    this.offSet = scrollTop;
  }

  cancelar()
  {
    this.hov08 = false;
    this.hov09 = false;
    this.detalle.loteActual = this.loteActual;
    this.detalle.parteActual = this.parteActual;
    this.detalle.turnoActual = this.turnoActual;
    this.detalle.tripulacionActual = this.tripulacionActual;
    setTimeout(() => {
      this.lstC0.focus();  
    }, 100);
    this.boton08 = false;
    this.boton09 = false;
  }

  regresar()
  {
    this.tiempoCongelado = false;
    this.modelo = 11;
    this.enCambio = false;

  }

  salidaEfecto(evento: any)
  {
    if (evento.toState)
    {
      this.modelo = this.modelo == 1 ? 1 : this.modelo - 10;
      setTimeout(() => {
        if (this.contenedor)
        {
          this.pasado = +this.contenedor.nativeElement.offsetHeight + 180 > this.servicio.rPantalla().alto - 105;
        }
        this.verGraficoBottom = true;  
      }, 100);

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
        if (resp[0].bajo_color)
        {
          resp[0].bajo_color = "#" + resp[0].bajo_color;  
        }
        else
        {
          resp[0].bajo_color = "#FF0000";
        }
        if (resp[0].medio_color)
        {
          resp[0].medio_color = "#" + resp[0].medio_color;  
        }
        else
        {
          resp[0].medio_color = "#FFCC00";
        }
        if (resp[0].alto_color)
        {
          resp[0].alto_color = "#" + resp[0].alto_color;  
        }
        else
        {
          resp[0].alto_color = "#00FF00";
        }
        this.configuracion = resp[0];
        this.colorear();
      }
    },
    error =>
      {
        console.log(error)
      })
  }

  estadoCarrusel(id: number)
  {
    if (id == 1)
    {
      this.carrusel();
      this.servicio.aMaquina(0);
    }
    else
    {
      const respuesta = this.dialogo.open(FijarequiComponent, 
      {
        width: "450px", panelClass: 'dialogo', data: { maquina: this.servicio.rTR(), alto: "90" }
      });
      respuesta.afterClosed().subscribe(result => 
      {
        if (result)
        {
          if (result.accion == 1) 
          {
            this.servicio.aTR(result.maquina)
            this.cadCarrusel = this.servicio.rTraduccion()[437];
            this.enCarrusel = false;
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal"
            
            mensajeCompleto.tiempo = 2000;
            
            if (result.maquina.substr(0, 1) == "M")
            {
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[3255];
              this.equipoFijo = +result.maquina.substr(1);
              this.actualizarOperador();
              this.viendoResumen = false;
              this.servicio.aMaquina(+result.maquina);
              this.lineaTiempo();
            }
            else if (result.maquina.substr(0, 1) == "L")
            {
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[3309];
              this.equipoFijo = 0;
              this.lineaActual = +result.maquina.substr(1);
              this.maquinas = [];
              this.verDetalle = true;
              this.animadoOEE = true;
              this.animadoDIS = true;
              this.animadoEFI = true;
              this.animadoFTQ = true;
              this.animadoRate = true;  
              this.cadCarrusel = this.servicio.rTraduccion()[434];
              this.viendoResumen = true;
              this.servicio.aMaquina(+result.maquina);
            }
            else if (result.maquina.substr(0, 1) == "T")
            {
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[3308];
              this.equipoFijo = 0;
              this.lineaActual = 0;
              this.maquinas = [];
              this.verDetalle = true;
              this.animadoOEE = true;
              this.animadoDIS = true;
              this.animadoEFI = true;
              this.animadoFTQ = true;
              this.animadoRate = true;  
              this.cadCarrusel = this.servicio.rTraduccion()[434];
              this.viendoResumen = true;
            }
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
        }
      })
    }
  }

seleccionarMaquina()
{

 
  let sentencia = "SELECT a.id FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.usuario = " + this.servicio.rUsuario().id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' AND a.oee = 'S' ORDER BY a.nombre;"
  if (this.servicio.rUsuario().maquina=="S" || this.servicio.rUsuario().rol == "A")
  {
    sentencia = "SELECT a.id FROM " + this.servicio.rBD() + ".cat_maquinas a WHERE a.estatus = 'A' AND a.oee = 'S' ORDER BY a.nombre;"
  }
  
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    //if (resp.length > 1)
    //{
    //  this.carrusel();
    //  this.boton02 = true;
    //}
    if (resp.length > 0)
    {
      this.cadCarrusel = this.servicio.rTraduccion()[437];
      this.enCarrusel = false;
      this.boton02 = false;
      this.equipoFijo = resp[0].id;
      this.actualizarOperador()
      //let mensajeCompleto: any = [];
      //mensajeCompleto.clase = "snack-normal"
      //mensajeCompleto.mensaje = this.servicio.rTraduccion()[3255];
      //mensajeCompleto.tiempo = 2000;
      //this.servicio.mensajeToast.emit(mensajeCompleto);
    }
    else
    {
      this.equipoFijo = 0;
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[3307];
      mensajeCompleto.tiempo = 3000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
    }
  })
}
  
carrusel()
 {
  this.segFaltan = +this.configuracion.carrusel_tiempo;
  this.tiempoCarrusel = 0;
  this.enCarrusel = true;
  this.carruselMaquinas = [];
  let sentencia = "SELECT a.id, a.linea FROM " + this.servicio.rBD() + ".cat_maquinas a WHERE a.estatus = 'A' AND a.oee = 'S' ORDER BY a.linea, nombre;"
  if (this.servicio.rUsuario().maquina=="N")
  {
    sentencia = "SELECT a.id, a.linea FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.usuario = " + this.servicio.rUsuario().id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' AND a.oee = 'S' ORDER BY a.linea, a.nombre;"  
  }
  if (this.servicio.rUsuario().linea=="N")
  {
    sentencia = "SELECT a.id, a.linea FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.linea = b.proceso AND b.tipo = 1 AND b.usuario = " + this.servicio.rUsuario().id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' AND a.oee = 'S' ORDER BY a.linea, a.nombre;"  
  }
  
  if (this.servicio.rUsuario().maquina=="S")
  {
    
  }
  let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.cadCarrusel = this.servicio.rTraduccion()[437];
      if (resp.length > 1)
      {
        this.boton02 = true; 
        this.equipoActual = 0;
        this.carruselMaquinas = resp;
        this.equipoFijo = this.carruselMaquinas[this.equipoActual].id;
        this.actualizarOperador()
        this.lineaActual = this.carruselMaquinas[this.equipoActual].linea;
        this.cadCarrusel = this.servicio.rTraduccion()[435] + (this.equipoActual + 1) + this.servicio.rTraduccion()[436] + this.carruselMaquinas.length + ")";
      }
      else if (resp.length == 1)
      {
        this.boton02 = false;
        this.equipoFijo = resp[0].id;
        this.actualizarOperador()
        this.equipoActual = 0;
        this.carruselMaquinas = resp;
        this.lineaActual = this.carruselMaquinas[this.equipoActual].linea;
        this.cadCarrusel = this.servicio.rTraduccion()[435] + (this.equipoActual + 1) + this.servicio.rTraduccion()[436] + this.carruselMaquinas.length + ")";
      }
      else
      {
        this.equipoFijo = 0;
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[3307];
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

revisarTiempo()
{
  this.contarTiempo = false;
  for (var i = 0; i < this.maquinas.length; i++)
  {
    if (this.maquinas[i].fecha)
    {
      let segundos =  this.servicio.tiempoTranscurrido(this.maquinas[i].fecha, "").split(";");
      
      if (+segundos[1] > 9)
      {
        this.arreTiempos[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]);
      }
      else
      {
        this.arreTiempos[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
      }
    }
    if (this.maquinas[i].oee_estado_cambio)
    {
      let segundos =  this.servicio.tiempoTranscurrido(this.maquinas[i].oee_estado_cambio, "").split(";");
      if (+segundos[1] > 9)
      {
        this.arreTiempoEstado[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]);  
      }
      else
      {
        this.arreTiempoEstado[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
      }
      
    }

  }
  this.contarTiempo = true;
}

contarRegs()
{
  if (this.router.url.substr(0, 6) != "/visor")
  {
    return;
  }
  let sentencia = "SELECT SUM(IF((alarmado_atender = 'S' AND estatus = 0) OR (alarmado_atendido = 'S' AND estatus = 10), 1, 0)) AS alarmados, COUNT(*) AS total FROM " + this.servicio.rBD() + ".reportes WHERE (estatus = 0 OR estatus = 10)";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    let mensaje = "";
    let tReportes = +resp[0].total;
    let tAlarmados = +resp[0].alarmados;
    if (+resp[0].total > 0)
    {
      mensaje = this.servicio.rTraduccion()[66] + tReportes + this.servicio.rTraduccion()[3305] 
    }
    else
    {
      mensaje = this.servicio.rTraduccion()[3306]
    }
    let cadAlarmas: string = "";
    if (tAlarmados > 0)
    {
      cadAlarmas = "<span class='resaltar'>" + (tAlarmados == 1 ? this.servicio.rTraduccion()[68] : tAlarmados + this.servicio.rTraduccion()[69]) + "</span>";
    }
    mensaje = mensaje + ' ' + cadAlarmas;
    this.mensajeTotal = mensaje;      
  })
}

cadaSegundo()
  {
    let ponerLimite = false;
    if (this.router.url.substr(0, 11) != "/produccion")
    {
      return;
    }
    if (this.segLinea >= 300)
    {
      this.segLinea = 0;
      this.calcularEtiquetas();
      this.lineaTiempo()
    }
    else
    {
      this.segLinea = this.segLinea + 1;
    }
    if (this.enCarrusel && this.carruselMaquinas.length > 0)
    {
      if (!this.tiempoCongelado)
      {
        this.tiempoCarrusel = this.tiempoCarrusel + 1;  
      }
      if (this.tiempoCarrusel > +this.configuracion.carrusel_tiempo && +this.configuracion.carrusel_tiempo > 0)
      {
        this.viendoResumen = false //Elvis;
        if (this.viendoResumen)
        {
          
          this.boton05 = false;
          this.boton06 = false;
          this.boton07 = false;
    
        }
        
        this.animadoOEE = true;
        this.animadoDIS = true;
        this.animadoEFI = true;
        this.animadoFTQ = true;
        this.animadoRate = true;  
        setTimeout(() => {
          this.animadoOEE = false;
          this.animadoDIS = false;
          this.animadoEFI = false;
          this.animadoFTQ = false;
          this.animadoRate = false;  
        }, 1100);
        ponerLimite = true;
        
        this.equipoActual = this.equipoActual + 1;  
        if (this.equipoActual >= this.carruselMaquinas.length)
        {
          this.modelo = 11;
          this.mostrarDatos = false;
          this.verDetalle = true;
          this.cadCarrusel = this.servicio.rTraduccion()[434];
          this.maquinas = [];
          this.verResumen(this.lineaActual)
          
          this.equipoActual = -1;
          this.segFaltan = this.configuracion.carrusel_tiempo;
          this.tiempoCarrusel = 0;
          this.viendoResumen = true;
          
          return;
        }
        else if (this.equipoActual > 1)
        {
          if (this.lineaActual != this.carruselMaquinas[this.equipoActual].linea && !this.viendoResumen)
          {
            this.modelo = 11;
            this.mostrarDatos = false;
            this.verDetalle = true;
            this.cadCarrusel = this.servicio.rTraduccion()[434];
            this.maquinas = [];
            this.verResumen(this.lineaActual)
            this.viendoResumen = true;
            this.equipoActual = this.equipoActual - 1;
            this.segFaltan = +this.configuracion.carrusel_tiempo;
            this.tiempoCarrusel = 0;
            return;
          }
        }
        this.modelo = 11;
        this.mostrarDatos = false;
        this.viendoResumen = false;
        this.boton05 = true;
        this.boton06 = true;
        this.boton07 = true;
        this.lineaActual = this.carruselMaquinas[this.equipoActual].linea;
        this.cadCarrusel = this.servicio.rTraduccion()[435] + (this.equipoActual + 1) + this.servicio.rTraduccion()[436] + this.carruselMaquinas.length + ")";
        this.equipoFijo = this.carruselMaquinas[this.equipoActual].id
        this.actualizarOperador()
        this.lineaTiempo();
        this.tiempoCarrusel = 0;
      }
      else if (!this.tiempoCongelado)
      {
        this.segFaltan = this.segFaltan - 1;
      }
    }
    else
    {
      //this.viendoResumen = false //Elvis; 
      if (this.viendoResumen)
        {
          
          this.boton05 = false;
          this.boton06 = false;
          this.boton07 = false;
    
        }
        else
        {
          this.boton05 = true;
          this.boton06 = true;
          this.boton07 = true;
        }
      
      this.cadCarrusel = this.servicio.rTraduccion()[437];
    }
    //this.viendoResumen = false //Elvis;
    if (this.viendoResumen)
    {
      this.cada3Segundos = this.cada3Segundos + 1;
      if (this.cada3Segundos > 100)
      {
        this.cada3Segundos = 0;
        this.verDetalle = true;
      }
      this.verResumen(this.lineaActual);
      this.revisarTiempo();
    }
    else
    {
      //Vista individual
      if (this.primeraVez)
      {
        this.calcularEtiquetas();
        this.lineaTiempo();
        setTimeout(() => {
          this.animadoOEE = false;
          this.animadoDIS = false;
          this.animadoEFI = false;
          this.animadoFTQ = false;
          this.animadoRate = false;  
        }, 1100);
      }
      this.primeraVez = false;
      //Consulta x equipo
      let consulta = "SELECT b.id AS idorden, f.referencia AS referencia, e.paro_emergencia, e.oee_estado, e.oee_estado_cambio, TIMEDIFF(NOW(), e.oee_estado_cambio) AS tiempoestado, e.oee_turno_actual, e.oee_tripulacion_actual, e.oee_lote_actual, e.oee_parte_actual, e.oee_umbral_alerta, e.nombre as nequipo2, a.estatus AS maquinafuncionando, a.*, b.*, TIME_TO_SEC(TIMEDIFF(NOW(), a.estado_desde)) AS transcurrido, TIME_TO_SEC(TIMEDIFF(NOW(), a.rate_mal_desde)) AS malrate FROM " + this.servicio.rBD() + ".cat_maquinas e LEFT JOIN " + this.servicio.rBD() + ".relacion_maquinas_lecturas a ON e.id = a.equipo LEFT JOIN " + this.servicio.rBD() + ".cat_partes f ON f.id = a.parte LEFT JOIN " + this.servicio.rBD() + ".equipos_objetivo b ON e.oee_lote_actual = b.lote WHERE e.id = " + this.equipoFijo;
      this.verTotal = false;
      let campos = {accion: 100, sentencia: consulta};  
      this.servicio.consultasBD(campos).subscribe((data: any []) =>
      {
        
        if (data.length > 0)
        {
          if (ponerLimite)
          {
            this.segFaltan = +this.configuracion.carrusel_tiempo;
          }
          if (!data[0].nequipo)
          {
            data[0].nequipo = data[0].nequipo2;
            data[0].fuera_programa = "S";
            data[0].maquinafuncionando = "D";
            data[0].referencia = "~";
            data[0].nparte = this.servicio.rTraduccion()[443];
            data[0].nturno = this.servicio.rTraduccion()[8];
            data[0].avance = "";
            data[0].produccion = "0";
            data[0].norden = this.servicio.rTraduccion()[297];
            data[0].sacos = "0";
            data[0].tarimas = "0";
            data[0].objetivo = "0";
            data[0].van = "0";
            data[0].faltan = this.servicio.rTraduccion()[8];
            data[0].van_sacos = "0";
            data[0].notas = "-";
            data[0].van_tarimas = "0";
          }
          if (+data[0].objetivo > 0)
          {
            data[0].faltan = +data[0].objetivo - +data[0].van;
            if (data[0].faltan < 0)
            {
              this.miColor = this.colores.fondo_boton_negativo.substring(0, 1) == "#" ? this.colores.fondo_boton_negativo : "#" + this.colores.fondo_boton_negativo;
            }
            else
            {
              this.miColor = this.colores.texto_tarjeta.substring(0, 1) == "#" ? this.colores.texto_tarjeta : "#" + this.colores.texto_tarjeta;
            }
            let tmp: number = 0;
            if (data[0].kg_saco)
            {
              tmp = data[0].van / +data[0].kg_saco;
              if (tmp - Math.floor(tmp) > 0)
              {
                tmp = Math.floor(tmp) + 1;
              }
              data[0].van_sacos = tmp;
            }
            if (data[0].sacos_tarima)
            {
              tmp = tmp / +data[0].sacos_tarima;
              if (tmp - Math.floor(tmp) > 0)
              {
                tmp = Math.floor(tmp) + 1;
              }
              data[0].van_tarimas = tmp;
            }
            if (+data[0].objetivo < +data[0].van)
            {
              this.colores.texto_boton = this.colores.fondo_boton_negativo;
            }
            if (+data[0].objetivo <= +data[0].van && data[0].mensaje_fin_enviado!="S" && data[0].mensaje_fin && !this.mostrandoAlerta)
            {
              let sentencia = "UPDATE " + this.servicio.rBD() + ".equipos_objetivo SET mensaje_fin_enviado = 'S' WHERE id = " + data[0].idorden;
              let campos = {accion: 200, sentencia: sentencia};  
              this.servicio.consultasBD(campos).subscribe( resp =>
              {
                this.mostrandoAlerta = true;
                const respuesta = this.dialogo.open(DialogoComponent, {
                width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3774], tiempo: 0, mensaje: data[0].mensaje_fin, alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_objetivos" }
                });
                respuesta.afterClosed().subscribe(result => {
                  this.mostrandoAlerta = false;
                })
              })
            }
            else if (+data[0].objetivo < +data[0].van && data[0].mensaje_sobrecarga && !this.mostrandoAlerta && this.ultimoVan != +data[0].van)
            {
              this.mostrandoAlerta = true;
              const respuesta = this.dialogo.open(DialogoComponent, {
              width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3776], tiempo: 0, mensaje: data[0].mensaje_sobrecarga, alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_objetivos" }
              });
              respuesta.afterClosed().subscribe(result => {
                this.mostrandoAlerta = false;
                this.ultimoVan = +data[0].van;
              })
            }
          }
          else
          {
            this.miColor = this.colores.texto_tarjeta.substring(0, 1) == "#" ? this.colores.texto_tarjeta : "#" + this.colores.texto_tarjeta;
          }
          let pasar = true;
          this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 40;
          this.turnoActual = data[0].oee_turno_actual;
          this.tripulacionActual = data[0].oee_tripulacion_actual;
          this.parteActual = data[0].oee_parte_actual;
          this.nroParteAntes = this.parteActual;
          this.loteActual = data[0].oee_lote_actual;
          if (data[0].parofalta_actual && data[0].tiempoparo_actual > 0)
          {
            data[0].vencido = data[0].parofalta_actual.substring(0, 1) == "-" ? "1" : "0";
          }
          else
          {
            data[0].vencido = "0";
          }
          if (data[0].parofalta)
          {
            if (data[0].parofalta.substring(0, 1) == "-")
            {
              data[0].parofalta = this.servicio.rTraduccion()[444]
            }
          }
          
          
          if (pasar)
          {
            let cadTiempo = "";
            let mensajeInferior = "";
            this.equipo = data[0];
            let LM: any = [];
            LM.linea = data[0].linea;
            LM.maquina = data[0].equipo;
            this.servicio.cambioLM.emit(LM);
            let Ufecha = data[0].ultima_lectura; 
            if (!Ufecha)
            {
              mensajeInferior = this.servicio.rTraduccion()[3304].replace("campo_0", this.servicio.rTraduccion()[449]).replace("campo_1", "");
            }
            else
            {
              this.uFecha = this.servicio.fecha(2, data[0].ultima_lectura, this.servicio.rIdioma().fecha_02);
              let tt =  this.servicio.tiempoTranscurrido(data[0].ultima_lectura, "S").split(";")[3];
              if (+tt > 10)
              {
                let segundos = this.servicio.tiempoTranscurrido(data[0].ultima_lectura, "").split(";");
                if (+segundos[1] > 24)
                {
                  mensajeInferior = this.servicio.rTraduccion()[3304].replace("campo_0", this.uFecha).replace("campo_1", "");
                }
                else if (+segundos[1] > 0)
                {
                  mensajeInferior = this.servicio.rTraduccion()[3304].replace("campo_0", +segundos[1]).replace("campo_1", this.servicio.rTraduccion()[3291]);
                }
                else if (+segundos[2] > 0)
                {
                  mensajeInferior = this.servicio.rTraduccion()[3304].replace("campo_0", +segundos[2]).replace("campo_1", this.servicio.rTraduccion()[3292]);
                }
                else if (+segundos[3] > 0)
                {
                  mensajeInferior = this.servicio.rTraduccion()[3304].replace("campo_0", +segundos[3]).replace("campo_1", this.servicio.rTraduccion()[3293]);
                }
              }
              else
              {
                mensajeInferior = this.servicio.rTraduccion()[3303].replace("campo_0", +tt).replace("campo_1", this.servicio.rTraduccion()[3293]);
              }
            }
            this.servicio.mensajeInferior.emit(mensajeInferior);


            //
            if (+data[0].oee_umbral_alerta > 0)
            {
              data[0].sinProduccion = "";
              let tt =  this.servicio.tiempoTranscurrido(data[0].ultima_produccion, "S").split(";")[3];
              if (+tt >= +data[0].oee_umbral_alerta)
              {
                if (!data[0].ultima_produccion)
                {
                  data[0].sinProduccion = "";
                }
                else
                {
                  let segundos = this.servicio.tiempoTranscurrido(data[0].ultima_produccion, "D").split(";");
                  if (+segundos[0] > 0)
                  {
                    data[0].sinProduccion = +segundos[0] + this.servicio.rTraduccion()[3302];
                  }
                  else if (+segundos[1] > 0)
                  {
                    data[0].sinProduccion = +segundos[1] + this.servicio.rTraduccion()[3291];
                  }
                  else if (+segundos[2] > 0)
                  {
                    data[0].sinProduccion = +segundos[2] + this.servicio.rTraduccion()[3292];
                  }
                  else
                  {
                    data[0].sinProduccion = +segundos[3] + this.servicio.rTraduccion()[3293]; 
                  }  
                }
              }
            }

            //

            if (+this.equipo.objetivo > 0)
            {
              //this.equipo.avance = Math.floor(+this.equipo.produccion / +this.equipo.objetivo * 100);
              this.equipo.avance = Math.floor(+this.equipo.van / +this.equipo.objetivo * 100);
              if (+this.equipo.avance >= 1000)
              {
                this.equipo.avanceCad = ">999%";
              }
              else
              {
                this.equipo.avanceCad = this.equipo.avance + "%"
;              }
            }
            else
            {
              this.equipo.avance = 0;
              this.equipo.avanceCad = "0%";
            }
            //if ( +this.equipo.produccion >= +this.equipo.objetivo && this.equipo.objetivo > 0 )
            if ( +this.equipo.van >= +this.equipo.objetivo && this.equipo.objetivo > 0 )
            {
              this.coletilla = " (OK)";//this.lit_ordenCompleta
            }
            else
            {
              this.coletilla = ""
            }
            let dias = 0;
            let horas = 0;
            let minutos = 0;    
            let segundos = +data[0].transcurrido;
            let strDias = '';
            let strHoras = '';
            let strMinutos = '';
            let strSegundos = '';
            dias = Math.floor(segundos / 86400);
            horas = Math.floor((segundos % 86400) / 3600);
            minutos = Math.floor((segundos % 3600) / 60);
            segundos = segundos % 60;
            if (dias > 0)
            {
              strDias = dias + 'd ';
            }
            strHoras = (horas < 10 ? '0' : '') + horas;
            strMinutos = ':' + (minutos < 10 ? '0' : '') + minutos;
            strSegundos = ':' + (segundos < 10 ? '0' : '') + segundos;
            this.equipo.estadoDesde = strDias + strHoras + strMinutos + strSegundos;
            this.rateActual = data[0].ultimo_rate;
            segundos = +data[0].malrate;
            strHoras = '';
            strMinutos = '';
            strSegundos = '';
            horas = Math.floor(segundos / 3600);
            minutos = Math.floor((segundos % 3600) / 60);
            if (horas > 0)
            {
              strHoras = horas + ':';
            }
            if (minutos > 0 || horas > 0) 
            { 
              strMinutos = minutos + ':';
              if (strMinutos.length == 1)
              {
                strMinutos = "00" + strMinutos;
              }
              else if (strMinutos.length == 2)
              {
                strMinutos = "0" + strMinutos;
              }
            }
            segundos = segundos % 60;
            if (segundos > 0 || minutos > 0 || horas > 0) 
            { 
              strSegundos = '' + segundos;
              if (strSegundos.length == 0)
              {
                strSegundos = "00";
              }
              if (strSegundos.length == 1)
              {
                strSegundos = "0" + strSegundos;
              }
            }
            this.tiempoRate = this.servicio.rTraduccion()[570] + ": " + (strHoras + strMinutos + strSegundos);
            this.mostrarDatos = true;
            if (this.rateActual != -100)
            {
              let cad2 = this.servicio.rTraduccion()[3294];
              if (+this.equipo.oee_minutos_rate > 0)
              {
                cad2 = this.servicio.rTraduccion()[3295].replace("campo_0", this.equipo.oee_minutos_rate);
              }
              else if (this.equipo.oee_historico_rate == "1")
              {
                cad2 = this.servicio.rTraduccion()[3296];
              }
              else if (this.equipo.oee_historico_rate == "2")
              {
                cad2 = this.servicio.rTraduccion()[3297];
              }
              else if (this.equipo.oee_historico_rate == "3")
              {
                cad2 = this.servicio.rTraduccion()[3298];
              }
              else if (this.equipo.oee_historico_rate == "4")
              {
                cad2 = this.servicio.rTraduccion()[3299];
              } 
              else if (this.equipo.oee_historico_rate == "5")
              {
                cad2 = this.servicio.rTraduccion()[3300];
              }
              this.lit_rateActual = this.servicio.rTraduccion()[3301] + cad2;
            }
            else if (this.equipo.oee_estado == 'N')
            {
              this.colorEquipo = this.configuracion.bajo_color
              this.lit_rateActual = this.servicio.rTraduccion()[2883];
              this.trabajandoDesde = this.servicio.rTraduccion()[3289]
            }
            else if (this.equipo.oee_estado == 'S')
            {
              this.colorEquipo = this.configuracion.alto_color
              this.lit_rateActual = this.servicio.rTraduccion()[2884];
              this.trabajandoDesde = this.servicio.rTraduccion()[3290]
            }
            if (this.rateActual == -100)
            {
              if (data[0].tiempoestado)
              {
                let segmentos = data[0].tiempoestado.split(":");
                if (+segmentos[0] > 0)
                {
                  cadTiempo = +segmentos[0] + this.servicio.rTraduccion()[3291];
                }
                
                if (+segmentos[1] > 0)
                {
                  cadTiempo = cadTiempo + (cadTiempo.length > 0 ? ", " : "") + +segmentos[1] + this.servicio.rTraduccion()[3292];
                }
                if (+segmentos[2] > 0)
                {
                  cadTiempo = cadTiempo + (cadTiempo.length > 0 ? ", " : "") + +segmentos[2] + this.servicio.rTraduccion()[3293];
                }
                data[0].trabajando_desde = data[0].tiempoestado;
              }
            }
          }
        }
      })
    }
  }

  verResumen(linea: number)
  {
    let sentencia = "SELECT '" + this.servicio.rTraduccion()[438] + "' AS nombre, SUM(IF(b.estatus = 'F', 1, 0)) AS funcionando, SUM(IF(b.estatus <> 'F', 1, 0)) AS detenidas, SUM(IF(b.planeado = 'N', b.produccion_tc, 0)) AS produccion_tc, SUM(IF(b.planeado = 'N', b.calidad_tc, 0)) AS calidad_tc, SUM(IF(b.planeado = 'N', b.transcurrido, 0)) AS transcurrido, SUM(IF(b.planeado = 'N', b.parosmostrar, 0)) AS parosmostrar, AVG(b.esperadoefi) AS esperadoefi, MAX(b.ultima_lectura) AS ultima_lectura, AVG(b.esperadodis) AS esperadodis, AVG(b.esperadooee) AS esperadooee, AVG(b.esperadoftq) AS esperadoftq FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_maquinas_lecturas b ON a.id = b.equipo WHERE a.oee = 'S' AND a.estatus = 'A' GROUP BY 1";
    if (linea > 0)
    {
      sentencia = "SELECT c.nombre, SUM(IF(b.estatus = 'F', 1, 0)) AS funcionando, SUM(IF(b.estatus <> 'F', 1, 0)) AS detenidas, SUM(IF(b.planeado = 'N', b.produccion_tc, 0)) AS produccion_tc, SUM(IF(b.planeado = 'N', b.calidad_tc, 0)) AS calidad_tc, SUM(IF(b.planeado = 'N', b.transcurrido, 0)) AS transcurrido, SUM(IF(b.planeado = 'N', b.parosmostrar, 0)) AS parosmostrar, AVG(b.esperadoefi) AS esperadoefi, MAX(b.ultima_lectura) AS ultima_lectura, AVG(b.esperadodis) AS esperadodis, AVG(b.esperadooee) AS esperadooee, AVG(b.esperadoftq) AS esperadoftq FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_maquinas_lecturas b ON a.id = b.equipo LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.linea = " + linea + " AND a.oee = 'S' AND a.estatus = 'A' GROUP BY c.nombre";
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        let disponibilidad = +resp[0].transcurrido - +resp[0].parosmostrar;
        disponibilidad < 0 ? disponibilidad = 0 : disponibilidad;
        resp[0].efi = 100
        if (disponibilidad == 0 && resp[0].produccion_tc == 0)
        {
          resp[0].efi = 0;
        } 
        else if (disponibilidad > 0)
        {
          resp[0].efi = +resp[0].produccion_tc / disponibilidad * 100;
        }
        //
        resp[0].dis = 100
        if (resp[0].transcurrido > 0)
        {
          resp[0].dis = disponibilidad / +resp[0].transcurrido * 100;
        } 
        //
        resp[0].ftq = 100
        if (resp[0].produccion_tc > 0)
        {
          resp[0].ftq = (+resp[0].produccion_tc - +resp[0].calidad_tc) / +resp[0].produccion_tc * 100;
        } 
        resp[0].dis > 100 ? resp[0].dis = 100 : resp[0].dis < 0 ? resp[0].dis = 0 : resp[0].dis;
        resp[0].ftq > 100 ? resp[0].ftq = 100 : resp[0].ftq < 0 ? resp[0].ftq = 0 : resp[0].ftq;
        resp[0].efi > 100 ? resp[0].efi = 100 : resp[0].efi < 0 ? resp[0].efi = 0 : resp[0].efi;
        resp[0].oee = +resp[0].dis * +resp[0].efi * +resp[0].ftq / 10000;
        if (+resp[0].detenidas > 0)
        {
          resp[0].pctFuncionando = Math.round(+resp[0].funcionando / (+resp[0].funcionando + +resp[0].detenidas) * 100);
        }
        else
        {
          resp[0].pctFuncionando = 0;
        }
        
        this.equipo = resp[0];
        this.mostrarDatos = true;

        if (this.verDetalle)
        {
          this.servicio.activarSpinnerSmall.emit(true);     
          
          let joinAdic = "";
          if (this.servicio.rUsuario().maquina=="N")
          {
            joinAdic = " INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones z ON e.id = z.proceso AND z.tipo = 2 AND z.usuario = " + this.servicio.rUsuario().id;
          }
          else if (this.servicio.rUsuario().linea=="N")
          {
            joinAdic = " INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones z ON e.linea = z.proceso AND z.tipo = 1 AND z.usuario = " + this.servicio.rUsuario().id;
          }
          let consulta = "SELECT e.id, a.estatus, e.oee_estado_cambio, a.ratemed, a.rate_teorico, a.rate_efecto, a.oee, IFNULL(j.reporte, 0) AS reporte, IF(k.estatus = 0, '" + this.servicio.rTraduccion()[439] + "', '" + this.servicio.rTraduccion()[440] + "') AS reporteest, IFNULL(m.nombre, '" + this.servicio.rTraduccion()[8] + "') AS narea, IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nlinea, a.wip_paro, a.esperadooee, a.dis, a.ftq, a.efi, a.esperadodis, a.esperadoftq, a.esperadoefi, e.oee_historico_rate, k.fecha, e.oee_estado, e.nombre as nequipo2, a.nparte, a.nequipo, l.nombre AS nfalla, a.rate FROM " + this.servicio.rBD() + ".cat_maquinas e " + joinAdic + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas f ON e.linea = f.id AND f.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".relacion_maquinas_lecturas a ON e.id = a.equipo LEFT JOIN " + this.servicio.rBD() + ".detalleparos b ON a.proximo_paro = b.id AND b.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".cat_paros c ON b.paro = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON c.tipo = d.id LEFT JOIN " + this.servicio.rBD() + ".detalleparos g ON a.paro_actual = g.id AND g.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".cat_paros h ON g.paro = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON h.tipo = i.id LEFT JOIN (SELECT maquina, MAX(id) AS reporte FROM " + this.servicio.rBD() + ".reportes WHERE estatus <= 10 AND contabilizar = 'S' AND afecta_oee = 'S' GROUP BY maquina) AS j ON j.maquina = e.id LEFT JOIN " + this.servicio.rBD() + ".reportes k ON j.reporte = k.id LEFT JOIN " + this.servicio.rBD() + ".cat_fallas l ON k.falla = l.id  LEFT JOIN " + this.servicio.rBD() + ".cat_areas m ON k.area = m .id WHERE e.oee = 'S' AND e.estatus = 'A'";
          if (linea > 0)
          {
            consulta = "SELECT e.id, a.estatus, e.oee_estado_cambio, a.ratemed, a.rate_teorico, a.rate_efecto, a.oee, IFNULL(j.reporte, 0) AS reporte, IF(k.estatus = 0, '" + this.servicio.rTraduccion()[439] + "', '" + this.servicio.rTraduccion()[440] + "') AS reporteest, IFNULL(m.nombre, '" + this.servicio.rTraduccion()[8] + "') AS narea, IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nlinea, a.esperadooee, a.wip_paro, a.dis, a.ftq, a.efi, a.esperadodis, a.esperadoftq, a.esperadoefi, e.oee_historico_rate, k.fecha, e.oee_estado, e.nombre as nequipo2, a.nparte, a.nequipo, l.nombre AS nfalla, a.rate FROM " + this.servicio.rBD() + ".cat_maquinas e " + joinAdic + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas f ON e.linea = f.id AND f.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".relacion_maquinas_lecturas a ON e.id = a.equipo LEFT JOIN " + this.servicio.rBD() + ".detalleparos b ON a.proximo_paro = b.id AND b.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".cat_paros c ON b.paro = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON c.tipo = d.id LEFT JOIN " + this.servicio.rBD() + ".detalleparos g ON a.paro_actual = g.id AND g.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".cat_paros h ON g.paro = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON h.tipo = i.id LEFT JOIN (SELECT maquina, MAX(id) AS reporte FROM " + this.servicio.rBD() + ".reportes WHERE estatus <= 10 AND contabilizar = 'S' AND afecta_oee = 'S' GROUP BY maquina) AS j ON j.maquina = e.id LEFT JOIN " + this.servicio.rBD() + ".reportes k ON j.reporte = k.id LEFT JOIN " + this.servicio.rBD() + ".cat_fallas l ON k.falla = l.id  LEFT JOIN " + this.servicio.rBD() + ".cat_areas m ON k.area = m .id WHERE e.oee = 'S' AND e.estatus = 'A' AND e.linea = " + linea;
          
          }
          this.verTotal = false;
          let campos = {accion: 100, sentencia: consulta};  
          this.servicio.consultasBD(campos).subscribe((data: any []) =>
          {
            if (data.length > 0)
            {
              for (var i = 0; i < data.length; i++)
              {
                if (data[i].rate == -100)
                {
                  if (data[i].oee_estado == 'N')
                  {
                    data[i].rate_cad = this.servicio.rTraduccion()[2883];                  
                  }
                  else 
                  {
                    data[i].rate_cad = this.servicio.rTraduccion()[2884];                  
                  }
                }
                else
                {
                  data[i].imagenRATE = data[i].rate_efecto == "N" ? "" : "i_bajar";
                  data[i].imagenOEE = data[i].oee_imagen == 0 ? "" : "i_bajar";
                }
              }
              this.maquinas = data;
              this.arreTiempos.length = this.maquinas.length;
              this.arreTiempoEstado.length = this.maquinas.length;
              this.revisarTiempo()
              setTimeout(() => {
                this.servicio.activarSpinnerSmall.emit(false);       
              }, 100);              
            }
          })
          
        }
        this.verDetalle = false;      
      }
      else
      {
        this.equipo = [];
      }
      
    });
  }


  colorear()
  {
    
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_colores WHERE id = " + this.servicio.rTemaActual();
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        if (resp[0].texto_boton_positivo)
        {
          resp[0].texto_boton_positivo = "#" + resp[0].texto_boton_positivo;
        }
        else
        {
          resp[0].texto_boton_positivo = "#000000";
        }
        if (resp[0].texto_boton_negativo)
        {
          resp[0].texto_boton_negativo = "#" + resp[0].texto_boton_negativo;
        }
        else
        {
          resp[0].texto_boton_negativo = "#000000";
        }
        if (resp[0].fondo_boton_positivo)
        {
          resp[0].fondo_boton_positivo = "#" + resp[0].fondo_boton_positivo;
        }
        else
        {
          resp[0].fondo_boton_positivo = "#00FF00";
        }
        if (resp[0].fondo_boton_negativo)
        {
          resp[0].fondo_boton_negativo = "#" + resp[0].fondo_boton_negativo;
        }
        else
        {
          resp[0].fondo_boton_negativo = "#FF0000";
        }
        if (resp[0].fondo_boton)
        {
          resp[0].fondo_boton = "#" + resp[0].fondo_boton;
        }
        else
        {
          resp[0].fondo_boton = "grey";
        }
        if (resp[0].texto_boton)
        {
          resp[0].texto_boton = "#" + resp[0].texto_boton;
        }
        else
        {
          resp[0].texto_boton = "black";
        }
        if (resp[0].fondo_tarjeta)
        {
          resp[0].fondo_tarjeta = "#" + resp[0].fondo_tarjeta;
        }
        else
        {
          resp[0].fondo_tarjeta = "white";
        }
        this.colores = resp[0];
        this.lineaTiempo();
        this.colorEFI = this.colores.texto_boton;
      }
    })
  }

  lineaTiempo()
  {
    //this.horas = [];
    let horatmp =  this.datepipe.transform(new Date().getTime() - 79200000, "yyyy/MM/dd HH") + ":00:00";
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".lecturas_resumen WHERE equipo  = " + this.equipoFijo + " AND desde >= '" + horatmp + "' ORDER BY desde LIMIT 92"
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        for (let i = 0; i < resp.length ;i++)
        {
          resp[i].valord = i * 0.25 + '';
          resp[i].valorh = (i + 1) * 0.25 + '';
          if (!resp[i].tipo)
          {
            resp[i].color = this.colores.fondo_boton;
          }
          else if (resp[i].tipo == 0)
          {
            resp[i].color = this.colores.fondo_boton;
          }
          else if (resp[i].tipo == 1)
          {
            resp[i].color = this.configuracion.alto_color;
          }
          else if (resp[i].tipo == 2)
          {
            resp[i].color = this.configuracion.medio_color;
          }
          else if (resp[i].tipo == 3)
          {
            resp[i].color = this.configuracion.bajo_color;
          }
          if (!resp[i].color)
          {
            resp[i].color = this.colores.fondo_boton;
          }
        }
        
        this.horas = resp;
      }
    });
  }

  customizeText(arg: any) {
    return this.etiquetas[arg.value * 4].hora;
  }

  reiniciarConteo(accion: number)
  {
    this.tiempoCongelado = true;
    if (accion == 1)
    {
      this.validarOpcion(260);    
    }
    else
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3283], tiempo: 0, mensaje: this.servicio.rTraduccion()[3284], alto: "60", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3285], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_inicializar" }
      });
      respuesta.afterClosed().subscribe(result => {
        if (result.accion)
        {
          if (result.accion == 1) 
          {
            this.tiempoCongelado = false;
            let sentencia = "UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET iniciar = 'S' WHERE equipo = " + this.equipoFijo;
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[3286];
              mensajeCompleto.tiempo = 3000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            })
          }
          else
          {
            this.tiempoCongelado = false;
          }
        }
        else
        {
          this.tiempoCongelado = false;
        }
      })
    }
  } 

  
  sincronizar(accion: number)
  {
    this.tiempoCongelado = true;
    if (accion == 1)
    {
      this.usuarioDetiene = this.servicio.rUsuario().id;
      this.validarOpcion(360);    
    }
    else if (accion == 2)
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "500px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3277], tiempo: 0, mensaje: this.servicio.rTraduccion()[3278], alto: "300", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3279], icono1: "i_refrescar", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_sensor" }
      });
      respuesta.afterClosed().subscribe(result => {
        if (result.accion)
        {
          if (result.accion == 1) 
          {
            this.tiempoCongelado = false;
            let sentencia = "UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET buffer = produccion WHERE equipo = " + this.equipoFijo + ";UPDATE " + this.servicio.rBD() + ".lecturas_cortes SET buffer = produccion WHERE id = " + this.equipo[0].corte + ";";
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[3276];
              mensajeCompleto.tiempo = 3000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            })
          }
          else
          {
            this.tiempoCongelado = false;
          }
        }
        else
        {
          this.tiempoCongelado = false;
        }
      })
    }
    else if (accion == 3)
    {
      this.usuarioDetiene = this.servicio.rUsuario().id;
      this.validarOpcion(370);    
    }
    else if (accion == 4)
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "500px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3274], tiempo: 0, mensaje: this.servicio.rTraduccion()[3275], alto: "300", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3273], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_sensor" }
      });
      respuesta.afterClosed().subscribe(result => {
        if (result.accion)
        {
          if (result.accion == 1) 
          {
            this.tiempoCongelado = false;
            let sentencia = "UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET calidad = calidad + IF(buffer > produccion, buffer - produccion, 0), calidad_tc = calidad_tc + IF(buffer > produccion, (buffer - produccion) * (produccion_tc / produccion), 0), buffer = produccion WHERE equipo = " + this.equipoFijo + ";UPDATE " + this.servicio.rBD() + ".lecturas_cortes SET calidad = calidad + IF(buffer > produccion, buffer - produccion, 0), calidad_tc = calidad_tc + IF(buffer > produccion, (buffer - produccion) * tc, 0), buffer = produccion WHERE equipo = " + this.equipo[0].corte;
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[3272];
              mensajeCompleto.tiempo = 3000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            })
          }
          else
          {
            this.tiempoCongelado = false;
          }
        }
        else
        {
          this.tiempoCongelado = false;
        }
      })
    }
  }

  cambiarParametros(accion: number)
  {
    this.hov08 = false;
    this.hov09 = false;
    
    this.tiempoCongelado = true;
    if (accion == 1)
    {
      this.usuarioDetiene = this.servicio.rUsuario().id;
      this.validarOpcion(290);    
    }
    else if (accion == 2)
    {
      //this.listarTurnos();
      //this.listarTripulaciones();
      this.listarPartes();
      this.listarLotes();
      //this.buscarRateEquipo();
      this.buscarDatos(1, this.detalle.parteActual)
      this.buscarDatos(2, this.detalle.loteActual)
      this.enCambio = true;
      this.modelo = 12;
      this.boton08 = false;
      this.boton09 = false;
      setTimeout(() => {
        this.lstC0.focus();  
      }, 100);
        
    }
    else if (accion == 33)
    {
      if (this.detalle.parteActual==-1)
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[992], tiempo: 0, mensaje: this.servicio.rTraduccion()[3550], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_documento" }
        });
        respuesta.afterClosed().subscribe(result => {
          setTimeout(() => {
            this.txtT10.nativeElement.focus();  
          }, 50);
        });  
      }
      else if (this.detalle.loteActual==-1)
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3549], tiempo: 0, mensaje: this.servicio.rTraduccion()[3551], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_documento" }
        });
        respuesta.afterClosed().subscribe(result => {
          setTimeout(() => {
            this.txtT9.nativeElement.focus();  
          }, 50);
        })
      }
      else
      {
        let sentencia = "SELECT piezas, bajo, alto, tiempo, unidad FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE (equipo = " + this.equipoFijo + " OR equipo = 0) And (parte = " + this.detalle.parteActual + " Or parte = 0) ORDER BY parte DESC, equipo DESC LIMIT 1;"
        this.rateEquipo = ""
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length == 0)
          {
            const respuesta = this.dialogo.open(DialogoComponent, {
              width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3260], tiempo: 0, mensaje: this.servicio.rTraduccion()[3261], alto: "60", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3262], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_documento" }
            });
            respuesta.afterClosed().subscribe(result => {
              if (result.accion)
              {
                if (result.accion == 1) 
                {
                  //UPDATE
                  this.cambiarParametros(4);
                  this.tiempoCongelado = false;
                  
                }
                else
                {
                  this.tiempoCongelado = false;
                }
              }
              else
              {
                this.tiempoCongelado = false;
              }
            })
          }
          else
          {
            this.cambiarParametros(4);
          }
          
        });
      }
      
    }
    else if (accion == 3)
    {
      if (this.detalle.loteActual==-1)
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3549], tiempo: 0, mensaje: this.servicio.rTraduccion()[3551], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_documento" }
        });
        respuesta.afterClosed().subscribe(result => {
          setTimeout(() => {
            this.txtT9.nativeElement.focus();  
          }, 50);
        })
      }
      else
      {
        let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".equipos_objetivo WHERE lote = " + this.detalle.loteActual + " AND estatus = 'A' ORDER BY equipo DESC LIMIT 1;"
        this.rateEquipo = ""
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length == 0)
          {
            const respuesta = this.dialogo.open(DialogoComponent, {
              width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3260], tiempo: 0, mensaje: this.servicio.rTraduccion()[3261], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_documento" }
            });
            respuesta.afterClosed().subscribe(result => {
              this.tiempoCongelado = false;
            })
          }
          else
          {
            this.cambiarParametros(4);
          }
          
        });
      }
      
    }
    else if (accion == 4)
    {
      let miFecha = new Date();
      let laHora = +this.datepipe.transform(new Date(), "HH") + 1;
      if (laHora > 23)
      {
        laHora = 0;
        miFecha.setDate(miFecha.getDate() + 1);
      }
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3258], tiempo: 0, mensaje: this.servicio.rTraduccion()[3259], alto: "60", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3262], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_documento", replanear: 0, horaIni: laHora + '', fechaIni:  miFecha }
      });
      respuesta.afterClosed().subscribe(result => {
        if (result.accion)
        {
          if (result.accion == 1) 
          {
            //UPDATE
            let sentencia = "SELECT parte, equipo FROM " + this.servicio.rBD() + ".equipos_objetivo WHERE lote = " + this.detalle.loteActual;
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              if (resp.length > 0)
              {
                this.parteActual = resp[0].parte;
                this.equipoFijo = resp[0].equipo;
                let cadAdicional = "";
                if (this.detalle.loteActual  != this.loteActual)
                {
                  cadAdicional = "oee_lote_cambio = 'S',"
                }
                sentencia = "UPDATE " + this.servicio.rBD() + ".cat_maquinas SET " + cadAdicional + " oee_parte_actual = " + +resp[0].parte + ", oee_lote_actual = " + +this.detalle.loteActual + ",  oee_lote_anterior = " + +this.loteActual + " WHERE id = " + resp[0].equipo;
                campos = {accion: 200, sentencia: sentencia};  
                this.servicio.consultasBD(campos).subscribe( resp =>
                {
                  this.verProduccion();  
                })  
              }
              this.tiempoCongelado = false;
            })
          }
          else
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[3256];
            mensajeCompleto.tiempo = 3000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            this.tiempoCongelado = false;
          }
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[3256];
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          this.tiempoCongelado = false;
        }
      })
    }
  } 

verProduccion()
{
  this.enCambio = false;
  this.modelo = 11;
  let mensajeCompleto: any = [];
  mensajeCompleto.clase = "snack-normal";
  mensajeCompleto.mensaje = this.servicio.rTraduccion()[3257];
  mensajeCompleto.tiempo = 3000;
  this.servicio.mensajeToast.emit(mensajeCompleto);
}

buscarPlan()
{
  this.servicio.activarSpinnerSmall.emit(true);
  let sentencia = "SELECT replanear FROM " + this.servicio.rBD() + ".cat_maquinas WHERE id = " + this.equipoFijo + " AND replanear = 'Y'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length == 0)
    {
      setTimeout(() => {
        this.buscarPlan();  
      }, 1000);
    }
    else
    {
      if (!this.yaPlaneado)
      {
        this.yaPlaneado = true;
        let mensajeCompleto: any = [];
        this.boton08 = false;
        this.boton09 = false;
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[3638];
        mensajeCompleto.tiempo = 4000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
      this.servicio.activarSpinnerSmall.emit(false);
      let sentencia = "SELECT a.*, b.secuencia AS tsecuencia FROM " + this.servicio.rBD() + ".horaxhora a LEFT JOIN " + this.servicio.rBD() + ".cat_turnos b ON a.turno = b.id WHERE a.equipo = " + this.equipoFijo + " AND a.estatus = 'A' AND a.tocada = 0 AND a.lote = " + this.loteActual + " ORDER BY a.dia, a.hora, a.id;"
      this.rateEquipo = ""
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        for (var i = 0; i < resp.length; i  ++)
        {
          resp[i].desde = resp[i].desde.substring(0, 5);
          resp[i].hasta = resp[i].hasta.substring(0, 5);
          resp[i].thora = +resp[i].hora == 0 ? "12am" : +resp[i].hora < 13 ? (+resp[i].hora + "am") : (+resp[i].hora - 12 + "pm");

          if (+resp[i].disponible >= 3599)
          {
            resp[i].tdisponible = "01:00:00";
          }
          else
          {
            let minutos = Math.floor(+resp[i].disponible / 60);
            let segundos = +resp[i].disponible % 60;
            let cadMin = +minutos < 10 ? "0" + minutos : minutos;
            let cadSeg = +segundos < 10 ? "0" + segundos : segundos;
            resp[i].tdisponible = "00:" + cadMin +":" + cadSeg;
          }
          if (+resp[i].mantto >= 3599)
          {
            resp[i].tmantto = "01:00:00";
          }
          else
          {
            let minutos = Math.floor(+resp[i].mantto / 60);
            let segundos = +resp[i].mantto % 60;
            let cadMin = +minutos < 10 ? "0" + minutos : minutos;
            let cadSeg = +segundos < 10 ? "0" + segundos : segundos;
            resp[i].tmantto = "00:" + cadMin +":" + cadSeg;
          }
        }
        this.planes = resp;
        if (this.modelo == 13 || this.modelo == 3)
        {
          setTimeout(() => {
            this.buscarPlan();  
          }, 3000);
        }
        
      });
    }
  })

  
}

validarOpcion(opcion: number) 
  {
    if (this.servicio.rUsuario().id == 0)
    {
      this.sesion(opcion);
    }
    else
    {
      if (this.servicio.rUsuario().rol== "A" && opcion != 380)
      {
        if (opcion == 260)
        {
          this.reiniciarConteo(2);
        }
        else if (opcion == 290)
        {
          this.cambiarParametros(2);
        }
        else if (opcion == 360)
        {
          this.sincronizar(2);
        }
        else if (opcion == 370)
        {
          this.sincronizar(4);
        }
        
      }
      else
      {
        let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + this.servicio.rUsuario().id + " AND opcion = " + opcion;
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length > 0)
          {
            if (opcion == 260)
            {
              this.reiniciarConteo(2);
            }
            
            else if (opcion == 290)
            {
              this.cambiarParametros(2);
            }
            else if (opcion == 360)
            {
              this.sincronizar(2);
            }
            else if (opcion == 370)
            {
              this.sincronizar(4);
            }
            else if (opcion == 380)
            {
              this.verIndicadores = true;
            }
            
          }
          else if (opcion == 380)
          {
            this.verIndicadores = true;
          }
          else
          {
            this.sesion(opcion);
          }
        })
      }
    }
}

sesion(opcion: number)
{
  const respuesta = this.dialogo.open(SesionComponent, 
    {
      width: "400px", panelClass: 'dialogo', data: { tiempo: 10, sesion: 1, rolBuscar: "", opcionSel: opcion, idUsuario: 0, usuario: "", clave: "", titulo: this.servicio.rTraduccion()[266], mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[122], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_sesion" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        if (result.accion == 1) 
        {
          if (opcion == 260)
          {
            this.usuarioDetiene = result.idUsuario;
            this.reiniciarConteo(2);
          }
          else if (opcion == 290)
          {
            this.cambiarParametros(2);
          }
          else if (opcion == 360)
          {
            this.sincronizar(2);
          }
          else if (opcion == 370)
          {
            this.sincronizar(4);
          }
        }
        else 
        {
          this.tiempoCongelado = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[253];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        this.tiempoCongelado = false;
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[253];
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    });
  }

  primerasEtiquetas()
  {
    let horatmp =  this.datepipe.transform(new Date().getTime() - 79200000, "yyyy/MM/dd HH") + ":00:00";
    let hora = new Date(horatmp);  
    for (var i = 0; i < 96; i++)
    {
      let miHora = +this.datepipe.transform(new Date(hora.getTime() + (900000 * i)), "HH");
      this.etiquetas.push({hora: miHora})
    }
  }

  calcularEtiquetas()
  {
    this.etiquetas = [];
    let horatmp =  this.datepipe.transform(new Date().getTime() - 79200000, "yyyy/MM/dd HH") + ":00:00";
    let hora = new Date(horatmp);  
    for (var i = 0; i < 96; i++)
    {
      let miHora = +this.datepipe.transform(new Date(hora.getTime() + (900000 * i)), "HH");
      this.etiquetas.push({hora: miHora})
    }
  }

  listarTurnos()
  {
    this.detalle.turnoActual = this.turnoActual;
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_turnos WHERE estatus = 'A' ORDER BY secuencia;"
    this.turnos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.turnos = resp;
    });
  }

  listarTripulaciones()
  {
    this.detalle.tripulacionActual = this.tripulacionActual;
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_tripulacion WHERE estatus = 'A' ORDER BY nombre;"
    this.tripulaciones = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.tripulaciones = resp;
    });
  }

  listarPartes()
  {
    this.detalle.parteActual = this.parteActual;
    let sentencia = "SELECT id, IF(ISNULL(referencia), nombre, CONCAT(nombre, '" + this.servicio.rTraduccion()[2637] + "', referencia, ')')) AS nombre FROM " + this.servicio.rBD() + ".cat_partes WHERE estatus = 'A' AND tipo = 0 ORDER BY nombre;"
    this.partes = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.partes = resp;
    });
  }

  listarLotes()
  {
    this.detalle.loteActual = this.loteActual
    let sentencia = "SELECT a.id, IF(ISNULL(b.nombre), a.numero, CONCAT(a.numero, ' (Nro Parte: ', b.nombre, ')')) AS numero FROM " + this.servicio.rBD() + ".lotes a LEFT JOIN " + this.servicio.rBD() + ".cat_partes b ON a.parte = b.id INNER JOIN " + this.servicio.rBD() + ".equipos_objetivo c ON a.id = c.lote AND c.estatus = 'A' WHERE a.estatus = 'A' AND a.estado <= 50 ORDER BY numero;"
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.lotes = resp;
    });
  }

  buscarRateEquipo()
  {
    let sentencia = "SELECT piezas, bajo, alto, tiempo, unidad FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE (equipo = " + this.equipoFijo + " OR equipo = 0) And (parte = " + this.detalle.parteActual + " Or parte = 0) ORDER BY parte DESC, equipo DESC LIMIT 1;"
    this.rateEquipo = ""
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.rateEquipo = resp[0].piezas * 1 + "  " + resp[0].unidad;
      }
      else
      {
        this.rateEquipo = this.servicio.rTraduccion()[449]
      }
      
    });
  }

  cambiando(evento: any)
  {
    this.boton08 = true;
    this.boton09 = true;
  }

  seleccion(id: number)
  {
    if (this.servicio.rUsuario().maquina=="S")
    {
      this.enCambio = false;
      this.modelo = 11;
      this.viendoResumen = false;
      this.cadCarrusel = this.servicio.rTraduccion()[437];
      this.enCarrusel = false;
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal"
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[3255];
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      this.equipoFijo = this.maquinas[id].id;
      this.actualizarOperador()
      this.servicio.aMaquina(this.maquinas[id].id);
      this.lineaTiempo();
    }
    else
    {
      let sentencia = "SELECT b.proceso FROM " + this.servicio.rBD() + ".relacion_usuarios_operaciones b WHERE b.proceso = " + id + " AND b.tipo = 2 AND b.usuario = " + this.servicio.rUsuario().id ;
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          this.modelo = 11;
          this.viendoResumen = false;
          this.cadCarrusel = this.servicio.rTraduccion()[437];
          this.enCarrusel = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal"
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[3255];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          this.equipoFijo = this.maquinas[id].id;
          this.actualizarOperador()
          this.servicio.aMaquina(this.maquinas[id].id);
          this.lineaTiempo();
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error"
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[3254];
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      })
    }
}

  
  filtrando(indice: number, evento: any)
  {
    if (indice==1)
    {
      let miCad = "";
      if (evento.target)
      {
        miCad = evento.target.value;
      }
      else
      {
        miCad = evento;
      }
      if (this.cadenaAntes != miCad )
      {
        this.cadenaAntes = miCad;
        setTimeout(() => {
          this.filtrando(1, this.cadenaAntes);
        }, 300);
        return;
      }
      this.partesF = [];
      this.detalle.parteActual = -1;
      this.servicio.activarSpinnerSmall.emit(true);
      if (miCad) 
      {
        for (var i = 0; i < this.partes.length; i  ++)
        {
          if (this.partes[i].nombre)
          {
            if (this.partes[i].nombre.toLowerCase().indexOf(miCad.toLowerCase()) !== -1)
            {
              this.partesF.splice(this.partesF.length, 0, this.partes[i]);
            }
          }
        }
      }
      else
      {
        this.partesF = this.partes;
      }
      this.servicio.activarSpinnerSmall.emit(false);
    }
    else if (indice==2)
    {
      let miCad = "";
      if (evento.target)
      {
        miCad = evento.target.value;
      }
      else
      {
        miCad = evento;
      }
      if (this.cadenaAntes != miCad )
      {
        this.cadenaAntes = miCad;
        setTimeout(() => {
          this.filtrando(2, this.cadenaAntes);
        }, 300);
        return;
      }
      this.lotesF = [];
      this.detalle.loteActual = -1;
      this.servicio.activarSpinnerSmall.emit(true);
      if (miCad) 
      {
        for (var i = 0; i < this.lotes.length; i  ++)
        {
          if (this.lotes[i].numero)
          {
            if (this.lotes[i].numero.toLowerCase().indexOf(miCad.toLowerCase()) !== -1)
            {
              this.lotesF.splice(this.lotesF.length, 0, this.lotes[i]);
            }
          }
        }
      }
      else
      {
        this.lotesF = this.lotes;
      }
      this.servicio.activarSpinnerSmall.emit(false);
    }
  }

  buscarDatos(indice: number, evento: any)
  {
    if (indice == 1)
    {
      let idBuscar: number;
      if (evento)
      {
        if (evento.option)
        {
          idBuscar = +evento.option.value
        }
        else
        {
          idBuscar = evento;
        }
      }
      else
      {
        idBuscar = evento;
      }
      //Buscar parte
      if (idBuscar)
      {
        this.servicio.activarSpinnerSmall.emit(true);
        let sentencia = "SELECT id, IF(ISNULL(referencia), nombre, CONCAT(nombre, '" + this.servicio.rTraduccion()[2637] + "', referencia, ')')) AS nombre FROM " + this.servicio.rBD() + ".cat_partes WHERE id = " + idBuscar;
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length > 0)
          {
            this.detalle.parteDes = resp[0].nombre; 
            this.partesF = resp;
            this.detalle.parteActual = resp[0].id;
            ////this.buscarRateEquipo();
          }
          setTimeout(() => {
            this.servicio.activarSpinnerSmall.emit(false);
          }, 100);
        })
      }
      else
      {
        this.detalle.parteDes = this.servicio.rTraduccion()[1495];
        this.partesF = [];
        this.detalle.parteActual = 0;
        //this.buscarRateEquipo();
      }
      
    }
    else if (indice == 2)
    {
      let idBuscar: number;
      if (evento.option)
      {
        idBuscar = +evento.option.value
      }
      else
      {
        idBuscar = evento;
      }
      //Buscar parte
      this.servicio.activarSpinnerSmall.emit(true);
      let sentencia = "SELECT a.id, b.id AS parte, IF(ISNULL(b.nombre), a.numero, CONCAT(a.numero, ' (Nro Parte: ', b.nombre, ')')) AS numero FROM " + this.servicio.rBD() + ".lotes a INNER JOIN " + this.servicio.rBD() + ".equipos_objetivo c ON a.id = c.lote AND c.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".cat_partes b ON a.parte = b.id WHERE a.id = " + idBuscar;
      
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          this.detalle.loteDes = resp[0].numero; 
          this.detalle.loteActual = resp[0].id;
          this.lotesF = resp;
          this.detalle.parteActual = resp[0].parte;
          this.buscarDatos(1, this.detalle.parteActual);
          //this.buscarRateEquipo();
        }
        setTimeout(() => {
          this.servicio.activarSpinnerSmall.emit(false);
        }, 100);
      })
    }
  }
}