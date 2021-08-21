import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, Params } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import 'snapsvg-cjs';
import * as SNAPSVG_TYPE from 'snapsvg';
import { environment } from '../../environments/environment'


declare var Snap: typeof SNAPSVG_TYPE;

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css'],
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

export class VisorComponent implements OnInit {

  @ViewChild("txtBuscar", { static: false }) txtBuscar: ElementRef;
  @ViewChild("txtNotas", { static: false }) txtNotas: ElementRef;
  scrollingSubscription: Subscription;
  vistaCatalogo: Subscription;
  //URL_FOLDER = "http://localhost:8081/sigma/assets/datos/";
  URL_FOLDER = "/robot/assets/datos/";

  constructor
  (
    public servicio: ServicioService,
    public scroll: ScrollDispatcher,
    public dialogo: MatDialog,
    private router: Router,
    private rutaActiva: ActivatedRoute
  )
  {
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
      this.altoPantalla = this.servicio.rPantalla().alto - 105;
      this.anchoPantalla = this.servicio.rPantalla().ancho - 10 - this.servicio.rAnchoSN();
  
      this.aplicarMapa();
      
    });
    this.emit20 = this.servicio.cambioColor.subscribe((estatus: any)=>
    {
      if (this.router.url.substr(0, 6) == "/visor")
      {
        
        this.colorear();

      }
      
    });

    this.emit30 = this.servicio.valida.subscribe((val) => 
    {
      this.verExcel = this.servicio.rUsuario().preferencias_andon.substr(31, 1) == "1" && this.servicio.rVersion().modulos[1] == 1 ;
  
    });

    this.emit40 = this.servicio.teclaBuscar.subscribe((accion: boolean)=>
    {
      this.buscar();
    });
    this.emit50 = this.servicio.teclaEscape.subscribe((accion: boolean)=>
    {
      this.escapar();
    });
    this.emit60 = this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
    });
    this.emit70 = this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 6) == "/visor")
      {
        this.cadaSegundo();
      }
    });
    this.emit80 = this.servicio.vista.subscribe((accion: number)=>
    {
      if (accion == 20)
      {
        this.rConfiguracion();
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
      }
    });
    this.emit90 = this.servicio.mostrarBarra.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 6) == "/visor")
      {
        this.verTop = accion;
        this.servicio.guardarVista(34, this.verTop ? 1: 0 );
        this.aplicarMapa();
        
      }
    });
    this.emit100 = this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    this.rConfiguracion();
    //this.llenarMaquinas();
    if (!this.verMapa && !this.verExcel && !this.verReporte)
    {
      this.verReporte = true;
      this.servicio.guardarVista(33, 1);
    }
  }

  ngOnInit() 
  {
    this.servicio.validarLicencia(1)
    this.llenarMaquinas();
  }


  ngOnDestroy()
  {
    if (this.emit00)
    {
      this.emit00.unsubscribe();
    }
    if (this.emit10)
    {
      this.emit10.unsubscribe();
    }
    if (this.emit20)
    {
      this.emit20.unsubscribe();
    }
    if (this.emit30)
    {
      this.emit30.unsubscribe();
    }
    if (this.emit40)
    {
      this.emit40.unsubscribe();
    }
    if (this.emit50)
    {
      this.emit50.unsubscribe();
    }
    if (this.emit60)
    {
      this.emit60.unsubscribe();
    }
    if (this.emit70)
    {
      this.emit70.unsubscribe();
    }
    if (this.emit80)
    {
      this.emit80.unsubscribe();
    }
    if (this.emit90)
    {
      this.emit90.unsubscribe();
    }
    if (this.emit100)
    {
      this.emit100.unsubscribe();
    }
  }

  reajustarPantalla()
  {
    this.leerBD();
    this.procesarMapa();
  }

  iniPantalla()
  {
    let wMapa: number = +this.anchoMapa;
    let hMapa: number = +this.altoMapa;
    if (this.mapa)
    {
      if (+this.anchoMapa / +this.altoMapa < +this.mapa.ancho / +this.mapa.alto)
      {
        hMapa = +this.mapa.alto * +this.anchoMapa / +this.mapa.ancho;
      }
      else
      {
        wMapa = +this.mapa.ancho * +this.altoMapa / +this.mapa.alto; 
      }
    }
    
    if (this.paper) 
    {
      this.paper.attr({
        x: 0,
        y: 0,
        width: wMapa,
        height: hMapa,
        viewBox: `0 0 ${this.anchoMapa} ${this.altoMapa}`,
        preserveAspectRatio: "none"
      });
    }
  }

  //
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
  //
  private paper: Snap.Paper;
  private canvas = '#canvas';
  baseOrigen;
  private coloresEstados = [];
  private figuras = []
  private idIntervalo: any;
  private contRefresco: number;
  public zoom: number;
  objetosInflados: number = 0;
  objetosTotal: number = 0;
  objetosPActual: string = "0";
  tiempoRate: string = "";
  trabajandoDesde: string = "";
  objetosEstatus = [];
  mapa;
  private STATUS_NORMAL: number;
  private grupo: SNAPSVG_TYPE.Paper;
  private transformMatrix = [1, 0, 0, 1, 0, 0];
  private centroX: number;
  private centroY: number;
  private factorEscala = 1.10;
  listoMostrar: boolean = true;
  primeraVez: boolean = true;
  cambio: boolean = false;
  //URL_BASE = "http://localhost:8081/sigma/";
  nombreMapa: string = "";

  
  URL_BASE = environment.urlMapa;
  
  ///ELVIS

  vista: any = '';
  equipos: any[] =[];
  equipo: any = [];
  rates: any[] =[];
  
  verTotal: boolean = false;
  intervalo: any;
  verParo: boolean = false;
  verNombre: boolean = false;
  verRates: boolean = true;
  verMetas: boolean = false;
  mensajeRate: number = 0; 
  cadCarrusel: string = this.servicio.rTraduccion()[437];
  multiMapas: boolean = false;

  //Literales

  colores: any = [];
  
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
  carruselMaquinas: any = [];

  //Colores
  //
  animadoOEE: boolean = true;
  animadoDIS: boolean = true;
  animadoFTQ: boolean = true;
  animadoEFI: boolean = true;
  animadoRate: boolean = true;
  animadoTodas: boolean = true;
  //
  rateActual: number = 0;
  rateMinimo: number = 0;
  rateMaximo: number = 0;
  horaDesde;

  veces: number = 0;
  isHandset: boolean = false;
  uFecha: string = this.servicio.fecha(1, "", this.servicio.rIdioma().fecha_02);
  

  ////
  
  uReporte: number = 0;

  leeBD: any;
  elTiempo: number = 0;
  sondeo: number = 0;
  mensajeTotal: string = "";
  ultimoMapa: string = "";

  llamadaLista: boolean = false;
  arreTiempos: any = [];
  arreHover: any = [];

  offSet: number;

  contar: boolean = false;
  verIrArriba: boolean = false;
  contarTiempo: boolean = false;
  verBuscar: boolean = false;
  empezando: boolean = true;
  movil: boolean = false;
  verBarra: string = "";
  ultimoReporte: string = "";
  ultimoID: number = 0;
  textoBuscar: string = "";
  nuevoRegistro: string = ";"
  maestroActual: number = 0;
  altoPantalla: number = this.servicio.rPantalla().alto - 105;
  anchoPantalla: number = this.servicio.rPantalla().ancho - 10 - this.servicio.rAnchoSN();
  anchoMensaje: number = this.anchoPantalla - 13;
  anchoExcel: number = this.anchoPantalla * 0.40 - 20;;
  altoMensaje: number = this.altoPantalla * 0.33 - 10;
  altoExcel: number = this.altoPantalla * 0.67;
  errorTitulo: string = "[" + this.servicio.rTraduccion()[6] + "]";
  errorMensaje: string = "";
  pantalla: number = 2;
  modelo: number = 1;
  miSeleccion: number = 1;
  iconoGeneral: string = "";
  tituloBuscar: string = "";
  verMantenimiento: boolean = false;
  enCadaSegundo: boolean = false;
  cuentaMapa: number = 0;
  cuentaMapaRotar: number = 0;
  registros: any = [];
  excels: any = [];
  arrFiltrado: any = [];
  cronometro: any;
  cronoMapa: any;
  laSeleccion: any = [];
  anchoColumnas: any = [];
  anchoColumnas2: any = [];
  configuracion: any = [];
  fotoStatus: any = [];  
  segExcel: number = 0;
  fallas: any = [];
  detalle: any = {id: 0, falla_ajustada: 0, tipo: 0}
  notas: string = "";
  enTecnico: boolean = false;
  hoverp01: boolean = false;
  hoverp02: boolean = false;
  operacioSel: boolean = false;
  maquinaSel: boolean = false;
  reparandoSel: boolean = false;
  abiertoSel: boolean = false;
  lineaSel: boolean = false;
  editando: boolean = false;
  faltaMensaje: string = "";
  responsableSel: boolean = false;
  fallaSel: boolean = false;
  rAlarmado: string = "N";
  horaReporte;
  mensajeSinFiltro: string = "";
  //URL_BASE = "/robot/api/upload.php"
  URL_IMAGENES = "/robot/assets/imagenes/";

  boton01: boolean = true;
  boton02: boolean = true;
  boton03: boolean = true;

  verMapa: boolean = this.servicio.rUsuario().preferencias_andon.substr(30, 1) == "1";
  verExcel: boolean = this.servicio.rUsuario().preferencias_andon.substr(31, 1) == "1" && this.servicio.rVersion().modulos[1] == 1 ;
  verReporte: boolean = this.servicio.rUsuario().preferencias_andon.substr(32, 1) == "1";

  verTop: boolean = this.servicio.rUsuario().preferencias_andon.substr(33, 1) == "1";

  altoMapa: number = this.altoPantalla + (this.verReporte ? -350 :  -10) - (this.verTop ? 94 : 0);
  anchoMapa: number = this.anchoPantalla * (this.verExcel ? 0.6 : 1) -10;
  equipoActual: number = 0;
  equipoFijo: number = 0;
  lineaActual : number = 0;
  
  escapar()
  {
    if (this.verBuscar)
    {
      this.textoBuscar = "";
    }
    else
    {
      this.cancelar();
    }
  }

  buscar()
  {
    if (this.verBuscar)
    {
      setTimeout(() => {
        this.txtBuscar.nativeElement.focus();
      }, 150);
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
        this.verIrArriba = false; //true
        clearTimeout(this.cronometro);
        this.cronometro = setTimeout(() => {
          this.verIrArriba = false;
        }, 3000);
      }

    this.offSet = scrollTop;
  }

  cancelar()
  {

  }

  salidaEfecto(evento: any)
  {
    if (evento.toState)
    {
      this.modelo = (this.modelo == 11 ? 1 : 2);

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
        if (!resp[0].mapa_fondo)
        {
          resp[0].mapa_fondo = "t";
        }
        document.documentElement.style.setProperty("--fondo_mapa", "#" + resp[0].mapa_fondo);
    ///
        this.configuracion = resp[0];
        this.paper = Snap(this.canvas);
        this.grupo = this.paper.group();
        //this.grupo.drag();
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
        this.reajustarPantalla();
        this.aplicarMapa();
    ///
        
        this.iniLeerBD();
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
        this.colorear();
      }
    },
    error =>
      {
        console.log(error)
      })
  }

  llenarMaquinas()
  {
    this.carruselMaquinas = [];
    let sentencia = "SELECT a.id, a.linea FROM " + this.servicio.rBD() + ".cat_maquinas a WHERE a.estatus = 'A' AND a.oee = 'S' ORDER BY a.linea, nombre;"
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.equipoActual = 0;
        this.carruselMaquinas = resp;
        this.equipoFijo = this.carruselMaquinas[this.equipoActual].id;
        this.lineaActual = this.carruselMaquinas[this.equipoActual].linea;
        this.cadCarrusel = (this.equipoActual + 1) + this.servicio.rTraduccion()[436] + this.carruselMaquinas.length;
        if (this.primeraVez)
        {
          this.mostrarEquipo();
        }
        
      }
      
    });
  
  }
  
  cadaSegundo()
  {
    this.segExcel = this.segExcel + 1 
    //let activarExcel: boolean = false;
    if (this.segExcel > 10 && this.verExcel)
    {
      //Vista individual
      if (this.primeraVez)
      {
        setTimeout(() => {
          this.animadoOEE = false;
          this.animadoDIS = false;
          this.animadoEFI = false;
          this.animadoFTQ = false;
          this.animadoRate = false;  
        }, 1100);
      }
      this.segExcel = 0;
      this.primeraVez = false;
      this.mostrarEquipo();
    }
    this.cuentaMapaRotar = this.cuentaMapaRotar + 1 ;
    if (this.mapa)
    {
      let restante: string = "";
      if (+this.configuracion.mapa_delay > 0 && (+this.configuracion.mapa_delay - +this.cuentaMapaRotar) > 0) 
      {
        if (this.servicio.rUsuario().rol == "V" && this.multiMapas)
        {
          restante = " (" + (+this.configuracion.mapa_delay - +this.cuentaMapaRotar) + ") "
        }
        
      }
      
      this.nombreMapa = this.mapa.nombre + restante;
      if (this.servicio.rUsuario().rol == "V" && this.multiMapas)
      {
        this.servicio.mensajeSuperior.emit(this.cuentaMapa > 0 ? (10 - this.cuentaMapa + this.servicio.rTraduccion()[3355]) : "");
      }
      
      this.actualizarStatusFiguras()
    }
    if (this.servicio.rUsuario().rol == "V" && this.mapa && !this.multiMapas && +this.configuracion.mapa_delay > 0)
    {
      let minutos = Math.floor((900 - +this.cuentaMapaRotar) / 60)
      let segundos = '' + (900 - +this.cuentaMapaRotar) % 60
       if (+segundos < 10)
       {
         segundos = "0" + segundos;
       }
      this.servicio.mensajeSuperior.emit(minutos + ":" + segundos + this.servicio.rTraduccion()[3356] );
      if (this.cuentaMapaRotar >= 900)
      {
        if (this.servicio.rUsuario().rol == "V")
        {
          localStorage.setItem("ultimoUsuario", this.servicio.rUsuario().id);
          localStorage.setItem("aplicacion", "/visor");
          location.reload();
        }
      }
     }
    else if (+this.configuracion.mapa_delay > 0 && this.mapa && this.cuentaMapaRotar >= +this.configuracion.mapa_delay)
    {
      this.cuentaMapa = this.cuentaMapa + 1 ;
      if (this.mapa)
      {
        if (this.cuentaMapa >= 10)
        {
          if (this.servicio.rUsuario().rol == "V")
          {
            localStorage.setItem("ultimoUsuario", this.servicio.rUsuario().id);
            localStorage.setItem("aplicacion", "/visor");
            location.reload();
          }
        }
        this.actualizarStatusFiguras()
        
      }
      this.cuentaMapaRotar = 0
      this.procesarMapa()
     }
     else if (+this.configuracion.mapa_delay == 0)
     { 
      if (this.servicio.rUsuario().rol == "V")
      {
        let minutos = Math.floor((900 - +this.cuentaMapaRotar) / 60)
        let segundos = '' + (900 - +this.cuentaMapaRotar) % 60
        if (+segundos < 10)
        {
          segundos = "0" + segundos;
        }
        this.servicio.mensajeSuperior.emit(minutos + ":" + segundos + this.servicio.rTraduccion()[3356] );
      }
      
      if (this.cuentaMapaRotar >= 900)
      {
        if (this.servicio.rUsuario().rol == "V")
        {
          localStorage.setItem("ultimoUsuario", this.servicio.rUsuario().id);
          localStorage.setItem("aplicacion", "/visor");
          location.reload();
        }
      }
     }
    this.calcularTiempo()
    if (!this.contar)
    {
      //this.servicio.mensajeInferior.emit(this.mensajeTotal + " (Leyendo datos desde MS Excel...)");        
      this.servicio.mensajeInferior.emit(this.mensajeTotal);        
    }
    else
    {
      this.servicio.mensajeInferior.emit(this.mensajeTotal);
    }
  }

mostrarEquipo()
{
  //Consulta x equipo
  this.cambio = false;
  setTimeout(() => {
    this.cambio = true;
  }, 300);
let consulta = "SELECT IFNULL(j.reporte, 0) AS reporte, IF(k.estatus = 0, '" + this.servicio.rTraduccion()[441] + "', '" + this.servicio.rTraduccion()[442] + "') AS reporteest, l.nombre AS fallanombre, m.nombre AS nsolicitante, e.oee_historico_rate, TIMEDIFF(NOW(), k.fecha) AS tiempofalla, e.oee_estado, e.oee_estado_cambio, TIMEDIFF(NOW(), e.oee_estado_cambio) AS tiempoestado, e.id AS idequipo, e.oee_turno_actual, e.oee_tripulacion_actual, e.oee_lote_actual, e.oee_parte_actual, e.oee_umbral_alerta, e.nombre as nequipo2, f.nombre as nlinea, a.*, TIME_TO_SEC(TIMEDIFF(NOW(), a.estado_desde)) AS transcurrido, TIME_TO_SEC(TIMEDIFF(NOW(), a.rate_mal_desde)) AS malrate, b.id, b.desde, b.hasta, b.paro, b.clase AS tipo, TIMEDIFF(b.desde, NOW()) AS parofalta, SEC_TO_TIME(b.tiempo) AS tiempoparo, b.paro AS nombre, d.nombre AS nparo, g.id AS id_actual, g.clase AS tipo_actual, g.inicia AS desde_actual, DATE_ADD(g.inicia, INTERVAL g.tiempo SECOND) AS hasta_actual, TIMEDIFF(DATE_ADD(g.inicia, INTERVAL g.tiempo SECOND), NOW()) AS parofalta_actual, TIMEDIFF(NOW(), g.inicia) AS parovan_actual, SEC_TO_TIME(g.tiempo) AS tiempoparo_actual, g.paro AS nombre_actual, i.nombre AS nparo_actual, a.velocidad FROM " + this.servicio.rBD() + ".cat_maquinas e LEFT JOIN " + this.servicio.rBD() + ".cat_lineas f ON e.linea = f.id AND f.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".relacion_maquinas_lecturas a ON e.id = a.equipo LEFT JOIN " + this.servicio.rBD() + ".detalleparos b ON a.proximo_paro = b.id AND b.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.tipo = d.id LEFT JOIN " + this.servicio.rBD() + ".detalleparos g ON a.paro_actual = g.id AND g.estatus = 'A' LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON g.tipo = i.id LEFT JOIN (SELECT maquina, MIN(id) AS reporte FROM " + this.servicio.rBD() + ".reportes WHERE estatus <= 10 AND contabilizar = 'S' GROUP BY maquina) AS j ON j.maquina = e.id LEFT JOIN " + this.servicio.rBD() + ".reportes k ON j.reporte = k.id LEFT JOIN " + this.servicio.rBD() + ".cat_fallas l ON k.falla = l.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios m ON k.solicitante = m.id WHERE e.id = " + this.equipoFijo;
  this.verTotal = false;
  let campos = {accion: 100, sentencia: consulta};  
  this.servicio.consultasBD(campos).subscribe((data: any []) =>
  {
    if (data.length > 0)
    {
      if (!data[0].nequipo)
      {
        data[0].ftq = 0;
        data[0].dis = 0;
        data[0].efi = 0;
        data[0].oee = 0;
        data[0].esperadoefi = 0;
        data[0].esperadodis = 0;
        data[0].esperadooee = 0;
        data[0].esperadoftq = 0;
        data[0].nequipo = data[0].nequipo2;
        data[0].rate_teorico = 0;
        data[0].rate = 0; 
        data[0].rate_efecto = "N";
        data[0].estatus = "D";
        data[0].referencia = "-";
        data[0].nparte = this.servicio.rTraduccion()[443];
        data[0].norden = "";
        data[0].ntripulacion = this.servicio.rTraduccion()[8];
        data[0].nturno = this.servicio.rTraduccion()[8];
        data[0].avance = "0";
        data[0].produccion = "0";
        data[0].objetivo = "0";
        data[0].transcurrido = "0";
        data[0].malrate = "0";
        data[0].ratemed = "";
      }
      let pasar = true;
      if (data[0].parofalta_actual)
      {
        data[0].vencido = data[0].parofalta_actual.substring(0, 1) == "-" ? "1" : "0";
      }
      else
      {
        data[0].vencido = "0";
      }
      
      data[0].nparo = !data[0].nparo  ? this.servicio.rTraduccion()[8] : data[0].nparo;
      data[0].imagenOEE = data[0].oee_imagen == 0 ? "" : "i_bajar";
      data[0].imagenEFI = data[0].efi_imagen == 0 ? "" : "i_bajar";
      data[0].imagenDIS = data[0].dis_imagen == 0 ? "" : "i_bajar";
      data[0].imagenFTQ = data[0].ftq_imagen == 0 ? "" : "i_bajar";

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

      if (pasar)
      {
        
        this.equipo = data[0];
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
            this.tiempoRate = this.servicio.rTraduccion()[602] + (strHoras + strMinutos + strSegundos);
            if (this.rateActual != -100)
            {
              let cad2 = this.servicio.rTraduccion()[3294];
              if (this.equipo.oee_historico_rate == "1")
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
            let cadTiempo = "";
            if (this.rateActual == -100)
            {
              if (data[0].tiempoestado)
              {
                let segmentos = data[0].tiempoestado.split(":");
                if (+segmentos[0] > 0)
                {
                  cadTiempo = +segmentos[0] + this.servicio.rTraduccion()[3291];;
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
            if (this.rateActual == 0)
            {
              //this.servicio.mensajeInferior.emit("No se están registrando piezas...");
            }
            else if (data[0].rate_efecto == "B")
            {
              
              this.colorRate = this.configuracion.bajo_color;
              if (this.mensajeRate != 1)
              {
                this.mensajeRate = 1;
                //let mensajeCompleto: any = [];
                //mensajeCompleto.clase = "snack-error";
                //mensajeCompleto.mensaje = this.lit_bajoRate + " (" + Math.floor(this.equipo.rate_min) + "%)";
                //mensajeCompleto.tiempo = 2000;
                //this.servicio.mensajeToast.emit(mensajeCompleto);
              }
              this.lit_estatusRate = this.servicio.rTraduccion()[3288]
            }
            else if (data[0].rate_efecto == "A")
            {
              this.colorRate = this.configuracion.alto_color;
              if (this.mensajeRate != 2)
              {
                this.mensajeRate = 2;
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = this.lit_sobreRate + " (" + Math.floor(this.equipo.rate_max) + "%)";
                mensajeCompleto.tiempo = 3000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
              this.lit_estatusRate = this.servicio.rTraduccion()[3287]
            }
            else
            {
              this.colorRate = this.colores.alto_color;
              this.lit_estatusRate = ""
              this.mensajeRate = 0
            }

      }
    }
    this.equipoActual = this.equipoActual + 1;  
    if (this.equipoActual >= this.carruselMaquinas.length && this.router.url.substr(0, 6) == "/visor")
    {
      this.llenarMaquinas();
    }
    else
    {
      this.equipoFijo = this.carruselMaquinas[this.equipoActual].id;
      this.lineaActual = this.carruselMaquinas[this.equipoActual].linea;
      this.cadCarrusel = (this.equipoActual + 1) + this.servicio.rTraduccion()[436] + this.carruselMaquinas.length;
    }
  })
}

  calcularTiempo()
{
  this.contarTiempo = false;
  for (var i = 0; i < this.registros.length; i++)
  {
    let segundos =  this.servicio.tiempoTranscurrido(this.registros[i].fechac, "").split(";");
    this.arreTiempos[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
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


  procesarMapa() {
    this.contRefresco = 0;
    this.zoom = 0;
    //this.verNombre = false;
    // Cargar mapa activo
    let filtro = "";
    if (this.configuracion.mapa_rotacion==0)
    {
      filtro = " WHERE docs > 0 "
    }
    let join = "";
    if (this.servicio.rUsuario().mapa != "S" && this.servicio.rUsuario().rol != "A")
    {
       join = "INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 6 AND b.usuario = " + this.servicio.rUsuario().id;
    }
    let sentencia = "SELECT a.id, a.nombre, a.ancho, a.alto, a.tasa_actualizacion as tasaActualizacion, a.tasa_refresco as tasaRefresco FROM " + this.servicio.rBD() + ".mapas a " + join + " WHERE activo <> 9;";
    
    if (this.mapa)
    {
      let filtroANDON = " (c.estatus = 0 OR c.estatus = 10)"
      if (this.configuracion.hibrido_mostrar_reparacion=="N")
      {
        filtroANDON = "(c.estatus = 0 OR (c.estatus = 10 AND c.origen = 0))";
      }
      
      sentencia = "SELECT * FROM (SELECT 1, id, nombre, ancho, alto, tasa_actualizacion as tasaActualizacion, tasa_refresco as tasaRefresco, activo, (SELECT COUNT(DISTINCT(c.id)) FROM " + this.servicio.rBD() + ".reportes c INNER JOIN " + this.servicio.rBD() + ".cat_maquinas f ON c.maquina = f.id INNER JOIN " + this.servicio.rBD() + ".figuras ON f.id_mapa = objeto_id WHERE " + filtroANDON + " AND mapa_id = a.id) AS docs FROM " + this.servicio.rBD() + ".mapas AS a WHERE a.id > " + this.mapa.id + " UNION (SELECT 3, id, nombre, ancho, alto, tasa_actualizacion as tasaActualizacion, tasa_refresco as tasaRefresco, activo, (SELECT COUNT(DISTINCT(c.id)) FROM " + this.servicio.rBD() + ".reportes c INNER JOIN " + this.servicio.rBD() + ".cat_maquinas f ON c.maquina = f.id INNER JOIN " + this.servicio.rBD() + ".figuras ON f.id_mapa = objeto_id WHERE " + filtroANDON + " AND mapa_id = a.id) AS docs FROM " + this.servicio.rBD() + ".mapas AS a WHERE a.id < " + this.mapa.id + " AND a.activo<=1) UNION (SELECT 3, id, nombre, ancho, alto, tasa_actualizacion as tasaActualizacion, tasa_refresco as tasaRefresco, activo, (SELECT COUNT(DISTINCT(c.id)) FROM " + this.servicio.rBD() + ".reportes c INNER JOIN " + this.servicio.rBD() + ".cat_maquinas f ON c.maquina = f.id INNER JOIN " + this.servicio.rBD() + ".figuras ON f.id_mapa = objeto_id WHERE " + filtroANDON + " AND mapa_id = a.id) AS docs FROM " + this.servicio.rBD() + ".mapas AS a WHERE a.activo <> 9)) AS a " + join + " " + filtro + " ORDER BY 1, 2, 3 LIMIT 1";
      

      
    }
    
    let campos = {accion: 100, sentencia: sentencia};
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (!this.mapa)
      {
        this.multiMapas = resp.length > 1; 
      
      }
      this.mapa = resp[0];
      this.nombreMapa = this.mapa.nombre;
      if (this.mapa.id != this.ultimoMapa)
      {
        this.ultimoMapa = this.mapa.id;
           //this.servicio.mensajeSuperior.emit(this.mapa.nombre);
        sentencia = "SELECT id AS status, color, normal FROM " + this.servicio.rBD() + ".status_objetos WHERE mapa_id = " + this.mapa.id;
        campos = {accion: 100, sentencia: sentencia};
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          this.coloresEstados = resp;
          const e = this.coloresEstados.find(ce => ce.normal==1);
          if (e) {
            this.STATUS_NORMAL = e.status;
          } else {
            this.STATUS_NORMAL = 1;   // Valor por defecto
          }
          // Obtener figuras asociadas al mapa actual
          sentencia = "SELECT f.id AS id, tipo_id AS tipo, x, y, ancho, largo, rotacion, idx, idy, x AS x2, y AS y2, ancho AS ancho2, largo AS largo2, idx AS idx2, idy AS idy2, mensaje, rotacion_texto AS rotacionTexto, ancho_borde AS anchoBorde, color_borde AS colorBorde, alfa_borde AS alfaBorde, color_fondo AS colorFondo, alfa_fondo AS alfaFondo, color_texto AS colorTexto, fuente, tamano_fuente AS tamanoFuente, fuente_italica AS italicas, fuente_negrita AS negritas, mapa_id AS mapa, objeto_id AS objeto, archivo, status_asociado AS statusAsociado, efecto, lower(tf.descripcion) AS descTipoFigura FROM " + this.servicio.rBD() + ".figuras AS f JOIN " + this.servicio.rBD() + ".tipos_figuras AS tf on f.tipo_id = tf.id WHERE mapa_id = " + this.mapa.id;
          campos = {accion: 100, sentencia: sentencia};
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            this.figuras = resp;
            // Escalar figuras
            this.adaptarFiguras();
            // Dibujar mapa
            this.dibujar();

            // Actualizar status de las maquinas cada n segundos
            this.fotoStatus = [];
          });
        });
      }
    });
  }

  eliminarFiltros() {
    this.figuras.forEach(fig => {
      const idFiltro = fig.id + '-fil';
      const ele = this.paper.select('#' + idFiltro);

      if (ele) {
        ele.remove();
      }
    });
  }

  private colorEstado(status: number): string {
    const cest = this.coloresEstados.find(ce => ce.status === status);

    if (cest) {
      return cest.color;
    } else {
      return '';
    }
  }

  actualizarStatusFiguras() 
  {
    if (this.mapa.tasaRefresco > 0) 
    {
      this.contRefresco += this.mapa.tasaActualizacion;

      if (this.contRefresco >= this.mapa.tasaRefresco) {
        this.contRefresco = 0;
        location.reload();  // Refrescar ventana del navegador
      }
    }

    let filtroANDON = " (a.estatus = 0 OR a.estatus = 10)"
    if (this.configuracion.hibrido_mostrar_reparacion=="N")
    {
      filtroANDON = "(a.estatus = 0 OR (a.estatus = 10 AND a.origen = 0))";
    }
    let sentencia = "SELECT b.id_mapa, b.id_mapa2, b.id_mapa3, MIN(a.estatus) AS status FROM " + this.servicio.rBD() + ".reportes a INNER JOIN " + this.servicio.rBD() + ".cat_maquinas b ON a.maquina = b.id WHERE " + filtroANDON + " AND (b.id_mapa > 0 OR b.id_mapa2 > 0 OR b.id_mapa3 > 0) GROUP BY b.id_mapa, b.id_mapa2, b.id_mapa3";
    let campos = {accion: 100, sentencia: sentencia};
    this.servicio.consultasBD(campos).subscribe( resp2 =>
    {
      let revision = [];
      let resp = [];
      if (resp2.length == 0)
      {
        this.objetosPActual = "0";
        this.objetosInflados = 0;
        this.objetosEstatus = [];
      }
      else
      {
        for (const status of resp2) {

          if (+status.id_mapa > 0)
          {
            resp.push({idObjeto: status.id_mapa, status: status.status })
          }
          if (+status.id_mapa2 > 0)
          {
            resp.push({idObjeto: status.id_mapa2, status: status.status })
          }
          if (+status.id_mapa3 > 0)
          {
            resp.push({idObjeto: status.id_mapa3, status: status.status })
          }
          }           
        }
      if (this.fotoStatus.length == 0 && resp.length == 0)
      {
        return;
      }
      if (this.fotoStatus.length == 0 && resp.length > 0)
      {
        for (const status of resp) {
          revision.push({idObjeto: status.idObjeto, status: status.status, accion: 1})
        }
      }
      else if (this.fotoStatus.length > 0 && resp.length == 0)
      {
        for (const status of this.fotoStatus) {
          revision.push({idObjeto: status.idObjeto, status: status.status, accion: 2})
        }
      }
      else 
      {
        for (var i = 0; i < this.fotoStatus.length; i++)
        {
          let hallado = false;
          for (var j = 0; j < resp.length; j++)
          {
            if (this.fotoStatus[i].idObjeto ==  resp[j].idObjeto)
            {
              hallado = true;
              if (this.fotoStatus[i].status !=  resp[j].status)
              {
                revision.push({idObjeto: resp[i].idObjeto, status: resp[i].status, accion: 3}) 
              }
              else
              {
                break;
              }
            }
          }
          if (!hallado)
          {
            revision.push({idObjeto: this.fotoStatus[i].idObjeto, status: this.fotoStatus[i].status, accion: 2}) 
          }
        }
        for (var i = 0; i < resp.length; i++)
        {
          let agregar = true;
          for (var j = 0; j < this.fotoStatus.length; j++)
          {
            if (this.fotoStatus[j].idObjeto == resp[i].idObjeto)
            {
              agregar = false
              break;              
            }
          }
          if (agregar)
          {
            revision.push({idObjeto: resp[i].idObjeto, status: resp[i].status, accion: 1}) 
          }
        }
        
      }
      this.objetosTotal = resp.length;
      this.objetosEstatus.length = resp.length;
      if (revision.length > 0)
      {
        for (const status of revision) 
        {
          this.aplicarStatus(status);
        }
      }
      this.fotoStatus = resp;
    });
  }
  
  aplicarStatus(sts)
   {
    // Eliminar filtros asociados al objeto actual
    const fils = this.paper.selectAll('.M' + sts.idObjeto + '-fil');
    if (fils) { fils.remove(); }

    // Eliminar figuras asociadas al objeto actual

    const eles = this.paper.selectAll('.M' + sts.idObjeto);
    if (eles) 
    { 
      eles.remove(); 
    }

    if (sts.accion == 2)
    {
      return;
    }
    // Si el status es NORMAL no dibujar las figuras
    if (sts.status === this.STATUS_NORMAL) { return; }

    // Seleccionar figuras asociadas al status actual
    let figs = this.figuras.filter(f =>
      f.objeto === sts.idObjeto && f.statusAsociado === sts.status
    );

    // Si no hay figuras asociadas por status, buscar figura por defecto, si la hay
    if (!figs || figs.length === 0) {
      figs = this.figuras.filter(f =>
        f.objeto === sts.idObjeto && f.statusAsociado === this.STATUS_NORMAL
      );
    }

    // Crear un filtro para cada figura y aplicarlo
    let idFiltro = '';
    let idGauss = '';
    let filtro = '';

    for (const fig of figs) {
      // Si el status leido es el mismo continuar con el siguiente objeto
      //if (fig.statusActual === sts.status) continue;

      // Actualizar el nuevo status
      fig.statusActual = sts.status;

      let ele = this.paper.select('#' + fig.id);

      if (ele) {
        ele.stop();       // Detener la animacion del status anterior
        ele.remove();     // Eliminar figura del status anterior
      }

      // Dibujar figura asociada al nuevo status
      ele = this.dibujarFigura(fig, sts.status);

      // Aplicar efecto segun tipo de figura
      if (fig.efecto.toLowerCase() === 'p')  
      {
        this.blink(ele);
      }
    }
  } 

  dibujar() {
      //this.canvas = null;
      this.paper.clear();
      //this.paper = null;
      this.grupo = null;
      this.paper = Snap(this.canvas);
      this.grupo = this.paper.group();
      this.ultimoMapa = this.mapa.id;
      this.cargarFondo(this.mapa);
      //this.cargarControlesZoom();
      //this.grupo.attr({ transform: this.transformMatrix.join(' ') });
  }

  cargarFondo(mapa) {
    if (mapa) 
    {
      const img = this.paper.image(this.URL_BASE + 'assets/mapas/mapa' + mapa.id + '.png', 0, 0,
        +this.anchoMapa, +this.altoMapa)
        .attr({ id: 'mapaInterno' });
      this.grupo.add(img);
      setTimeout(() => {
        this.verNombre = true;
      }, 100);
    }
  }

  cargarControlesZoom() {
    const zoomin = this.paper.image(this.URL_BASE + 'assets/mapas/zoomin.png', 5, 5, 32, 32);
    zoomin.attr({ style: 'cursor: pointer; position: fixed;' });
    zoomin.click(() => this.zoomMapa(0));

    const normal = this.paper.image(this.URL_BASE + 'assets/mapas/normal.png', 45, 5, 32, 32);
    normal.attr({ style: 'cursor: pointer; position: fixed;' });
    normal.click(() => this.zoomMapa(1));
  }

  private dibujarFigura(fig, status: number): Snap.Element {
    let shp: Snap.Element = null;
    let base: Snap.Element = null;

    switch (fig.descTipoFigura) {
      case 'rectangle':
        base = this.paper.rect(fig.x, fig.y, fig.ancho, fig.largo);
        shp = this.paper.rect(fig.x, fig.y, fig.ancho, fig.largo);
        break;
      case 'roundedrectangle':
        base = this.paper.rect(fig.x, fig.y, fig.ancho, fig.largo, 10);
        shp = this.paper.rect(fig.x, fig.y, fig.ancho, fig.largo, 10);
        break;
      case 'cube':
        base = this.dibujarCubo(fig);
        shp = this.dibujarCubo(fig);
        break;
      case 'diamond':
        base = this.dibujarRombo(fig);
        shp = this.dibujarRombo(fig);
        break;
      case 'oval':
        base = this.dibujarElipse(fig);
        shp = this.dibujarElipse(fig);
        break;
      case 'isoscelestriangle':
        base = this.dibujarTriangulo(fig);
        shp = this.dibujarTriangulo(fig);
        break;
      case 'parallelogram':
        base = this.dibujarParalelogramo(fig);
        shp = this.dibujarParalelogramo(fig);
        break;
      case 'regularpentagon':
        base = this.dibujarPentagono(fig);
        shp = this.dibujarPentagono(fig);
        break;
      case 'hexagon':
        base = this.dibujarHexagono(fig);
        shp = this.dibujarHexagono(fig);
        break;
      case 'can':
        base = this.dibujarCilindro(fig);
        shp = this.dibujarCilindro(fig);
        break;
      case 'uparrow':
        base = this.dibujarFlecha(fig, 0);
        shp = this.dibujarFlecha(fig, 0);
        break;
      case 'rightarrow':
        base = this.dibujarFlecha(fig, 1);
        shp = this.dibujarFlecha(fig, 1);
        break;
      case 'downarrow':
        base = this.dibujarFlecha(fig, 2);
        shp = this.dibujarFlecha(fig, 2);
        break;
      case 'leftarrow':
        base = this.dibujarFlecha(fig, 3);
        shp = this.dibujarFlecha(fig, 3);
        break;
      case 'cross':
        base = this.dibujarCruz(fig);
        shp = this.dibujarCruz(fig);
        break;
      case '5pointstar':
        base = this.dibujarEstrella5(fig);
        shp = this.dibujarEstrella5(fig);
        break;
      case '6pointstar':
        base = this.dibujarEstrella6(fig);
        shp = this.dibujarEstrella6(fig);
        break;
      case 'picture':
        shp = this.cargarImagen(fig);
        break;
      default:
        return;
    }

    let color = '';

    if (status !== this.STATUS_NORMAL) {
      if (fig.anchoBorde > 0 && fig.descTipoFigura !== 'picture') {
        color = fig.colorBorde;
      } else {
        color = this.colorEstado(status);
      }
    }

    const g = this.paper.group();

    // Aplicar atributos a la figura base
    if (base) {
      base.attr({
        id: fig.id + '-base',
        stroke: color,
        strokeWidth: fig.anchoBorde > 0 ? fig.anchoBorde : 0,
        fill: fig.colorFondo,
        fillOpacity: 0
      });

      base.transform('r' + fig.rotacion);   // Aplicar rotacion
      g.add(base);                          // Agregar al grupo
    }

    if (shp) {
      // Aplicar atributos a la figura
      shp.attr({ id: fig.id + '-shp' });

      if (fig.descTipoFigura !== 'picture') {
        shp.attr({
          stroke: color,
          strokeWidth: fig.anchoBorde > 0 ? fig.anchoBorde : 0,
          fill: fig.colorFondo,
          fillOpacity: fig.alfaFondo
        });
      }

      shp.transform('r' + fig.rotacion);    // Aplicar rotacion
      g.add(shp);                           // Agregar al grupo
    }
    // Escribir texto
    const texto = this.escribirMensaje(fig);

    if (texto) {
      texto.transform('r' + fig.rotacionTexto);   // Aplicar rotacion
      g.add(texto);                               // Agregar al grupo
    }

    // Asignar ID y clase al grupo
    g.attr({ id: fig.id, class: 'M' + fig.objeto});
    // Agregar al grupo general
    this.grupo.add(g);
    return g;
  }

  escribirMensaje(fig): Snap.Element {
    let texto = this.paper.text(-1000, -1000, fig.mensaje);
    const anchoTexto = texto.getBBox().width;
    const altoTexto = texto.getBBox().height;
    const dx = fig.x + (fig.ancho - anchoTexto) / 2;
    const dy = fig.idy + altoTexto;
    texto = this.paper.text(dx, dy, fig.mensaje);

    // Aplicar atributos al texto
    texto.attr({
      id: fig.id + '-txt',
      fill: fig.colorTexto,
      fontFamily: fig.fuente + ', Sans-serif, Monospace',
      fontSize: fig.tamanoFuente + 'px',
      fontStyle: fig.italicas != 0 ? 'italic' : 'normal',
      fontWeight: fig.negritas != 0 ? 'bold' : 'normal',
    });

    return texto;
  }

  blink(ele: Snap.Element) {
    this.mostrar(ele);
  }

  private ocultar(ele: Snap.Element) {
    ele.animate({ opacity: 0.7 }, 500, mina.linear, () => this.mostrar(ele));
  }

  private mostrar(ele: Snap.Element) {
    ele.animate({ opacity: 1 }, 200, mina.linear, () => 
    {
      ele.animate({ opacity: 0.4 }, 500, mina.linear, () => this.mostrar(ele))
    });
  }

  pulse(base: SNAPSVG_TYPE.Element) {
    this.inflar(base, "1");
  }

  private inflar(base, paso: string) 
  {
      let parOpacity = paso == "1" ? 0.6 : paso == "2" ? 0 : paso == "3" ? 0 : 1;
      let parEscala = paso == "1" ? 'scaleX(1.03)' : paso == "2" ? 'scaleX(1.07)' : paso == "3" ? 'scaleX(1)' : 'scaleX(1)'
      let parTiempo = paso == "1" ? 1000 : paso == "2" ? 500 : paso == "3" ? 10 : 100
      base.animate({ opacity: parOpacity, transform: parEscala }, parTiempo, mina.easeout, () => {
      let pasoSiguiente = paso == "1" ? "2" : paso == "2" ? "3" : paso == "3" ? "4" : "1";
      this.inflar(base, pasoSiguiente);
    });
  }

  
animGlow(onOff: number, gaussian: SNAPSVG_TYPE.Paper) {
    const min = 0;
    const max = 1;

    let start = min;
    let end = max;

    if (onOff) {
      start = max; end = min;
    }

    onOff = onOff ? 0 : 1;
    Snap.animate(start, end, (amount) => {
      gaussian.attr({ stdDeviation: amount + ' ' + amount });
    }, 400, mina.linear, () => this.animGlow(onOff, gaussian));
  }

  zoomMapa(inout: number) {
    const vb = this.paper.attr('viewBox');
    this.centroX = vb.width / 2;
    this.centroY = vb.height / 2;

    if (inout === 0) {
      for (let i = 0; i < 4; i++) {
        this.transformMatrix[i] *= this.factorEscala;
      }

      this.transformMatrix[4] += (1 - this.factorEscala) * this.centroX;
      this.transformMatrix[5] += (1 - this.factorEscala) * this.centroY;
      this.zoom++;
    } else {
      if (this.zoom > 0) {
        for (let i = this.zoom; i > 0; i--) {
          this.transformMatrix[4] -= (1 - this.factorEscala) * this.centroX;
          this.transformMatrix[5] -= (1 - this.factorEscala) * this.centroY;

          for (let j = 0; j < 4; j++) {
            this.transformMatrix[j] /= this.factorEscala;
          }
        }

        this.zoom = 0;
      }
    }

    const newMatrix = 'matrix(' + this.transformMatrix.join(' ') + ')';
    this.grupo.attr({ transform: newMatrix });
  }

  dibujarElipse(fig): Snap.Element {
    let shp = null;

    if (fig.ancho === fig.largo) {
      shp = this.paper.circle(
        fig.x + fig.ancho / 2,
        fig.y + fig.largo / 2,
        fig.ancho / 2);
    } else {
      shp = this.paper.ellipse(
        fig.x + fig.ancho / 2,
        fig.y + fig.largo / 2,
        fig.ancho / 2,
        fig.largo / 2);
    }

    return shp;
  }

  dibujarTriangulo(fig): Snap.Element {
    const pts = [
      fig.x, fig.y + fig.largo,
      fig.x + fig.ancho / 2.0, fig.y,
      fig.x + fig.ancho, fig.y + fig.largo
    ];

    const shp = this.paper.polygon(pts);
    return shp;
  }

  dibujarParalelogramo(fig): Snap.Element {
    const x = fig.x;
    const y = fig.y;
    const ancho = fig.ancho;
    const largo = fig.largo;
    const w = ancho / 5;

    const pts = [
      x, y + largo,
      x + w, y,
      x + ancho, y,
      x + ancho - w, y + largo
    ];

    const shp = this.paper.polygon(pts);
    return shp;
  }

  dibujarCilindro(fig): Snap.Element {
    // Calcular radio de las tapas
    const rx = fig.ancho / 2;
    const ry = fig.ancho / 6;

    // Calcular centro de las tapas
    const cx = fig.x + rx;
    const cy1 = fig.y + ry;
    const cy2 = fig.y + fig.largo - ry;

    // Dibujar cilindro
    const e1 = this.paper.ellipse(cx, cy1, rx, ry);
    const e2 = this.paper.ellipse(cx, cy2, rx, ry);
    const l1 = this.paper.line(fig.x, cy1, fig.x, cy2);
    const l2 = this.paper.line(fig.x + fig.ancho, cy1, fig.x + fig.ancho, cy2);
    const g = this.paper.group(e1, e2, l1, l2);

    return g;
  }

  dibujarPentagono(fig): Snap.Element {
    const pts = this.puntosEstrella5(fig);
    const ptsp = [];

    ptsp.push(pts[0]);
    ptsp.push(pts[1]);
    ptsp.push(pts[4]);
    ptsp.push(pts[5]);
    ptsp.push(pts[8]);
    ptsp.push(pts[9]);
    ptsp.push(pts[12]);
    ptsp.push(pts[13]);
    ptsp.push(pts[16]);
    ptsp.push(pts[17]);

    const shp = this.paper.polygon(ptsp);
    return shp;
  }

  dibujarHexagono(fig): Snap.Element {
    const x = fig.x;
    const y = fig.y;
    const ancho = fig.ancho;
    const largo = fig.largo;
    const w = ancho / 5;

    const pts = [
      x, y + largo / 2,
      x + w, y,
      x + w * 4, y,
      x + ancho, y + largo / 2,
      x + ancho - w, y + largo,
      x + w, y + largo
    ];

    const shp = this.paper.polygon(pts);
    return shp;
  }

  dibujarRombo(fig): Snap.Element {
    const pts = [
      fig.x, fig.y + fig.largo / 2.0,
      fig.x + fig.ancho / 2.0, fig.y,
      fig.x + fig.ancho, fig.y + fig.largo / 2.0,
      fig.x + fig.ancho / 2.0, fig.y + fig.largo
    ];

    const shp = this.paper.polygon(pts);
    return shp;
  }

  dibujarFlecha(fig, dir: number): Snap.Element {
    const x = fig.x;
    const y = fig.y;
    const ancho = fig.ancho;
    const largo = fig.largo;
    let h = 0;

    if (dir === 0 || dir === 2) {
      h = ancho / 2.0;
    } else {
      h = largo / 2.0;
    }

    let pts = [];

    switch (dir) {
      case 0:   // Arriba
        pts = [
          x + h, y,
          x + ancho, y + h,
          x + ancho - h / 2.0, y + h,
          x + ancho - h / 2.0, y + largo,
          x + h / 2.0, y + largo,
          x + h / 2.0, y + h,
          x, y + h
        ];
        break;
      case 1:   // Derecha
        pts = [
          x + ancho, y + h,
          x + ancho - h, y + largo,
          x + ancho - h, y + largo - h / 2.0,
          x, y + largo - h / 2.0,
          x, y + h / 2.0,
          x + ancho - h, y + h / 2.0,
          x + ancho - h, y
        ];
        break;
      case 2:   // Abajo
        pts = [
          x + h, y + largo,
          x, y + largo - h,
          x + h / 2.0, y + largo - h,
          x + h / 2.0, y,
          x + ancho - h / 2.0, y,
          x + ancho - h / 2.0, y + largo - h,
          x + ancho, y + largo - h
        ];
        break;
      case 3:   // Izquierda
        pts = [
          x, y + h,
          x + h, y,
          x + h, y + h / 2.0,
          x + ancho, y + h / 2.0,
          x + ancho, y + largo - h / 2.0,
          x + h, y + largo - h / 2.0,
          x + h, y + largo
        ];
        break;
    }

    const shp = this.paper.polygon(pts);
    return shp;
  }

  dibujarCruz(fig): Snap.Element {
    const pts = [
      fig.x + fig.ancho / 4, fig.y,
      fig.x + fig.ancho * 0.75, fig.y,
      fig.x + fig.ancho * 0.75, fig.y + fig.largo / 4,
      fig.x + fig.ancho, fig.y + fig.largo / 4,
      fig.x + fig.ancho, fig.y + fig.largo * 0.75,
      fig.x + fig.ancho * 0.75, fig.y + fig.largo * 0.75,
      fig.x + fig.ancho * 0.75, fig.y + fig.largo,
      fig.x + fig.ancho / 4, fig.y + fig.largo,
      fig.x + fig.ancho / 4, fig.y + fig.largo * 0.75,
      fig.x, fig.y + fig.largo * 0.75,
      fig.x, fig.y + fig.largo / 4,
      fig.x + fig.ancho / 4, fig.y + fig.largo / 4
    ];

    const shp = this.paper.polygon(pts);
    return shp;
  }

  dibujarCubo(fig): Snap.Element {
    const x = fig.x;
    const y = fig.y;
    const ancho = fig.ancho;
    const largo = fig.largo;

    let w = 0;
    let h = 0;

    if (ancho > largo) {
      w = largo / 4.0;
      h = w;
    } else {
      w = ancho / 4.0;
      h = w;
    }

    const pts = [
      x, y + h,
      x + h, y,
      x + ancho, y,
      x + ancho, y + largo - h,
      x + ancho - h, y + largo,
      x, y + largo
    ];

    const shp = this.paper.polygon(pts);

    // Hacerlo 3D
    const l1 = this.paper.line(x, y + h, x + ancho - w, y + h);
    l1.attr({ stroke: fig.colorBorde, strokeWidth: 2 });

    const l2 = this.paper.line(x + ancho - w, y + h, x + ancho - w, y + largo);
    l2.attr({ stroke: fig.colorBorde, strokeWidth: 2 });

    const l3 = this.paper.line(x + ancho - w, y + h, x + ancho, y);
    l3.attr({ stroke: fig.colorBorde, strokeWidth: 2 });

    const g = this.paper.group(shp, l1, l2, l3);
    return g;
  }

  dibujarEstrella5(fig): Snap.Element {
    const pts = this.puntosEstrella5(fig);
    const shp = this.paper.polygon(pts);
    return shp;
  }

  dibujarEstrella6(fig): Snap.Element {
    const pts = this.puntosEstrella6(fig);
    const shp = this.paper.polygon(pts);
    return shp;
  }

  puntosEstrella5(fig): number[] {
    const x = fig.x;
    const y = fig.y;
    const ancho = fig.ancho;
    const largo = fig.largo;
    const w = ancho / 8.0;
    const h = largo / 8.0;

    const pts = [
      x + ancho / 2, y,
      x + w * 5, y + h * 3,
      x + ancho, y + h * 3,
      x + w * 6 - w / 2, y + h * 5,
      x + w * 7 - w / 2, y + largo,
      x + w * 4, y + largo - h * 1.7,
      x + w * 2 - w / 2, y + largo,
      x + w * 3 - w / 2, y + h * 5,
      x, y + h * 3,
      x + w * 3, y + h * 3
    ];

    return pts;
  }

  puntosEstrella6(fig): number[] {
    const x = fig.x;
    const y = fig.y;
    const ancho = fig.ancho;
    const largo = fig.largo;
    const w = ancho / 3.0;
    const h = largo / 4.0;

    const pts = [
      x + w * 2 - w / 2, y,
      x + w * 2, y + h,
      x + ancho, y + h,
      x + ancho - w / 2, y + h * 2,
      x + ancho, y + h * 3,
      x + ancho - w, y + h * 3,
      x + w * 2 - w / 2, y + largo,
      x + w, y + h * 3,
      x, y + largo - h,
      x + w / 2, y + h * 2,
      x, y + h,
      x + w, y + h
    ];

    return pts;
  }

  cargarImagen(fig): Snap.Element {
    return this.paper.image(this.URL_BASE + 'assets/mapas/' + fig.archivo,
      fig.x, fig.y, fig.ancho, fig.largo);
  }

  adaptarFiguras() {
    const factorX = +this.anchoMapa / +this.mapa.ancho;
    const factorY = +this.altoMapa / +this.mapa.alto;

    // Calcular coordenadas y tamaños en nueva escala
    this.figuras.forEach(fig => {
      fig.x = fig.x2 * factorX;
      fig.y = fig.y2 * factorY;
      fig.ancho = fig.ancho2 * factorX;
      fig.largo = fig.largo2 * factorY;
      fig.idx = fig.idx2 * factorX;
      fig.idy = fig.idy2 * factorY;
    });
  }

  leerBD()
  {
    if (this.router.url.substr(0, 6) != "/visor")
    {
      return;
    }
    this.arreHover = [];
    let altoReporte = this.altoPantalla - (this.verTop ? 94 : 0);
    let limite: number = (this.verMapa || this.verExcel ? 5 : Math.floor(altoReporte / 44)); 
    let sentencia = "SELECT * FROM (SELECT 1, a.id, a.estatus, a.alarmado_atender, a.alarmado_atendido, a.inicio_atencion, a.fecha, a.fecha AS fechac, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nlinea, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nmaquina, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "') AS narea, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nfalla, IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nsolicitante FROM " + this.servicio.rBD() + ".reportes a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas b ON a.linea = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.maquina = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_areas d ON a.area = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_fallas e ON a.falla = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios f ON a.solicitante = f.id WHERE (a.estatus = 0 OR a.estatus = 10) AND a.id > " + this.uReporte + ") AS q1 UNION (SELECT 2, a.id, a.estatus, a.alarmado_atender, a.alarmado_atendido, a.inicio_atencion, a.fecha, a.fecha AS fechac, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nlinea, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nmaquina, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "') AS narea, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nfalla, IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nsolicitante FROM " + this.servicio.rBD() + ".reportes a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas b ON a.linea = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.maquina = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_areas d ON a.area = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_fallas e ON a.falla = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios f ON a.solicitante = f.id WHERE (a.estatus = 0 OR a.estatus = 10) AND a.id <= " + this.uReporte + ") ORDER BY 1, 2 LIMIT " + limite;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.arreHover.length = resp.length;
      if (resp.length == limite)
      {
        this.registros = [];
        this.uReporte = +resp[limite - 1].id 
        setTimeout(() => {
          this.registros = resp;
          this.arreTiempos.length = resp.length;
          this.calcularTiempo()  
        }, 250);
      }
      else 
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
                  if (this.registros[i].estatus !=  arreTemp[j].estatus || this.registros[i].alarmado_atendido !=  arreTemp[j].alarmado_atendido || this.registros[i].alarmado_atender !=  arreTemp[j].alarmado_atender)
                  {
                    this.registros[i].alarmado_atendido = arreTemp[j].alarmado_atendido;
                    this.registros[i].alarmado_atender = arreTemp[j].alarmado_atender;
                    this.registros[i].estatus = arreTemp[j].estatus;
                    this.registros[i].fechac = arreTemp[j].fechac;
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
                if (this.registros[j].id == resp[i].id)
                {
                  agregar = false
                  break;              
                }
              }
              if (agregar)
              {
                this.registros.splice(i, 0, resp[i])
                this.sondeo = resp[i].id;
              }
            }
          }
        }
        this.uReporte = 0;
      }
      this.listoMostrar = resp.length == 0;
      this.contarRegs();
      clearTimeout(this.leeBD);
      if (this.router.url.substr(0, 6) == "/visor")
      {
        this.leeBD = setTimeout(() => {
          this.leerBD();
        }, +this.elTiempo);
      }
    });
  }

  iniLeerBD()
  {
    if (!this.configuracion.visor_revisar_cada)
    {
      this.elTiempo = 5000;
    }
    else
    {
      this.elTiempo = +this.configuracion.visor_revisar_cada * 1000;
    }
    setTimeout(() => {
      this.leerBD();
    }, +this.elTiempo);
  }
  
cambiarVistas(id: number)
{
  if (id == 1)
  {
    this.servicio.guardarVista(31, this.verMapa ? 1: 0 );
  }
  else if (id == 2)
  {
    this.servicio.guardarVista(32, this.verExcel ? 1: 0 );
    if (this.verExcel)
    {
      this.segExcel = 11;
    }
  }
  else if (id == 3)
  {
    this.servicio.guardarVista(33, this.verReporte ? 1: 0 );
    
  };

  this.aplicarMapa()
    
}

aplicarMapa()
{
  setTimeout(() => {
    this.altoMapa = this.altoPantalla + (this.verReporte ? -330 :  -40) - (this.verTop ? 94 : 0);
    this.anchoMapa = this.anchoPantalla * (this.verExcel ? 0.6 : 1) -40;
  
  
    // Actualizar status de las maquinas cada n segundos
    this.fotoStatus = [];
    //this.servicio.mensajeSuperior.emit("Alto: " + this.altoMapa + "x Ancho: " + this.anchoMapa)
    
    document.documentElement.style.setProperty("--altoMapaTop", this.altoMapa + 20 + 'px');
    //this.servicio.mensajeSuperior.emit(this.anchoMapa + 'x' + this.altoMapa);
    this.iniPantalla();
    
    // Dibujar mapa
    if (this.mapa)
    {
      this.adaptarFiguras();
      this.dibujar();
    }
    
   
  }, 100);
  }


////ELVIS


  customizeTooltip(arg) {
    return {
        text: arg.valueText + '%'
    }
  }

  resetCanvas()
  {
    if (this.figuras) {
      for (var i = 0; i < this.figuras.length; i++)
      {
        let ele = this.paper.select('#' + this.figuras[i].id);
        if (ele) {
          ele.stop();
          ele.remove();
        }
      }
      this.fotoStatus = [];
    }
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
        this.colorEFI = this.colores.texto_boton;
      }
    })
  }




  ////


}

