import { Component, OnInit, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, GuardsCheckStart } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { HttpClient  } from '@angular/common/http';
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatSelectionList } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css'],
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
    trigger('esquema_del', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(15px)' }),
        animate('0.5s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0, transform: 'translateY(15px)' }))
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

export class CatalogosComponent implements OnInit {

  @ViewChild("txtBuscar", { static: false }) txtBuscar: ElementRef;
  @ViewChild("txtNombre", { static: false }) txtNombre: ElementRef;
  @ViewChild("txtTelefonos", { static: false }) txtTelefonos: ElementRef;
  @ViewChild("lstC0", { static: false }) lstC0: MatSelect;
  @ViewChild("lstC1", { static: false }) lstC1: MatSelect;
  @ViewChild("lstC2", { static: false }) lstC2: MatSelect;
  @ViewChild("lstC3", { static: false }) lstC3: MatSelect;
  @ViewChild("lstC4", { static: false }) lstC4: MatSelect;
  @ViewChild("lstC5", { static: false }) lstC5: MatSelect;
  @ViewChild("lstC6", { static: false }) lstC6: MatSelect;
  @ViewChild("listaListad", { static: false }) listaListad: MatSelectionList;
  @ViewChild("listaComplejidad", { static: false }) listaComplejidad: MatSelectionList;
  
  @ViewChild("lista1", { static: false }) lista1: MatSelectionList;
  @ViewChild("lista2", { static: false }) lista2: MatSelectionList;
  @ViewChild("lista3", { static: false }) lista3: MatSelectionList;
  @ViewChild("lista4", { static: false }) lista4: MatSelectionList;
  @ViewChild("lista5", { static: false }) lista5: MatSelectionList;
  @ViewChild("lista6", { static: false }) lista6: MatSelectionList;
  @ViewChild("lista7", { static: false }) lista7: MatSelectionList;

  @ViewChild("lstC10", { static: false }) lstC10: MatSelect;
  @ViewChild("lstC11", { static: false }) lstC11: MatSelect;
  @ViewChild("lstC12", { static: false }) lstC12: MatSelect;
  @ViewChild("lstC13", { static: false }) lstC13: MatSelect;
  @ViewChild("lstC14", { static: false }) lstC14: MatSelect;
  @ViewChild("lstC15", { static: false }) lstC15: MatSelect;


  @ViewChild("txtT1", { static: false }) txtT1: ElementRef;
  @ViewChild("txtT2", { static: false }) txtT2: ElementRef;
  @ViewChild("txtT3", { static: false }) txtT3: ElementRef;
  @ViewChild("txtT4", { static: false }) txtT4: ElementRef;
  @ViewChild("txtT5", { static: false }) txtT5: ElementRef;
  @ViewChild("txtT6", { static: false }) txtT6: ElementRef;
  @ViewChild("txtT7", { static: false }) txtT7: ElementRef;
  @ViewChild("txtT8", { static: false }) txtT8: ElementRef;
  @ViewChild("txtT9", { static: false }) txtT9: ElementRef;
  @ViewChild("txtT10", { static: false }) txtT10: ElementRef;
  scrollingSubscription: Subscription;
  vistaCatalogo: Subscription;
  //URL_FOLDER = "http://localhost:8081/sigma/assets/datos/";  
  URL_FOLDER = "/robot/assets/datos/";  

  constructor
  (
    public servicio: ServicioService,
    private route: ActivatedRoute,
    public scroll: ScrollDispatcher,
    private http: HttpClient,
    public dialogo: MatDialog, 
    private router: Router, 
    private viewportRuler: ViewportRuler,
    public datepipe: DatePipe,
    
  ) {

    this.emit00 = this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        this.altoPantalla = this.servicio.rPantalla().alto - 92;
        this.anchoPantalla = this.servicio.rPantalla().ancho - 2;// - (pantalla ? 0 : this.servicio.rAnchoSN());// : 0);
      }
    });
   
    this.emit10 = this.servicio.teclaBuscar.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        this.buscar();
      }
    });
    this.emit20 = this.servicio.teclaEscape.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 10) == "/catalogos" && !this.servicio.rEscapado())
      {
        this.cancelar();
      }
    });
    this.emit30 = this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
    });
    this.emit40 = this.servicio.vista.subscribe((accion: number)=>
    {
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        if (accion >= 30 && accion <= 43 || accion >= 46 && accion <= 61)
        {
          this.miSeleccion = accion - 29;  
          this.bot9 = this.miSeleccion == 8;
          this.cambiarVista(0)
          this.rRegistros(this.miSeleccion);
          this.iniLeerBD()
          
        }
        this.servicio.mostrarBmenu.emit(0);
      }
    });
    this.emit50 = this.servicio.cambioIdioma.subscribe((data: boolean)=>
    {
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        if (this.modelo==4 || this.modelo==14)
        {
          this.adecuar();
          if (this.miSeleccion == 12)
          {
            this.asociarTablas(this.detalle.id);
          }
        }
        
      }
      
    })
    this.emit60 = this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        this.cadaSegundo();
      }
    });

  
    this.emit70 = this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    this.rConfiguracion();
    this.miSeleccion = this.servicio.rVista() - 29;
    this.bot9 = this.miSeleccion == 8;
    this.cambiarVista(2)
    
    this.rRegistros(this.miSeleccion);
    this.iniLeerBD()
  }

  ngOnInit() {
    this.servicio.validarLicencia(1)
    this.servicio.mostrarBmenu.emit(0);
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
  }

  emit00: Subscription;
  emit10: Subscription;
  emit20: Subscription;
  emit30: Subscription;
  emit40: Subscription;
  emit50: Subscription;
  emit60: Subscription;
  emit70: Subscription;
  

  offSet: number;
  
  tVariables: number = 0;
  tVariablesC: number = 0;
  tVariablesA: number = 0;
  idRates: number = 0;
  nListado: number = 0;
  loteCopiado: boolean = false;
  valMaquinas: boolean = false;
  verIrArriba: boolean = false;
  noAceptado: boolean = false;
  varAlarmada: boolean = false
  verBuscar: boolean = true;
  verTabla: boolean = false;
  activarNumero: boolean = true;
  preguntarAC: boolean = true;
  primeraVez: boolean = true;
  cambioVista: boolean = true;
  hayFiltro: boolean = false;
  creando: boolean = false;
  movil: boolean = false;
  cancelando: boolean = true;
  cadResumenVariables: string;
  cadAlarmados: string;
  nCatalogo: string = this.servicio.rTraduccion()[1189]
  etiBuscar: string = this.servicio.rTraduccion()[1190];
  verBarra: string = "";
  ultimoReporte: string = "";
  ultimoID: number = 0;
  copiandoDesde: number = 0;
  textoBuscar: string = "";
  sentenciaR: string = "";
  sentenciaR2: string = "";
  vezExportar:number = 0
  cadSQLActual: string = "";
  nuevoRegistro: string = ";";
  nExtraccion: string = "0";
  nLapso: string = "0";
  piezasAntes: number = 0;
  equipoAntes: number = -1;
  validarCU: boolean = false;
  validarUSER: boolean = false;
  loteLista: boolean = false;
  validarM: boolean = false;
  nHorario: string = "T";
  sentenciaRate: string = "";
  nFrecuencia: string = "T";
  verSR: boolean = false;
  vObjetivoCero: boolean = false;
  arreTiempos: any = [];
  arreHover1: any = [];

  arreVariables: any = [];
  arreValoresVariables: any = [];

  turnosLote: any = [];
  fechasLote: any = [];
  loteCreado: number = 0;

  

  imagenesValidadas: number = 0;
  
  mostrarImagenRegistro: string = "N";
  mensajeImagen: string = this.servicio.rTraduccion()[358];
  cancelarEdicion: boolean = false;

  modelo: number = 0;
  ultimaActualizacion = new Date();
  altoPantalla: number = this.servicio.rPantalla().alto - 92;
  anchoPantalla: number = this.servicio.rPantalla().ancho - 10 + this.servicio.rAnchoSN();
  errorTitulo: string = "[" + this.servicio.rTraduccion()[6] + "]";
  errorMensaje: string = "";
  pantalla: number = 2;  
  miSeleccion: number = 1;
  seleccionado: number = 0;
  selListadoT: string = "S";
  opciones: string = "S";
  iconoGeneral: string = "";
  iconoVista: string = "";
  literalVista: string = this.servicio.rTraduccion()[1191];
  tituloBuscar: string = "";
  alarmados: number = 0;
  elTiempo: number = 0;
  despuesBusqueda: number = 0;
  enCadaSegundo: boolean = false;
  contarTiempo: boolean = false;
  visualizarImagen: boolean = false;
  paroEnCurso: boolean = false;
  sondeo: number = 0;
  registros: any = [];
  tmpRegistros: any = [];
  arrFiltrado: any = [];
  detalle: any = [];
  disponibilidad: any = [];
  titulos: any = [];
  tablas: any = [];
  consultas: any = [];
  cargos: any = [];
  recipientes: any = [];
  ayudas: any = [];
  ayuda02: string = this.servicio.rTraduccion()[1192];
  ayuda03: string = this.servicio.rTraduccion()[1193];
  ayuda04: string  = this.servicio.rTraduccion()[1194];
  cronometro: any;
  vista17: number = 0;
  litVista17: string = this.servicio.rTraduccion()[1195];
  icoVista17: string = "i_maquina";
  leeBD: any;
  laSeleccion: any = [];
  configuracion: any = [];
  fallas: any = [];
  idiomas: any = [];
  lineas: any = [];
  procesos: any = [];
  eventos: any = [];
  lotes: any = [];
  lotesF: any = [];
  
  paros: any = [];
  maquinas: any = [];
  partes: any = [];
  partesF: any = [];
  cadenaAntes: string = "";
  areas: any = [];
  lineasSel: any = [];
  mapasSel: any = [];
  operacionesSel: any = [];
  cVariables: any = [];
  respondido: number = 0;
  partesSel: any = [];
  maquinasSel: any = [];
  areasSel: any = [];
  plantasSel: any = [];
  fallasSel: any = [];
  opcionesSel: any = [];
  registrosSel: any = [];
  tipos: any = [];
  turnos: any = [];
  listas: any = [];
  tecnicos: any = [];
  usuarios: any = [];
  listados: any = [];
  agrupadores1: any = [];
  agrupadores2: any = [];
  arreImagenes: any = [];
  arreHover: any = [];

  seleccionMensaje = ["M", "C"];
  seleccionMensaje2 = ["M", "C"];
  seleccionescalar1 = ["C"];
  seleccionescalar2 = ["C"];
  seleccionescalar3 = ["C"];
  seleccionescalar4 = ["C"];
  seleccionescalar5 = ["C"];
  seleccionProcesos = [];

  notas: string = "";
  hoverp01: boolean = false;
  hoverp02: boolean = false;
  noLeer: boolean = false;
  operacioSel: boolean = false;
  maquinaSel: boolean = false;
  maquinaSel2: boolean = false;
  maquinaSel3: boolean = false;
  maquinaSel4: boolean = false;
  reparandoSel: boolean = false;
  texto_habilitado: boolean = false;
  abiertoSel: boolean = false;
  lineaSel: boolean = false;
  masivoSel: boolean = false;
  editando: boolean = false;
  faltaMensaje: string = "";
  responsableSel: boolean = false;
  fallaSel: boolean = false;
  rAlarmado: string = "N";
  horaReporte;
  mensajePadre: string = "";
  URL_BASE = "/robot/api/upload.php"
  URL_IMAGENES = "/robot/assets/imagenes/";
  mostrarDetalle: boolean = false;

  ayuda01 = this.servicio.rTraduccion()[1196]

  botonera1: number = 1;
  verParos: number = 1;
  verSubParos: number = 1;
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
  bot8: boolean = true;
  bot9: boolean = true;

  bot1Sel: boolean = false;
  bot2Sel: boolean = false;
  bot3Sel: boolean = false;
  bot4Sel: boolean = false;
  bot5Sel: boolean = false;
  bot6Sel: boolean = false;
  bot7Sel: boolean = false;
  bot8Sel: boolean = false;
  bot9Sel: boolean = false;

  iniciarSel: boolean = false;
  topeSel: boolean = false;

  boton11: boolean = true;
  boton12: boolean = true;
  boton13: boolean = false;
  yaValidado: number = -1;
  cantidadValidada: boolean = false;
  cantidadActual: number = 0;
  corteActual: number = 0;
  rateEquipo: number = 1;
  rateEquipoOriginal: number = 1;

  animando: boolean = true;
  listoMostrar: boolean = true;

  error01: boolean = false;
  error02: boolean = false;
  error03: boolean = false;
  error04: boolean = false;
  error05: boolean = false;
  error06: boolean = false;
  error07: boolean = false;
  error08: boolean = false;
  error09: boolean = false;
  error10: boolean = false;
  error20: boolean = false;
  error21: boolean = false;
  error22: boolean = false;
  error23: boolean = false;
  error24: boolean = false; 
  error25: boolean = false;
  error30: boolean = false;
  error31: boolean = false;
  error32: boolean = false;
  error33: boolean = false;
  error34: boolean = false;
  error35: boolean = false;
  error36: boolean = false;

  literalSingular: string = "";
  literalSingularArticulo: string = "";
  literalPlural: string = "";

  ayuda11: string = "[" + this.servicio.rTraduccion()[7] + "]"


  
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
        if (this.txtBuscar)
        {
          this.txtBuscar.nativeElement.focus();
        }
        
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
      this.modelo = this.modelo - 10;
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

  rRegistros(tabla: number)
  {
    this.seleccionado = 0;
    //this.verBuscar = tabla <= 4 || tabla==11;
    //this.cambioVista = tabla <= 4 || tabla==1;
    this.animando = false;
    this.visualizarImagen = false;
    this.despuesBusqueda = 0;
    this.copiandoDesde = 0;
    this.botonera1 = 1;
    this.registros = [];
    this.arrFiltrado = [];
    this.arreHover = [];
    this.arreImagenes = [];
    this.servicio.activarSpinner.emit(true);     
    this.servicio.activarSpinnerSmall.emit(true);     
    this.noLeer = false;  
    let mensajeSI = false
    //
    let sentencia: string  = "";
    if (tabla == 1)
    {
    /* this.nCatalogo = this.servicio.rTraduccion()[499]
    this.etiBuscar = this.servicio.rTraduccion()[1190];
    this.iconoGeneral = "i_lineas";
    sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_lineas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
    this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[1198] + "', '" + this.servicio.rTraduccion()[1199] + "', '" + this.servicio.rTraduccion()[1200] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, a.url_mmcall, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_lineas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.agrupador_1 = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.agrupador_2 = e.id ";
    this.tituloBuscar = this.servicio.rTraduccion()[48];
    this.literalSingular = this.servicio.rTraduccion()[30];
    this.literalPlural = this.servicio.rTraduccion()[31];
    this.literalSingularArticulo = this.servicio.rTraduccion()[32];
    this.mensajePadre = "";
 */    }
    else if (tabla == 2)
    {
      this.nCatalogo = this.servicio.rTraduccion()[35]
      this.etiBuscar = this.servicio.rTraduccion()[1280]
      this.iconoGeneral = "i_maquina";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nlinea, a.imagen FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.tipo = d.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[1201] + "', '" + this.servicio.rTraduccion()[655] + "', '" + this.servicio.rTraduccion()[3766] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, IFNULL(g.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.oee_umbral_produccion, IF(a.pieza = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales g ON a.tipo = g.id ";
      this.tituloBuscar = this.servicio.rTraduccion()[50];
      this.literalSingular = this.servicio.rTraduccion()[34];
      this.literalPlural = this.servicio.rTraduccion()[35];
      this.literalSingularArticulo = this.servicio.rTraduccion()[36];
      this.mensajePadre = "";
    }
    /* else if (tabla == 3)
    {
      this.nCatalogo = this.servicio.rTraduccion()[38]
      this.etiBuscar = this.servicio.rTraduccion()[1203];
      this.iconoGeneral = "i_responsable";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_areas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[1198] + "', '" + this.servicio.rTraduccion()[1199] + "', '" + this.servicio.rTraduccion()[1200] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, a.url_mmcall, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_areas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.agrupador_1 = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.agrupador_2 = e.id ";
      this.tituloBuscar = this.servicio.rTraduccion()[52];
      this.literalSingular = this.servicio.rTraduccion()[37];
      this.literalPlural = this.servicio.rTraduccion()[38];
      this.literalSingularArticulo = this.servicio.rTraduccion()[39];
      this.mensajePadre = ""; 
    
    else if (tabla == 28)
    {
      this.nCatalogo = this.servicio.rTraduccion()[516]
      this.etiBuscar = this.servicio.rTraduccion()[1204];
      this.iconoGeneral = "i_variables";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "') AS unidad, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ntipo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen, (SELECT COUNT(*) FROM " + this.servicio.rBD() + ".relacion_variables_equipos WHERE variable = a.id) AS tequipos, a.maquinas FROM " + this.servicio.rBD() + ".cat_variables a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.unidad = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.tipo = e.id ORDER BY a.nombre;";
        this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[1198] + "', '" + this.servicio.rTraduccion()[644] + "', '" + this.servicio.rTraduccion()[590] + "', '" + this.servicio.rTraduccion()[645] + "', '" + this.servicio.rTraduccion()[668] + "', '" + this.servicio.rTraduccion()[674] + "', '" + this.servicio.rTraduccion()[670] + "', '" + this.servicio.rTraduccion()[671] + "', '" + this.servicio.rTraduccion()[672] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, a.url_mmcall, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "'), CASE WHEN a.tipo_valor ='0' THEN '" + this.servicio.rTraduccion()[1052] + "' WHEN a.tipo_valor = '1' THEN '" + this.servicio.rTraduccion()[1074] + "' WHEN a.tipo_valor = '2' THEN '" + this.servicio.rTraduccion()[996] + "' WHEN a.tipo_valor = '3' THEN '" + this.servicio.rTraduccion()[1090] + "' END, IF(a.tipo_valor = '2', (SELECT GROUP_CONCAT(valor) FROM variables_valores WHERE variable = a.id), ''), IF(a.tipo_valor = '0', a.minimo, ''), IF(a.tipo_valor = '0', a.maximo, ''), IF(a.tipo_valor <> '2', a.por_defecto, ''), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_variables a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.unidad = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.tipo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_distribucion f ON a.recipiente = f.id ";
      this.tituloBuscar = this.servicio.rTraduccion()[1230]
      this.literalSingular = this.servicio.rTraduccion()[1267]
      this.literalPlural = this.servicio.rTraduccion()[516]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1248]
      this.mensajePadre = "";
    }
    else if (tabla == 29)
    {
      this.nCatalogo = "CHECKLISTS"
      this.etiBuscar = this.servicio.rTraduccion()[1275]
      this.iconoGeneral = "i_checklist";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(CONCAT(d.nombre, ' / ', f.nombre), '" + this.servicio.rTraduccion()[3399] + "') AS nequipo, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ndpto, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen, (SELECT COUNT(*) FROM " + this.servicio.rBD() + ".det_checklist WHERE checklist = a.id) AS tvariables FROM " + this.servicio.rBD() + ".cat_checklists a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas d ON a.equipo = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.tipo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas f ON d.linea = f.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[650] + "', '" + this.servicio.rTraduccion()[645] + "', '" + this.servicio.rTraduccion()[646] + "', '" + this.servicio.rTraduccion()[680] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "'), CONCAT(IFNULL(h.nombre, ''), ' / ', IFNULL(g.nombre, '" + this.servicio.rTraduccion()[1494] + "')), IF(a.variables = 'N', (SELECT GROUP_CONCAT('(', y.orden, ') ', z.nombre, ' ') FROM " + this.servicio.rBD() + ".det_checklist y LEFT JOIN " + this.servicio.rBD() + ".cat_variables z ON y.variable = z.id WHERE y.checklist = a.id ORDER BY y.orden), '" + this.servicio.rTraduccion()[3442] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_checklists a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.tipo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_distribucion f ON a.recipiente = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas g ON a.equipo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas h ON g.linea = h.id ";
      this.tituloBuscar = this.servicio.rTraduccion()[1214]
      this.literalSingular = this.servicio.rTraduccion()[1251]
      this.literalPlural = this.servicio.rTraduccion()[497]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1231]
      this.mensajePadre = "";
    }
    else if (tabla == 30)
    {
      this.nCatalogo = "PLANES"
      this.etiBuscar = this.servicio.rTraduccion()[1284]
      this.iconoGeneral = "i_plan";
      sentencia = "SELECT a.id, a.nombre, a.fecha, a.hora, a.frecuencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, CASE WHEN a.frecuencia ='0' THEN '" + this.servicio.rTraduccion()[1152] + "' WHEN a.frecuencia = 'T' THEN '" + this.servicio.rTraduccion()[1151] + "' WHEN a.frecuencia = 'UM' THEN '" + this.servicio.rTraduccion()[1135] + "' WHEN a.frecuencia = '1M' THEN '" + this.servicio.rTraduccion()[1134] + "' WHEN a.frecuencia = 'L' THEN '" + this.servicio.rTraduccion()[1120] + "' WHEN a.frecuencia = 'M' THEN '" + this.servicio.rTraduccion()[1121] + "' WHEN a.frecuencia = 'MI' THEN '" + this.servicio.rTraduccion()[1122] + "' WHEN a.frecuencia = 'J' THEN '" + this.servicio.rTraduccion()[1119] + "' WHEN a.frecuencia = 'V' THEN '" + this.servicio.rTraduccion()[1124] + "' WHEN a.frecuencia = 'S' THEN '" + this.servicio.rTraduccion()[1123] + "' WHEN a.frecuencia = 'D' THEN 'Los domingos' WHEN a.frecuencia = 'LV' THEN '" + this.servicio.rTraduccion()[1127] + "' END AS nfrecuencia, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".plan_checklists a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[637] + "', '" + this.servicio.rTraduccion()[638] + "', '" + this.servicio.rTraduccion()[639] + "', '" + this.servicio.rTraduccion()[640] + "', '" + this.servicio.rTraduccion()[641] + "', '" + this.servicio.rTraduccion()[642] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, IF(a.checklists = 'N', (SELECT GROUP_CONCAT(z.nombre, ' ') FROM " + this.servicio.rBD() + ".det_plan_checklists y LEFT JOIN " + this.servicio.rBD() + ".cat_checklists z ON y.checklist = z.id WHERE y.plan = a.id), '" + this.servicio.rTraduccion()[144] + "'), CASE WHEN a.frecuencia ='0' THEN '" + this.servicio.rTraduccion()[1152] + "' WHEN a.frecuencia = 'T' THEN '" + this.servicio.rTraduccion()[1151] + "' WHEN a.frecuencia = 'UM' THEN '" + this.servicio.rTraduccion()[1135] + "' WHEN a.frecuencia = '1M' THEN '" + this.servicio.rTraduccion()[1134] + "' WHEN a.frecuencia = 'L' THEN '" + this.servicio.rTraduccion()[1120] + "' WHEN a.frecuencia = 'M' THEN '" + this.servicio.rTraduccion()[1121] + "' WHEN a.frecuencia = 'MI' THEN '" + this.servicio.rTraduccion()[1122] + "' WHEN a.frecuencia = 'J' THEN '" + this.servicio.rTraduccion()[1119] + "' WHEN a.frecuencia = 'V' THEN '" + this.servicio.rTraduccion()[1124] + "' WHEN a.frecuencia = 'S' THEN '" + this.servicio.rTraduccion()[1123] + "' WHEN a.frecuencia = 'D' THEN 'Los domingos' WHEN a.frecuencia = 'LV' THEN '" + this.servicio.rTraduccion()[1127] + "' END, IF(a.frecuencia ='0', a.fecha, ''), a.hora, IF(a.anticipacion = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), a.tiempo, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".plan_checklists a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ";
      
      this.tituloBuscar = this.servicio.rTraduccion()[1221]
      this.literalSingular = this.servicio.rTraduccion()[1256]
      this.literalPlural = this.servicio.rTraduccion()[1270]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1238]
      this.mensajePadre = "";
    }
    else if (tabla == 31)
    {
      this.nCatalogo = "CHECKLISTS"
      this.etiBuscar = this.servicio.rTraduccion()[1284]
      this.iconoGeneral = "i_checklist";
      sentencia = "SELECT a.id, d.nombre, IFNULL(CONCAT(e.nombre, ' / ', f.nombre), '" + this.servicio.rTraduccion()[3399] + "') AS nequipo, a.vence, a.estado, a.frecuencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, CASE WHEN a.frecuencia ='0' THEN '" + this.servicio.rTraduccion()[1152] + "' WHEN a.frecuencia = 'T' THEN '" + this.servicio.rTraduccion()[1151] + "' WHEN a.frecuencia = 'UM' THEN '" + this.servicio.rTraduccion()[1135] + "' WHEN a.frecuencia = '1M' THEN '" + this.servicio.rTraduccion()[1134] + "' WHEN a.frecuencia = 'L' THEN '" + this.servicio.rTraduccion()[1120] + "' WHEN a.frecuencia = 'M' THEN '" + this.servicio.rTraduccion()[1121] + "' WHEN a.frecuencia = 'MI' THEN '" + this.servicio.rTraduccion()[1122] + "' WHEN a.frecuencia = 'J' THEN '" + this.servicio.rTraduccion()[1119] + "' WHEN a.frecuencia = 'V' THEN '" + this.servicio.rTraduccion()[1124] + "' WHEN a.frecuencia = 'S' THEN '" + this.servicio.rTraduccion()[1123] + "' WHEN a.frecuencia = 'D' THEN 'Los domingos' WHEN a.frecuencia = 'LV' THEN '" + this.servicio.rTraduccion()[1127] + "' END AS nfrecuencia, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, d.imagen FROM " + this.servicio.rBD() + ".checkeje_cab a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_checklists d ON a.checklist = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas e ON d.equipo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas f ON e.linea = f.id ORDER BY a.id DESC;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[637] + "', '" + this.servicio.rTraduccion()[638] + "', '" + this.servicio.rTraduccion()[639] + "', '" + this.servicio.rTraduccion()[640] + "', '" + this.servicio.rTraduccion()[641] + "', '" + this.servicio.rTraduccion()[642] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, IF(a.checklists = 'N', (SELECT GROUP_CONCAT(z.nombre, ' ') FROM " + this.servicio.rBD() + ".det_plan_checklists y LEFT JOIN " + this.servicio.rBD() + ".cat_checklists z ON y.checklist = z.id WHERE y.plan = a.id), '" + this.servicio.rTraduccion()[144] + "'), CASE WHEN a.frecuencia ='0' THEN '" + this.servicio.rTraduccion()[1152] + "' WHEN a.frecuencia = 'T' THEN '" + this.servicio.rTraduccion()[1151] + "' WHEN a.frecuencia = 'UM' THEN '" + this.servicio.rTraduccion()[1135] + "' WHEN a.frecuencia = '1M' THEN '" + this.servicio.rTraduccion()[1134] + "' WHEN a.frecuencia = 'L' THEN '" + this.servicio.rTraduccion()[1120] + "' WHEN a.frecuencia = 'M' THEN '" + this.servicio.rTraduccion()[1121] + "' WHEN a.frecuencia = 'MI' THEN '" + this.servicio.rTraduccion()[1122] + "' WHEN a.frecuencia = 'J' THEN '" + this.servicio.rTraduccion()[1119] + "' WHEN a.frecuencia = 'V' THEN '" + this.servicio.rTraduccion()[1124] + "' WHEN a.frecuencia = 'S' THEN '" + this.servicio.rTraduccion()[1123] + "' WHEN a.frecuencia = 'D' THEN 'Los domingos' WHEN a.frecuencia = 'LV' THEN '" + this.servicio.rTraduccion()[1127] + "' END, IF(a.frecuencia ='0', a.fecha, ''), a.hora, IF(a.anticipacion = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), a.tiempo, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".plan_checklists a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ";
      
      this.tituloBuscar = this.servicio.rTraduccion()[1214]
      this.literalSingular = this.servicio.rTraduccion()[1251]
      this.literalPlural = this.servicio.rTraduccion()[497]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1231]
      this.mensajePadre = "";
    }
    else if (tabla == 4)
    {
      this.nCatalogo = this.servicio.rTraduccion()[41]
      this.etiBuscar = this.servicio.rTraduccion()[1278]
      this.iconoGeneral = "i_falla";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_fallas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[1198] + "', '" + this.servicio.rTraduccion()[1199] + "', '" + this.servicio.rTraduccion()[1200] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, a.url_mmcall, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_fallas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.agrupador_1 = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.agrupador_2 = e.id LEFT JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones i ON a.id = i.falla LEFT JOIN " + this.servicio.rBD() + ".cat_lineas f ON i.proceso = f.id AND i.tipo = 1 LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas g ON i.proceso = g.id AND i.tipo = 2  LEFT JOIN " + this.servicio.rBD() + ".cat_areas h ON i.proceso = h.id AND i.tipo = 3";

      this.sentenciaR2 = "SELECT * FROM (SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[1373] + "', '" + this.servicio.rTraduccion()[1374] + "', '" + this.servicio.rTraduccion()[1375] + "', '" + this.servicio.rTraduccion()[149] + "', '" + this.servicio.rTraduccion()[1376] + "', '" + this.servicio.rTraduccion()[1377] + "', '" + this.servicio.rTraduccion()[1378] + "', '" + this.servicio.rTraduccion()[1379] + "', '" + this.servicio.rTraduccion()[1380] + "' UNION SELECT a.id, a.nombre, IF(a.linea = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), IF(a.maquina = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), IF(a.AREA = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(f.id, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(g.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(g.id, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(h.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(h.id, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_fallas a LEFT JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones i ON a.id = i.falla LEFT JOIN " + this.servicio.rBD() + ".cat_lineas f ON i.proceso = f.id AND i.tipo = 1 LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas g ON i.proceso = g.id AND i.tipo = 2 LEFT JOIN " + this.servicio.rBD() + ".cat_areas h ON i.proceso = h.id AND i.tipo = 3 ORDER BY 1 DESC, 2, 3, 4, 5) AS qry ";


      this.tituloBuscar = this.servicio.rTraduccion()[54];
      this.literalSingular = this.servicio.rTraduccion()[40];
      this.literalPlural = this.servicio.rTraduccion()[41];
      this.literalSingularArticulo = this.servicio.rTraduccion()[42];
      this.mensajePadre = "";
    }}*/
    else if (tabla == 5)
    {
      this.nCatalogo = "GENERALES"
      this.etiBuscar = this.servicio.rTraduccion()[1289]
      this.iconoGeneral = "i_general";
      sentencia = "SELECT a.id, a.nombre, d.nombre AS ntabla, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".tablas d ON a.tabla = d.id AND d.idioma = " + this.servicio.rIdioma().id + " ORDER BY a.nombre";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[1293] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, d.nombre, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".tablas d ON a.tabla = d.id AND d.idioma = " + this.servicio.rIdioma().id;
      this.tituloBuscar = this.servicio.rTraduccion()[1217]
      this.literalSingular = this.servicio.rTraduccion()[1260]
      this.literalPlural = this.servicio.rTraduccion()[1271]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      this.mensajePadre = "";
      let filtroTabla = "WHERE idioma = " + this.servicio.rIdioma().id;
      if (this.servicio.rVersion().modulos[5] == 0)
      {
        filtroTabla = filtroTabla + " AND id <> 105 "
      }
      if (this.servicio.rVersion().modulos[6] == 0)
      {
        filtroTabla = filtroTabla + " AND id NOT IN (110, 115, 120) "
      }
      if (this.servicio.rVersion().modulos[3] == 0)
      {
        filtroTabla = filtroTabla + " AND id <> 100 "
      }
      if (this.servicio.rVersion().modulos[10] == 0)
      {
        filtroTabla = filtroTabla + " AND id NOT IN (140, 145) "
      }
      this.llenarListas(7, this.servicio.rBD() + ".tablas", filtroTabla);
    }
    else if (tabla == 6)
    {
      this.nCatalogo = "RECIPIENTES"
      this.etiBuscar = this.servicio.rTraduccion()[1288]
      this.iconoGeneral = "i_recipiente";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1294] + "', '" + this.servicio.rTraduccion()[1295] + "', '" + this.servicio.rTraduccion()[1296] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.telefonos, a.correos, a.mmcall, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id  ";
      this.tituloBuscar = this.servicio.rTraduccion()[1225]
      this.literalSingular = this.servicio.rTraduccion()[1259]
      this.literalPlural = this.servicio.rTraduccion()[522]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      this.mensajePadre = "";
    }
    else if (tabla == 7)
    {
      this.nCatalogo = "CORREOS/REPORTE"
      this.etiBuscar = this.servicio.rTraduccion()[1276]
      this.iconoGeneral = "i_correos";
      sentencia = "SELECT a.id, a.nombre, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_correos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_correos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ";
      this.tituloBuscar = this.servicio.rTraduccion()[1226]
      this.literalSingular = this.servicio.rTraduccion()[44];
      this.literalPlural = this.servicio.rTraduccion()[45];
      this.literalSingularArticulo = this.servicio.rTraduccion()[46];
      this.mensajePadre = "";
    }
    else if (tabla == 8)
    {
      this.bot9 = true
      this.nCatalogo = "ALERTAS"
      this.iconoGeneral = "i_alertas";
      this.etiBuscar = this.servicio.rTraduccion()[1274]
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_alertas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1297] + "', '" + this.servicio.rTraduccion()[1298] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.transcurrido, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_alertas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".int_eventos d ON a.evento = d.alerta  AND d.idioma = " + this.servicio.rIdioma().id;
      this.tituloBuscar = this.servicio.rTraduccion()[1213]
      this.literalSingular = this.servicio.rTraduccion()[1264]
      this.literalPlural = this.servicio.rTraduccion()[523]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1231]
      this.mensajePadre = "";
    }
    else if (tabla == 9)
    {
      this.nCatalogo = "TURNOS"
      this.iconoGeneral = "i_turnos";
      this.etiBuscar = this.servicio.rTraduccion()[1291]
      sentencia = "SELECT a.id, a.nombre, a.inicia, a.termina, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_turnos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1299] + "', '" + this.servicio.rTraduccion()[1300] + "','" + this.servicio.rTraduccion()[1302] + "', '" + this.servicio.rTraduccion()[1303] + "', '" + this.servicio.rTraduccion()[1304] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.inicia, a.termina, CASE WHEN a.tipo = 0 THEN '" + this.servicio.rTraduccion()[1009] + "' WHEN a.tipo = 1 THEN '" + this.servicio.rTraduccion()[1028] + "' WHEN a.tipo = 2 THEN '" + this.servicio.rTraduccion()[1037] + "' WHEN a.tipo = 3 THEN '" + this.servicio.rTraduccion()[1029] + "' END, IF(a.cambiodia = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), CASE WHEN a.mover = 0 THEN '" + this.servicio.rTraduccion()[1035] + "' WHEN a.mover = 1 THEN '" + this.servicio.rTraduccion()[1061] + "' WHEN a.mover = 2 THEN '" + this.servicio.rTraduccion()[1077] + "' END, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_turnos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id  ";
      this.tituloBuscar = this.servicio.rTraduccion()[1228]
      this.literalSingular = this.servicio.rTraduccion()[1262]
      this.literalPlural = this.servicio.rTraduccion()[519]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      this.mensajePadre = "";
    }
    else if (tabla == 10)
    {
      this.nCatalogo = "FRASES"
      this.iconoGeneral = "i_traductor";
      this.etiBuscar = this.servicio.rTraduccion()[1279]
      sentencia = "SELECT a.id, a.literal, a.traduccion FROM " + this.servicio.rBD() + ".traduccion a ORDER BY a.literal;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[565] + "', '" + this.servicio.rTraduccion()[1330] + "' UNION SELECT a.id, a.literal, a.traduccion FROM " + this.servicio.rBD() + ".traduccion ";
      this.tituloBuscar = this.servicio.rTraduccion()[1216]
      this.literalSingular = this.servicio.rTraduccion()[1265]
      this.literalPlural = this.servicio.rTraduccion()[1268]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1246]
      this.mensajePadre = "";
    }
    else if (tabla == 12)
    {
      this.nCatalogo = "USUARIOS"
      this.etiBuscar = this.servicio.rTraduccion()[1292]
      this.iconoGeneral = "i_grupos";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1328] + "', '" + this.servicio.rTraduccion()[1331] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[704] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[1329] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, IFNULL(g.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.referencia, a.notas, a.imagen, CASE WHEN a.rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN a.rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN a.rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN a.rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN a.rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN a.rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.compania = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.departamento = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales f ON a.planta = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales h ON a.cargo = h.id LEFT JOIN " + this.servicio.rBD() + ".politicas g ON a.politica = g.id    ";
      this.tituloBuscar = this.servicio.rTraduccion()[1229]
      this.literalSingular = this.servicio.rTraduccion()[1263]
      this.literalPlural = this.servicio.rTraduccion()[1273]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      this.mensajePadre = "";
    }
    else if (tabla == 14)
    {
      this.nCatalogo = "POLÍTICAS"
      this.etiBuscar = this.servicio.rTraduccion()[1285]
      this.iconoGeneral = "i_politicas";
      sentencia = "SELECT a.id, a.nombre, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".politicas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[1335] + "', '" + this.servicio.rTraduccion()[1336] + "', '" + this.servicio.rTraduccion()[1337] + "', '" + this.servicio.rTraduccion()[1338] + "', '" + this.servicio.rTraduccion()[1339] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, IF(a.deunsolouso = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), IF(a.obligatoria = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), IF(a.vence = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), a.diasvencimiento, a.aviso, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".politicas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id  ";
      this.tituloBuscar = this.servicio.rTraduccion()[1222]
      this.literalSingular = this.servicio.rTraduccion()[1266]
      this.literalPlural = this.servicio.rTraduccion()[529]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1248]
      this.mensajePadre = "";
    }
    else if (tabla == 17)
    {
      this.nCatalogo = "RATES"
      this.etiBuscar = this.servicio.rTraduccion()[1286]
      this.nCatalogo = "RATES"
      this.etiBuscar = this.servicio.rTraduccion()[1286]
      this.iconoGeneral = this.icoVista17=="i_maquina" ? "i_rates" : "i_maquina";
      if (this.vista17 == 0)
      {
        sentencia = "SELECT a.*, b.referencia, CASE WHEN a.tiempo = 0 THEN '" + this.servicio.rTraduccion()[1394] + "' WHEN a.tiempo = 1 THEN '" + this.servicio.rTraduccion()[1395] + "' WHEN a.tiempo = 2 THEN '" + this.servicio.rTraduccion()[1396] + "' WHEN a.tiempo = 3 THEN '" + this.servicio.rTraduccion()[1397] + "' END AS tiempo, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[325] + "') AS nombre, IFNULL(CONCAT(c.nombre, ' / ', d.nombre), '" + this.servicio.rTraduccion()[3399] + "') AS nequipo, d.nombre AS nlinea FROM " + this.servicio.rBD() + ".relacion_partes_equipos a LEFT JOIN " + this.servicio.rBD() + ".cat_partes b ON a.parte = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.equipo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas d ON c.linea = d.id ORDER BY b.nombre;";
      }
      else
      {
        sentencia = "SELECT piezas, unidad, IFNULL(CONCAT(b.nombre, ' / ', c.nombre), '" + this.servicio.rTraduccion()[3399] + "') AS nequipo, COUNT(DISTINCT(parte)) AS partes, CASE WHEN tiempo = 0 THEN '" + this.servicio.rTraduccion()[1394] + "' WHEN tiempo = 1 THEN '" + this.servicio.rTraduccion()[1395] + "' WHEN tiempo = 2 THEN '" + this.servicio.rTraduccion()[1396] + "' WHEN tiempo = 3 THEN '" + this.servicio.rTraduccion()[1397] + "' END AS tiempo FROM " + this.servicio.rBD() + ".relacion_partes_equipos a LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas b ON a.equipo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON b.linea = c.id GROUP BY a.piezas, a.unidad, nequipo ORDER BY piezas;";
      }
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[728] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1340] + "', '" + this.servicio.rTraduccion()[1341] + "', '" + this.servicio.rTraduccion()[1342] + "', '" + this.servicio.rTraduccion()[1343] + "', '" + this.servicio.rTraduccion()[1344] + "', '" + this.servicio.rTraduccion()[1345] + "', '" + this.servicio.rTraduccion()[1346] + "', '" + this.servicio.rTraduccion()[644] + "', '" + this.servicio.rTraduccion()[1347] + "', '" + this.servicio.rTraduccion()[1348] + "' UNION SELECT IFNULL(b.nombre, '" + this.servicio.rTraduccion()[614] + "'), IFNULL(b.referencia, '" + this.servicio.rTraduccion()[614] + "'), a.parte, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[3399] + "'), IFNULL(d.nombre, '" + this.servicio.rTraduccion()[3548] + "'), a.equipo, c.linea, a.piezas, CASE WHEN a.tiempo = 0 THEN '" + this.servicio.rTraduccion()[1394] + "' WHEN a.tiempo = 1 THEN '" + this.servicio.rTraduccion()[1395] + "' WHEN a.tiempo = 2 THEN '" + this.servicio.rTraduccion()[1396] + "' WHEN a.tiempo = 3 THEN '" + this.servicio.rTraduccion()[1397] + "' END, a.unidad, a.bajo, a.alto FROM " + this.servicio.rBD() + ".relacion_partes_equipos a LEFT JOIN " + this.servicio.rBD() + ".cat_partes b ON a.parte = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.equipo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas d ON c.linea = d.id  ";
      this.tituloBuscar = this.servicio.rTraduccion()[1223]
      this.literalSingular = this.servicio.rTraduccion()[1257]
      this.literalPlural = this.servicio.rTraduccion()[513]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      this.mensajePadre = "";
    }
    else if (tabla == 18)
    {
      this.nCatalogo = "OBJETIVOS"
      this.etiBuscar = this.servicio.rTraduccion()[1281]
      this.iconoGeneral = "i_objetivos";

      sentencia = "SELECT a.*, b.referencia, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[325] + "') AS nombre, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[3399] + "') AS nequipo, e.numero, IFNULL(f.nombre, '" + this.servicio.rTraduccion()[1494] + "') AS nturno, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus FROM " + this.servicio.rBD() + ".equipos_objetivo a LEFT JOIN " + this.servicio.rBD() + ".cat_partes b ON a.parte = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.equipo = c.id LEFT JOIN " + this.servicio.rBD() + ".lotes e ON a.lote = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_turnos f ON a.turno = f.id ORDER BY b.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[2099] + "', '" + this.servicio.rTraduccion()[728] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1341] + "', '" + this.servicio.rTraduccion()[1350] + "', '" + this.servicio.rTraduccion()[1340] + "', '" + this.servicio.rTraduccion()[1343] + "', '" + this.servicio.rTraduccion()[1351] + "', '" + this.servicio.rTraduccion()[3748] + "', '" + this.servicio.rTraduccion()[3749] + "', '" + this.servicio.rTraduccion()[3750] + "', '" + this.servicio.rTraduccion()[153] + "' UNION SELECT IFNULL(e.numero, '" + this.servicio.rTraduccion()[1494] + "'), IFNULL(b.nombre, '" + this.servicio.rTraduccion()[614] + "'), IFNULL(b.referencia, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[3399] + "'), IFNULL(f.nombre, '" + this.servicio.rTraduccion()[1494] + "'), a.parte, a.equipo, a.turno, a.objetivo, a.sacos, a.tarimas, a.van FROM " + this.servicio.rBD() + ".equipos_objetivo a LEFT JOIN " + this.servicio.rBD() + ".cat_partes b ON a.parte = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.equipo = c.id LEFT JOIN " + this.servicio.rBD() + ".lotes e ON a.lote = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_turnos f ON a.turno = f.id ";
      this.tituloBuscar = this.servicio.rTraduccion()[1218]
      this.literalSingular = this.servicio.rTraduccion()[1254]
      this.literalPlural = this.servicio.rTraduccion()[514]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      this.mensajePadre = "";
    }
    /*else if (tabla == 19)
    {
      this.nCatalogo = "ESTIMADOS"
      this.etiBuscar = this.servicio.rTraduccion()[1277]
      this.iconoGeneral = "i_estimados";
      sentencia = "SELECT a.*, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[3399] + "') AS nequipo, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[3548] + "') AS nlinea FROM " + this.servicio.rBD() + ".estimados a LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.equipo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas d ON a.linea = d.id ORDER BY c.nombre;";
      this.sentenciaR = "SELECT 'Equipo/Máquina', '" + this.servicio.rTraduccion()[1342] + "', '" + this.servicio.rTraduccion()[1343] + "', '" + this.servicio.rTraduccion()[1344] + "', '" + this.servicio.rTraduccion()[536] + "', '" + this.servicio.rTraduccion()[575] + "', '" + this.servicio.rTraduccion()[576] + "', '" + this.servicio.rTraduccion()[577] + "' UNION SELECT IFNULL(c.nombre, '" + this.servicio.rTraduccion()[3399] + "'), IFNULL(d.nombre, '" + this.servicio.rTraduccion()[3548] + "'), a.equipo, c.linea, a.oee, a.efi, a.ftq, a.dis FROM " + this.servicio.rBD() + ".estimados a LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.equipo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas d ON a.linea = d.id ";
      this.tituloBuscar = this.servicio.rTraduccion()[1215]
      this.literalSingular = this.servicio.rTraduccion()[1252]
      this.literalPlural = this.servicio.rTraduccion()[515]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      this.mensajePadre = "";
    }*/
    else if (tabla == 20)
    {
      this.nCatalogo = "SENSORES"
      this.etiBuscar = this.servicio.rTraduccion()[1290]
      this.iconoGeneral = "i_sensor";
      sentencia = "SELECT a.*, CASE WHEN a.tipo = '0' THEN '" + this.servicio.rTraduccion()[1146] + "' WHEN a.tipo = '1' THEN '" + this.servicio.rTraduccion()[3348] + "' WHEN a.tipo = '2' THEN '" + this.servicio.rTraduccion()[3765] + "' WHEN a.tipo = '3' THEN '" + this.servicio.rTraduccion()[1117] + "' WHEN a.tipo = '4' THEN '" + this.servicio.rTraduccion()[1147] + "' END AS ntipo, d.nombre AS nequipo, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".relacion_procesos_sensores a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas d ON a.equipo = d.id ORDER BY nequipo, a.sensor;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[744] + "', '" + this.servicio.rTraduccion()[1341] + "', '" + this.servicio.rTraduccion()[1343] + "', '" + this.servicio.rTraduccion()[743] + "', '" + this.servicio.rTraduccion()[580] + "', '" + this.servicio.rTraduccion()[581] + "', '" + this.servicio.rTraduccion()[3763] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.sensor, d.nombre, a.equipo, CASE WHEN a.tipo = '0' THEN '" + this.servicio.rTraduccion()[1146] + "' WHEN a.tipo = '1' THEN '" + this.servicio.rTraduccion()[3348] + "' WHEN a.tipo = '2' THEN '" + this.servicio.rTraduccion()[3765] + "' WHEN a.tipo = '3' THEN '" + this.servicio.rTraduccion()[1117] + "' WHEN a.tipo = '4' THEN '" + this.servicio.rTraduccion()[1147] + "' END AS ntipo, a.multiplicador, a.base, IF(a.kg_saco_parte = 'S', '" + this.servicio.rTraduccion()[352] + "', '" + this.servicio.rTraduccion()[353] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".relacion_procesos_sensores a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas d ON a.equipo = d.id  ";
      this.tituloBuscar = this.servicio.rTraduccion()[1227]
      this.literalSingular = this.servicio.rTraduccion()[1261]
      this.literalPlural = this.servicio.rTraduccion()[1272]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      this.mensajePadre = "";
    }
    /* else if (tabla == 21)
    {
      if (this.servicio.rFParo().mes ==0)
      {
        this.servicio.aFParo({mes: this.servicio.fecha(1, "", "MM"), ano: this.servicio.fecha(1, "", "yyyy"), concepto: -1, clase: "-1", area: 0, cadena: "" });
        ;
      }
      mensajeSI = this.servicio.rFParo().concepto == -1;
      if (this.primeraVez)
      {
        this.primeraVez = false;
        this.filtrarParo();
        return;
      }
      this.nCatalogo = "PAROS"
      this.etiBuscar = this.servicio.rTraduccion()[1282]
      this.iconoGeneral = "i_paro";
      
      let uDia = new Date(+this.servicio.rFParo().ano, this.servicio.rFParo().mes, 0).getDate();
     
      let cadWhere = "WHERE a.fecha >= '" + this.servicio.rFParo().ano + "/" + this.servicio.rFParo().mes + "/01' AND a.fecha <= '" + this.servicio.rFParo().ano + "/" + this.servicio.rFParo().mes + "/" + uDia + "' ";
      let cadWhere2 = "";
      if (this.servicio.rFParo().clase != -1)
      {
        cadWhere = cadWhere + " AND a.clase = " + this.servicio.rFParo().clase; 
      }
      if (this.servicio.rFParo().concepto == -1)
      {
        cadWhere = cadWhere + " AND a.tipo = 0 "; 
      }
      else if (this.servicio.rFParo().concepto != 0)
      {
        cadWhere = cadWhere + " AND a.tipo = " + this.servicio.rFParo().concepto;
      }
      if (this.servicio.rFParo().area == -1)
      {
        cadWhere = cadWhere + " AND a.area = 0 "; 
      }
      else if (this.servicio.rFParo().area != 0)
      {
        cadWhere = cadWhere + " AND a.area = " + this.servicio.rFParo().area;
      }
      if (this.servicio.rFParo().cadena)
      {
        cadWhere = cadWhere + " AND a.paro LIKE '%" + this.servicio.rFParo().cadena + "%' "; 
      }
      
      sentencia = "SELECT a.*, a.paro AS nombre, CASE WHEN a.estado = 'P' THEN '" + this.servicio.rTraduccion()[1205] + "' WHEN a.estado = 'L' THEN '" + this.servicio.rTraduccion()[1206] + "' WHEN a.estado = 'C' THEN '" + this.servicio.rTraduccion()[1207] + "' WHEN a.estado = 'F' THEN '" + this.servicio.rTraduccion()[1208] + "' END AS estado, a.estado AS miEstado, a.desde, a.hasta, SEC_TO_TIME(tiempo) AS totalt, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[1209] + "') AS narea, IF(ISNULL(e.nombre), c.nombre, CONCAT(c.nombre, ' / ',  e.nombre)) AS nequipo, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[1210] + "') AS ntipo FROM " + this.servicio.rBD() + ".detalleparos a LEFT JOIN " + this.servicio.rBD() + ".cat_areas b ON a.area = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.maquina = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas e ON c.linea = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.tipo = d.id " + cadWhere + " ORDER BY a.desde DESC;";

      this.sentenciaR = "SELECT * FROM (SELECT '" + this.servicio.rTraduccion()[1211] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[1212] + "', '" + this.servicio.rTraduccion()[572] + "', '" + this.servicio.rTraduccion()[1354] + "', '" + this.servicio.rTraduccion()[1355] + "', '" + this.servicio.rTraduccion()[1356] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1357] + "', '" + this.servicio.rTraduccion()[1358] + "', '" + this.servicio.rTraduccion()[1359] + "', '" + this.servicio.rTraduccion()[1360] + "', '" + this.servicio.rTraduccion()[1361] + "', '" + this.servicio.rTraduccion()[1362] + "', '" + this.servicio.rTraduccion()[1363] + "', '" + this.servicio.rTraduccion()[1364] + "', '" + this.servicio.rTraduccion()[1365] + "', '" + this.servicio.rTraduccion()[1366] + "', '" + this.servicio.rTraduccion()[1367] + "', '" + this.servicio.rTraduccion()[1368] + "', '" + this.servicio.rTraduccion()[1369] + "', '" + this.servicio.rTraduccion()[1370] + "', '" + this.servicio.rTraduccion()[1371] + "', '" + this.servicio.rTraduccion()[1372] + "' UNION (SELECT a.id, a.paro, a.fecha, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(i.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(i.referencia, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(j.numero, '" + this.servicio.rTraduccion()[8] + "'), a.reporte, CASE WHEN a.clase = 0 THEN '" + this.servicio.rTraduccion()[303] + "' WHEN a.clase = 1 THEN '" + this.servicio.rTraduccion()[304] + "' WHEN a.clase = 2 THEN '" + this.servicio.rTraduccion()[305] + "' WHEN a.clase = 3 THEN '" + this.servicio.rTraduccion()[306] + "' END, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "'), CASE WHEN a.estado = 'P' THEN '" + this.servicio.rTraduccion()[1205] + "' WHEN a.estado = 'L' THEN '" + this.servicio.rTraduccion()[1206] + "' WHEN a.estado = 'C' THEN '" + this.servicio.rTraduccion()[1207] + "' WHEN a.estado = 'F' THEN '" + this.servicio.rTraduccion()[1208] + "' END, a.desde, a.hasta, a.inicia, a.finaliza, IF(a.tiempo = 0, TIME_TO_SEC(TIMEDIFF(NOW(), a.inicia)), a.tiempo), CASE WHEN a.finalizo_accion = 'P' THEN '" + this.servicio.rTraduccion()[3409] + "' WHEN a.finalizo_accion = 'T' THEN '" + this.servicio.rTraduccion()[3410] + "' WHEN a.finalizo_accion = 'M' THEN '" + this.servicio.rTraduccion()[3411] + "' WHEN a.finalizo_accion = 'R' THEN '" + this.servicio.rTraduccion()[3412] + "' WHEN a.finalizo_accion = 'O' THEN '" + this.servicio.rTraduccion()[3413] + "' END, IFNULL(g.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(h.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.notas, a.resultados FROM " + this.servicio.rBD() + ".detalleparos a LEFT JOIN " + this.servicio.rBD() + ".cat_turnos b ON a.turno = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON a.maquina = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas d ON c.linea = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.tipo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_areas f ON a.area = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios g ON a.inicio = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios h ON a.finalizo = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_partes i ON a.parte = i.id LEFT JOIN " + this.servicio.rBD() + ".lotes j ON a.lote = j.id " + cadWhere + ")) AS a ORDER BY 1 DESC";
      

      this.tituloBuscar = this.servicio.rTraduccion()[1219]
      this.literalSingular = this.servicio.rTraduccion()[1255]
      this.literalPlural = this.servicio.rTraduccion()[493]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      this.mensajePadre = "";
    }
    else if (tabla == 27)
    {
      this.nCatalogo = "RECHAZOS"
      this.etiBuscar = this.servicio.rTraduccion()[1287]
      this.iconoGeneral = "i_rechazo";

      if (this.servicio.rFRechazo().mes == 0)
      {
        this.servicio.aFRechazo({mes: this.servicio.fecha(1, "", "MM"), ano: this.servicio.fecha(1, "", "yyyy"), clasificacion: "-1", producto: "-1", maquina: "-1" });
      }
      mensajeSI = this.servicio.rFRechazo().clasificacion == -1;
      let cadWhere = "";
      let cadWhere2 = "";
      if (this.servicio.rFRechazo().producto != -1)
      {
        cadWhere = cadWhere + " AND a.parte = " + this.servicio.rFRechazo().producto; 
        cadWhere2 = cadWhere2 + " AND a.parte = " + this.servicio.rFRechazo().producto; 
      }
      if (this.servicio.rFRechazo().clasificacion > 0)
      {
        cadWhere = cadWhere + " AND a.tipo = " + this.servicio.rFRechazo().clasificacion; 
      }
      
      if (this.servicio.rFRechazo().maquina != -1)
      {
        cadWhere = cadWhere + " AND a.equipo = " + this.servicio.rFRechazo().maquina; 
        cadWhere2 = cadWhere2 + " AND a.equipo = " + this.servicio.rFRechazo().maquina;
      }
      let uDia = new Date(+this.servicio.rFRechazo().ano, this.servicio.rFRechazo().mes, 0).getDate();
      sentencia = "SELECT * FROM (SELECT a.tipo, a.id, a.corte, a.cantidad, a.fecha, a.origen, a.rechazo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[1209] + "') AS narea, IF(ISNULL(e.nombre), d.nombre, CONCAT(d.nombre, ' / ',  e.nombre)) AS nequipo, IFNULL(f.nombre, '" + this.servicio.rTraduccion()[320] + "') AS ntipo FROM " + this.servicio.rBD() + ".detallerechazos a INNER JOIN " + this.servicio.rBD() + ".lecturas_cortes b ON a.corte = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_areas c ON a.area = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas d ON a.equipo = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas e ON d.linea = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales f ON a.tipo = f.id WHERE a.fecha >= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/01' AND a.fecha <= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/" + uDia + "' " + cadWhere + ") AS q1 "
      if (this.servicio.rFRechazo().clasificacion == -1)
      {
        sentencia = sentencia + " UNION ALL SELECT 0 AS tipo, a.id, a.id AS corte, a.calidad - a.calidad_clasificada AS cantidad, a.dia AS fecha, 0 AS origen, '" + this.servicio.rTraduccion()[8] + "' AS rechazo, '" + this.servicio.rTraduccion()[1209] + "' AS narea, IF(ISNULL(e.nombre), d.nombre, CONCAT(d.nombre, ' / ',  e.nombre)) AS nequipo, '" + this.servicio.rTraduccion()[1210] + "' AS ntipo FROM " + this.servicio.rBD() + ".lecturas_cortes a LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas d ON a.equipo = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas e ON d.linea = e.id WHERE a.calidad - a.calidad_clasificada > 0 AND a.dia >= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/01' AND a.dia <= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/" + uDia + "' " + cadWhere2 + " "
      }
      if (this.servicio.rFRechazo().clasificacion == 0)
      {
        sentencia = "SELECT 0 AS tipo, a.id, a.id AS corte, a.calidad - a.calidad_clasificada AS cantidad, a.dia AS fecha, 0 AS origen, '" + this.servicio.rTraduccion()[8] + "' AS rechazo, '" + this.servicio.rTraduccion()[1209] + "' AS narea, IF(ISNULL(e.nombre), d.nombre, CONCAT(d.nombre, ' / ',  e.nombre)) AS nequipo, '" + this.servicio.rTraduccion()[320] + "' AS ntipo FROM " + this.servicio.rBD() + ".lecturas_cortes a LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas d ON a.equipo = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas e ON d.linea = e.id WHERE a.calidad - a.calidad_clasificada > 0 AND a.dia >= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/01' AND a.dia <= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/" + uDia + "' " + cadWhere2 + " "
      }
      sentencia = sentencia + "ORDER BY 5, 6;";

      this.sentenciaR = "SELECT a.id, a.corte, a.fecha, a.cantidad, a.rechazo, a.notas, c.nombre, a.area, d.nombre AS n2, a.equipo, e.nombre AS n3, d.linea, f.nombre AS n4, a.tipo, g.nombre AS n5, a.parte, h.nombre AS n6, a.turno, i.numero, a.lote, a.actualizacion, j.nombre AS n7, a.usuario FROM (SELECT a.tipo, a.id, a.corte, a.cantidad, a.fecha, a.origen, a.rechazo, a.area, a.equipo, a.parte, a.turno, a.lote, a.notas, a.actualizacion, a.usuario FROM " + this.servicio.rBD() + ".detallerechazos a INNER JOIN " + this.servicio.rBD() + ".lecturas_cortes b ON a.corte = b.id WHERE a.id > 0 AND a.fecha >= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/01' AND a.fecha <= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/" + uDia + "' UNION ALL SELECT 0 AS tipo, 0 AS id, a.id AS corte, a.calidad - a.calidad_clasificada AS cantidad, a.dia AS fecha, 0 AS origen, '" + this.servicio.rTraduccion()[8] + "' AS rechazo, 0 AS AREA, a.equipo, a.parte, a.turno, a.orden, '" + this.servicio.rTraduccion()[1373] + "' AS notas, a.bloque_inicia, 0 AS usuario FROM " + this.servicio.rBD() + ".lecturas_cortes a WHERE a.calidad - a.calidad_clasificada > 0 AND a.dia >= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/01' AND a.dia <= '" + this.servicio.rFRechazo().ano + "/" + this.servicio.rFRechazo().mes + "/" + uDia + "') AS a LEFT JOIN " + this.servicio.rBD() + ".cat_areas c ON a.area = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas d ON a.equipo = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas e ON d.linea = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales f ON a.tipo  = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_partes g ON a.parte = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_turnos h ON a.turno = h.id LEFT JOIN " + this.servicio.rBD() + ".lotes i ON a.lote = i.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios j ON a.usuario = j.id ORDER BY 3, 21;";

      this.tituloBuscar = this.servicio.rTraduccion()[1224]
      this.literalSingular = this.servicio.rTraduccion()[1258]
      this.literalPlural = this.servicio.rTraduccion()[494]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1240]
      this.mensajePadre = "";
    } */

    else if (tabla == 25)
    {
      this.nCatalogo = "NÚMEROS DE PARTE"
      this.etiBuscar = this.servicio.rTraduccion()[1283]
      this.iconoGeneral = "i_partes";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[697] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[665] + "', '" + this.servicio.rTraduccion()[1197] + "', '" + this.servicio.rTraduccion()[3744] + "', '" + this.servicio.rTraduccion()[3746] + "', '" + this.servicio.rTraduccion()[707] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[750] + "', '" + this.servicio.rTraduccion()[749] + "', '" + this.servicio.rTraduccion()[751] + "' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, a.kg_saco_defecto, a.saco_pallets_defecto, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "'), a.creacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), a.modificacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ";
      this.tituloBuscar = this.servicio.rTraduccion()[1220]
      this.literalSingular = this.servicio.rTraduccion()[1253]
      this.literalPlural = this.servicio.rTraduccion()[1269]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      this.mensajePadre = "";
    }
    this.verSR = false;
    this.cadSQLActual = sentencia;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.irArriba();
      if(this.miSeleccion == 17 && this.vista17==1)
      {
        for (var i = 0; i < resp.length; i++) 
        {
          resp[i].nombre = resp[i].partes + this.servicio.rTraduccion()[1400]
          resp[i].parte = "N";
        }
      }
      if(this.miSeleccion == 18)
      {
        for (var i = 0; i < resp.length; i++) 
        {
          if (+resp[i].objetivo > 0)
          {
            resp[i].cumplimiento = Math.round(+resp[i].van / +resp[i].objetivo * 100) + "%";
          }
          else
          {
            resp[i].cumplimiento = "0%";
          }
        }
      }
      if (mensajeSI)
      {
        //let mensajeCompleto: any = [];
        //mensajeCompleto.clase = "snack-normal";
        //mensajeCompleto.mensaje = this.servicio.rTraduccion()[1393]
        //mensajeCompleto.tiempo = 4000;
        //this.servicio.mensajeToast.emit(mensajeCompleto);
      
      }
      this.arreHover.length = resp.length;
      this.arreImagenes.length = resp.length
      for (var i=0; i< resp.length; i++)
      {
        
        this.arreImagenes[i] = "S";
              
      }
      
      this.arrFiltrado = resp;
      this.tmpRegistros = resp;
      this.llenarTiempo(0, 50);
    }, 
    error => 
      {
        console.log(error)
      })
  }


  llenarTiempo(inicio, total)
  {
    let limite = inicio + total;

    if (this.miSeleccion != this.seleccionado && this.seleccionado > 0)
    {
      this.registros = [];
      return;
    } 
    if (this.modelo == 4)
    {
      setTimeout(() => {
        this.servicio.activarSpinnerSmall.emit(false);   
      }, 100);
      return;
    }
    this.seleccionado = this.miSeleccion;
    
    if (this.tmpRegistros.length > limite)
    {
      
      setTimeout(() => {
        this.llenarTiempo(inicio + 50, 50);  
      }, 200);
      
    }
    else
    {
      limite = this.tmpRegistros.length;
      setTimeout(() => {
        this.servicio.activarSpinnerSmall.emit(false);   
      }, 200);
        
    }
    for (var i=inicio; i<limite; i++)
    {
      
      this.registros.push(this.tmpRegistros[i]);
            
    }
    
    this.verSR = true;
    this.mostrarDetalle = true;  
    
    //
    this.mostrarImagenRegistro = "S";
    this.cancelarEdicion = false;
    //
    setTimeout(() => {
      this.contarRegs();
      this.servicio.activarSpinner.emit(false);  
      this.visualizarImagen = true; 
      this.animando = true;       
    }, 100);

    
    this.buscar();
  }
  
  imagenError(event, id: number)
  {
    this.arreImagenes[id] = "N";
  }

  imagenBien(event, id: number)
  {
    this.arreImagenes[id] = "S";
    
  }

  filtrar()
  {
    this.sondeo = 0;
    this.animando = false;
    this.registros = this.aplicarFiltro(this.textoBuscar);
    setTimeout(() => {
      this.animando = true;  
    }, 200);
    
    this.contarRegs(); 
  }

  aplicarFiltro(cadena: string) 
  {
    let tmpRegistros = [];
    this.servicio.activarSpinnerSmall.emit(true);
    if (cadena ) 
    {
      for (var i = 0; i < this.arrFiltrado.length; i  ++)
      {
        for (var j in this.arrFiltrado[i])
        {
          if (this.arrFiltrado[i][j])
          {
            if (this.servicio.tildes(this.arrFiltrado[i][j], "M").toLowerCase().indexOf(cadena.toLowerCase()) !== -1)
            {
              tmpRegistros.splice(tmpRegistros.length, 0, this.arrFiltrado[i]);
              break;
            }
          }
        }
      }
    }
    else
    {
      tmpRegistros = this.arrFiltrado;
    }
    this.servicio.activarSpinnerSmall.emit(false);
    return tmpRegistros;
  }
  
  contarRegs()
  {
    if (this.router.url.substr(0, 10) != "/catalogos" || this.noLeer )
    {
      return;
    }
    let mensaje = "";
    
    let cadAdicional: string = (this.registros.length != this.arrFiltrado.length ? this.servicio.rTraduccion()[65].replace("campo_0", this.arrFiltrado.length) : "");
    this.hayFiltro = this.registros.length != this.arrFiltrado.length;
    if (this.registros.length > 0)
    {
      mensaje = this.servicio.rTraduccion()[66] + (this.registros.length == 1 ? " " + this.literalSingular : this.registros.length + " " + this.literalPlural);
    }
    else
    {
      mensaje = this.servicio.rTraduccion()[67] + this.literalPlural
    }
    let cadAlarmas: string = "";
    {
      this.alarmados = 0;
      for (var i = 0; i < this.arrFiltrado.length; i++)
      {
        if (this.arrFiltrado[i].estatus == this.servicio.rTraduccion()[1155])
        {
          this.alarmados = this.alarmados + 1
        }
      }
      if (this.alarmados > 0)
      {
        cadAlarmas = "<span class='resaltar'>" + (this.alarmados == 1 ? this.servicio.rTraduccion()[1401] : this.alarmados + this.servicio.rTraduccion()[1402]) + "</span>";
      }
    }
    mensaje = mensaje + " " + cadAdicional + " " + this.mensajePadre + " " + cadAlarmas
    this.servicio.mensajeInferior.emit(mensaje);          
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

  cambiarVista(modo: number)
  {
    this.animando = false;
    this.sondeo = 0;
    let vistaRecuadro: boolean = false;
    if (modo == 1)
    {
      vistaRecuadro = (this.modelo == 13 || this.modelo == 3) && modo == 1;
      this.servicio.guardarVista(this.miSeleccion + 10, (vistaRecuadro ? 1: 0))      
    }
    else
    {
      vistaRecuadro = this.servicio.rUsuario().preferencias_andon.substr(9 + this.miSeleccion, 1) == "1";
    }
    if (vistaRecuadro)
    {
      if (this.modelo > 10)
      {
        this.modelo = this.modelo - 10;
      }
      else
      {
        this.modelo = (modo == 2 ? 2 : 12);
      }
      this.ayuda11 = this.servicio.rTraduccion()[0]
      this.iconoVista = "i_vdetalle"
      this.literalVista = this.servicio.rTraduccion()[1191]
      this.verTabla = false;
    }
    else
    { 
      if (this.modelo > 10)
      {
        this.modelo = this.modelo - 10;
      }
      else
      {
        this.modelo = (modo == 2 ? 3 : 13);  
      }
      this.ayuda11 = this.servicio.rTraduccion()[1]
      this.iconoVista = "i_vcuadro"
      this.literalVista = this.servicio.rTraduccion()[1403]
      this.verTabla = true;
    }
    setTimeout(() => {
      this.animando = true;
      if (this.txtBuscar)
      {
        this.txtBuscar.nativeElement.focus();
      }
    }, 300);
  }

  cadaSegundo()
  {
    }

  
  leerBD()
  {
    if (this.noLeer || this.router.url.substr(0, 10) != "/catalogos")
    {
      return;
    }
    let campo: string = "lineas";
    if  (this.miSeleccion==2)
    {
      campo = "maquinas";
    }
    else if (this.miSeleccion==3)
    {
      campo = "areas";
    }

    else if (this.miSeleccion==4)
    {
      campo = this.servicio.rTraduccion()[41];
    }
    else if (this.miSeleccion==5)
    {
      campo = "generales";
    }
    else if (this.miSeleccion==6)
    {
      campo = "distribucion";
    }
    else if (this.miSeleccion==7)
    {
      campo = "correos";
    }
    else if (this.miSeleccion==8)
    {
      campo = "alertas";
    }
    else if (this.miSeleccion==9)
    {
      campo = "turnos";
    }
    else if (this.miSeleccion==10)
    {
      campo = "traducciones";
    }
    else if (this.miSeleccion==12)
    {
      campo = "usuarios";
    }
    else if (this.miSeleccion==14)
    {
      campo = "politicas";
    }
    else if (this.miSeleccion==17)
    {
      campo = "rates";
    }
    else if (this.miSeleccion==18)
    {
      campo = "objetivos";
    }
  else if (this.miSeleccion==19)
  {
    campo = "estimados";
  }
  else if (this.miSeleccion==20)
  {
    campo = "sensores";
  }
  else if (this.miSeleccion==21)
  {
    campo = "paros";
  }
    let sentencia = "SELECT " + campo + " FROM " + this.servicio.rBD() + ".actualizaciones";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let revisar: boolean = false;
      if (resp.length > 0)
      {
        if (resp[0][campo])
        {
          if (new Date(resp[0][campo]) > this.ultimaActualizacion)
          {
            revisar = true;
          }
        }
      }
      if (revisar)
      {
        campos = {accion: 100, sentencia: this.cadSQLActual};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (this.vista17==1 && this.miSeleccion==17)
          {
            for (var i = 0; i < resp.length; i++) 
            {
              resp[i].nombre = resp[i].partes + this.servicio.rTraduccion()[1400]
              resp[i].parte = "N";
            }
          }
          this.arrFiltrado = resp;
          let arreTemp: any = this.arrFiltrado;
          if (this.hayFiltro)
          {
            arreTemp = this.aplicarFiltro(this.textoBuscar);
          }
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
                    if (this.miSeleccion == 10)
                    {
                      if (this.registros[i].literal !=  arreTemp[j].literal || this.registros[i].traduccion !=  arreTemp[j].traduccion)
                      {
                        this.registros[i].literal = arreTemp[j].literal;
                        this.registros[i].traduccion = arreTemp[j].traduccion;
                      }
                    }
                    else if (this.miSeleccion != 10)
                    {
                      if (this.registros[i].estatus !=  arreTemp[j].estatus || this.registros[i].nombre !=  arreTemp[j].nombre )
                      {
                        this.registros[i].estatus = arreTemp[j].estatus;
                        this.registros[i].nombre = arreTemp[j].nombre;
                      }
                    }
                    if (this.miSeleccion == 2)
                    {
                      if (this.registros[i].nlinea !=  arreTemp[j].nlinea)
                      {
                        this.registros[i].nlinea = arreTemp[j].nlinea;
                      }
                    }
                    else if (this.miSeleccion == 5)
                    {
                      if (this.registros[i].ntabla !=  arreTemp[j].ntabla)
                      {
                        this.registros[i].ntabla = arreTemp[j].ntabla;
                      }
                    }
                    else if (this.miSeleccion == 9)
                    {
                      if (this.registros[i].inicia !=  arreTemp[j].inicia)
                      {
                        this.registros[i].inicia = arreTemp[j].inicia;
                      }
                      if (this.registros[i].termina !=  arreTemp[j].termina)
                      {
                        this.registros[i].termina = arreTemp[j].termina;
                      }
                    }
                    else if (this.miSeleccion == 17)
                    {
                      if (this.registros[i].piezas !=  arreTemp[j].piezas)
                      {
                        this.registros[i].piezas = arreTemp[j].piezas;
                      }
                      if (this.registros[i].tiempo !=  arreTemp[j].tiempo)
                      {
                        this.registros[i].tiempo = arreTemp[j].tiempo;
                      }
                      if (this.vista17==0)
                      {
                        if (this.registros[i].equipo !=  arreTemp[j].equipo)
                        {
                          this.registros[i].equipo = arreTemp[j].equipo;
                        }
                        if (this.registros[i].parte !=  arreTemp[j].parte)
                        {
                          this.registros[i].parte = arreTemp[j].parte;
                        }
                      }
                      else
                      {
                        if (this.registros[i].nequipo !=  arreTemp[j].nequipo)
                        {
                          this.registros[i].nequipo = arreTemp[j].nequipo;
                        }
                        if (this.registros[i].nombre !=  arreTemp[j].nombre)
                        {
                          this.registros[i].nombre = arreTemp[j].nombre;
                        }
                      }
                      
                    }
                    else if (this.miSeleccion == 18)
                    {
                      if (this.registros[i].objetivo !=  arreTemp[j].objetivo)
                      {
                        this.registros[i].objetivo = arreTemp[j].objetivo;
                      }
                      if (this.registros[i].equipo !=  arreTemp[j].equipo)
                      {
                        this.registros[i].equipo = arreTemp[j].equipo;
                      }
                      if (this.registros[i].parte !=  arreTemp[j].parte)
                      {
                        this.registros[i].parte = arreTemp[j].parte;
                      }
                    }
                    else if (this.miSeleccion == 19)
                    {
                      if (this.registros[i].oee !=  arreTemp[j].oee)
                      {
                        this.registros[i].oee = arreTemp[j].oee;
                      }
                      if (this.registros[i].equipo !=  arreTemp[j].equipo)
                      {
                        this.registros[i].equipo = arreTemp[j].equipo;
                      }
                      if (this.registros[i].linea !=  arreTemp[j].linea)
                      {
                        this.registros[i].linea = arreTemp[j].linea;
                      }
                    }
                    else if (this.miSeleccion == 20)
                    {
                      if (this.registros[i].equipo !=  arreTemp[j].equipo)
                      {
                        this.registros[i].equipo = arreTemp[j].equipo;
                      }
                    }
                    else if (this.miSeleccion == 21)
                    {
                      if (this.registros[i].area !=  arreTemp[j].area)
                      {
                        this.registros[i].area = arreTemp[j].area;
                      }
                      if (this.registros[i].maquina !=  arreTemp[j].maquina)
                      {
                        this.registros[i].maquina = arreTemp[j].maquina;
                      }
                      if (this.registros[i].desde !=  arreTemp[j].desde)
                      {
                        this.registros[i].desde = arreTemp[j].desde;
                      }
                      if (this.registros[i].hasta !=  arreTemp[j].hasta)
                      {
                        this.registros[i].hasta = arreTemp[j].hasta;
                      }
                      if (this.registros[i].tipo !=  arreTemp[j].tipo)
                      {
                        this.registros[i].tipo = arreTemp[j].tipo;
                      }
                    }
                    else if (this.miSeleccion == 27)
                    {
                      if (this.registros[i].area !=  arreTemp[j].area)
                      {
                        this.registros[i].area = arreTemp[j].area;
                      }
                      if (this.registros[i].equipo !=  arreTemp[j].equipo)
                      {
                        this.registros[i].equipo = arreTemp[j].equipo;
                      }
                      if (this.registros[i].fecha !=  arreTemp[j].fecha)
                      {
                        this.registros[i].fecha = arreTemp[j].fecha;
                      }
                      if (this.registros[i].rechazo !=  arreTemp[j].rechazo)
                      {
                        this.registros[i].rechazo = arreTemp[j].rechazo;
                      }
                      if (this.registros[i].cantidad !=  arreTemp[j].cantidad)
                      {
                        this.registros[i].cantidad = arreTemp[j].cantidad;
                      }
                      if (this.registros[i].tipo !=  arreTemp[j].tipo)
                      {
                        this.registros[i].tipo = arreTemp[j].tipo;
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
            this.contarRegs()
          }
        });
      }
      this.ultimaActualizacion = new Date();
      clearTimeout(this.leeBD);
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        this.leeBD = setTimeout(() => {
          this.leerBD()
        }, +this.elTiempo);
      }
  
    })

    }

  editar(id: number)
  {
    
    let miID: number = 0;
    if (id == -1)
    {
      miID = this.detalle.id;
      if (this.miSeleccion==17 && this.vista17==1)
      {
        miID = this.idRates; 
      }
    }
    else
    {
      miID = this.registros[id].id;
      this.idRates = id; 
      this.arreHover[id] = false
    }
    //this.yaValidado = miID;
    this.botonera1 = 2;
    let sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_lineas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
    if (this.miSeleccion == 1)
    {
      this.iconoGeneral = "i_lineas";
      this.literalSingularArticulo = this.servicio.rTraduccion()[32];
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1412])
    }
    else if (this.miSeleccion == 2)
    {
      this.iconoGeneral = "i_maquina";
      this.literalSingularArticulo = this.servicio.rTraduccion()[36];
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID;   
      this.llenarListas(3, this.servicio.rBD() + ".cat_lineas", "");
      this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 " );
      this.llenarListas(22, this.servicio.rBD() + ".cat_usuarios", "");
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1413])
    }
    else if (this.miSeleccion == 3)
    {
      this.iconoGeneral = "i_responsable";
      this.literalSingularArticulo = this.servicio.rTraduccion()[39];
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1405])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_areas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(29, this.servicio.rBD() + ".cat_distribucion", "");
      this.llenarListas(200, this.servicio.rBD() + ".cat_usuarios", " WHERE ROL = 'T' ");
      this.llenarListas(205, this.servicio.rBD() + ".cat_fallas", "");
    }
    else if (this.miSeleccion == 28)
    {
      this.iconoGeneral = "i_variables";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1248]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1426])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_variables a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(1110, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 110 " );
      this.llenarListas(1115, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 115 " );
      this.llenarListas(149, this.servicio.rBD() + ".cat_distribucion", "")
      this.llenarListas(20, this.servicio.rBD() + ".cat_maquinas", "");
      this.asociarValores(miID);
      this.asociarVariablesMaquinas(miID);
    }
    else if (this.miSeleccion == 32)
    {
      this.iconoGeneral = "i_valores";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1248]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1426])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_variables a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(1110, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 110 " );
      this.llenarListas(1115, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 115 " );
      this.llenarListas(149, this.servicio.rBD() + ".cat_distribucion", "")
      this.asociarValores(miID);
    }
    else if (this.miSeleccion == 29)
    {
      this.iconoGeneral = "i_checklist";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1231]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1406])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_checklists a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(100, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 70 " );
      this.llenarListas(1120, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 120 " );
      this.llenarListas(160, this.servicio.rBD() + ".cat_maquinas", "");
      this.llenarListas(149, this.servicio.rBD() + ".cat_distribucion", "")
    }
    else if (this.miSeleccion == 30)
    {
      this.respondido = 0;
      this.iconoGeneral = "i_plan";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1417])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".plan_checklists a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.checklistPlan(miID);
      this.llenarListas(1121, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 120 " );
    }
    else if (this.miSeleccion == 31)
    {
      this.iconoGeneral = "i_checklist";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1231]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1406])
      sentencia = "SELECT a.*, d.nombre AS nombreChecklist, IFNULL(CONCAT(e.nombre, ' / ', f.nombre), '" + this.servicio.rTraduccion()[3399] + "') AS nequipo, d.url_mmcall, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".checkeje_cab a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_checklists d ON a.checklist = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas e ON d.equipo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas f ON e.linea = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(10, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 70 " );
      this.llenarListas(1120, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 120 " );
      this.llenarListas(16, this.servicio.rBD() + ".cat_maquinas", "");
      this.llenarListas(149, this.servicio.rBD() + ".cat_distribucion", "")
      this.noAceptado = false;
    }
    else if (this.miSeleccion == 4)
    {
      this.iconoGeneral = "i_falla";
      this.literalSingularArticulo = this.servicio.rTraduccion()[42];
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1409])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_fallas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.asociarTablasFalla(miID);
      this.validarCU = false;
      this.validarM = false;
    }
    else if (this.miSeleccion == 25)
    {
      this.iconoGeneral = "i_partes";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1414])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.asociarTablasHerramental(miID);
      this.llenarListas(93, this.servicio.rBD() + ".cat_rutas", "");
      this.validarCU = false;
      this.validarM = false;
    }
    else if (this.miSeleccion == 5)
    {
      this.iconoGeneral = "i_general";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1422])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(7, this.servicio.rBD() + ".tablas", " WHERE idioma = " + this.servicio.rIdioma().id);
    }
    else if (this.miSeleccion == 6)
    {
      this.iconoGeneral = "i_recipiente";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1421])
        sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
    }

    else if (this.miSeleccion == 7)
    {
      this.iconoGeneral = "i_correos";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1231]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1407])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_correos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(900, this.servicio.rBD() + ".consultas_cab a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.usuario = b.id ", "WHERE (a.publico = 'S' OR a.usuario = 1) AND NOT ISNULL(a.nombre) AND a.nombre <> ''");
    }

    else if (this.miSeleccion == 8)
    {
      this.iconoGeneral = "i_alertas";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1246]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1404])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_alertas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.asociarTablasAlerta(miID);
      let filtroTabla = " WHERE idioma = " + this.servicio.rIdioma().id + " AND estatus = 'A' AND (alerta < 200" 
      if (this.servicio.rVersion().modulos[5] == 1)
      {
        filtroTabla = filtroTabla + " OR alerta BETWEEN 200 AND 300"
      }
      if (this.servicio.rVersion().modulos[4] == 1)
      {
        filtroTabla = filtroTabla + " OR alerta BETWEEN 300 AND 400"
      }
      if (this.servicio.rVersion().modulos[6] == 1)
      {
        filtroTabla = filtroTabla + " OR alerta BETWEEN 400 AND 500"
      }
      filtroTabla = filtroTabla + ")"
      this.llenarListas(31, this.servicio.rBD() + ".int_eventos", filtroTabla);
      this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", "");
    }
    else if (this.miSeleccion == 9)
    {
      this.iconoGeneral = "i_turnos";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1424])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_turnos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(22, this.servicio.rBD() + ".cat_usuarios", "");      
    }
    else if (this.miSeleccion == 10)
    {
      this.iconoGeneral = "i_traductor";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1246]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1410])
      sentencia = "SELECT a.* FROM " + this.servicio.rBD() + ".traduccion a WHERE a.id = " + miID; 
    }
    else if (this.miSeleccion == 12)
    {
      this.iconoGeneral = "i_grupos";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID;   
      this.llenarListas(10, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 70 " );
      this.llenarListas(110, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 130 " );
      this.llenarListas(11, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 80 " );
      this.llenarListas(12, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 90 " );
      this.llenarListas(14, this.servicio.rBD() + ".cat_turnos", "");
      this.llenarListas(13, this.servicio.rBD() + ".politicas", "" );
      this.llenarListas(105, this.servicio.rBD() + ".cat_idiomas", "" );
      this.asociarTablas(miID);
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1425])
      this.validarUSER = false;          
    }
    else if (this.miSeleccion == 14)
    {
      this.iconoGeneral = "i_politicas";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1248]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1418])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".politicas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      
    }
    else if (this.miSeleccion == 15)
    {
      this.iconoGeneral = "i_licencia";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1248]
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1411])
      sentencia = "SELECT a.*, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreo, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".politicas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
    }
    else if (this.miSeleccion == 17)
    {
      this.iconoGeneral = this.icoVista17=="i_maquina" ? "i_rates" : "i_maquina";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      if (this.vista17==0)
      {
        sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE id = " + miID;   
      }
      else
      {
        sentencia = "SELECT a.piezas, a.unidad, a.equipo, IFNULL(CONCAT(b.nombre, ' / ', c.nombre), '" + this.servicio.rTraduccion()[3399] + "') AS nequipo, COUNT(DISTINCT(a.parte)) AS partes, a.tiempo, a.alto, a.bajo FROM " + this.servicio.rBD() + ".relacion_partes_equipos a LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas b ON a.equipo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON b.linea = c.id WHERE a.piezas = " + this.registros[this.idRates].piezas + " GROUP BY a.piezas, a.unidad, a.equipo";
      }
      
      this.llenarListas(16, this.servicio.rBD() + ".cat_maquinas", "");
      this.llenarListas(15, this.servicio.rBD() + ".cat_partes", "");
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1419])
      
    }
    else if (this.miSeleccion == 18)
    {
      this.iconoGeneral = "i_objetivos";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      sentencia = "SELECT * FROM " + this.servicio.rBD() + ".equipos_objetivo WHERE id = " + miID;   
      this.llenarListas(16, this.servicio.rBD() + ".cat_maquinas", "");
      this.llenarListas(15, this.servicio.rBD() + ".cat_partes", "");
      this.llenarListas(17, this.servicio.rBD() + ".lotes", "WHERE a.estado <> 99 AND a.estatus = 'A'");
      this.llenarListas(18, this.servicio.rBD() + ".cat_turnos", "");
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1415])
      

    }
    else if (this.miSeleccion == 19)
    {
      this.iconoGeneral = "i_estimados";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      sentencia = "SELECT * FROM " + this.servicio.rBD() + ".estimados WHERE id = " + miID;   
      this.llenarListas(16, this.servicio.rBD() + ".cat_maquinas", "");
      this.llenarListas(19, this.servicio.rBD() + ".cat_lineas", "");
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1408])
    }
    else if (this.miSeleccion == 20)
    {
      this.iconoGeneral = "i_sensor";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1233]
      sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_procesos_sensores WHERE id = " + miID;   
      this.llenarListas(20, this.servicio.rBD() + ".cat_maquinas", "");
      this.llenarListas(5, this.servicio.rBD() + ".cat_areas", "");
      this.llenarListas(107, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 105 " );
     
     
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1423])
    }
    else if (this.miSeleccion == 21)
    {
      
      this.iconoGeneral = "i_paro";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1234]
      sentencia = "SELECT * FROM " + this.servicio.rBD() + ".detalleparos WHERE id = " + miID;   
      this.llenarListas(23, this.servicio.rBD() + ".cat_areas", "");
      this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 45 " );
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1416])
      this.llenarListas(4, this.servicio.rBD() + ".cat_maquinas", " WHERE a.oee = 'S' ");       
    }
    else if (this.miSeleccion == 27)
    {
      this.cantidadValidada = false;
      this.preguntarAC = false;
      this.iconoGeneral = "i_rechazo";
      this.literalSingularArticulo = this.servicio.rTraduccion()[1240]
      this.corteActual = this.registros[id].corte;
      if (this.registros[id].origen == 0 && this.registros[id].tipo == 0)
      {
        
        sentencia = "SELECT a.*, a.calidad_antes AS cantidad_antes, 0 AS origen, orden AS lote, 0 AS tipo, 0 AS van, dia AS fecha, calidad - calidad_clasificada AS cantidad, 0 AS existe, b.numero AS orden FROM " + this.servicio.rBD() + ".lecturas_cortes a LEFT JOIN " + this.servicio.rBD() + ".lotes b ON a.orden = b.id WHERE a.id = " + this.corteActual;   
      }
      else
      {
        sentencia = "SELECT a.*, 1 AS existe, a.cantidad AS van, b.numero AS orden FROM " + this.servicio.rBD() + ".detallerechazos a LEFT JOIN " + this.servicio.rBD() + ".lotes b ON a.lote = b.id WHERE a.id = " + miID;   
      }
      this.llenarListas(23, this.servicio.rBD() + ".cat_areas", "");
      this.llenarListas(115, this.servicio.rBD() + ".cat_partes", "");
      this.lotes = [];
      this.llenarListas(118, this.servicio.rBD() + ".cat_turnos", "");
      this.llenarListas(106, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 105 " );
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1420])
      this.llenarListas(104, this.servicio.rBD() + ".cat_maquinas", " WHERE a.oee = 'S' ");       
    }
    this.adecuar();
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {

        this.faltaMensaje = "";
        this.error01 = false;
        this.error02 = false;
        this.error03 = false;
        this.error04 = false;
        this.error05 = false;
        this.error06 = false;
        this.error07 = false;
        this.error08 = false;
        this.error09 = false;
        this.error10 = false;
        this.error20 = false;
        this.error21 = false;
        this.error22 = false;
        this.error23 = false;
        this.error24 = false; 
        this.error25 = false;
        this.error30 = false;
        this.error31 = false;
        this.error32 = false;
        this.error33 = false;
        this.error34 = false;
        this.error35 = false;
        this.error36 = false;
        if (this.miSeleccion==3)
        {
          if (resp[0].audios_ruta)
          {
            resp[0].audios_ruta = resp[0].audios_ruta.replace(/\//g, '\\');
          }
          if (resp[0].audios_prefijo)
          {
            resp[0].audios_prefijo = resp[0].audios_prefijo.replace(/\//g, '\\');
          }
          resp[0].recipiente = !resp[0].recipiente ? 0 : resp[0].recipiente;
          resp[0].falla = !resp[0].falla ? 0 : resp[0].falla;
          resp[0].tecnico = !resp[0].tecnico ? 0 : resp[0].tecnico;
          resp[0].cerrar_boton = !resp[0].cerrar_boton ? "N" : resp[0].cerrar_boton;
        }

        this.detalle = resp[0];
        if (this.miSeleccion==17)
        {
          if (this.vista17==1)
          {
            this.llenarPartes(false);
            this.detalle.parte = "N";
            this.piezasAntes = resp[0].piezas * 1;
            this.equipoAntes = resp[0].equipo;
          }
          else
          {
            this.buscarDatos(1, this.detalle.parte);
          }
          this.detalle.piezas = resp[0].piezas * 1;
          this.detalle.alto = resp[0].alto * 1;
          this.detalle.bajo = resp[0].bajo * 1;
          
        }
        if (this.miSeleccion==18)
        {
          this.cancelando = id == -1;
          this.detalle.objetivo = resp[0].objetivo * 1;
          this.buscarDatos(1, this.detalle.parte);
          this.buscarDatos(2, this.detalle.lote);
          this.calcularSacos(1);
        }
        if (this.miSeleccion==19)
        {
          this.detalle.oee = resp[0].oee * 1;
          this.detalle.efi = resp[0].efi * 1;
          this.detalle.ftq = resp[0].ftq * 1;
          this.detalle.dis = resp[0].dis * 1;
        }
        else if (this.miSeleccion == 7)
        {
          this.listarListados(miID)
        }
        else if (this.miSeleccion == 21) 
        {
          this.detalle.finaliza_sensor = this.detalle.finaliza_sensor ? this.detalle.finaliza_sensor : "S";
          //this.detalle.masivo = this.detalle.masivo ? this.detalle.masivo : "N";
          this.detalle.fdesde = new Date(this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd"));
          this.detalle.fhasta = new Date(this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd"));
          this.detalle.desde = this.servicio.fecha(2, this.detalle.desde, "HH:mm:ss");
          this.detalle.hasta = this.servicio.fecha(2, this.detalle.hasta, "HH:mm:ss");
          //this.detalle.hora_inicial = this.servicio.fecha(2, this.detalle.hora_inicial, "HH:mm:ss");
          //this.detalle.hora_final = this.servicio.fecha(2, this.detalle.hora_final, "HH:mm:ss");
          if (this.detalle.estado == 'C')
          {
            this.faltaMensaje = "El paro no se podrá editar mientras esté en curso"
          }
          else if (this.detalle.estado == 'F')
          {
            this.faltaMensaje = "El paro ya finalizó. No se podrá editar"
          }
          this.paroEnCurso = this.detalle.estado == "C" || this.detalle.estado == "F";
        }
        else if (this.miSeleccion == 27) 
        {
          this.detalle.tipo_cantidad = this.detalle.cantidad_antes > 0 ? "N" : "S"; 
          this.detalle.nuevo = false;
          this.detalle.fecha = new Date(this.detalle.fecha + " 23:00:00")
          this.buscarListas(0);
          this.buscarRate(1)
          this.detalle.cantidad = resp[0].cantidad * 1;
          this.cantidadActual = this.detalle.van;
          
           
        }
        else if (this.miSeleccion == 32)
        {
          this.detalle.requerida = !this.detalle.requerida ? "N" : this.detalle.requerida; 
          this.detalle.maximo = this.detalle.maximo ? this.detalle.maximo * 1 : this.detalle.maximo
          this.detalle.minimo = this.detalle.minimo? this.detalle.minimo * 1 : this.detalle.minimo
          this.detalle.reiniciar_en = this.detalle.reiniciar_en ? this.detalle.reiniciar_en * 1 : this.detalle.reiniciar_en
          this.detalle.tope = this.detalle.tope ? this.detalle.tope * 1 : this.detalle.tope
          this.activarNumero = this.detalle.tipo_valor == 0;
          this.seleccionMensaje = [];
          if (this.detalle.sms == "S")
          {
            this.seleccionMensaje.push("S");
          }
          if (this.detalle.llamada == "S")
          {
            this.seleccionMensaje.push("L");
          }
          if (this.detalle.correo == "S")
          {
            this.seleccionMensaje.push("C");
          }
          if (this.detalle.mmcall == "S")
          {
            this.seleccionMensaje.push("M");
          }
        }
        else if (this.miSeleccion == 28)
        {
          this.detalle.requerida = !this.detalle.requerida ? "N" : this.detalle.requerida; 
          this.detalle.maximo = this.detalle.maximo ? this.detalle.maximo * 1 : this.detalle.maximo
          this.detalle.minimo = this.detalle.minimo? this.detalle.minimo * 1 : this.detalle.minimo
          this.detalle.reiniciar_en = this.detalle.reiniciar_en ? this.detalle.reiniciar_en * 1 : this.detalle.reiniciar_en
          this.detalle.tope = this.detalle.tope ? this.detalle.tope * 1 : this.detalle.tope
          this.activarNumero = this.detalle.tipo_valor == 0;
          this.seleccionMensaje = [];
          if (this.detalle.sms == "S")
          {
            this.seleccionMensaje.push("S");
          }
          if (this.detalle.llamada == "S")
          {
            this.seleccionMensaje.push("L");
          }
          if (this.detalle.correo == "S")
          {
            this.seleccionMensaje.push("C");
          }
          if (this.detalle.mmcall == "S")
          {
            this.seleccionMensaje.push("M");
          }
        }
        else if (this.miSeleccion == 29)
        {
          this.detalle.variables = "S";
          this.variables(miID);
        }
        else if (this.miSeleccion == 9) 
        {
          this.detalle.usuario = resp[0].usuario ? resp[0].usuario : 0;
        }
        this.mostrarImagenRegistro = "S"
        this.mensajeImagen = this.servicio.rTraduccion()[358]
        this.mostrarDetalle = true;  
        this.editando = false;
        this.modelo = this.modelo !=4 ? 14 : 4;
        this.noLeer = true;
        this.bot5 = true;
        this.bot6 = this.detalle.estatus == "A";
        this.bot7 = true;
        this.faltaMensaje = "";
        this.selListadoT = "S";
        if (this.miSeleccion == 8)
        {
          this.detalle.linea = this.detalle.linea != "N" ? "S" : "N";
          this.detalle.falla = this.detalle.falla != "N" ? "S" : "N";
          this.detalle.proceso = this.detalle.proceso != "N" ? "S" : "N";
          this.detalle.maquina = this.detalle.maquina != "N" ? "S" : "N";
          this.detalle.area =  this.detalle.area != "N" ? "S" : "N"; 
          this.seleccionMensaje = [];
          this.seleccionescalar1 = [];
          this.seleccionescalar2 = [];
          this.seleccionescalar3 = [];
          this.seleccionescalar4 = [];
          this.seleccionescalar5 = [];
          ///
          if (this.detalle.sms == "S")
          {
            this.seleccionMensaje.push("S");
          }
          if (this.detalle.llamada == "S")
          {
            this.seleccionMensaje.push("L");
          }
          if (this.detalle.correo == "S")
          {
            this.seleccionMensaje.push("C");
          }
          if (this.detalle.mmcall == "S")
          {
            this.seleccionMensaje.push("M");
          }
          if (this.detalle.log == "S")
          {
            this.seleccionMensaje.push("G")
          }
          

          if (this.detalle.sms1 == "S")
          {this.seleccionescalar1.push("S");}
          if (this.detalle.llamada1 == "S")
          {this.seleccionescalar1.push("L");}
          if (this.detalle.correo1 == "S")
          {this.seleccionescalar1.push("C");}
          if (this.detalle.mmcall1 == "S")
          {this.seleccionescalar1.push("M");}
          if (this.detalle.log1 == "S")
          {this.seleccionescalar1.push("G")}

          if (this.detalle.sms2 == "S")
          {this.seleccionescalar2.push("S");}
          if (this.detalle.llamada2 == "S")
          {this.seleccionescalar2.push("L");}
          if (this.detalle.correo2 == "S")
          {this.seleccionescalar2.push("C");}
          if (this.detalle.mmcall2 == "S")
          {this.seleccionescalar2.push("M");}
          if (this.detalle.log2 == "S")
          {this.seleccionescalar2.push("G")}

          if (this.detalle.sms3 == "S")
          {this.seleccionescalar3.push("S");}
          if (this.detalle.llamada3 == "S")
          {this.seleccionescalar3.push("L");}
          if (this.detalle.correo3 == "S")
          {this.seleccionescalar3.push("C");}
          if (this.detalle.mmcall3 == "S")
          {this.seleccionescalar3.push("M");}
          if (this.detalle.log3 == "S")
          {this.seleccionescalar3.push("G")}

          if (this.detalle.sms4 == "S")
          {this.seleccionescalar4.push("S");}
          if (this.detalle.llamada4 == "S")
          {this.seleccionescalar4.push("L");}
          if (this.detalle.correo4 == "S")
          {this.seleccionescalar4.push("C");}
          if (this.detalle.mmcall4 == "S")
          {this.seleccionescalar4.push("M");}
          if (this.detalle.log4 == "S")
          {this.seleccionescalar4.push("G")}

          if (this.detalle.sms5 == "S")
          {this.seleccionescalar5.push("S");}
          if (this.detalle.llamada5 == "S")
          {this.seleccionescalar5.push("L");}
          if (this.detalle.correo5 == "S")
          {this.seleccionescalar5.push("C");}
          if (this.detalle.mmcall5 == "S")
          {this.seleccionescalar5.push("M");}
          if (this.detalle.log5 == "S")
          {this.seleccionescalar5.push("G")}
        }
        ///
        if (this.miSeleccion==7)
        {
          let mensajes = this.detalle.extraccion.split(";");
          this.nExtraccion = mensajes[0];
          this.nLapso = mensajes[1];
          this.nFrecuencia = mensajes[2];
          this.nHorario = mensajes[3];
        }


        if (this.miSeleccion == 30)
        {
          this.seleccionMensaje = [];
          if (this.detalle.sms == "S")
          {
            this.seleccionMensaje.push("S");
          }
          if (this.detalle.llamada == "S")
          {
            this.seleccionMensaje.push("L");
          }
          if (this.detalle.correo == "S")
          {
            this.seleccionMensaje.push("C");
          }
          if (this.detalle.mmcall == "S")
          {
            this.seleccionMensaje.push("M");
          }
          this.seleccionMensaje2 = [];
          if (this.detalle.sms2 == "S")
          {
            this.seleccionMensaje2.push("S");
          }
          if (this.detalle.llamada2 == "S")
          {
            this.seleccionMensaje2.push("L");
          }
          if (this.detalle.correo2 == "S")
          {
            this.seleccionMensaje2.push("C");
          }
          if (this.detalle.mmcall2 == "S")
          {
            this.seleccionMensaje2.push("M");
          }
          this.detalle.asignadores = !this.detalle.asignadores ? "S" : this.detalle.asignadores;
          this.checklistRegistros()
        }
        
        if (this.miSeleccion==1 || this.miSeleccion==2)
        {
          let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".disponibilidad WHERE linea = 0 AND maquina = 0 LIMIT 1;"
          if (this.detalle.disponibilidad == 1 && this.miSeleccion==1)
          {
            sentencia = "SELECT * FROM " + this.servicio.rBD() + ".disponibilidad WHERE linea = " + +this.detalle.id + " LIMIT 1;"
          }
          else if (this.detalle.disponibilidad == 1 && this.miSeleccion==2)
          {
            sentencia = "SELECT * FROM " + this.servicio.rBD() + ".disponibilidad WHERE maquina = " + +this.detalle.id + " LIMIT 1;"
          }
          this.listados = [];
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (resp.length > 0)
            {
              this.disponibilidad = resp[0];
            }
            else
            {
              this.iniDisp();
            }
          });
          this.detalle.mapa = this.servicio.rTraduccion()[8]
          if (this.miSeleccion==2)
          {
            sentencia = "SELECT (SELECT id FROM " + this.servicio.rBD() + ".mapas WHERE activo  <> 9 ORDER BY id LIMIT 1) AS primero, (SELECT mapa_id FROM " + this.servicio.rBD() + ".figuras WHERE objeto_id = " + this.detalle.id_mapa + " ORDER BY id LIMIT 1) AS mapa"
            this.listados = [];
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              if (resp.length > 0)
              {
                if (resp[0].mapa)
                {
                  this.detalle.mapa = "Mapa: " + (+resp[0].primero - +resp[0].mapa + 1);
                }
                
              }
            });
          }
        }
        this.detalle.codigo = this.detalle.codigo == "null" ? "" : this.detalle.codigo;
        this.detalle.plc = this.detalle.plc == "null" ? "" : this.detalle.plc;
        
        if (this.miSeleccion==14)
        {
          let mensajes = this.detalle.complejidad.split(";");
          this.detalle.largo = mensajes[0];
          this.detalle.especial = mensajes[1];
          this.detalle.numeros = mensajes[2];
          this.detalle.mayusculas = mensajes[3];
        }
        
        ///
        if (this.despuesBusqueda == 1)
        {
          this.copiandoDesde = this.detalle.id;
          this.detalle.id = 0;
          if (this.miSeleccion==18)
          {
            this.detalle.lote = 0;
          }
          this.piezasAntes = 0;
          this.equipoAntes = -1;
          this.detalle.estado = "P";
          this.detalle.clase = 0;
          this.mostrarImagenRegistro = "S";
          this.detalle.estatus = "A"
          this.bot3 = true;
          this.bot4 = true;
          if (this.detalle.id==0)
          {
            this.bot5 = false;
            this.bot6 = false;
            this.bot7 = false;
          }
          this.paroEnCurso = false;
          this.editando = true;
          this.faltaMensaje = this.servicio.rTraduccion()[134]
          this.detalle.creado = "";
          this.detalle.modificado = "";
          this.detalle.modificacion = null;
          this.detalle.creacion = null;
        }
        else
        {
          this.editando = false;
          this.bot3 = false;
          this.bot4 = false;;
        }
        if (this.miSeleccion==12)
        {
          this.bot6 = this.detalle.admin != "S" && this.detalle.estatus=="A" && this.detalle.id>0;
          this.bot7 = this.detalle.admin != "S"  && this.detalle.id>0;
          this.detalle.mapa = !this.detalle.mapa ? "S" : this.detalle.mapa;
        }
        this.bot1Sel = false;
        this.bot2Sel = false;
        this.bot3Sel = false;
        this.bot4Sel = false;
        this.bot5Sel = false;
        this.bot6Sel = false;
        this.bot7Sel = false;
        this.llenarListas(1, this.servicio.rBD() + ".cat_generales", " WHERE tabla = " + this.miSeleccion * 10);
        this.llenarListas(2, this.servicio.rBD() + ".cat_generales", " WHERE tabla = " + (this.miSeleccion * 10 + 5));
        setTimeout(() => {
          if (this.txtNombre)
          {
            this.txtNombre.nativeElement.focus();
          }
          else if (this.lstC0)
          {
            if (this.vista17== 1)
            {
              this.txtT1.nativeElement.focus();
            }
            else
            {
              this.lstC0.focus();
            }
            
          }
          this.animando = true;       
        }, 400);
        this.buscar();
      }
    },
    error => 
    {
      console.log(error)
    })
}

llenarPartes(nuevo: boolean)
{

  let sentencia = "SELECT a.id, IF(ISNULL(a.referencia), a.nombre, CONCAT(a.nombre, ' (', a.referencia, ')')) AS nombre, IF(ISNULL(b.id), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".relacion_partes_equipos b ON a.id = b.parte AND b.piezas = " + this.detalle.piezas + " AND b.equipo = " + this.detalle.equipo + " WHERE a.estatus = 'A' AND tipo IN (0, 2) ORDER BY seleccionado DESC, nombre;";
  if (nuevo)
  {
    sentencia = "SELECT id, IF(ISNULL(a.referencia), a.nombre, CONCAT(a.nombre, ' (', a.referencia, ')')) AS nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_partes WHERE estatus = 'A' AND tipo IN (0, 2) ORDER BY nombre;";
  } 
  this.partesSel = [];
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
      this.partesSel = resp;  
    
  });
}

validarCodigo()
{
  
  let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_fallas WHERE codigo = '" + this.detalle.codigo +"' AND NOT ISNULL(codigo) AND codigo <> 'null' AND id <> " + this.detalle.id;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    if (resp.length > 0)
    {
      this.validarCU = false;
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "480px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1427], tiempo: 0, mensaje: this.servicio.rTraduccion()[1428].replace("campo_0", resp[0].nombre).replace("campo_1", resp[0].id), alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_falla" }
      });
    }
    else
    {
      this.validarCU = true;
      this.guardar();
    }
    
  })
}

validarUsuario()
{
  
  let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_usuarios WHERE referencia = '" + this.detalle.referencia +"' AND id <> " + this.detalle.id;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    if (resp.length > 0)
    {
      this.validarUSER = false;
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "480px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1427], tiempo: 0, mensaje: this.servicio.rTraduccion()[1429].replace("campo_0", resp[0].nombre).replace("campo_1", resp[0].id), alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_falla" }
      });
    }
    else
    {
      this.validarUSER = true;
      this.guardar();
    }
    
  })
}

validarMaquina()
{
  
  let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_maquinas WHERE linea = " + this.detalle.linea + " AND id = " + this.detalle.maquina;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    if (resp.length == 0)
    {
      this.validarM = false;
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "480px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1427], tiempo: 0, mensaje: this.servicio.rTraduccion()[1430], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_falla" }
      });
    }
    else
    {
      this.validarM = true;
      this.guardar();
    }
    
  })
}

mensajesRadio()
{
  let mensajeCompleto: any = [];
  mensajeCompleto.clase = "snack-normal";
  mensajeCompleto.mensaje = this.servicio.rTraduccion()[1391]
  mensajeCompleto.tiempo = 2000;
  this.servicio.mensajeToast.emit(mensajeCompleto);
}


 

validarMaquinas()
{
  let sentencia = "SELECT COUNT(*) AS total FROM " + this.servicio.rBD() + ".cat_maquinas WHERE estatus = 'A'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    if (resp.length > 0)
    {
      let tMaquinas = this.servicio.rVersion().maquinas == 1 ? 20 : this.servicio.rVersion().maquinas == 2 ? 50 : this.servicio.rVersion().maquinas == 3 ? 100 :  500;
      {
      }
      if (+resp[0].total > 20 && this.servicio.rVersion().maquinas == 1 || +resp[0].total > 50 && this.servicio.rVersion().maquinas == 2 || +resp[0].total > 100 && this.servicio.rVersion().maquinas == 3 || +resp[0].total > 500)
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
        width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[164], tiempo: 0, mensaje: this.servicio.rTraduccion()[3633].replace("campo_0", tMaquinas), alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", boton3STR: "", icono3: "", icono0: "i_maquina" }
        });
      }
      else
      {
        this.valMaquinas = true;
      }
    }
  })
}
  guardar()
  {
    if (this.miSeleccion == 2 && this.servicio.rVersion().maquinas != 0 && !this.valMaquinas)
    {
      this.validarMaquinas(); 
      return;
    }
    this.valMaquinas = false;
    if (this.miSeleccion == 21 && this.detalle.estado =='C')
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1432], tiempo: 0, mensaje: this.servicio.rTraduccion()[1433], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", boton3STR: "", icono3: "", icono0: "i_falla" }
      });
      return;
    }
    this.bot3 = false;
    let errores = 0;
    if (this.miSeleccion==4 && !this.validarCU && this.detalle.codigo)
    {
      this.validarCodigo()
      return;
    }
    if (this.miSeleccion==12 && !this.validarUSER)
    {
      this.validarUsuario()
      return;
    }
    if (this.miSeleccion==4 && !this.validarM && this.detalle.maquina > 0 && this.detalle.linea > 0 )
    {
      this.validarMaquina()
      return;
    }
    this.faltaMensaje = "";
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.error04 = false;
    this.error05 = false;
    this.error06 = false;
    this.error07 = false;
    this.error08 = false;
    this.error09 = false;
    this.error10 = false;
    this.error20 = false;
    this.error21 = false;
    this.error22 = false;
    this.error23 = false;
    this.error24 = false; 
    this.error25 = false;
    this.error30 = false;
    this.error31 = false;
    this.error32 = false;
    this.error33 = false;
    this.error34 = false;
    this.error35 = false;
    this.error36 = false;

    if (this.miSeleccion == 8)
    {
      this.detalle.tipo = (!this.detalle.tipo ? "0" : this.detalle.tipo);
      this.detalle.linea = (!this.detalle.linea ? "S" : this.detalle.linea);
      this.detalle.maquina = (!this.detalle.maquina ? "S" : this.detalle.maquina);
      this.detalle.area = (!this.detalle.area ? "S" : this.detalle.area);
      this.detalle.falla = (!this.detalle.falla ? "S" : this.detalle.falla);
      this.detalle.proceso = (!this.detalle.proceso ? "S" : this.detalle.proceso);
      
      this.detalle.linea = (this.detalle.linea == 0 ? "S" : this.detalle.linea);
      this.detalle.maquina = (this.detalle.maquina == 0 ? "S" : this.detalle.maquina);
      this.detalle.area = (this.detalle.area == 0 ? "S" : this.detalle.area);
      this.detalle.falla = (this.detalle.falla == 0 ? "S" : this.detalle.falla);
      this.detalle.proceso = (this.detalle.proceso == 0 ? "S" : this.detalle.proceso);
      if (this.detalle.linea == "S")
      {
        this.detalle.maquina = "S";
      }
      for (var indice = 0; indice < this.arreVariables.length; indice++) 
      this.detalle.acumular_tiempo = (!this.detalle.acumular_tiempo ? "0" : this.detalle.acumular_tiempo);
      this.detalle.transcurrido = (!this.detalle.transcurrido ? "0" : this.detalle.transcurrido);
      this.detalle.lista = (!this.detalle.lista ? "0" : this.detalle.lista);
      this.detalle.escrep1 = (!this.detalle.escrep1 ? "0" : this.detalle.escrep1);
      this.detalle.escrep2 = (!this.detalle.escrep2 ? "0" : this.detalle.escrep2);
      this.detalle.escrep3 = (!this.detalle.escrep3 ? "0" : this.detalle.escrep3);
      this.detalle.escrep4 = (!this.detalle.escrep4 ? "0" : this.detalle.escrep4);
      this.detalle.escrep5 = (!this.detalle.escrep5 ? "0" : this.detalle.escrep5);
      this.detalle.tiempo1 = (!this.detalle.tiempo1 ? "0" : this.detalle.tiempo1);
      this.detalle.lista1 = (!this.detalle.lista1 ? "0" : this.detalle.lista1);
      this.detalle.veces1 = (!this.detalle.veces1 ? "0" : this.detalle.veces1);
      this.detalle.tiempo2 = (!this.detalle.tiempo2 ? "0" : this.detalle.tiempo2);
      this.detalle.lista2 = (!this.detalle.lista2 ? "0" : this.detalle.lista2);
      this.detalle.veces2 = (!this.detalle.veces2 ? "0" : this.detalle.veces2);
      this.detalle.tiempo3 = (!this.detalle.tiempo3 ? "0" : this.detalle.tiempo3);
      this.detalle.lista3 = (!this.detalle.lista3 ? "0" : this.detalle.lista3);
      this.detalle.veces3 = (!this.detalle.veces3 ? "0" : this.detalle.veces3);
      this.detalle.tiempo4 = (!this.detalle.tiempo4 ? "0" : this.detalle.tiempo4);
      this.detalle.lista4 = (!this.detalle.lista4 ? "0" : this.detalle.lista4);
      this.detalle.veces4 = (!this.detalle.veces4 ? "0" : this.detalle.veces4);
      this.detalle.tiempo5 = (!this.detalle.tiempo5 ? "0" : this.detalle.tiempo5);
      this.detalle.lista5 = (!this.detalle.lista5 ? "0" : this.detalle.lista5);
      this.detalle.veces5 = (!this.detalle.veces5 ? "0" : this.detalle.veces5);
      this.detalle.repetir_veces = (!this.detalle.repetir_veces ? "0" : this.detalle.repetir_veces);
      this.detalle.repetir_veces = (!this.detalle.repetir_veces ? "0" : this.detalle.repetir_veces);
      this.detalle.repetir_tiempo = (!this.detalle.repetir_tiempo ? "0" : this.detalle.repetir_tiempo);
      this.nLapso = (!this.nLapso ? "0" : this.nLapso);
    }
    if (this.miSeleccion != 10 && this.miSeleccion < 17 || this.miSeleccion == 25 || this.miSeleccion >= 28)
    {
      if (!this.detalle.nombre)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1473]
      }
      else if (this.detalle.nombre.length == 0)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1473]
      }
    }
    else if (this.miSeleccion == 10)
    {
      if (!this.detalle.literal)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1472]
      }
      else if (this.detalle.literal.length == 0)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1472]
      }
      if (!this.detalle.traduccion)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1474]
      }
      else if (this.detalle.traduccion.length == 0)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1474]
      }
    }
    if (!this.detalle.telefonos && !this.detalle.correos && !this.detalle.mmcall && this.miSeleccion == 6)
    {
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1438]
    }
    if (this.miSeleccion == 7)
    {
      if (!this.detalle.para)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1435]
      }
      
      if (this.detalle.tipo < 2)
      {
        if (this.nExtraccion <= "6" && this.nLapso == "0")
        {
          errores = errores + 1;
          this.error04 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1471]
        }
        if (this.listaListad.selectedOptions.selected.length == 0)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1442]
        }  
        else if (this.listaListad.selectedOptions.selected.length > 10)
        {
          errores = errores + 1;
          this.error05 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1483]
        }
      }
      
    }
    if (this.miSeleccion == 12)
    {
      if (!this.detalle.referencia)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1475]
      }
      if (this.lista4.selectedOptions.selected.length==0 && this.detalle.rol !="V" &&  this.detalle.rol != "A")
      {
          errores = errores + 1;
          this.error10 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1436]
      }
    }
    if (this.miSeleccion == 8)
    {
      if (this.detalle.transcurrido == 0)
      {
          if (this.detalle.evento != 301 && this.detalle.evento<305 && this.detalle.evento>307 )
          {
            errores = errores + 1;
            this.error03 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1460]
          }
          
      }
      if (this.detalle.tiempo0 == 0)
      {
          if (this.detalle.evento >= 305 && this.detalle.evento<=307 )
          {
            errores = errores + 1;
            this.error36 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1461]
          }
          
      }
      if (this.detalle.acumular == 'S' && this.detalle.acumular_veces == 0)
      {
          errores = errores + 1;
          this.error04 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1456]
      }
      if (this.seleccionMensaje.length == 0)
      {
          errores = errores + 1;
          this.error20 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1439]
      }
      if (this.detalle.lista == 0)
      {
          errores = errores + 1;
          this.error30 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1457]
      }
      if (this.detalle.repetir != "N" && this.detalle.repetir_tiempo == 0)
      {
          errores = errores + 1;
          this.error05 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1462]
      }
      if (this.detalle.escalar1 != "N")
      {
        if (this.detalle.tiempo1 == 0)
        {
            errores = errores + 1;
            this.error06 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1459]
        }
        if (this.seleccionescalar1.length == 0)
        {
            errores = errores + 1;
            this.error21 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1437]
        }
        if (this.detalle.lista1 == 0)
        {
            errores = errores + 1;
            this.error31 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1458]
        }
      }
      if (this.detalle.escalar2 != "N")
      {
        if (this.detalle.tiempo2 == 0)
        {
            errores = errores + 1;
            this.error07 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1459]
        }
        if (this.seleccionescalar2.length == 0)
        {
            errores = errores + 1;
            this.error22 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1437]
        }
        if (this.detalle.lista2 == 0)
        {
            errores = errores + 1;
            this.error32 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1458]
        }
      }
      if (this.detalle.escalar3 != "N")
      {
        if (this.detalle.tiempo3 == 0)
        {
            errores = errores + 1;
            this.error08 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1459]
        }
        if (this.seleccionescalar3.length == 0)
        {
            errores = errores + 1;
            this.error23 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1437]
        }
        if (this.detalle.lista3 == 0)
        {
            errores = errores + 1;
            this.error33 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1458]
        }
      }
      if (this.detalle.escalar4 != "N")
      {
        if (this.detalle.tiempo4 == 0)
        {
            errores = errores + 1;
            this.error09 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1459]
        }
        if (this.seleccionescalar4.length == 0)
        {
            errores = errores + 1;
            this.error24 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1437]
        }
        if (this.detalle.lista4 == 0)
        {
            errores = errores + 1;
            this.error34 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1458]
        }
      }
      if (this.detalle.escalar5 != "N")
      {
        if (this.detalle.tiempo5 == 0)
        {
            errores = errores + 1;
            this.error10 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1459]
        }
        if (this.seleccionescalar5.length == 0)
        {
            errores = errores + 1;
            this.error25 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1437]
        }
        if (this.detalle.lista5 == 0)
        {
            errores = errores + 1;
            this.error35 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1458]
        }
      }
    }
    if (this.miSeleccion == 6)
    {
      this.detalle.hora_desde = !this.detalle.hora_desde ? "00:00:00" : this.detalle.hora_desde;
      this.detalle.hora_hasta = !this.detalle.hora_hasta ? "23:59:59" : this.detalle.hora_hasta;
      
      if (this.detalle.nombre.telefonos == 0 && this.detalle.nombre.mmcall == 0 && this.detalle.nombre.correos == 0)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1440]
      }
      if (this.detalle.hora_desde && this.detalle.hora_hasta) 
      {
        if (this.detalle.hora_desde > this.detalle.hora_hasta)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1482]
        }
      }
    }
    else if (this.miSeleccion == 14)
    {
      if (this.detalle.vence=="S")
      {
        if (this.detalle.diasvencimiento==0)
        {   
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1470]
        }
        else if (!this.detalle.diasvencimiento)
        {   
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1470]
        }
      }
    }
    else if (this.miSeleccion == 17)
    {
      this.detalle.piezas = (!this.detalle.piezas ? "0" : this.detalle.piezas);
      if (this.detalle.equipo==-1)
      {   
        errores = errores + 1;
        this.error03 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1469]
      }
      if (this.vista17==0)
      {
        if (this.detalle.parteID==-1)
        {   
          errores = errores + 1;
          this.error04 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1453]
        }
      }
      else if (this.lista3.selectedOptions.selected.length == 0 && this.detalle.parte != "S")
      {
        errores = errores + 1;
        this.error04 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1441]
      }
      if (this.detalle.piezas==0)
      {   
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1455]
      }
    }
    else if (this.miSeleccion == 18)
    {
      this.detalle.objetivo = !this.detalle.objetivo ? "0" : this.detalle.objetivo < 0 ? "0" : this.detalle.objetivo > 99999999999999 ? "99999999999999" : this.detalle.objetivo;
      this.detalle.sacos = !this.detalle.sacos ? "0" : this.detalle.sacos < 0 ? "0" : this.detalle.sacos > 99999999999999 ? "99999999999999" : this.detalle.sacos;
      this.detalle.tarimas = !this.detalle.tarimas ? "0" : this.detalle.tarimas < 0 ? "0" : this.detalle.tarimas > 99999999999999 ? "99999999999999" : this.detalle.tarimas;
      if (this.detalle.equipo==-1)
      {   
        errores = errores + 1;
        this.error03 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1469]
      }
      if (this.detalle.loteID == 0 && !this.detalle.lote)
      {   
        errores = errores + 1;
        this.error05 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1449]
      }
      if (this.detalle.parteID == 0)

      {   
        errores = errores + 1;
        this.error05 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1449]
      }

      if (+this.detalle.tarimas == 0)
      {   
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3755]
      }
      if (this.detalle.objetivo == 0)

      {   
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3755]
      }
      if (this.detalle.sacos == 0)
      {   
        errores = errores + 1;
        this.error07 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3755]
      }
      /* if (this.detalle.fijo == "N")
      {
        if (!this.detalle.desde) 
        {
          errores = errores + 1;
            this.error07 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1480]
        }

        if (!this.detalle.hasta) 
        {
          errores = errores + 1;
            this.error08 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1479]
        }

        if (this.detalle.desde && this.detalle.hasta) 
        {
          if (this.detalle.desde > this.detalle.hasta)
          {
            errores = errores + 1;
            this.error07 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1481]
          }

        } 

        
      }*/

      if ((this.detalle.loteID == 0 && this.detalle.lote && errores == 0) || (this.detalle.id == 0 && !this.loteCopiado))
      {
        this.crearNuevoLote();
        return;
      }
      
    }
    else if (this.miSeleccion == 19)
    {
      this.detalle.oee = (!this.detalle.oee ? "0" : this.detalle.oee);
      this.detalle.ftq = (!this.detalle.ftq ? "0" : this.detalle.ftq);
      this.detalle.efi = (!this.detalle.efi ? "0" : this.detalle.efi);
      this.detalle.dis = (!this.detalle.dis ? "0" : this.detalle.dis);
      if (this.detalle.linea==-1)
      {   
        errores = errores + 1;
        this.error03 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1468]
      }
      if (this.detalle.equipo==-1)
      {   
        errores = errores + 1;
        this.error04 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1469]
      }
      if (this.detalle.fijo == "N")
      {
        if (!this.detalle.desde) 
        {
          errores = errores + 1;
            this.error07 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1480]
        }

        if (!this.detalle.hasta) 
        {
          errores = errores + 1;
            this.error08 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1479]
        }

        if (this.detalle.desde && this.detalle.hasta) 
        {
          if (this.detalle.desde > this.detalle.hasta)
          {
            errores = errores + 1;
            this.error07 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1481]
          }
        }
      }
    }
    else if (this.miSeleccion == 20)
    {
      this.detalle.multiplicador = !this.detalle.multiplicador ? "1" : this.detalle.multiplicador <= 0 ? "1" : this.detalle.multiplicador > 99999999999999999999 ? 99999999999999999999 : this.detalle.multiplicador;
      this.detalle.base = !this.detalle.base ? "0" : this.detalle.base < 0 ? "0" : this.detalle.base > 99999999999999999999 ? 99999999999999999999 : this.detalle.base;
      this.detalle.sensor = !this.detalle.sensor ? "" : this.detalle.sensor;
      this.detalle.area = !this.detalle.area ? "0" : this.detalle.area;
      this.detalle.clasificacion = !this.detalle.clasificacion ? "0" : this.detalle.clasificacion;
      if (this.detalle.equipo==-1)
      {   
        errores = errores + 1;
        this.error04 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1469]
      }
      if (this.detalle.sensor=="")
      {   
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1448]
      }
    }
    else if (this.miSeleccion == 21)
    {
      this.detalle.desde = !this.detalle.desde ? this.servicio.fecha(1, "", "HH:mm:ss") : this.detalle.desde;
      this.detalle.hasta = !this.detalle.hasta ? "23:59:59" : this.detalle.hasta;
      //this.detalle.hora_inicial = !this.detalle.hora_inicial ? "00:00:00" : this.detalle.hora_inicial;
      //this.detalle.hora_final = !this.detalle.hora_final ? "00:59:59" : this.detalle.hora_final;
      this.detalle.fdesde = !this.detalle.fdesde ? new Date() : this.detalle.fdesde;
      this.detalle.fhasta = !this.detalle.fhasta ? new Date() : this.detalle.fhasta;
      this.detalle.paro = !this.detalle.paro ? "" : this.detalle.paro;
      this.detalle.maquina = !this.detalle.maquina ? "0" : this.detalle.maquina;
      this.detalle.area = !this.detalle.area ? "0" : this.detalle.area;
      this.detalle.tipo = !this.detalle.tipo ? "0" : this.detalle.tipo;
      if (this.detalle.paro=="")
      {   
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1452]
      }
      if (this.detalle.tipo==0 && this.detalle.clase ==0 && this.detalle.estado >="L")
      {   
        errores = errores + 1;
        this.error07 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1446]
      }
      if (this.detalle.maquina==0 && this.detalle.clase ==0 && this.detalle.estado >="L")
      {   
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1450]
      }
      if (this.detalle.area==0 || !this.detalle.area)
      {   
        errores = errores + 1;
        this.error03 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1444]
      }
      if (this.detalle.clase ==0 && this.detalle.estado >="L")
      {
        if (new Date(this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde) > new Date(this.servicio.fecha(2, this.detalle.fhasta, "yyyy/MM/dd") + " " + this.detalle.hasta)) 
        {
          errores = errores + 1;
          this.error04 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1482]
        }
        if (new Date(this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde) < new Date())
        {
          errores = errores + 1;
          this.error05 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1434]
        }
      }
      
    }
    else if (this.miSeleccion == 27)
    {
      //this.detalle.fecha = !this.detalle.fecha ? this.servicio.fecha(1, "", "dd/MM/yyyy") : this.detalle.fecha;
      this.detalle.rechazo = !this.detalle.rechazo ? "" : this.detalle.rechazo;
      this.detalle.equipo = !this.detalle.equipo ? "0" : this.detalle.equipo;
      this.detalle.area = !this.detalle.area ? "0" : this.detalle.area;
      this.detalle.turno = !this.detalle.turno ? "0" : this.detalle.turno;
      this.detalle.parte = !this.detalle.parte ? "0" : this.detalle.parte;
      this.detalle.lote = !this.detalle.lote ? "0" : this.detalle.lote;
      this.detalle.orden = !this.detalle.orden ? "" : this.detalle.orden;
      this.detalle.tipo = !this.detalle.tipo ? "0" : this.detalle.tipo;
      this.detalle.cantidad = !this.detalle.cantidad ? 0 : this.detalle.cantidad;
      this.detalle.tipo_cantidad = !this.detalle.tipo_cantidad ? "S" : this.detalle.tipo_cantidad;
      if (this.detalle.rechazo=="")
      {   
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1447]
      }
      if (this.detalle.area == 0)
      {   
        errores = errores + 1;
        this.error03 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1445]
      }
      if (this.detalle.tipo == 0)
      {   
        errores = errores + 1;
        this.error07 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1463]
      }
      if (this.detalle.equipo == 0)
      {   
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1451]
      }
      
      if (this.detalle.parte == 0)
      {   
        errores = errores + 1;
        this.error04 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1454]
      }

      if (this.detalle.orden == "")
      {   
        errores = errores + 1;
        this.error08 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1454]
      }
      if (!this.detalle.fecha)
      {   
        errores = errores + 1;
        this.error09 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1467]
      }
      if (this.detalle.turno == 0)
      {   
        errores = errores + 1;
        this.error05 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1464]
      }
      
      if (this.detalle.cantidad == 0)
      {   
        errores = errores + 1;
        this.error06 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1466]
      }
      if (!this.cantidadValidada && errores == 0)
      { 
        this.validarCantidad();
        return;      
        
      }
      if (this.detalle.tipo_cantidad == "N" && !this.preguntarAC && errores == 0)
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3463], mensaje: this.servicio.rTraduccion()[3464], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_inactivar" }
        });
        respuesta.afterClosed().subscribe(result => 
        {
          if (result)
          {
            if (result.accion != 1)
            {
              this.bot3 = true;
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[1427]
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
            else
            {
              this.preguntarAC = true;
              this.guardar();
            }
          }
          else
          {
            this.bot3 = true;
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[1427]
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
        })
        return;
      }
    }
    else if (this.miSeleccion == 29)
    {
      let haySeleccion = false;
      for (var i = 0; i < this.opcionesSel.length; i++) 
      {
        haySeleccion = this.opcionesSel[i].seleccionado;
        if (haySeleccion)
        {
          break;
        }
      }
      if (!haySeleccion)
      {
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1443]
      }
    }
    else if (this.miSeleccion == 28)
    {
      if (this.detalle.minimo || this.detalle.maximo)
      {   
        if (this.detalle.minimo >= this.detalle.maximo)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3605]
        }
      }
      if (this.seleccionMensaje.length == 0 && this.detalle.recipiente > 0)
      {
          errores = errores + 1;
          this.error20 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1439]
      }
    }
    else if (this.miSeleccion == 32)
    {
      if (this.detalle.minimo || this.detalle.maximo)
      {   
        if (this.detalle.minimo >= this.detalle.maximo)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3605]
        }
      }
      if (this.seleccionMensaje.length == 0)
      {
          errores = errores + 1;
          this.error20 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1439]
      }
    }
    else if (this.miSeleccion == 30)
    {
      if (this.detalle.checklists != "S")
      {
        if (!this.lista2.selectedOptions.selected)
        {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1484]
        }
        else if (this.lista2.selectedOptions.selected.length == 0)
        {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1484]
        }
      }
      if (this.detalle.asignadores != "S")
      {
        if (!this.lista3.selectedOptions.selected)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3580]
        }
        else if (this.lista3.selectedOptions.selected.length == 0)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3580]
        }
      }
      if (this.detalle.frecuencia == 1)
      {
        let laFecha = new Date(this.detalle.fdesde + " " + this.detalle.desde);
      
        if (!this.detalle.desde || !this.detalle.fdesde)
        {
          errores = errores + 1;
          this.error04 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1477]
        }  
        else if (new Date(this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde) < new Date())
        {
          errores = errores + 1;
          this.error05 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1478]
        }
      }
      if (this.seleccionMensaje.length == 0)

      {
          errores = errores + 1;
          this.error20 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3591]
      }
      if (this.seleccionMensaje2.length == 0)
      {
          errores = errores + 1;
          this.error21 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3591]
      }
      if (this.detalle.frecuencia != 0 && this.detalle.frecuencia != 1)
      {
        if (!this.detalle.hora)
        {
          errores = errores + 1;
          this.error06 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1476]
        }  
      }
    }
    else if (this.miSeleccion == 31)
    //Checklists
    {
      if (this.arreVariables.length != this.tVariablesC)
      {
        let cadVariables = "";
        let seRequiere = false;
        for (var i = 0; i < this.arreVariables.length; i++) 
        {
          if (!this.arreVariables[i].valor || this.arreVariables[i].tipo_valor == 0 && this.arreVariables[i].valor==0)
          {
            cadVariables = cadVariables + this.arreVariables[i].orden + ". " + this.arreVariables[i].nombre 
            if (this.arreVariables[i].requerida == "S")
            {
              seRequiere = true;
              cadVariables = cadVariables + " (" + this.servicio.rTraduccion()[358] + ")";
            }
            cadVariables = cadVariables + "<br/>";
          }
        }
        if (cadVariables && seRequiere)
        {
          const respuesta = this.dialogo.open(DialogoComponent, {
            width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3608].replace("campo_0", this.arreVariables.length - this.tVariablesC), mensaje: "<strong>" + this.servicio.rTraduccion()[3611] + "</strong><br><br>" + cadVariables, id: 0, accion: 0, tiempo: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", icono0: "i_checklist" }
          });
          this.bot3 = true;
          return;
        }
        else if (cadVariables && !seRequiere && !this.noAceptado)
        {
          const respuesta = this.dialogo.open(DialogoComponent, {
            width: "580px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3608].replace("campo_0", this.arreVariables.length - this.tVariablesC), mensaje: "<strong>" + this.servicio.rTraduccion()[3611] + "</strong><br><br>" + cadVariables + "<br/>" + this.servicio.rTraduccion()[3612], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3613], boton2STR: this.servicio.rTraduccion()[3614], icono1: "in_seleccionado", icono2: "i_checklist", icono0: "i_checklist" }
          });
          respuesta.afterClosed().subscribe(result => 
          {
            if (result)
            {
              if (result.accion != 1)
              {
                this.bot3 = true;
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-normal";
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[3615]
                mensajeCompleto.tiempo = 2000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
              else
              {
                this.noAceptado = true;
                this.guardar();
              }
            }
            else
            {
              this.bot3 = true;
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381]
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
          })
          return;
        }
      }
      else if (this.tVariablesA > 0 && !this.noAceptado)
      {
        let cadVariables = "";
        for (var i = 0; i < this.arreVariables.length; i++) 
        {
          if (this.arreVariables[i].alarmado == "S")
          {
            cadVariables = cadVariables + this.arreVariables[i].orden + ". " + this.arreVariables[i].nombre + "<br/>";
          }
        }
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3609].replace("campo_0", this.tVariablesA), mensaje: this.servicio.rTraduccion()[3610], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_alarmas" }
        });
        respuesta.afterClosed().subscribe(result => 
        {
          if (result)
          {
            if (result.accion != 1)
            {
              this.bot3 = true;
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381]
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
            else
            {
              this.noAceptado = true;
              this.guardar();
            }
          }
          else
          {
            this.bot3 = true;
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381]
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
        })
        return;
      }
    }
    this.noAceptado = false;
    if (errores > 0)
    {
      this.faltaMensaje = this.servicio.rTraduccion()[127] + this.faltaMensaje
      setTimeout(() => {
        if (this.error01 && (this.miSeleccion==27 || this.miSeleccion==21))
        {
          this.txtNombre.nativeElement.focus();
        }
        else if (this.error03 && this.miSeleccion==27)
        {
          this.lstC1.focus();
        }
        else if (this.error03 && this.miSeleccion==28)
        {
          this.txtT9.nativeElement.focus();
        }
        else if (this.error07 && this.miSeleccion==27)
        {
          this.lstC5.focus();
        }
        else if (this.error08 && this.miSeleccion==27)
        {
          this.txtT2.nativeElement.focus();
        }
        else if (this.error02 && this.miSeleccion==27)
        {
          this.lstC2.focus();
        }
        else if (this.error02 && this.miSeleccion==29)
        {
          this.lstC5.focus();
        }
        else if (this.error04 && this.miSeleccion==27)
        {
          this.lstC3.focus();
        }
        else if (this.error09 && this.miSeleccion==27)
        {
          this.lstC6.focus();
        }
        else if (this.error20 && this.miSeleccion==28)
        {
          this.lstC6.focus();
        }
        else if (this.error05 && this.miSeleccion==27)
        {
          this.lstC4.focus();
        }
        else if (this.error02 && this.miSeleccion==27)
        {
          this.lstC2.focus();
        }
        else if (this.error06 && this.miSeleccion==27)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error07 && this.miSeleccion==21)
        {
          this.lstC4.focus();
        }
        else if (this.error02 && this.miSeleccion==21)
        {
          this.lstC3.focus();
        }
        else if (this.error03 && this.miSeleccion==21)
        {
          this.lstC2.focus();
        }
       
        
        else if (this.error04 && this.miSeleccion == 21)
        {
          this.txtT5.nativeElement.focus();
        }
        else if (this.error05 && this.miSeleccion == 21)
        {
          this.txtT5.nativeElement.focus();
        }
        else if (this.error01 && this.txtNombre)
        {
          this.txtNombre.nativeElement.focus();
        }
        
        else if (this.error02 && this.miSeleccion==17 && this.vista17==1)
        {
          this.txtT1.nativeElement.focus();
        } 
        else if (this.error02 && this.miSeleccion==30)
        {
          this.lstC0.focus();
        }
        else if (this.error03 && this.miSeleccion==30)
        {
          this.lstC2.focus();
        }
        else if ((this.error04 || this.error05) && this.miSeleccion==30)
        {
          if (!this.detalle.fdesde)
          {
            this.txtT5.nativeElement.focus();
          }
          else if (!this.detalle.desde)
          {
            this.txtT6.nativeElement.focus();
          }
          else
          {
            this.txtT5.nativeElement.focus();
          }
        }
        else if (this.error06 && this.miSeleccion==30)
        {
          this.txtT7.nativeElement.focus();
        }
        else if (this.error20 && this.miSeleccion==30)
        {
          this.lstC1.focus();
        }
        else if (this.error21 && this.miSeleccion==30)
        {
          this.lstC6.focus();
        }
        else if (this.error03 && this.miSeleccion>=17)
        {
          this.lstC0.focus();
        }
        else if (this.error04 && this.miSeleccion>=19)
        {
          this.lstC1.focus();
        }
        else if (this.error05 && this.miSeleccion==18)
        {
          this.txtT9.nativeElement.focus();
        }
        else if (this.error04 && (this.miSeleccion==17 || this.miSeleccion==18))
        {
          this.txtT10.nativeElement.focus();
        }
        else if (this.error06 && this.miSeleccion==18)
        {
          this.lstC3.focus();
        }
        else if (this.error01 && this.miSeleccion==18)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error02 && this.miSeleccion==18)
        {
          this.txtT2.nativeElement.focus();
        }
        else if (this.error07 && this.miSeleccion==18)
        {
          this.txtT3.nativeElement.focus();
        }
        else if (this.error02 && (this.miSeleccion==12 || this.miSeleccion==17 || this.miSeleccion==20))
        {
          this.txtT1.nativeElement.focus();
        }        
        else if (this.error02 && this.miSeleccion==10)
        {
          this.txtTelefonos.nativeElement.focus();
        }
        else if (this.error02 && this.miSeleccion==14)
        {
          this.txtT1.nativeElement.focus();
        }
        
        else if (this.error02 && this.txtTelefonos)
        {
          this.txtTelefonos.nativeElement.focus();
        }
        else if (this.error03 && this.miSeleccion == 8)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error36 && this.miSeleccion == 8)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error03 && this.miSeleccion == 6)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error03 && this.miSeleccion == 7)
        {
          this.listaListad.focus();
        }
        else if (this.error04 && this.miSeleccion == 7)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error10 && this.miSeleccion == 12)
        {
          const respuesta = this.dialogo.open(DialogoComponent, {
            width: "460px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1427], tiempo: 0, mensaje: this.servicio.rTraduccion()[1485], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_grupos" }
          });
          
          this.lista4.focus();
        }
        else if (this.error04)
        {
          this.txtT2.nativeElement.focus();
        }
        
        else if (this.error20)
        {
          this.lstC0.focus();
        }
        else if (this.error30)
        {
          this.lstC10.focus();
        }
        else if (this.error05)
        {
          this.txtT3.nativeElement.focus();
        }
        else if (this.error06)
        {
          this.txtT4.nativeElement.focus();
        }
        else if (this.error21)
        {
          this.lstC1.focus();
        }
        else if (this.error31)
        {
          this.lstC11.focus();
        }
        else if (this.error07)
        {
          this.txtT5.nativeElement.focus();
        }
        else if (this.error22)
        {
          this.lstC2.focus();
        }
        else if (this.error32)
        {
          this.lstC12.focus();
        }
        else if (this.error08)
        {
          this.txtT6.nativeElement.focus();
        }
        else if (this.error23)
        {
          this.lstC3.focus();
        }
        else if (this.error33)
        {
          this.lstC13.focus();
        }
        else if (this.error09 && this.txtT7)
        {
          this.txtT7.nativeElement.focus();
        }
        else if (this.error24)
        {
          this.lstC4.focus();
        }
        else if (this.error34)
        {
          this.lstC14.focus();
        }
        else if (this.error10)
        {
          this.txtT8.nativeElement.focus();
        }
        else if (this.error25)
        {
          this.lstC5.focus();
        }
        else if (this.error35)
        {
          this.lstC15.focus();
        }
        this.bot3 = true;
        
      }, 300);
      return;
    }
    this.validarUSER = false;
    this.validarCU = false;
    this.validarM = false;
    this.editando = false;
    this.faltaMensaje = "";
    this.detalle.imagen = !this.detalle.imagen ? "" : this.detalle.imagen;
    this.detalle.url_mmcall = !this.detalle.url_mmcall ? "" : this.detalle.url_mmcall;
    this.detalle.referencia = !this.detalle.referencia ? "" : this.detalle.referencia;
    this.detalle.notas = !this.detalle.notas ? "" : this.detalle.notas; 
    this.detalle.agrupador_1 = !this.detalle.agrupador_1 ? "0" : this.detalle.agrupador_1; 
    this.detalle.agrupador_2 = !this.detalle.agrupador_2 ? "0" : this.detalle.agrupador_2; 
    this.detalle.tipo = !this.detalle.tipo ? "0" : this.detalle.tipo; 
    this.detalle.linea = !this.detalle.linea ? "0" : this.detalle.linea; 
    this.detalle.maquina = !this.detalle.maquina ? "0" : this.detalle.maquina; 
    this.detalle.area = !this.detalle.area ? "0" : this.detalle.area; 
    this.detalle.disponibilidad = !this.detalle.disponibilidad ? "0" : this.detalle.disponibilidad; 
    this.detalle.extraccion = this.nExtraccion + ";" + this.nLapso + ";" + this.nFrecuencia + ";" + this.nHorario 
    let sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_lineas (disponibilidad, nombre, referencia, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, agrupador_1, agrupador_2) VALUES (" + +this.detalle.disponibilidad + ", '" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.url_mmcall + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + this.detalle.agrupador_1 + ", "  + this.detalle.agrupador_2 + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();"
    if (this.detalle.id > 0)
    {
      sentencia = "UPDATE " + this.servicio.rBD() + ".cat_lineas SET disponibilidad = " + +this.detalle.disponibilidad + ", nombre = '" + this.detalle.nombre + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = '" + this.detalle.url_mmcall + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), agrupador_1 = " + this.detalle.agrupador_1 + ", agrupador_2 = " + this.detalle.agrupador_2 + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();";
    }
    if (this.miSeleccion == 2)
    {
      this.detalle.linea = !this.detalle.linea ? "0" : this.detalle.linea; 
      this.detalle.id_mapa = !this.detalle.id_mapa ? "0" : this.detalle.id_mapa; 
      this.detalle.id_mapa2 = !this.detalle.id_mapa2 ? "0" : this.detalle.id_mapa2; 
      this.detalle.id_mapa3 = !this.detalle.id_mapa3 ? "0" : this.detalle.id_mapa3; 
      this.detalle.id_mapa11 = !this.detalle.id_mapa11 ? "0" : this.detalle.id_mapa11; 
      this.detalle.id_mapa12 = !this.detalle.id_mapa12 ? "0" : this.detalle.id_mapa12; 
      this.detalle.id_mapa13 = !this.detalle.id_mapa13 ? "0" : this.detalle.id_mapa13; 
      this.detalle.id_mapa21 = !this.detalle.id_mapa21 ? "0" : this.detalle.id_mapa21; 
      this.detalle.id_mapa22 = !this.detalle.id_mapa22 ? "0" : this.detalle.id_mapa22; 
      this.detalle.id_mapa23 = !this.detalle.id_mapa23 ? "0" : this.detalle.id_mapa23; 
      this.detalle.id_mapa31 = !this.detalle.id_mapa31 ? "0" : this.detalle.id_mapa31; 
      this.detalle.id_mapa32 = !this.detalle.id_mapa32 ? "0" : this.detalle.id_mapa32; 
      this.detalle.id_mapa33 = !this.detalle.id_mapa33 ? "0" : this.detalle.id_mapa33; 
      this.detalle.paro_wip = !this.detalle.paro_wip ? "N" : this.detalle.paro_wip;

      this.detalle.confirmar_reparacion = !this.detalle.confirmar_reparacion ? "N" : this.detalle.confirmar_reparacion
      this.detalle.oee_historico_rate_reiniciar = !this.detalle.oee_historico_rate_reiniciar ? "1" : this.detalle.oee_historico_rate_reiniciar;
      this.detalle.oee_umbral_produccion = !this.detalle.oee_umbral_produccion ? "0" : this.detalle.oee_umbral_produccion; 
      this.detalle.oee_umbral_alerta = !this.detalle.oee_umbral_alerta ? "0" : this.detalle.oee_umbral_alerta; 
      this.detalle.id_mmcall = !this.detalle.id_mmcall ? "" : this.detalle.id_mmcall == "null" ? "" : this.detalle.id_mmcall;
      this.detalle.id_mmcall; 
      this.detalle.tipo_andon = !this.detalle.tipo_andon ? 0 : this.detalle.tipo_andon;
      this.detalle.oee_historico_rate = !this.detalle.oee_historico_rate ? 0 : this.detalle.oee_historico_rate;
      this.detalle.activar_buffer = !this.detalle.activar_buffer ? "N" : this.detalle.activar_buffer
      this.detalle.usuario = !this.detalle.usuario ? 0 : this.detalle.usuario;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_maquinas (disponibilidad, nombre, referencia, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, linea, agrupador_1, agrupador_2, tipo, oee, oee_umbral_alerta, id_mapa, id_mapa2, id_mapa3, id_mapa11, id_mapa12, id_mapa13, id_mapa21, id_mapa22, id_mapa23, id_mapa31, id_mapa32, id_mapa33, oee_umbral_produccion, oee_historico_rate, oee_historico_rate_reiniciar, confirmar_reparacion, id_mmcall, usuario, tipo_andon, activar_buffer, paro_wip, pieza) VALUES (" + +this.detalle.disponibilidad + ", '" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.url_mmcall + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + +this.detalle.linea + ", " + this.detalle.agrupador_1 + ", "  + this.detalle.agrupador_2  + ", "  + this.detalle.tipo + ", '" + this.detalle.oee + "', " + this.detalle.oee_umbral_alerta + ", " + this.detalle.id_mapa + ", " + this.detalle.id_mapa2 + ", " + this.detalle.id_mapa3 + ", " + this.detalle.id_mapa11 + ", " + this.detalle.id_mapa12 + ", " + this.detalle.id_mapa13 + ", " + this.detalle.id_mapa21 + ", " + this.detalle.id_mapa22 + ", " + this.detalle.id_mapa23 + ", " + this.detalle.id_mapa31 + ", " + this.detalle.id_mapa32 + ", " + this.detalle.id_mapa33 + ", " + this.detalle.oee_umbral_produccion + ", " + this.detalle.oee_historico_rate + ", '" + this.detalle.oee_historico_rate_reiniciar + "', '" + this.detalle.confirmar_reparacion + "', '" + this.detalle.id_mmcall + "', " + this.detalle.usuario + ", " + this.detalle.tipo_andon + ", '" + this.detalle.activar_buffer + "', '" + this.detalle.paro_wip + "', '" + this.detalle.pieza + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET maquinas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_maquinas SET oee_umbral_alerta = " + this.detalle.oee_umbral_alerta + ", confirmar_reparacion = '" + this.detalle.confirmar_reparacion + "', oee_umbral_produccion = " + this.detalle.oee_umbral_produccion + ", id_mapa = " + this.detalle.id_mapa + ", id_mapa2 = " + this.detalle.id_mapa2 + ", id_mapa3 = " + this.detalle.id_mapa3 + ", id_mapa11 = " + this.detalle.id_mapa11 + ", id_mapa12 = " + this.detalle.id_mapa12 + ", id_mapa13 = " + this.detalle.id_mapa13 + ", id_mapa21 = " + this.detalle.id_mapa21 + ", id_mapa22 = " + this.detalle.id_mapa22 + ", id_mapa23 = " + this.detalle.id_mapa23 + ", id_mapa31 = " + this.detalle.id_mapa31 + ", id_mapa32 = " + this.detalle.id_mapa32 + ", id_mapa33 = " + this.detalle.id_mapa33 + ", oee_historico_rate = " + this.detalle.oee_historico_rate + ", oee_historico_rate_reiniciar = '" + this.detalle.oee_historico_rate_reiniciar + "', oee = '" + this.detalle.oee + "', disponibilidad = " + +this.detalle.disponibilidad + ", nombre = '" + this.detalle.nombre + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = '" + this.detalle.url_mmcall + "', id_mmcall = '" + this.detalle.id_mmcall + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), linea = " + +this.detalle.linea + ", agrupador_1 = " + this.detalle.agrupador_1 + ", agrupador_2 = " + this.detalle.agrupador_2 + ", tipo = " + this.detalle.tipo + ", usuario = " + this.detalle.usuario + ", tipo_andon = " + +this.detalle.tipo_andon + ", activar_buffer = '" + this.detalle.activar_buffer + "', paro_wip = '" + this.detalle.paro_wip + "', pieza = '" + this.detalle.pieza + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET maquinas = NOW();";
      }
    }
    else if (this.miSeleccion == 3)
    {
      let audios_ruta = ""
      if (this.detalle.audios_ruta)
      {
        audios_ruta = this.detalle.audios_ruta.replace(/\\/g, '/')
      }
      let audios_prefijo = ""
      if (this.detalle.audios_prefijo)
      {
        audios_prefijo = this.detalle.audios_prefijo.replace(/\\/g, '/')
      }
      this.detalle.recipiente = !this.detalle.recipiente ? 0 : this.detalle.recipiente;
      this.detalle.audios_activar = !this.detalle.audios_activar ? "N" : this.detalle.audios_activar;
      this.detalle.audios_general = !this.detalle.audios_general ? "N" : this.detalle.audios_general;
      this.detalle.cerrar_boton = !this.detalle.cerrar_boton ? "N" : this.detalle.cerrar_boton;
      this.detalle.tecnico = !this.detalle.tecnico ? 0 : this.detalle.tecnico;
      this.detalle.falla = !this.detalle.falla ? 0 : this.detalle.falla;
      this.detalle.botoneras = !this.detalle.botoneras ? "" : this.detalle.botoneras;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_areas (nombre, audios_ruta, audios_activar, audios_prefijo, audios_general, referencia, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, agrupador_1, agrupador_2, id_mmcall, recipiente, cerrar_boton, tecnico, falla, botoneras) VALUES ('" + this.detalle.nombre + "', '" + audios_ruta + "', '" + this.detalle.audios_activar + "', '" + audios_prefijo + "', '" + this.detalle.audios_general + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.url_mmcall + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + this.detalle.agrupador_1 + ", "  + this.detalle.agrupador_2 + ", '"  + this.detalle.id_mmcall + "', " + this.detalle.recipiente + ", '"  + this.detalle.cerrar_boton + "', " + this.detalle.tecnico + ", " + this.detalle.falla + ", '" + this.detalle.botoneras + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_areas SET nombre = '" + this.detalle.nombre + "', audios_ruta = '" + audios_ruta + "', audios_activar = '" + this.detalle.audios_activar + "', audios_prefijo = '" + audios_prefijo + "', audios_general = '" + this.detalle.audios_general + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = '" + this.detalle.url_mmcall + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), agrupador_1 = " + this.detalle.agrupador_1 + ", agrupador_2 = " + this.detalle.agrupador_2 + ", id_mmcall = '" + this.detalle.id_mmcall + "', recipiente = " + this.detalle.recipiente + ", cerrar_boton = '" + this.detalle.cerrar_boton + "', tecnico = " + this.detalle.tecnico + ", falla = " + this.detalle.falla + ", botoneras = '" + this.detalle.botoneras + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();";
      }
    }
    else if (this.miSeleccion == 28)
    {
      //elvis
      this.detalle.por_defecto = !this.detalle.por_defecto ? "" : this.detalle.por_defecto;
      this.detalle.mensaje = this.detalle.mensaje == "null" ? "" : this.detalle.mensaje;
      this.detalle.mensaje_mmcall = this.detalle.mensaje_mmcall == "null" ? "" : this.detalle.mensaje_mmcall;
      this.detalle.titulo = this.detalle.titulo == "null" ? "" : this.detalle.titulo;
      this.detalle.acumular = this.detalle.acumular != "N" && this.detalle.acumular != "S" ? "N" : this.detalle.acumular;
      this.detalle.requerida = this.detalle.requerida != "N" && this.detalle.requerida != "S" ? "N" : this.detalle.requerida;
      
      if (this.seleccionMensaje)
      {
        this.detalle.sms = this.seleccionMensaje.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall = this.seleccionMensaje.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada = this.seleccionMensaje.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo = this.seleccionMensaje.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log = this.seleccionMensaje.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      let alarmaLista = false;
      for (var i = 0; i < this.opcionesSel.length; i++) 
      {
        if (this.opcionesSel[i].alarmar == "S")
        {
          alarmaLista = true;
          break;
        }
      }
      let puede_alarmarse = +this.detalle.alarma_binaria > 0 || this.detalle.minimo || this.detalle.maximo || alarmaLista;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_variables (nombre, referencia, prefijo, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, tipo, unidad, recipiente, tipo_valor, alarma_binaria, minimo, maximo, por_defecto, requerida, maquinas, mensaje, titulo, mensaje_mmcall, sms, correo, llamada, mmcall, puede_alarmarse) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.prefijo + "', '" + this.detalle.notas + "', '" + this.detalle.url_mmcall + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + this.detalle.tipo + ", "  + this.detalle.unidad + ", " + this.detalle.recipiente + ", " + +this.detalle.tipo_valor + ", " + +this.detalle.alarma_binaria + ", " + +this.detalle.minimo + ", " + +this.detalle.maximo + ", '" + this.detalle.por_defecto + "', '" + this.detalle.requerida + "', '" + this.detalle.maquinas + "', '" + this.detalle.mensaje + "', '" + this.detalle.titulo + "', '" + this.detalle.mensaje_mmcall + "', '" + this.detalle.sms + "', '" + this.detalle.correo + "', '" + this.detalle.llamada + "', '" + this.detalle.mmcall + "', '" + puede_alarmarse ? "S" : "N" + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET variables = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_variables SET nombre = '" + this.detalle.nombre + "', estatus = '" + this.detalle.estatus + "', prefijo = '" + this.detalle.prefijo + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = '" + this.detalle.url_mmcall + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), tipo = " + this.detalle.tipo + ", unidad = " + this.detalle.unidad + ", tipo_valor = " + this.detalle.tipo_valor + ", alarma_binaria = " + this.detalle.alarma_binaria + ", minimo = " + this.detalle.minimo + ", maximo = " + this.detalle.maximo + ", por_defecto = '" + this.detalle.por_defecto + "', requerida = '" + this.detalle.requerida + "', maquinas = '" + this.detalle.maquinas + "', recipiente = " + this.detalle.recipiente + ", sensor = " + this.detalle.sensor + ", mensaje = '" + this.detalle.mensaje + "', titulo = '" + this.detalle.titulo + "', mensaje_mmcall = '" + this.detalle.mensaje_mmcall + "', sms = '" + this.detalle.sms + "', llamada = '" + this.detalle.llamada + "', mmcall = '" + this.detalle.mmcall + "', correo = '" + this.detalle.correo + "', puede_alarmarse = '" + puede_alarmarse + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET variables = NOW();";
      }
    }
    else if (this.miSeleccion == 32)
    {
      //elvis
      this.detalle.van = !this.detalle.van ? 0 : this.detalle.van;
      this.detalle.tope = !this.detalle.tope ? 0 : this.detalle.tope;
      this.detalle.por_defecto = !this.detalle.por_defecto ? "" : this.detalle.por_defecto;
      this.detalle.reiniciar_en = !this.detalle.reiniciar_en ? 0 : this.detalle.reiniciar_en;
      this.detalle.mensaje = this.detalle.mensaje == "null" ? "" : this.detalle.mensaje;
      this.detalle.mensaje_mmcall = this.detalle.mensaje_mmcall == "null" ? "" : this.detalle.mensaje_mmcall;
      this.detalle.titulo = this.detalle.titulo == "null" ? "" : this.detalle.titulo;
      this.detalle.acumular = this.detalle.acumular != "N" && this.detalle.acumular != "S" ? "N" : this.detalle.acumular;
      this.detalle.requerida = this.detalle.requerida != "N" && this.detalle.requerida != "S" ? "N" : this.detalle.requerida;
      
      if (this.seleccionMensaje)
      {
        this.detalle.sms = this.seleccionMensaje.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall = this.seleccionMensaje.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada = this.seleccionMensaje.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo = this.seleccionMensaje.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log = this.seleccionMensaje.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      let alarmaLista = false;
      for (var i = 0; i < this.opcionesSel.length; i++) 
      {
        if (this.opcionesSel[i].alarmar == "S")
        {
          alarmaLista = true;
          break;
        }
      }
      let puede_alarmarse = +this.detalle.alarma_binaria > 0 || this.detalle.minimo || this.detalle.maximo || alarmaLista;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_variables (nombre, referencia, prefijo, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, tipo, unidad, recipiente, tipo_valor, alarma_binaria, minimo, maximo, acumular, por_defecto, requerida, maquinas, van, tope, reiniciar, reiniciar_en, sensor, mensaje, titulo, mensaje_mmcall, sms, correo, llamada, mmcall, puede_alarmarse) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.prefijo + "', '" + this.detalle.notas + "', '" + this.detalle.url_mmcall + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + this.detalle.tipo + ", "  + this.detalle.unidad + ", " + this.detalle.recipiente + ", " + +this.detalle.tipo_valor + ", " + +this.detalle.alarma_binaria + ", " + +this.detalle.minimo + ", " + +this.detalle.maximo + ", '" + this.detalle.acumular + "', '" + this.detalle.por_defecto + "', '" + this.detalle.requerida + "', '" + this.detalle.maquinas + "', " + this.detalle.van + ", " + this.detalle.tope + ", '" + (this.detalle.reiniciar ? this.detalle.reiniciar : "N") + "', " + this.detalle.reiniciar_en + ", " + this.detalle.sensor + ", '" + this.detalle.mensaje + "', '" + this.detalle.titulo + "', '" + this.detalle.mensaje_mmcall + "', '" + this.detalle.sms + "', '" + this.detalle.correo + "', '" + this.detalle.llamada + "', '" + this.detalle.mmcall + "', '" + puede_alarmarse ? "S" : "N" + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET variables = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_variables SET nombre = '" + this.detalle.nombre + "', estatus = '" + this.detalle.estatus + "', prefijo = '" + this.detalle.prefijo + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = '" + this.detalle.url_mmcall + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), tipo = " + this.detalle.tipo + ", unidad = " + this.detalle.unidad + ", tipo_valor = " + this.detalle.tipo_valor + ", alarma_binaria = " + this.detalle.alarma_binaria + ", minimo = " + this.detalle.minimo + ", maximo = " + this.detalle.maximo + ", por_defecto = '" + this.detalle.por_defecto + "', acumular = '" + this.detalle.acumular + "', requerida = '" + this.detalle.requerida + "', maquinas = '" + this.detalle.maquinas + "', van = " + this.detalle.van + ", tope = " + this.detalle.tope + ", reiniciar = '" + this.detalle.reiniciar + "', reiniciar_en = " + this.detalle.reiniciar_en + ", recipiente = " + this.detalle.recipiente + ", sensor = " + this.detalle.sensor + ", mensaje = '" + this.detalle.mensaje + "', titulo = '" + this.detalle.titulo + "', mensaje_mmcall = '" + this.detalle.mensaje_mmcall + "', sms = '" + this.detalle.sms + "', llamada = '" + this.detalle.llamada + "', mmcall = '" + this.detalle.mmcall + "', correo = '" + this.detalle.correo + "', puede_alarmarse = '" + puede_alarmarse + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET variables = NOW();";
      }
    }
    else if (this.miSeleccion == 29)
    {
      this.detalle.mensaje = this.detalle.mensaje == "null" ? "" : this.detalle.mensaje;
      this.detalle.mensaje_mmcall = this.detalle.mensaje_mmcall == "null" ? "" : this.detalle.mensaje_mmcall;
      this.detalle.titulo = this.detalle.titulo == "null" ? "" : this.detalle.titulo;

      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_checklists (nombre, referencia, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, tipo, equipo, tiempo, recipiente, mensaje, titulo, mensaje_mmcall) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.url_mmcall + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + this.detalle.tipo + ", "  + this.detalle.equipo + ", " + +this.detalle.tiempo + ", "  + +this.detalle.recipiente + ", '" + this.detalle.mensaje + "', '" + this.detalle.titulo + "', '" + this.detalle.mensaje_mmcall + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET checklists = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_checklists SET nombre = '" + this.detalle.nombre + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = '" + this.detalle.url_mmcall + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), tipo = " + this.detalle.tipo + ", equipo = " + this.detalle.equipo + ", tiempo = " + +this.detalle.tiempo + ", recipiente = " + this.detalle.recipiente + ", mensaje = '" + this.detalle.mensaje + "', titulo = '" + this.detalle.titulo + "', mensaje_mmcall = '" + this.detalle.mensaje_mmcall + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET checklists = NOW();";
      }
    }
    
    else if (this.miSeleccion == 4)
    {
      if (this.detalle.linea == "S")
      {
        this.detalle.maquina = "S";
      }
      if (this.detalle.codigo == "null")
      {
        this.detalle.codigo = "";
      }
      else
      {
        this.detalle.codigo = !this.detalle.codigo ? "" : this.detalle.codigo;
      }
      if (this.detalle.plc == "null")
      {
        this.detalle.plc = "";
      }
      else
      {
        this.detalle.plc = !this.detalle.plc ? "" : this.detalle.plc;
      }
      this.detalle.afecta_oee = !this.detalle.afecta_oee ? "N" : this.detalle.afecta_oee;
      this.detalle.tipo = !this.detalle.tipo ? "0" : this.detalle.tipo;
      this.detalle.ruta = !this.detalle.ruta ? "0" : this.detalle.ruta; 

      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_fallas (nombre, referencia, codigo, plc, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, agrupador_1, agrupador_2, linea, maquina, area, afecta_oee) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.codigo + "', '" + this.detalle.plc + "', '" + this.detalle.notas + "', '" + this.detalle.url_mmcall + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + this.detalle.agrupador_1 + ", "  + this.detalle.agrupador_2 + ", '"  + this.detalle.linea + "', '"  + this.detalle.maquina + "', '"  + this.detalle.area + "', '" + this.detalle.afecta_oee + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET fallas = NOW();"

      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_fallas SET nombre = '" + this.detalle.nombre + "', estatus = '" + this.detalle.estatus + "', codigo = '" + this.detalle.codigo + "', plc = '" + this.detalle.plc + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', afecta_oee = '" + this.detalle.afecta_oee + "', url_mmcall = '" + this.detalle.url_mmcall + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), agrupador_1 = " + this.detalle.agrupador_1 + ", agrupador_2 = " + this.detalle.agrupador_2 + ", linea = '" + this.detalle.linea + "', maquina = '" + this.detalle.maquina + "', area = '" + this.detalle.area + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET fallas = NOW();";
      }
    }
    else if (this.miSeleccion == 25)
    {
      this.detalle.saco_pallets_defecto = !this.detalle.saco_pallets_defecto ? 0 : this.detalle.saco_pallets_defecto;
      this.detalle.kg_saco_defecto = !this.detalle.kg_saco_defecto ? 0 : this.detalle.kg_saco_defecto;
      
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_partes (nombre, referencia, notas, imagen, creado, modificado, creacion, modificacion, maquinas, tipo, ruta, saco_pallets_defecto, kg_saco_defecto) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), '"  + this.detalle.maquinas + "', " + this.detalle.tipo + ", " + this.detalle.ruta + ", " + +this.detalle.saco_pallets_defecto + ", " + +this.detalle.kg_saco_defecto + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET partes = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_partes SET nombre = '" + this.detalle.nombre + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), maquinas = '" + this.detalle.maquinas + "', tipo = " + this.detalle.tipo + ", ruta = " + this.detalle.ruta + ",saco_pallets_defecto = " + +this.detalle.saco_pallets_defecto + ", kg_saco_defecto = " + +this.detalle.kg_saco_defecto + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET partes = NOW();";
      }
    }
    else if (this.miSeleccion == 5)
    {
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_generales (nombre, tabla, url_mmcall, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', " + this.detalle.tabla + ", '" + (this.detalle.tabla == 45 && !this.detalle.url_mmcall ? "N" : this.detalle.url_mmcall) + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_generales SET nombre = '" + this.detalle.nombre + "', url_mmcall = '" + (this.detalle.tabla == 45 && !this.detalle.url_mmcall ? "N" : this.detalle.url_mmcall) + "', tabla = " + this.detalle.tabla + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();";
      }
    }
    else if (this.miSeleccion == 6)
    {
      
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_distribucion (nombre, referencia, telefonos, hora_desde, hora_hasta, correos, mmcall, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.telefonos + "', '" + this.detalle.hora_desde + "', '" + this.detalle.hora_hasta + "', '" + this.detalle.correos + "', '" + this.detalle.mmcall + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET distribucion = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_distribucion SET nombre = '" + this.detalle.nombre + "', telefonos = '" + this.detalle.telefonos + "', referencia = '" + this.detalle.referencia + "', hora_desde = '" + this.detalle.hora_desde + "', hora_hasta = '" + this.detalle.hora_hasta + "', correos = '" + this.detalle.correos + "', mmcall = '" + this.detalle.mmcall + "', estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET distribucion = NOW();";
      }
    }
    else if (this.miSeleccion == 7)
    {
      this.detalle.tipo = !this.detalle.orden ? 0 : this.detalle.tipo;
      this.detalle.consulta = !this.detalle.consulta ? 0 : this.detalle.consulta;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_correos (nombre, para, copia, oculta, titulo, cuerpo, extraccion, tipo, consulta, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.para + "', '" + this.detalle.copia + "', '" + this.detalle.oculta + "', '" + this.detalle.titulo + "', '" + this.detalle.cuerpo + "', '" + this.detalle.extraccion + "', " + +this.detalle.orden + ", " + +this.detalle.consulta + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_correos SET nombre = '" + this.detalle.nombre + "', para = '" + this.detalle.para + "', copia = '" + this.detalle.copia + "', oculta = '" + this.detalle.oculta + "', titulo = '" + this.detalle.titulo + "', cuerpo = '" + this.detalle.cuerpo + "', extraccion = '" + this.detalle.extraccion + "', tipo = " + +this.detalle.tipo + ", consulta = " + +this.detalle.consulta + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
      }
    }
    else if (this.miSeleccion == 8)
    {
      
      if (this.seleccionMensaje)
      {
        this.detalle.sms = this.seleccionMensaje.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall = this.seleccionMensaje.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada = this.seleccionMensaje.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo = this.seleccionMensaje.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log = this.seleccionMensaje.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar1)
      {
        this.detalle.sms1 = this.seleccionescalar1.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall1 = this.seleccionescalar1.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada1 = this.seleccionescalar1.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo1 = this.seleccionescalar1.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log1 = this.seleccionescalar1.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar2)
      {
        this.detalle.sms2 = this.seleccionescalar2.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall2 = this.seleccionescalar2.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada2 = this.seleccionescalar2.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo2 = this.seleccionescalar2.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log2 = this.seleccionescalar2.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar3)
      {
        this.detalle.sms3 = this.seleccionescalar3.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall3 = this.seleccionescalar3.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada3 = this.seleccionescalar3.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo3 = this.seleccionescalar3.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log3 = this.seleccionescalar3.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar4)
      {
        this.detalle.sms4 = this.seleccionescalar4.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall4 = this.seleccionescalar4.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada4 = this.seleccionescalar4.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo4 = this.seleccionescalar4.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log4 = this.seleccionescalar4.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar5)
      {
        this.detalle.sms5 = this.seleccionescalar5.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall5 = this.seleccionescalar5.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada5 = this.seleccionescalar5.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo5 = this.seleccionescalar5.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log5 = this.seleccionescalar5.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      this.detalle.solapar = !this.detalle.solapar ? "S" : this.detalle.solapar;
      this.detalle.mensaje_mmcall = !this.detalle.mensaje_mmcall ? "" : this.detalle.mensaje_mmcall;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_alertas (proceso, evento, referencia, nombre, solapar, tipo, notas, linea, maquina, area, falla, transcurrido, acumular, acumular_veces, acumular_tiempo, acumular_inicializar, log, sms, correo, llamada, mmcall, lista, escalar1, tiempo1, lista1, log1, sms1, correo1, llamada1, mmcall1, repetir1, veces1, escalar2, tiempo2, lista2, log2, sms2, correo2, llamada2, mmcall2, repetir2, veces2, escalar3, tiempo3, lista3, log3, sms3, correo3, llamada3, mmcall3, repetir3, veces3, escalar4, tiempo4, lista4, log4, sms4, correo4, llamada4, mmcall4, repetir4, veces4, escalar5, tiempo5, lista5, log5, sms5, correo5, llamada5, mmcall5, repetir5, veces5, repetir, repetir_tiempo, repetir_veces, informar_resolucion, resolucion_mensaje, cancelacion_mensaje, tiempo0, mensaje, titulo, mensaje_mmcall, creado, modificado, creacion, modificacion, escrep1, escrep2, escrep3, escrep4, escrep5) VALUES ('" + this.detalle.proceso + "', " + this.detalle.evento + ", '" + this.detalle.referencia + "', '" + this.detalle.nombre + "', '" + this.detalle.solapar + "', " + this.detalle.tipo + ", '" + this.detalle.notas + "', '" + this.detalle.linea + "', '" + this.detalle.maquina + "', '" + this.detalle.area + "', '" + this.detalle.falla + "', " + this.detalle.transcurrido + ", '" + this.detalle.acumular + "', " + this.detalle.acumular_veces + ", " + this.detalle.acumular_tiempo + ", '" + this.detalle.acumular_inicializar + "', '" + this.detalle.log + "', '" + this.detalle.sms + "', '" + this.detalle.correo + "', '" + this.detalle.llamada + "', '" + this.detalle.mmcall + "', " + this.detalle.lista + ", '" + this.detalle.escalar1 + "', " + this.detalle.tiempo1 + ", " + this.detalle.lista1 + ", '" + this.detalle.log1 + "', '" + this.detalle.sms1 + "', '" + this.detalle.correo1 + "', '" + this.detalle.llamada1 + "', '" + this.detalle.mmcall1 + "', '" + this.detalle.repetir1 + "', " + this.detalle.veces1 + ", '" + this.detalle.escalar2 + "', " + this.detalle.tiempo2 + ", " + this.detalle.lista2 + ", '" + this.detalle.log2 + "', '" + this.detalle.sms2 + "', '" + this.detalle.correo2 + "', '" + this.detalle.llamada2 + "', '" + this.detalle.mmcall2 + "', '" + this.detalle.repetir2 + "', " + this.detalle.veces2 + ", '" + this.detalle.escalar3 + "', " + this.detalle.tiempo3 + ", " + this.detalle.lista3 + ", '" + this.detalle.log3 + "', '" + this.detalle.sms3 + "', '" + this.detalle.correo3 + "', '" + this.detalle.llamada3 + "', '" + this.detalle.mmcall3 + "', '" + this.detalle.repetir3 + "', " + this.detalle.veces3 + ", '" + this.detalle.escalar4 + "', " + this.detalle.tiempo4 + ", " + this.detalle.lista4 + ", '" + this.detalle.log4 + "', '" + this.detalle.sms4 + "', '" + this.detalle.correo4 + "', '" + this.detalle.llamada4 + "', '" + this.detalle.mmcall4 + "', '" + this.detalle.repetir4 + "', " + this.detalle.veces4 + ", '" + this.detalle.escalar5 + "', " + this.detalle.tiempo5 + ", " + this.detalle.lista5 + ", '" + this.detalle.log5 + "', '" + this.detalle.sms5 + "', '" + this.detalle.correo5 + "', '" + this.detalle.llamada5 + "', '" + this.detalle.mmcall5 + "', '" + this.detalle.repetir5 + "', " + this.detalle.veces5 + ", '" + this.detalle.repetir + "', " + this.detalle.repetir_tiempo + ", " + this.detalle.repetir_veces + ", '" + this.detalle.informar_resolucion + "', '" + this.detalle.resolucion_mensaje + "', '" + this.detalle.cancelacion_mensaje + "', " + this.detalle.tiempo0 + ", '" + this.detalle.mensaje + "', '" + this.detalle.titulo + "', '" + this.detalle.mensaje_mmcall + "',  " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + +this.detalle.escrep1 + ", " + +this.detalle.escrep2 + ", " + +this.detalle.escrep3 + ", " + +this.detalle.escrep4 + ", " + +this.detalle.escrep5 + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_alertas SET estatus = '" + this.detalle.estatus + "', evento = " + this.detalle.evento + ", tiempo0 = " + this.detalle.tiempo0 + ", proceso = '" + this.detalle.proceso + "', referencia = '" + this.detalle.referencia + "', nombre = '" + this.detalle.nombre + "', solapar = '" + this.detalle.solapar + "', tipo = " + this.detalle.tipo + ", notas = '" + this.detalle.notas + "', linea = '" + this.detalle.linea + "', maquina = '" + this.detalle.maquina + "', area = '" + this.detalle.area + "', falla = '" + this.detalle.falla + "', transcurrido = " + this.detalle.transcurrido + ", acumular = '" + this.detalle.acumular + "', acumular_veces = " + this.detalle.acumular_veces + ", acumular_tiempo = " + this.detalle.acumular_tiempo + ", acumular_inicializar = '" + this.detalle.acumular_inicializar + "', log = '" + this.detalle.log + "', sms = '" + this.detalle.sms + "', correo = '" + this.detalle.correo + "', llamada = '" + this.detalle.llamada + "', mmcall = '" + this.detalle.mmcall + "', lista = " + this.detalle.lista + ", escalar1 = '" + this.detalle.escalar1 + "', escrep1 = " + +this.detalle.escrep1+ ", escrep2 = " + +this.detalle.escrep2 + ", escrep3 = " + +this.detalle.escrep3 + ", escrep4 = " + +this.detalle.escrep4 + ", escrep5 = " + this.detalle.escrep5 + ", tiempo1 = " + this.detalle.tiempo1 + ", lista1 = " + this.detalle.lista1 + ", log1 = '" + this.detalle.log1 + "', sms1 = '" + this.detalle.sms1 + "', correo1 = '" + this.detalle.correo1 + "', llamada1 = '" + this.detalle.llamada1 + "', mmcall1 = '" + this.detalle.mmcall1 + "', repetir1 = '" + this.detalle.repetir1 + "', veces1 = " + this.detalle.veces1 + ", escalar2 = '" + this.detalle.escalar2 + "', tiempo2 = " + this.detalle.tiempo2 + ", lista2 = " + this.detalle.lista2 + ", log2 = '" + this.detalle.log2 + "', sms2 = '" + this.detalle.sms2 + "', correo2 = '" + this.detalle.correo2 + "', llamada2 = '" + this.detalle.llamada2 + "', mmcall2 = '" + this.detalle.mmcall2 + "', repetir2 = '" + this.detalle.repetir2 + "', veces2 = " + this.detalle.veces2 + ", escalar3 = '" + this.detalle.escalar3 + "', tiempo3 = " + this.detalle.tiempo3 + ", lista3 = " + this.detalle.lista3 + ", log3 = '" + this.detalle.log3 + "', sms3 = '" + this.detalle.sms3 + "', correo3 = '" + this.detalle.correo3 + "', llamada3 = '" + this.detalle.llamada3 + "', mmcall3 = '" + this.detalle.mmcall3 + "', repetir3 = '" + this.detalle.repetir3 + "', veces3 = " + this.detalle.veces3 + ", escalar4 = '" + this.detalle.escalar4 + "', tiempo4 = " + this.detalle.tiempo4 + ", lista4 = " + this.detalle.lista4 + ", log4 = '" + this.detalle.log4 + "', sms4 = '" + this.detalle.sms4 + "', correo4 = '" + this.detalle.correo4 + "', llamada4 = '" + this.detalle.llamada4 + "', mmcall4 = '" + this.detalle.mmcall4 + "', repetir4 = '" + this.detalle.repetir4 + "', veces4 = " + this.detalle.veces4 + ", escalar5 = '" + this.detalle.escalar5 + "', tiempo5 = " + this.detalle.tiempo5 + ", lista5 = " + this.detalle.lista5 + ", log5 = '" + this.detalle.log5 + "', sms5 = '" + this.detalle.sms5 + "', correo5 = '" + this.detalle.correo5 + "', llamada5 = '" + this.detalle.llamada5 + "', mmcall5 = '" + this.detalle.mmcall5 + "', repetir5 = '" + this.detalle.repetir5 + "', veces5 = " + this.detalle.veces5 + ", repetir = '" + this.detalle.repetir + "', repetir_tiempo = " + this.detalle.repetir_tiempo + ", repetir_veces = " + this.detalle.repetir_veces + ", informar_resolucion = '" + this.detalle.informar_resolucion + "', resolucion_mensaje = '" + this.detalle.resolucion_mensaje + "', cancelacion_mensaje = '" + this.detalle.cancelacion_mensaje + "', mensaje = '" + this.detalle.mensaje + "', titulo = '" + this.detalle.titulo + "', mensaje_mmcall = '" + this.detalle.mensaje_mmcall + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = NOW();"; 
      }
    }
    else if (this.miSeleccion == 9)
    {
      this.detalle.inicia = !this.detalle.inicia ? this.servicio.fecha(1, "", "HH") + ":00:00" : this.detalle.inicia;
      this.detalle.termina = !this.detalle.termina ? this.servicio.fecha(1, "", "HH") + ":59:59" : this.detalle.termina;
      this.detalle.secuencia = !this.detalle.secuencia ? "1" : this.detalle.secuencia;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_turnos (nombre, referencia, inicia, termina, cambiodia, especial, tipo, mover, secuencia, creado, modificado, creacion, modificacion, usuario) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.inicia + "', '" + this.detalle.termina + "', '" + this.detalle.cambiodia + "', '" + this.detalle.especial + "', " + +this.detalle.tipo + ", " + +this.detalle.mover + ", " + this.detalle.secuencia + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + this.detalle.usuario + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_turnos SET nombre = '" + this.detalle.nombre + "', secuencia = " + this.detalle.secuencia + ", referencia = '" + this.detalle.referencia + "', inicia = '" + this.detalle.inicia + "', termina = '" + this.detalle.termina + "', cambiodia = '" + this.detalle.cambiodia + "', especial = '" + this.detalle.especial + "', tipo = " + +this.detalle.tipo + ", mover = " + +this.detalle.mover + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), usuario = " + this.detalle.usuario + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
      }
    }
    else if (this.miSeleccion == 10)
    {
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".traduccion (literal, traduccion) VALUES ('" + this.detalle.literal + "', '" + this.detalle.traduccion + "');"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".traduccion SET literal = '" + this.detalle.literal + "', traduccion = '" + this.detalle.traduccion + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET traducciones = NOW();";
      }
    }
    else if (this.miSeleccion == 12)
    {
      this.detalle.inicia = !this.detalle.inicia ? this.servicio.fecha(1, "", "HH") + ":00:00" : this.detalle.inicia;
      this.detalle.planta = !this.detalle.planta ? 0 : this.detalle.planta;
      this.detalle.departamento = !this.detalle.departamento ? 0 : this.detalle.departamento;
      this.detalle.compania = !this.detalle.compania ? 0 : this.detalle.compania;
      this.detalle.cargo = !this.detalle.cargo ? 0 : this.detalle.cargo;
      this.detalle.politica  = !this.detalle.politica ? 0 : this.detalle.politica;
      this.detalle.turno  = !this.detalle.turno ? 0 : this.detalle.turno;
      this.detalle.idioma  = !this.detalle.idioma ? 0 : this.detalle.idioma;
      this.detalle.plantas  = !this.detalle.plantas ? "S" : this.detalle.plantas;
      this.detalle.correo  = this.detalle.correo == "null" ? "" : this.detalle.correo;
      this.detalle.mapa  = !this.detalle.mapa ? "S" : this.detalle.mapa;
      this.detalle.planta_defecto  = !this.detalle.planta_defecto ? 0 : this.detalle.planta_defecto;
      
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_usuarios (nombre, referencia, notas, rol, politica, linea, maquina, area, operacion, imagen, planta, plantas, mapa, departamento, cargo, correo, compania, turno, idioma, planta_defecto, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.rol + "', " + this.detalle.politica + ", '" + this.detalle.linea + "', '" + this.detalle.maquina + "', '" + this.detalle.area + "', '" + this.detalle.operacion + "', '" + this.detalle.imagen + "', " + this.detalle.planta + ", '" + this.detalle.plantas + "', '" + this.detalle.mapa + "', " + this.detalle.departamento + ", " + this.detalle.cargo + ", '" + this.detalle.correo + "', " + this.detalle.compania + ", " + this.detalle.turno  + ", " + this.detalle.idioma  + ", " + this.detalle.planta_defecto + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET nombre = '" + this.detalle.nombre + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', rol = '" + this.detalle.rol + "', politica = " + this.detalle.politica + ", linea = '" + this.detalle.linea + "', maquina = '" + this.detalle.maquina + "', area = '" + this.detalle.area + "', mapa = '" + this.detalle.mapa + "', plantas = '" + this.detalle.plantas + "', operacion = '" + this.detalle.operacion + "', imagen = '" + this.detalle.imagen + "', planta = " + this.detalle.planta + ", departamento = " + this.detalle.departamento + ", cargo = " + this.detalle.cargo + ", correo = '" + this.detalle.correo + "', compania = " + this.detalle.compania + ", turno = " + this.detalle.turno + ", idioma = " + this.detalle.idioma + ", planta_defecto = " + this.detalle.planta_defecto + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
      }
    }
    
    else if (this.miSeleccion == 14)
    {
      this.detalle.diasvencimiento = !this.detalle.diasvencimiento ? 0 : this.detalle.diasvencimiento;
      this.detalle.aviso = !this.detalle.aviso ? 0 : this.detalle.aviso;
      this.detalle.largo = !this.detalle.largo ? 0 : this.detalle.largo;

      this.detalle.largo = this.detalle.largo < 0 ? 0 : this.detalle.largo > 50 ? 50 : this.detalle.largo;
      this.detalle.diasvencimiento = this.detalle.diasvencimiento < 0 ? 0 : this.detalle.diasvencimiento > 365 ? 365 : this.detalle.diasvencimiento;
      this.detalle.aviso = this.detalle.aviso < 0 ? 0 : this.detalle.aviso > 30 ? 30 : this.detalle.aviso;
      
      this.detalle.especial = "N";
      this.detalle.numeros = "N";
      this.detalle.mayusculas = "N";
      for (var i = 0; i < this.listaComplejidad.selectedOptions.selected.length; i++) 
      {
        if (this.listaComplejidad.selectedOptions.selected[i].value==0)
        {
          this.detalle.especial = "S";
        }
        else if (this.listaComplejidad.selectedOptions.selected[i].value==1)
        {
          this.detalle.numeros = "S";
        }
        else if (this.listaComplejidad.selectedOptions.selected[i].value==2)
        {
          this.detalle.mayusculas = "S";
        }
      }
      this.detalle.complejidad = this.detalle.largo + ";" + this.detalle.especial + ";" + this.detalle.numeros + ";" + this.detalle.mayusculas
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".politicas (nombre, deunsolouso, obligatoria, vence, diasvencimiento, aviso, complejidad, usadas, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.deunsolouso + "', '" + this.detalle.obligatoria + "', '" + this.detalle.vence + "', " + this.detalle.diasvencimiento + ", " + this.detalle.aviso + ", '" + this.detalle.complejidad + "', " + this.detalle.usadas + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET politicas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".politicas SET nombre = '" + this.detalle.nombre + "', deunsolouso = '" + this.detalle.deunsolouso + "', obligatoria = '" + this.detalle.obligatoria + "', vence = '" + this.detalle.vence + "', diasvencimiento = " + this.detalle.diasvencimiento + ", aviso = " + this.detalle.aviso + ", complejidad = '" + this.detalle.complejidad + "', usadas = " + this.detalle.usadas + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET politicas = NOW();";
      }
    }
    else if (this.miSeleccion == 17 && this.vista17==0)
    {
        if (this.yaValidado==-1)
      {
        this.validarSiExiste(1)
        return;
      }
      else
      {
        this.detalle.id = this.yaValidado;
        this.detalle.alto = !this.detalle.alto ? 0 : this.detalle.alto > 1000 ? 1000 : this.detalle.alto;
        this.detalle.bajo = !this.detalle.bajo ? 0 : this.detalle.bajo > 1000 ? 1000 : this.detalle.bajo < 0 ? 0 : this.detalle.bajo;
        sentencia = "INSERT INTO " + this.servicio.rBD() + ".relacion_partes_equipos (parte, equipo, piezas, unidad, tiempo, bajo, alto) VALUES (" + this.detalle.parteID + ", " + this.detalle.equipo + ", " + this.detalle.piezas + ", '" + this.detalle.unidad + "', " + this.detalle.tiempo + ", " + this.detalle.bajo + ", " + this.detalle.alto + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET rates = NOW();"
        if (this.detalle.id > 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".relacion_partes_equipos SET parte = " + this.detalle.parteID + ", equipo = " + this.detalle.equipo + ", piezas = " + this.detalle.piezas + ", unidad = '" + this.detalle.unidad + "', tiempo = " + this.detalle.tiempo + ", bajo = " + this.detalle.bajo + ", alto = " + this.detalle.alto + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET rates = NOW();";
        }
        this.yaValidado = -1;
      }
    }
    else if (this.miSeleccion == 17 && this.vista17 ==1)
    {
      this.detalle.id = this.yaValidado;
      this.detalle.alto = !this.detalle.alto ? 0 : this.detalle.alto > 1000 ? 1000 : this.detalle.alto;
      this.detalle.bajo = !this.detalle.bajo ? 0 : this.detalle.bajo > 1000 ? 1000 : this.detalle.bajo < 0 ? 0 : this.detalle.bajo;
      sentencia = "UPDATE " + this.servicio.rBD() + ".relacion_partes_equipos SET sesion = 'S' WHERE equipo = " + this.equipoAntes + " AND piezas = " + this.piezasAntes + ";"
    }
    else if (this.miSeleccion == 18)
    {
      if (this.yaValidado==-1)
      {
        this.validarSiExiste(2)
        return;
      }
      else
      {
        let miLote = this.detalle.loteID;
        this.loteCreado = 0;
        this.detalle.id = this.yaValidado;
        this.detalle.mensaje_fin = this.detalle.mensaje_fin == "null" ? "" : this.detalle.mensaje_fin;
        this.detalle.mensaje_sobrecarga = this.detalle.mensaje_sobrecarga == "null" ? "" : this.detalle.mensaje_sobrecarga;
        

        sentencia = "INSERT INTO " + this.servicio.rBD() + ".equipos_objetivo (parte, equipo, lote, turno, objetivo, notas, kg_saco, sacos_tarima, sacos, tarimas, mensaje_fin, mensaje_sobrecarga) VALUES (" + this.detalle.parteID + ", " + this.detalle.equipo + ", " + miLote + ", " + this.detalle.turno + ", " + +this.detalle.objetivo + ", '" + this.detalle.notas + "', " + +this.detalle.kg_saco + ", " + +this.detalle.sacos_tarima  + ", " + +this.detalle.sacos + ", " + +this.detalle.tarimas + ", '" + this.detalle.mensaje_fin + "', '" + this.detalle.mensaje_sobrecarga + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET objetivos = NOW();"
        if (this.detalle.id > 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".equipos_objetivo SET parte = " + this.detalle.parteID + ", equipo = " + this.detalle.equipo + ", objetivo = " + this.detalle.objetivo + ", turno = " + this.detalle.turno + ", lote = " + miLote + ", notas = '" + this.detalle.notas + "', kg_saco = " + this.detalle.kg_saco + ", sacos_tarima = " + this.detalle.sacos_tarima + ", sacos = " + this.detalle.sacos + ", tarimas = " + this.detalle.tarimas + ", mensaje_fin =  '" + this.detalle.mensaje_fin + "', mensaje_sobrecarga = '" + this.detalle.mensaje_sobrecarga + "', estatus = '" + this.detalle.estatus + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET objetivos = NOW();";

        }
        this.yaValidado = -1;
      }
    }
    else if (this.miSeleccion == 19)
    {
      if (this.yaValidado==-1)
      {
        this.validarSiExiste(3)
        return;
      }
      else
      {
        this.detalle.id = this.yaValidado;
        this.detalle.desde = this.detalle.desde ? this.detalle.desde : "";
        this.detalle.hasta = this.detalle.hasta ? this.detalle.hasta : "";
        sentencia = "INSERT INTO " + this.servicio.rBD() + ".estimados (linea, equipo, fijo, desde, hasta, oee, efi, dis, ftq) VALUES (" + this.detalle.linea + ", " + this.detalle.equipo + ", '" + this.detalle.fijo + "', " + (this.detalle.desde == "" ? "null" : "'" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "'")  + ", " + (this.detalle.hasta == "" ? "null" : "'" + this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "'")  + ", " + this.detalle.oee + ", " + this.detalle.efi + ", " + this.detalle.ftq + ", " + this.detalle.dis + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET estimados = NOW();"
        if (this.detalle.id > 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".estimados SET linea = " + this.detalle.linea + ", equipo = " + this.detalle.equipo + ", oee = " + this.detalle.oee + ", efi = " + this.detalle.efi + ", dis = " + this.detalle.dis + ", ftq = " + this.detalle.ftq + ", fijo = '" + this.detalle.fijo + "', desde = " + (this.detalle.desde == "" ? "null" : "'" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "'")  + ", hasta = " + (this.detalle.hasta == "" ? "null" : "'" + this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "'")  + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET estimados = NOW();";
        }
        this.yaValidado = -1;
      }
    }
    else if (this.miSeleccion == 20)
    {
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".relacion_procesos_sensores (equipo, sensor, tipo, multiplicador, base, area, clasificacion, creado, modificado, creacion, modificacion, kg_saco_parte) VALUES (" + this.detalle.equipo + ", '" + this.detalle.sensor + "', " + this.detalle.tipo + ", " + this.detalle.multiplicador + ", " + this.detalle.base + ", " + this.detalle.area + ", " + this.detalle.clasificacion + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), '" + this.detalle.kg_saco_parte + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET sensores = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".relacion_procesos_sensores SET equipo = " + this.detalle.equipo + ", sensor = '" + this.detalle.sensor + "', tipo = " + this.detalle.tipo + ", area = " + this.detalle.area + ", clasificacion = " + this.detalle.clasificacion + ", multiplicador = " +  this.detalle.multiplicador + ", base = " +  this.detalle.base + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), kg_saco_parte = '" + this.detalle.kg_saco_parte + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET sensores = NOW();";
      }
    }
    else if (this.miSeleccion == 21)
    {
      this.detalle.fecha = this.detalle.fdesde;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".detalleparos (paro, notas, tipo, area, maquina, inicio, finaliza_sensor, estado, fecha, desde, hasta, origen, tiempo) VALUES ('" + this.detalle.paro + "', '" + this.detalle.notas + "', " + this.detalle.tipo + ", " + this.detalle.area + ", " + this.detalle.maquina + ", " + this.servicio.rUsuario().id + ", '" + this.detalle.finaliza_sensor + "', '" + this.detalle.estado + "', '" +  this.servicio.fecha(2, this.detalle.fecha, "yyyy/MM/dd") + "', '" + this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde + "', '" + this.servicio.fecha(2, this.detalle.fhasta, "yyyy/MM/dd") + " " + this.detalle.hasta + "', 'N', TIME_TO_SEC(TIMEDIFF('" + this.servicio.fecha(2, this.detalle.fhasta, "yyyy/MM/dd") + " " + this.detalle.hasta + "', '" + this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde + "')));UPDATE " + this.servicio.rBD() + ".actualizaciones SET paros = NOW();"
      if (this.detalle.id > 0 && this.detalle.clase == 0 && this.detalle.estado >= "L")
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".detalleparos SET paro = '" + this.detalle.paro + "', notas = '" + this.detalle.notas + "', maquina = " + this.detalle.maquina + ", tipo = " + this.detalle.tipo + ", area = " +  this.detalle.area + ", finaliza_sensor = '" +  this.detalle.finaliza_sensor + "', estatus = '" + this.detalle.estatus + "', estado = '" + this.detalle.estado + "', fecha = '" + this.servicio.fecha(2, this.detalle.fecha, "yyyy/MM/dd") + "', desde = '" + this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde + "', hasta = '" + this.servicio.fecha(2, this.detalle.fhasta, "yyyy/MM/dd") + " " + this.detalle.hasta + "', tiempo = TIME_TO_SEC(TIMEDIFF('" + this.servicio.fecha(2, this.detalle.fhasta, "yyyy/MM/dd") + " " + this.detalle.hasta + "', '" + this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde + "')) WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET paros = NOW();";
        
      }
      else if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".detalleparos SET paro = '" + this.detalle.paro + "', notas = '" + this.detalle.notas + "', tipo = " + this.detalle.tipo + ", area = " +  this.detalle.area + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET paros = NOW();";
        
      }
    }
    else if (this.miSeleccion == 27)
    {
      this.detalle.cantidad_antes = !this.detalle.cantidad_antes ? 0 : this.detalle.cantidad_antes; 
      if (this.detalle.tipo_cantidad == "N")
      {
        this.detalle.cantidad_antes = this.detalle.cantidad; 
      }
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".detallerechazos (rechazo, tipo, area, equipo, fecha, turno, origen, corte, notas, parte, lote, cantidad, cantidad_tc, usuario, actualizacion, cantidad_antes) VALUES ('" + this.detalle.rechazo + "', " + this.detalle.tipo + ", " + this.detalle.area + ", " + this.detalle.equipo + ", '" + this.servicio.fecha(2, this.detalle.fecha, "yyyy/MM/dd") + "', " + this.detalle.turno + ", "  + this.detalle.origen  + ", " + this.corteActual + ", '" + this.detalle.notas + "', " + this.detalle.parte + ", " + this.detalle.lote + ", " + this.detalle.cantidad + ", " + this.detalle.cantidad * this.rateEquipo + ", " + this.servicio.rUsuario().id + ", NOW(), " + this.detalle.cantidad_antes + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET rechazos = NOW();"
      if (this.detalle.existe > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".detallerechazos SET rechazo = '" + this.detalle.rechazo + "', tipo = " + this.detalle.tipo + ", area = " + this.detalle.area + ", equipo = " + this.detalle.equipo + ", fecha = '" + this.servicio.fecha(2, this.detalle.fecha, "yyyy/MM/dd") + "', turno = " + this.detalle.turno + ", corte = " + this.corteActual + ", notas = '" + this.detalle.notas + "', parte = " + this.detalle.parte + ", lote = " + this.detalle.lote + ", cantidad = " + this.detalle.cantidad + ", cantidad_antes = " + this.detalle.cantidad_antes + ", cantidad_tc = " + this.detalle.cantidad * this.rateEquipo + ", usuario = " + this.servicio.rUsuario().id + ", actualizacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET rechazos = NOW();";
        
      }
    }
    else if (this.miSeleccion == 30)
    {
      let laFecha = "NULL";
      if (this.detalle.fdesde)
      {
        laFecha = "'" + this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde + "'";
      }
      let laHora = "";
      if (this.detalle.hora)
      {
        laHora =  "'" + (this.detalle.hora.length == 4 ? this.detalle.hora +  ":00" : this.detalle.hora) + "'";
      }
      if (this.seleccionMensaje)
      {
        this.detalle.sms = this.seleccionMensaje.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall = this.seleccionMensaje.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada = this.seleccionMensaje.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo = this.seleccionMensaje.findIndex(c => c=="C") > -1 ? "S" : "N";
      }
      if (this.seleccionMensaje2)
      {
        this.detalle.sms2 = this.seleccionMensaje2.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall2 = this.seleccionMensaje2.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada2 = this.seleccionMensaje2.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo2 = this.seleccionMensaje2.findIndex(c => c=="C") > -1 ? "S" : "N";
      }
      this.detalle.asignacion = !this.detalle.asignacion ? 0 : this.detalle.asignacion;
      this.detalle.tipo = !this.detalle.tipo ? 0 : this.detalle.tipo;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".plan_checklists (nombre, referencia, imagen, fecha, notas, frecuencia, hora, checklists, anticipacion, tiempo, creado, modificado, creacion, modificacion, mensaje, sms, llamada, correo, mmcall, asignacion, sms2, llamada2, correo2, mmcall2, ejecucion, tipo, titulo, mensaje_mmcall, mensaje2, titulo2, mensaje_mmcall2) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.imagen + "', " + laFecha + ", '" + this.detalle.notas + "', '"  + this.detalle.frecuencia + "', " + laHora + ", '" + this.detalle.checklists + "', '" + this.detalle.asignadores + "', '" + this.detalle.anticipacion + "', " + +this.detalle.tiempo + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), '" + this.detalle.mensaje + "', '" + this.detalle.sms + "', '" + this.detalle.llamada + "', '" + this.detalle.correo + "', '" + this.detalle.mmcall + "', " + +this.detalle.asignacion + ", '" + this.detalle.sms2 + "', '" + this.detalle.llamada2 + "', '" + this.detalle.correo2 + "', '" + this.detalle.mmcall2 + "', '" + +this.detalle.ejecucion + "',  " + +this.detalle.tipo + ", '" + this.detalle.titulo + "', '" + this.detalle.mensaje_mmcall + "', '" + this.detalle.mensaje2 + "', '" + this.detalle.titulo2 + "', '" + this.detalle.mensaje_mmcall2 + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET planes_checklists = NOW();";
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".plan_checklists SET nombre = '" + this.detalle.nombre + "', referencia = '" + this.detalle.referencia + "', mensaje = '" + this.detalle.mensaje + "', sms = '" + this.detalle.sms + "', llamada = '" + this.detalle.llamada + "', mmcall = '" + this.detalle.mmcall + "', correo = '" + this.detalle.correo + "', mensaje2 = '" + this.detalle.mensaje2 + "', sms2 = '" + this.detalle.sms2 + "', llamada2 = '" + this.detalle.llamada2 + "', mmcall2 = '" + this.detalle.mmcall2 + "', correo2 = '" + this.detalle.correo2 + "', imagen = '" + this.detalle.imagen + "', fecha = " +  (!this.detalle.fdesde ? "NULL" : "'" + this.servicio.fecha(2, this.detalle.fdesde, "yyyy/MM/dd") + " " + this.detalle.desde + "'") + ", frecuencia = '" + this.detalle.frecuencia + "', hora = " + laHora + ", checklists = '" + this.detalle.checklists + "', asignadores = '" + this.detalle.asignadores + "', asignacion = " + +this.detalle.asignacion + ", tipo = " + this.detalle.tipo + ", anticipacion = '" + this.detalle.anticipacion + "', mensaje_mmcall = '" + this.detalle.mensaje_mmcall + "', titulo = '" + this.detalle.titulo + "', ejecucion = '" + this.detalle.ejecucion + "', mensaje_mmcall2 = '" + this.detalle.mensaje_mmcall2 + "', titulo2 = '" + this.detalle.titulo2 + "', notas = '" + this.detalle.notas + "', tiempo = " + +this.detalle.tiempo + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET planes_checklists = NOW();";
        
      }
    }
    
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (this.detalle.id == 0)
      {
        sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_lineas;";
        if (this.miSeleccion == 2)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_maquinas;";
        }
        else if (this.miSeleccion == 3)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_areas;";
        }
        else if (this.miSeleccion == 28)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_variables;";
        }
        else if (this.miSeleccion == 4)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_fallas;";
        }
        else if (this.miSeleccion == 25)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_partes;";
        }
        else if (this.miSeleccion == 5)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_generales;";
        }
        else if (this.miSeleccion == 6)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_distribucion;";
        }
        else if (this.miSeleccion == 7)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_correos;";
        }
        else if (this.miSeleccion == 8)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_alertas;";
        }
        else if (this.miSeleccion == 9)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_turnos;";
        }
        else if (this.miSeleccion == 10)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".traduccion;";
        }
        else if (this.miSeleccion == 12)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_usuarios;";
        }
        else if (this.miSeleccion == 14)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".politicas;";
        }
        else if (this.miSeleccion == 17 && this.vista17==0)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".relacion_partes_equipos;";
        }
        else if (this.miSeleccion == 18)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".equipos_objetivo;";
        }
        else if (this.miSeleccion == 19)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".estimados;";
        }
        else if (this.miSeleccion == 20)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".relacion_procesos_sensores;";
        }
        else if (this.miSeleccion == 21)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".detalleparos;";
        }
        else if (this.miSeleccion == 27)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".detallerechazos;";
        }
        else if (this.miSeleccion == 29)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_checklists;";
        }
        else if (this.miSeleccion == 30)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".plan_checklists;";
        }
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          this.detalle.id = resp[0].nuevoid
          this.detalle.creacion = new Date();
          this.detalle.creado = this.servicio.rUsuario().nombre;
          this.guardar_2();
        })
      }
      else
      {
        this.guardar_2();
      }
      this.detalle.modificado = this.servicio.rUsuario().nombre;
      this.detalle.modificacion = new Date();
      this.bot3 = false;
      this.bot4 = false;
      this.bot5 = true;
      this.bot6 = this.detalle.estatus == "A";
      this.bot7 = true;

      this.bot1Sel = false;
      this.bot2Sel = false;
      this.bot3Sel = false;
      this.bot4Sel = false;
      this.bot5Sel = false;
      this.bot6Sel = false;
      this.bot7Sel = false;
    
      

      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[1384]
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      setTimeout(() => {
        this.txtNombre.nativeElement.focus();
      }, 400);
      
    })
  
  }

  guardar_2()
  {
    let seleccionados
    let seleccionados1
    let seleccionados2
    let seleccionados3
    let seleccionados4
    let seleccionados5
    let seleccionados6
    let seleccionados7
    if (this.miSeleccion == 7)
    {
      seleccionados = this.listaListad.selectedOptions.selected;
    }
    if (this.miSeleccion == 30)
    {
      seleccionados = this.lista2.selectedOptions.selected;
      seleccionados1 = this.lista3.selectedOptions.selected;
    }
    else if (this.miSeleccion == 12)
    {
      seleccionados2 = this.lista2.selectedOptions.selected;
      seleccionados4 = this.lista4.selectedOptions.selected;
    }
    else if (this.miSeleccion == 4)
    {
      seleccionados1 = this.lista1.selectedOptions.selected;
      seleccionados2 = this.lista2.selectedOptions.selected;
      seleccionados3 = this.lista3.selectedOptions.selected;
    }
    else if (this.miSeleccion == 25)
    {
      seleccionados2 = this.lista2.selectedOptions.selected;
    }
    else if (this.miSeleccion == 17 && this.vista17==1)
    {
      seleccionados5 = this.lista3.selectedOptions.selected;
    }
    if (this.miSeleccion==7)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".det_correo WHERE correo = " + +this.detalle.id + ";"
        if (seleccionados)
        {
          cadTablas = cadTablas + "INSERT INTO " + this.servicio.rBD() + ".det_correo (correo, reporte) VALUES";
          for (var i = 0; i < seleccionados.length; i++) 
          {

            if (cadTablas.indexOf("(" + this.detalle.id + ", " + seleccionados[i].value + ")") == -1)
            {
              cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados[i].value + "),";
            }

          }
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }
      if (this.miSeleccion==30)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".det_plan_checklists WHERE plan = " + +this.detalle.id + ";"
        if (seleccionados)
        {
          if (seleccionados.length > 0)
          {
            cadTablas = cadTablas + "INSERT INTO " + this.servicio.rBD() + ".det_plan_checklists (plan, checklist) VALUES";
            for (var i = 0; i < seleccionados.length; i++) 
            {
              cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados[i].value + "),";
            }
          }
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        cadTablas = cadTablas + ";DELETE FROM " + this.servicio.rBD() + ".relacion_plan_checklists WHERE plan = " + +this.detalle.id + " AND tipo = " + this.detalle.asignacion + ";";
        if (seleccionados1)
        {
          if (seleccionados1.length > 0)
          {
            cadTablas = cadTablas + "INSERT INTO " + this.servicio.rBD() + ".relacion_plan_checklists (plan, registro, tipo) VALUES "
            for (var i = 0; i < seleccionados1.length; i++) 
            {
              cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados1[i].value + ", " + this.detalle.asignacion + "),";
            }
          }
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }

      if (this.miSeleccion==12)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + +this.detalle.id + ";DELETE FROM " + this.servicio.rBD() + ".relacion_usuarios_operaciones WHERE usuario = " + +this.detalle.id;
        if (seleccionados4.length > 0)
        {
          cadTablas = cadTablas + ";INSERT INTO " + this.servicio.rBD() + ".relacion_usuarios_opciones (usuario, opcion) VALUES "
          for (var i = 0; i < seleccionados4.length; i++) 
          {
            if (cadTablas.indexOf("(" + this.detalle.id + ", " + seleccionados4[i].value + ")") == -1)
            {
              cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados4[i].value + "),";
            }
          }
          cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        
        }
        
        if (seleccionados2.length > 0)
        {
          cadTablas = cadTablas + ";INSERT INTO " + this.servicio.rBD() + ".relacion_usuarios_operaciones (usuario, proceso, tipo) VALUES";
          for (var i = 0; i < seleccionados2.length; i++) 
          {
            if (cadTablas.indexOf("(" + this.detalle.id + ", " + seleccionados2[i].value + ")") == -1)
            {
              cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados2[i].value + ", 2),";
            }
          }
          cadTablas = cadTablas.substr(0, cadTablas.length - 1);
          
        }
        
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }

      if (this.miSeleccion==4)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".relacion_fallas_operaciones WHERE falla = " + +this.detalle.id + ";";
        if (seleccionados1.length > 0 || seleccionados2.length > 0 || seleccionados3.length > 0)
        {
          cadTablas = cadTablas + "INSERT INTO " + this.servicio.rBD() + ".relacion_fallas_operaciones (falla, proceso, tipo) VALUES";
          
          
          for (var i = 0; i < seleccionados1.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados1[i].value + ", 1),";
          }
          for (var i = 0; i < seleccionados2.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados2[i].value + ", 2),";
          }
          for (var i = 0; i < seleccionados3.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados3[i].value + ", 3),";
          }          
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }
      else if (this.miSeleccion == 8)
      {
        seleccionados1 = this.lista1.selectedOptions.selected;
        seleccionados2 = this.lista2.selectedOptions.selected;
        seleccionados3 = this.lista3.selectedOptions.selected;
        seleccionados4 = this.lista4.selectedOptions.selected;
        if (this.lista5)
        {
          seleccionados5 = this.lista5.selectedOptions.selected;  
        }
        else
        {
          seleccionados5 = "";
        }
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".relacion_alertas_operaciones WHERE alerta = " + +this.detalle.id + ";";
        if (seleccionados1.length > 0 || seleccionados2.length > 0 || seleccionados3.length > 0 || seleccionados4.length > 0 || seleccionados5.length > 0)
        {
          cadTablas = cadTablas + "INSERT INTO " + this.servicio.rBD() + ".relacion_alertas_operaciones (alerta, proceso, tipo) VALUES";
          
          
          for (var i = 0; i < seleccionados1.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados1[i].value + ", 1),";
          }
          for (var i = 0; i < seleccionados2.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados2[i].value + ", 2),";
          }
          for (var i = 0; i < seleccionados3.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados3[i].value + ", 3),";
          }
          for (var i = 0; i < seleccionados4.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados4[i].value + ", 4),";
          }
          if (seleccionados5)
          {
            for (var i = 0; i < seleccionados5.length; i++) 
            {
              cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados5[i].value + ", 5),";
            }
          }
                    
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }
      else if (this.miSeleccion == 25)
      {
        let cadTablas = "";
        if (seleccionados2.length > 0)
        {
          cadTablas = cadTablas + "DELETE FROM " + this.servicio.rBD() + ".relacion_partes_maquinas WHERE parte = " + +this.detalle.id + ";INSERT INTO " + this.servicio.rBD() + ".relacion_partes_maquinas (parte, maquina) VALUES";
          for (var i = 0; i < seleccionados2.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados2[i].value + "),";
          }
          cadTablas = cadTablas.substr(0, cadTablas.length - 1);
          let campos = {accion: 200, sentencia: cadTablas};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
          });
        }
      }
      else if (this.miSeleccion==28)
      {
        let cadTablas = "";
        seleccionados2 = this.lista2.selectedOptions.selected;
        if (seleccionados2.length > 0)
        {
          cadTablas = "DELETE FROM " + this.servicio.rBD() + ".relacion_variables_equipos WHERE variable = " + +this.detalle.id + ";INSERT INTO " + this.servicio.rBD() + ".relacion_variables_equipos (variable, maquina) VALUES";
          for (var i = 0; i < seleccionados2.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados2[i].value + "),";
          }
          cadTablas = cadTablas.substr(0, cadTablas.length - 1) + ";";
        }
        cadTablas = cadTablas + "DELETE FROM " + this.servicio.rBD() + ".variables_valores WHERE variable = " + +this.detalle.id + ";";
        if (this.opcionesSel.length > 0)
        {
          cadTablas = cadTablas + "INSERT INTO " + this.servicio.rBD() + ".variables_valores (variable, orden, valor, alarmar, defecto) VALUES";
          for (var i = 0; i < this.opcionesSel.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + (i + 1) + ", '" + this.opcionesSel[i].valor + "', '" + this.opcionesSel[i].alarmar + "', '" + this.opcionesSel[i].defecto + "'),";
          }
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1) ;
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }
      else if (this.miSeleccion==32)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".variables_valores WHERE variable = " + +this.detalle.id + ";";
        if (this.opcionesSel.length > 0)
        {
          cadTablas = cadTablas + "INSERT INTO " + this.servicio.rBD() + ".variables_valores (variable, orden, valor, alarmar, defecto) VALUES";
          for (var i = 0; i < this.opcionesSel.length; i++) 
          {
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + (i + 1) + ", '" + this.opcionesSel[i].valor + "', '" + this.opcionesSel[i].alarmar + "', '" + this.opcionesSel[i].defecto + "'),";
          }
        }
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }
      else if (this.miSeleccion==29)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".det_checklist WHERE checklist = " + +this.detalle.id + ";";
        let primero = false;
        for (var i = 0; i < this.opcionesSel.length; i++) 
        {
          if (this.opcionesSel[i].seleccionado)
          {
            if (!primero)
            {
              cadTablas = cadTablas + "INSERT INTO " + this.servicio.rBD() + ".det_checklist (checklist, variable, orden) VALUES";
              primero = true;
            }
            cadTablas = cadTablas +  "(" + this.detalle.id + ", " + this.opcionesSel[i].id + ", " + +(i + 1) + "),";
          }
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }
      else if (this.miSeleccion == 27)
      {
        let cadAdicional = "";
        let cantidadRestar = this.cantidadActual;
        if (this.detalle.campos)
        {
          if (this.detalle.campos.length !=  4)
          {
            let misCampos = this.detalle.campos.split(";");
            if (misCampos[0] != this.servicio.fecha(2, this.detalle.fecha, "yyyy/MM/dd") || misCampos[1] != this.detalle.equipo || misCampos[2] !=  + this.detalle.parte || misCampos[3] !=  + this.detalle.turno || misCampos[4] !=  + this.detalle.lote)
            {
              cadAdicional = "UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET calidad = calidad - " + +this.cantidadActual + ", calidad_tc = calidad_tc - " + (+this.cantidadActual * this.rateEquipoOriginal) + " WHERE corte = " + this.detalle.corte + ";UPDATE " + this.servicio.rBD() + ".lecturas_cortes SET calidad = calidad - " + +this.cantidadActual + ", calidad_tc = calidad_tc - " + (+this.cantidadActual * this.rateEquipoOriginal) + ", calidad_clasificada = calidad_clasificada - " + this.cantidadActual + (this.detalle.tipo_cantidad == "N" ? (", produccion = produccion - " + +this.cantidadActual + ", produccion_tc = produccion_tc - " + (+this.cantidadActual * this.rateEquipoOriginal)) : "") + " WHERE id = " + this.detalle.corte;
              cantidadRestar = 0;
            }
          }
        }
        if (this.detalle.origen==0)
        {
          let cadTablas = "UPDATE " + this.servicio.rBD() + ".lecturas_cortes SET calidad_clasificada = calidad_clasificada + " + (+this.detalle.cantidad - this.cantidadActual) + " WHERE id = " + this.corteActual;
          let campos = {accion: 200, sentencia: cadTablas};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
          });
        }
        else if (this.detalle.origen == 1)
        {
          let cadAdic = "";
          if (this.detalle.cantidad_antes > 0)
          {
            cadAdic = ", produccion = produccion + " + (+this.detalle.cantidad - cantidadRestar) + ", produccion_tc = produccion_tc + " + (+this.detalle.cantidad - cantidadRestar) * this.rateEquipo;
          }
          let cadTablas = "UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET calidad = calidad + " + (+this.detalle.cantidad - cantidadRestar) + cadAdic + ", calidad_tc = calidad_tc + " + (+this.detalle.cantidad - cantidadRestar) * this.rateEquipo + " WHERE corte = " + this.corteActual + ";UPDATE " + this.servicio.rBD() + ".lecturas_cortes SET calidad = calidad + " + (+this.detalle.cantidad - cantidadRestar) + ", calidad_tc = calidad_tc + " + (+this.detalle.cantidad - cantidadRestar) * this.rateEquipo + ", calidad_clasificada = calidad_clasificada + " + +(this.detalle.cantidad - cantidadRestar) + cadAdic + " WHERE id = " + this.corteActual + cadAdicional;
          let campos = {accion: 200, sentencia: cadTablas};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
          });
        }
        this.detalle.campos = this.servicio.fecha(2, this.detalle.fecha, "yyyy/MM/dd") + ";" + this.detalle.equipo + ";" + this.detalle.parte + ";" + this.detalle.turno + ";" + this.detalle.lote;
        this.detalle.existe = 1;
        this.buscarRate(1)

        this.detalle.nuevo = false;
        //this.detalle.fecha = new Date(this.detalle.fecha + " 23:00:00")

        this.cantidadActual = this.detalle.cantidad;
        this.detalle.corte = this.corteActual;
        this.cantidadValidada = false;
        
      }
      if (this.miSeleccion==1 || this.miSeleccion==2)
      {
        this.disponibilidad.lunes = !this.disponibilidad.lunes ? 0 : this.disponibilidad.lunes; 
        this.disponibilidad.martes = !this.disponibilidad.martes ? 0 : this.disponibilidad.martes; 
        this.disponibilidad.miercoles = !this.disponibilidad.miercoles ? 0 : this.disponibilidad.miercoles; 
        this.disponibilidad.jueves = !this.disponibilidad.jueves ? 0 : this.disponibilidad.jueves; 
        this.disponibilidad.viernes = !this.disponibilidad.viernes ? 0 : this.disponibilidad.viernes; 
        this.disponibilidad.sabado = !this.disponibilidad.sabado ? 0 : this.disponibilidad.sabado; 
        this.disponibilidad.domingo = !this.disponibilidad.domingo ? 0 : this.disponibilidad.domingo; 

        this.disponibilidad.lunes = this.disponibilidad.lunes < 0 ? 0 : this.disponibilidad.lunes; 
        this.disponibilidad.martes = this.disponibilidad.martes < 0 ? 0 : this.disponibilidad.martes; 
        this.disponibilidad.miercoles = this.disponibilidad.miercoles < 0 ? 0 : this.disponibilidad.miercoles; 
        this.disponibilidad.jueves = this.disponibilidad.jueves < 0 ? 0 : this.disponibilidad.jueves; 
        this.disponibilidad.viernes = this.disponibilidad.viernes < 0 ? 0 : this.disponibilidad.viernes; 
        this.disponibilidad.sabado = this.disponibilidad.sabado < 0 ? 0 : this.disponibilidad.sabado; 
        this.disponibilidad.domingo = this.disponibilidad.domingo < 0 ? 0 : this.disponibilidad.domingo; 

        this.disponibilidad.lunes = this.disponibilidad.lunes > 86400 ? 86400 : this.disponibilidad.lunes; 
        this.disponibilidad.martes = this.disponibilidad.martes > 86400 ? 86400 : this.disponibilidad.martes; 
        this.disponibilidad.miercoles = this.disponibilidad.miercoles > 86400 ? 86400 : this.disponibilidad.miercoles; 
        this.disponibilidad.jueves = this.disponibilidad.jueves > 86400 ? 86400 : this.disponibilidad.jueves; 
        this.disponibilidad.viernes = this.disponibilidad.viernes > 86400 ? 86400 : this.disponibilidad.viernes; 
        this.disponibilidad.sabado = this.disponibilidad.sabado > 86400 ? 86400 : this.disponibilidad.sabado; 
        this.disponibilidad.domingo = this.disponibilidad.domingo > 86400 ? 86400 : this.disponibilidad.domingo; 

          let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".disponibilidad WHERE" + (this.miSeleccion == 1 ? " linea = " : " maquina = ") + +this.detalle.id + ";INSERT INTO " + this.servicio.rBD() + ".disponibilidad (" + (this.miSeleccion == 1 ? "linea" : "maquina") + ", lunes, martes, miercoles, jueves, viernes, sabado, domingo, estatus) VALUES(" + +this.detalle.id + ", " + +this.disponibilidad.lunes + ", " + +this.disponibilidad.martes + ", " + +this.disponibilidad.miercoles + ", " + +this.disponibilidad.jueves + ", " + +this.disponibilidad.viernes + ", " + +this.disponibilidad.sabado + ", " + +this.disponibilidad.domingo + ", '" + (this.detalle.disponibilidad == 0 ? "I" : "A") + "');";
          let campos = {accion: 200, sentencia: cadTablas};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
          });
        }
    
      if (this.miSeleccion == 17 && this.vista17 ==1)
      {
        this.sentenciaRate = "";
        for (var i = 0; i < seleccionados5.length; i++) 
        {
          this.actualizarRate(seleccionados5[i].value, i == seleccionados5.length - 1, 1)
        }
      }
  }

  validarCantidad()
  {
    let cantidadRestar = 0
    if (!this.detalle.nuevo) 
    {
      cantidadRestar = this.cantidadActual
    }
    if (this.detalle.origen == 0)
    {
      let sentencia = "SELECT calidad, (calidad_clasificada - " + cantidadRestar + " + " + this.detalle.cantidad + ") AS clasificada FROM " + this.servicio.rBD() + ".lecturas_cortes WHERE id = " + this.corteActual;   
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          if (+resp[0].clasificada > +resp[0].calidad)
          {
            const respuesta = this.dialogo.open(DialogoComponent, {
              width: "480px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1427], tiempo: 0, mensaje: this.servicio.rTraduccion()[1486].replace("campo_0", (resp[0].clasificada * 1)) + (resp[0].calidad * 1) + "</strong>", alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_falla" }
            })
            respuesta.afterClosed().subscribe(result => {
              setTimeout(() => {
                this.txtT1.nativeElement.focus();  
              }, 100);
              
            })
            this.bot3 = true;
            
          }
          else
          {
            this.buscarRate(0)
          }
        }
        else
        {
          this.buscarRate(0)
        }
      })
    }
    else
    {
      
      if (this.detalle.campos.length != 4)
      {
        let misCampos = this.detalle.campos.split(";");
        if (misCampos[0] != this.servicio.fecha(2, this.detalle.fecha, "yyyy/MM/dd") || misCampos[1] != this.detalle.equipo || misCampos[2] !=  + this.detalle.parte || misCampos[3] !=  + this.detalle.turno || misCampos[4] !=  + this.detalle.lote)
        {
          cantidadRestar = 0;
        }
           
      }
      let sentencia = "SELECT id, produccion + " + (this.detalle.tipo_cantidad == "N" ? (+this.detalle.cantidad - cantidadRestar) : 0) + " AS produccion, calidad + " + (+this.detalle.cantidad - cantidadRestar) + " AS calidad FROM " + this.servicio.rBD() + ".lecturas_cortes WHERE equipo = " + this.detalle.equipo + " AND parte = " + this.detalle.parte + " AND turno = " + this.detalle.turno + " AND orden = " + this.detalle.lote + " AND dia = '" + this.servicio.fecha(2, this.detalle.fecha + " 10:00:00", "yyyy/MM/dd") + "' ";   
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          if (+resp[0].calidad > +resp[0].produccion)
          {
            const respuesta = this.dialogo.open(DialogoComponent, {
              width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1427], tiempo: 0, mensaje: this.servicio.rTraduccion()[1487].replace("campo_0", (resp[0].calidad * 1)) + (resp[0].produccion * 1) + "</strong>", alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_falla" }
            })
            respuesta.afterClosed().subscribe(result => {
              setTimeout(() => {
                this.txtT1.nativeElement.focus();  
              }, 100);
              
            })
            this.bot3 = true;
            
          }
          else
          {
            this.corteActual = resp[0].id;
            this.buscarRate(0)
          }
        }
        else
        {
          const respuesta = this.dialogo.open(DialogoComponent, {
            width: "480px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1427], tiempo: 0, mensaje: this.servicio.rTraduccion()[1488], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_falla" }
          })
          respuesta.afterClosed().subscribe(result => {
            setTimeout(() => {
              this.txtT1.nativeElement.focus();  
            }, 100);
            
          })
          this.bot3 = true;
        }
      })
    }
    
  }

  buscarRate(id: number)
  {
    this.rateEquipo = 1;
    let sentencia = "SELECT 1, piezas, tiempo FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE (equipo = " + this.detalle.equipo + " OR equipo = 0) AND (parte = " + this.detalle.parte + " OR parte = 0) ORDER BY parte DESC, equipo DESC LIMIT 1;";   
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        resp[0].piezas = !resp[0].piezas ? 1 : resp[0].piezas == 0 ? 1 : resp[0].piezas;
        if (resp[0].tiempo == 2)
        {
          this.rateEquipo = 3600 / resp[0].piezas;
        }
        else if (resp[0].tiempo == 1)
        {
          this.rateEquipo = 60 / resp[0].piezas;
        }
        else if (resp[0].tiempo == 0)
        {
          this.rateEquipo = 1 / resp[0].piezas;
        }
        else if (resp[0].tiempo == 3)
        {
          this.rateEquipo = 86400 / resp[0].piezas;
        }
        if (id == 0)
        {
          this.cantidadValidada = true;
          this.guardar()
        }
        else
        {
          this.rateEquipoOriginal = this.rateEquipo;
        }
        
      }
      else
      {
        if (id == 0)
        {
          this.cantidadValidada = true;
          this.guardar()
        }
        else
        {
          this.rateEquipoOriginal = this.rateEquipo;
        }
      }
    })
    
  }
  
  actualizarRate(parte: number, ultimo: boolean, accion: number)
  {
    let sentencia = "";
    if (accion == 1)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE equipo = " + this.detalle.equipo + " AND parte = " + parte + ";";
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        this.actualizarRate(parte, ultimo, resp.length == 0 ? 2 : 3);
      })
    }
    else
    {
      if (accion == 2)
      {
        this.sentenciaRate = this.sentenciaRate + "INSERT INTO " + this.servicio.rBD() + ".relacion_partes_equipos (parte, equipo, piezas, unidad, tiempo, bajo, alto) VALUES (" + parte + ", " + this.detalle.equipo + ", " + this.detalle.piezas + ", '" + this.detalle.unidad + "', " + this.detalle.tiempo + ", " + this.detalle.bajo + ", " + this.detalle.alto + ");"
      }
      else
      {
        this.sentenciaRate = this.sentenciaRate + "UPDATE " + this.servicio.rBD() + ".relacion_partes_equipos SET sesion = 'N', equipo = " + this.detalle.equipo + ", piezas = " + this.detalle.piezas + ", unidad = '" + this.detalle.unidad + "', tiempo = " + this.detalle.tiempo + ", bajo = " + this.detalle.bajo + ", alto = " + this.detalle.alto + " WHERE parte = " + parte + " AND equipo = " + this.equipoAntes + ";";
      }
      if (ultimo)
      {
        this.sentenciaRate = this.sentenciaRate + "UPDATE " + this.servicio.rBD() + ".actualizaciones SET rates = NOW();DELETE FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE sesion = 'S' AND piezas = " + this.piezasAntes +  " AND equipo = " + this.equipoAntes + ";";
        let campos = {accion: 200, sentencia: this.sentenciaRate};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          
        })
      }
    }
  }

  validarSiExiste(tabla: number)
  {
    this.yaValidado = 0;
    let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE parte = " + this.detalle.parteID + " AND equipo = " + this.detalle.equipo;
    if (tabla == 2)
    {
      //sentencia = "SELECT id FROM " + this.servicio.rBD() + ".equipos_objetivo WHERE parte = " + this.detalle.parteID + " AND lote = " + this.detalle.loteID + " AND turno = " + this.detalle.turno + " AND equipo = " + this.detalle.equipo;
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".equipos_objetivo WHERE lote = " + this.detalle.loteID;
    }
    else if (tabla == 3)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".estimados WHERE linea = " + this.detalle.linea + " AND equipo = " + this.detalle.equipo;
      if (this.detalle.fijo == 'S')
      {
        sentencia = sentencia + " AND fijo = 'S'"
      }
      else
      {
        sentencia = sentencia + " AND fijo = 'N' AND desde = '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "' AND hasta = '" + this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "'";
      }
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.yaValidado = resp[0].id;
      }
      this.guardar();
    })

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

  regresar()
  {
    if (this.editando && !this.cancelarEdicion)
    {
      this.deshacerEdicion(0, 99)
      return;
    }
    this.volver()
  }

  volver()
  {
    this.bot1Sel = false;
    this.bot2Sel = false;
    this.bot3Sel = false;
    this.bot4Sel = false;
    this.bot5Sel = false;
    this.bot6Sel = false;
    this.bot7Sel = false;
    this.botonera1 = 1;
    this.noLeer = false,
    this.rRegistros(this.miSeleccion);
    this.cambiarVista(0);
    this.contarRegs();
  }

  imagenErrorRegistro()
  {
    //if (this.accion == "in")
    {
      this.mostrarImagenRegistro = "N";
      if (this.detalle.imagen)
      {
        this.mensajeImagen = this.servicio.rTraduccion()[1883];
      }
      else
      {
        this.mensajeImagen = this.servicio.rTraduccion()[358];
      }
      
    }
  }

  onFileSelected(event)
  {
    this.bot3 = true;
    this.bot4 = true;
    this.bot5 = false;
    this.bot6 = false;
    this.bot7 = false;
      
    const fd = new FormData();
    fd.append('imagen', event.target.files[0], event.target.files[0].name);
    this.editando = true;
    this.faltaMensaje = this.servicio.rTraduccion()[134]
    this.cancelarEdicion = false;
    this.mensajeImagen = this.servicio.rTraduccion()[358]
    this.detalle.imagen = this.URL_IMAGENES + event.target.files[0].name;
    this.faltaMensaje = this.servicio.rTraduccion()[134]
    this.cancelarEdicion = false;
        

    /** In Angular 5, including the header Content-Type can invalidate your request */
    this.http.post(this.URL_BASE, fd)
    .subscribe(res => {
      console.log(this.URL_BASE);
      console.log(res);
      
        this.detalle.modificacion = null;
        this.detalle.modificado = "";
        this.cancelarEdicion = false;
        this.mostrarImagenRegistro = "S";
        this.mensajeImagen = this.servicio.rTraduccion()[358]

        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[1389]
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      })
  }

cambiando(evento: any)
  {
    this.validarCU = false;
    this.cantidadValidada = false;
    if (!this.editando)
    {
      this.bot3 = true;
      this.bot4 = true;
      this.bot5 = false;
      this.bot6 = false;
      this.bot7 = false;
      this.editando = true;
      this.faltaMensaje = this.servicio.rTraduccion()[134]
      this.detalle.modificacion = null;
      this.detalle.modificado = "";
      this.cancelarEdicion = false;
      if (this.miSeleccion== 4)
      {
        this.validarCU = false;
        this.validarM = false;
      }
      this.validarUSER = false;
      
    }
    if (evento.target)
    {
      if (evento.target.name)
      {
        if (evento.target.name == "imagen")
        {
          this.mostrarImagenRegistro = "S";
          this.mensajeImagen = this.servicio.rTraduccion()[358]
        }
      }
    }
  }
  
  nuevo(modo: number)
  {
    this.creando = false;
    if (modo == 1)
    {
      if (this.editando && !this.cancelarEdicion)
      {
        this.deshacerEdicion(0, 2)
        return;
      } 
      
    } 
    else
    {
      this.modelo = 14;
    }
    this.nuevo_siguiente()
  }
  
  calcularHR(segundos: number)
  {
    let cadHora = "";
    if (!segundos)
    {
      cadHora = "";
    }
    else if (segundos == 0)
    {
      cadHora = this.servicio.rTraduccion()[371];
    }
    else if (segundos > 0 && segundos <= 60)
    {
      cadHora = this.servicio.rTraduccion()[372];
    }
    else if ((segundos / 3600) < 1)
    {
      cadHora = (segundos / 60).toFixed(1) + this.servicio.rTraduccion()[373] 
    }
    else
    {
      cadHora = (segundos / 3600).toFixed(2) + this.servicio.rTraduccion()[374] 
    }
    return cadHora
  }

  iniDisp()
  {
    this.disponibilidad.lunes = 86400;
    this.disponibilidad.martes = 86400;
    this.disponibilidad.miercoles = 86400;
    this.disponibilidad.jueves = 86400;
    this.disponibilidad.viernes = 86400;
    this.disponibilidad.sabado = 86400;
    this.disponibilidad.domingo = 86400;
    
  }

  nuevo_siguiente()
  {

      this.iniDisp();
      this.copiandoDesde = 0;
      this.yaValidado = -1;
      this.preguntarAC = false;
      this.error01 = false;
      this.error02 = false;
      this.error03 = false;
      this.error04 = false;
      this.error05 = false;
      this.error06 = false;
      this.error07 = false;
      this.error08 = false;
      this.error09 = false;
      this.error10 = false;
      this.error20 = false;
      this.error21 = false;
      this.error22 = false;
      this.error23 = false;
      this.error24 = false;
      this.error25 = false;
      this.error30 = false;
      this.error31 = false;
      this.error32 = false;
      this.error33 = false;
      this.error34 = false;
      this.error35 = false;
      this.despuesBusqueda = 0;
      this.error01 = false;
      this.error02 = false;
      this.verTabla = false;
      this.nExtraccion = "0";
      this.adecuar();
      this.botonera1 = 2;
      this.detalle.referencia = "";
      this.detalle.notas = "";
      this.detalle.literal = "";
      this.detalle.traduccion = "";
      this.detalle.imagen = "";
      this.detalle.nombre = "";
      this.detalle.inicia = this.servicio.fecha(1, "", "HH") + ":00:00";
      this.detalle.termina = this.servicio.fecha(1, "", "HH") + ":59:00";
      this.detalle.hora_desde = "00:00:00";
      this.detalle.hora_hasta = "23:59:00";
      this.detalle.cambiodia = "N";
      this.detalle.especial = "N";
      this.detalle.tipo = "0";
      this.detalle.mover = "0";
      //
      
      this.detalle.telefonos = "";
      this.detalle.mmcall = "";
      this.detalle.correos = "";
      //
      this.detalle.agrupador_1 = "0";
      this.detalle.oee = "S";
      this.detalle.activar_buffer = "N";
      this.detalle.paro_wip = "N";
      this.detalle.agrupador_2 = "0";
      this.detalle.tipo = "0";
      this.mostrarImagenRegistro = "S";
      this.mensajeImagen = this.servicio.rTraduccion()[358]
      this.detalle.imagen = "";
      
      this.detalle.url_mmcall = "";
      this.detalle.estatus = "A";
      this.detalle.disponibilidad = 0;
      this.detalle.id = 0;
      this.detalle.creado = "";
      this.detalle.modificado = "";
      this.detalle.modificacion = null;
      this.detalle.creacion = null;

      ///
      this.seleccionMensaje = ["M", "C"];
      this.seleccionMensaje2 = ["M", "C"];
      this.seleccionescalar1 = ["C"];
      this.seleccionescalar2 = ["C"];
      this.seleccionescalar3 = ["C"];
      this.seleccionescalar4 = ["C"];
      this.seleccionescalar5 = ["C"];
      this.detalle.evento = "1";
      this.detalle.tiempo = 0;
      this.detalle.solapar = "S";
      this.detalle.tipo = "1";
      this.detalle.falla = "0";
      this.detalle.acumular = "N";
      this.detalle.repetir_veces = 0;
      this.detalle.repetir_tiempo = 0;
      this.detalle.transcurrido = 0;
      this.detalle.repetir = "N";
      this.detalle.escalar1 = "N";
      this.detalle.escalar2 = "N";
      this.detalle.escalar3 = "N";
      this.detalle.escalar4 = "N";
      this.detalle.escalar5 = "N";
      this.detalle.lista = "0";
      this.detalle.lista1 = "0";
      this.detalle.lista2 = "0";
      this.detalle.lista3 = "0";
      this.detalle.lista4 = "0";
      this.detalle.lista5 = "0";
      this.detalle.mensaje = "";
      this.detalle.mensaje_mmcall = "";
      this.detalle.acumular_veces = 0;
      this.detalle.titulo = "";
      this.detalle.tiempo1 = 0;
      this.detalle.repetir1 = "N";
      this.detalle.veces1 = 0;
      this.detalle.veces2 = 0;
      this.detalle.tiempo2 = 0;
      this.detalle.repetir2 = "N";
      this.detalle.veces3 = 0;
      this.detalle.tiempo3 = 0;
      this.detalle.repetir3 = "N";
      this.detalle.veces4 = 0;
      this.detalle.tiempo4 = 0;
      this.detalle.repetir4 = "N";
      this.detalle.veces5 = 0;
      this.detalle.tiempo5 = 0;
      this.detalle.repetir5 = "N";
      this.detalle.informar_resolucion = "N";
      this.detalle.resolucion_mensaje = "";
      this.detalle.cancelacion_mensaje = "";
      this.detalle.acumular_inicializar = "N";
      this.selListadoT = "S";
      this.detalle.titulo = "";
      this.detalle.cuerpo = "";
      this.detalle.para = "";
      this.detalle.copia = "";
      this.detalle.oculta = "";
      this.nFrecuencia = "T";
      this.nLapso = "0";
      this.nExtraccion = "0";
      this.nHorario = "T";
      this.opciones = "S";
      this.detalle.escrep1 = 0;
      this.detalle.escrep2 = 0;
      this.detalle.escrep3 = 0;
      this.detalle.escrep4 = 0;
      this.detalle.escrep5 = 0;
      ///
      this.llenarListas(1, this.servicio.rBD() + ".cat_generales", " WHERE tabla = " + this.miSeleccion * 10);
      this.llenarListas(2, this.servicio.rBD() + ".cat_generales", " WHERE tabla = " + (this.miSeleccion * 10 + 5));
      ///
      if (this.miSeleccion==12)
      {
        this.detalle.linea = "S";
        this.detalle.maquina = "S";
        this.detalle.operacion = "S";
        this.detalle.mapa = "S";
        this.detalle.area = "S";     
        this.detalle.compania = "0";     
        this.detalle.planta = "0";
        this.detalle.politica = "0";     
        this.detalle.departamento = "0";     
        this.detalle.turno = "0";     
        this.detalle.inicializada=='S';   
        this.asociarTablas(0);
      }
      else if (this.miSeleccion==4)
      {
        this.detalle.linea = "S";
        this.detalle.maquina = "S";
        this.detalle.area = "S";
        this.detalle.afecta_oee = "N";  
        this.detalle.codigo = ""   
        this.detalle.plc = ""
        this.asociarTablasFalla(0);
      }
      else if (this.miSeleccion==7)
      {
        this.detalle.tipo = 0;
        this.listarListados(0);
      }
      else if (this.miSeleccion==5)
      {
        this.detalle.tabla = "10";
      }
      else if (this.miSeleccion==2)
      {
        this.detalle.oee_historico_rate = 0;
      this.detalle.usuario = 0;
      }
      else if (this.miSeleccion==3)
      {
        this.detalle.audios_activar = "N";
        this.detalle.audios_general = "N";
        this.detalle.recipiente = 0;
        this.detalle.tecnico = 0;
        this.detalle.recipiente = 0;
        this.detalle.cerrar_boton = "N";
        this.detalle.botoneras = "";
        this.detalle.id_mmcall = "";
        this.llenarListas(200, this.servicio.rBD() + ".cat_usuarios", " WHERE ROL = 'T' ");
        this.llenarListas(205, this.servicio.rBD() + ".cat_fallas", "");
        this.llenarListas(29, this.servicio.rBD() + ".cat_distribucion", "");
      }
      else if (this.miSeleccion==25)
      {
        this.detalle.maquinas = "S";
        this.detalle.saco_pallets_defecto = 0;
        this.detalle.kg_saco_defecto = 0;
        this.detalle.tipo = "0";
        this.detalle.ruta = "0";
        this.asociarTablasHerramental(0);
        this.llenarListas(93, this.servicio.rBD() + ".cat_rutas", "");
      }
      else if (this.miSeleccion==14)
      {
        this.detalle.deunsolouso = "N";
        this.detalle.obligatoria = "S";
        this.detalle.vence = "S";     
        this.detalle.diasvencimiento = 365;   
        this.detalle.aviso = 7;   
        this.detalle.largo = 10;
        this.detalle.especial = "S";
        this.detalle.numeros = "S";
        this.detalle.mayusculas = "S";
        this.detalle.usadas = "5";
     
      }
      else
      {
        this.detalle.linea = "0";
        this.detalle.maquina = "0";
        this.detalle.area = "0";
      }
      if (this.miSeleccion == 2) 
      {

        /* this.detalle.id_mapa = "";

        this.detalle.id_mapa2 = "";
        this.detalle.id_mapa3 = "";
        this.detalle.id_mapa11 = "";
        this.detalle.id_mapa12 = "";
        this.detalle.id_mapa13 = "";
        this.detalle.id_mapa21 = "";
        this.detalle.id_mapa22 = "";
        this.detalle.id_mapa23 = "";
        this.detalle.id_mapa31 = "";
        this.detalle.id_mapa32 = "";

        this.detalle.id_mapa33 = ""; */
        this.detalle.tipo = "0";

        this.llenarListas(3, this.servicio.rBD() + ".cat_lineas", "");
        this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 ");
        this.llenarListas(22, this.servicio.rBD() + ".cat_usuarios", "");
      }
      else if (this.miSeleccion==8) 
      {
        this.detalle.evento = "0";
        this.detalle.linea = "S";
        this.detalle.falla = "S";
        this.detalle.proceso = "S";
        this.detalle.maquina = "S";
        this.detalle.area = "S";     
        this.asociarTablasAlerta(0);
        this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", "");
        this.detalle.escalar1 = "N";
        this.detalle.escalar2 = "N";
        this.detalle.escalar3 = "N";
        this.detalle.escalar4 = "N";
        this.detalle.escalar5 = "N";
        let filtroTabla = " WHERE idioma = " + this.servicio.rIdioma().id + " AND estatus = 'A' AND (alerta < 200" 
        if (this.servicio.rVersion().modulos[5] == 1)
        {
          filtroTabla = filtroTabla + " OR alerta BETWEEN 200 AND 300"
        }
        if (this.servicio.rVersion().modulos[4] == 1)
        {
          filtroTabla = filtroTabla + " OR alerta BETWEEN 300 AND 400"
        }
        if (this.servicio.rVersion().modulos[6] == 1)
        {
          filtroTabla = filtroTabla + " OR alerta BETWEEN 400 AND 500"
        }
        filtroTabla = filtroTabla + ")"
        this.llenarListas(31, this.servicio.rBD() + ".int_eventos", filtroTabla);
      }
      else if (this.miSeleccion == 28) 
      {
        this.llenarListas(1110, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 110 ");
        this.llenarListas(1115, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 115 ");
        this.llenarListas(149, this.servicio.rBD() + ".cat_distribucion", "")
        this.llenarListas(114, this.servicio.rBD() + ".cat_maquinas", " WHERE a.oee = 'S' ");
        this.asociarValores(0);
        this.asociarVariablesMaquinas(0);
        this.detalle.unidad = "0";
        this.detalle.tipo = "0";
        this.detalle.maquinas = "S";
        this.detalle.lista = "";
        this.detalle.prefijo = "";
        this.detalle.url_mmcall = "";
        this.detalle.unidad = "0";
        this.detalle.tipo = "0";
        this.detalle.minimo = "";
        this.detalle.maximo = "";
        this.detalle.por_defecto = "";
        this.detalle.lista = "";
        this.detalle.tipo_valor = 0;
        this.activarNumero = true;
        this.detalle.alarma_binaria = 0;
        this.detalle.acumular = "N";
        this.detalle.requerida = 0;
        this.detalle.recipiente = 0;
        this.detalle.requerida = "N";
      }
      else if (this.miSeleccion == 29) 
      {
        this.llenarListas(160, this.servicio.rBD() + ".cat_maquinas", "");
        this.llenarListas(100, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 70 ");
        this.llenarListas(1120, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 120 ");
        this.llenarListas(149, this.servicio.rBD() + ".cat_distribucion", "")
        this.detalle.departamento = "0";
        this.detalle.tipo = "0";
        this.detalle.equipo = "0";
        this.detalle.tiempo = "0";
        this.detalle.recipiente = "0";
        this.detalle.variables = "S";
        this.variables(0);
      }
      else if (this.miSeleccion == 30) 
      {
        this.llenarListas(1121, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 120 " );
        this.detalle.fdesde = "";
        this.detalle.desde = "";
        this.detalle.asignacion = 0;
        this.detalle.tipo = 0;
        this.detalle.asignadores = "S";
        this.detalle.ejecucion = "S";
        this.checklistRegistros();
        this.detalle.mensaje2 = "";
        this.detalle.mensaje_mmcall2 = "";
        this.detalle.titulo2 = "";
        this.detalle.frecuencia = "T";
        this.checklistPlan(0);
        this.detalle.anticipacion = "N";
        this.detalle.tiempo = 0;
        this.detalle.seleccionMensaje = ["C"];
        this.detalle.seleccionMensaje2 = ["C"];
  
      }
      else if (this.miSeleccion == 5) 
      {
        this.llenarListas(5, this.servicio.rBD() + ".cat_areas", "");
      }
      else if (this.miSeleccion == 2) 
      {
        this.detalle.pieza = "N";
        this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 ");
      }
      else if (this.miSeleccion == 12) 
      {
        this.detalle.admin = 'N';
        this.detalle.rol = "O";
        this.detalle.pantas = "S";
        this.detalle.correo = "";
        this.detalle.idioma = 0;
        this.detalle.cargo = 0;
        this.detalle.planta_defecto = 0;
        this.colocarOpciones()
        this.llenarListas(10, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 70 ");
        this.llenarListas(110, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 130 " );
        this.llenarListas(11, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 80 ");
        this.llenarListas(12, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 90 ");
        this.llenarListas(14, this.servicio.rBD() + ".cat_turnos", "");
        this.llenarListas(13, this.servicio.rBD() + ".politicas", "" );
        this.llenarListas(105, this.servicio.rBD() + ".cat_idiomas", "" );
      }
      else if (this.miSeleccion == 17) 
      {
        this.llenarListas(16, this.servicio.rBD() + ".cat_maquinas", "");
        this.llenarListas(15, this.servicio.rBD() + ".cat_partes", ""); 
        this.detalle.parteID = 0;
        this.detalle.parte = this.servicio.rTraduccion()[1495];
        this.detalle.equipo = 0;
        this.detalle.tiempo = "0";
        this.detalle.piezas = "0";
        this.detalle.unidad = "";
        if (this.vista17==1)
        {
          this.piezasAntes = 0;
          this.equipoAntes = -1;
          this.llenarPartes(true);
          this.detalle.parte = "N";
          this.detalle.piezas = "";
        }
      }
      else if (this.miSeleccion == 18) 
      {

        this.loteCreado = 0;
        this.creando = true;

        this.llenarListas(16, this.servicio.rBD() + ".cat_maquinas", "");
        this.llenarListas(15, this.servicio.rBD() + ".cat_partes", "");
        this.llenarListas(17, this.servicio.rBD() + ".lotes", "WHERE a.estado <> 99 AND a.estatus = 'A'");
        this.llenarListas(18, this.servicio.rBD() + ".cat_turnos", "");
        this.detalle.parteID = 0;

        this.detalle.kg_sacos = 0;
        this.detalle.sacos_tarima = 0;
        this.detalle.parte = "";
        this.detalle.mensaje_fin = "";
        this.detalle.mensaje_sobrecarga = "";
        this.detalle.loteID = 0;
        this.detalle.lote = "";        

        this.detalle.equipo = "0";
        this.detalle.turno = "0";
        this.detalle.objetivo = "0";
        this.detalle.sacos = "0";
        this.detalle.tarimas = "0";
        this.detalle.sacos_tarima = 0;
        this.detalle.kg_saco = 0;
      }
      else if (this.miSeleccion == 19) 
      {
        this.llenarListas(16, this.servicio.rBD() + ".cat_maquinas", "");
        this.llenarListas(19, this.servicio.rBD() + ".cat_lineas", "");
        this.detalle.linea = "-1";
        this.detalle.equipo = "-1";
        this.detalle.oee = "0";
        this.detalle.ftq = "0";
        this.detalle.dis = "0";
        this.detalle.efi = "0";
        this.detalle.fijo = "S";
        this.detalle.desde = "";
        this.detalle.hasta = "";
      }
      else if (this.miSeleccion == 20) 
      {
        this.detalle.kg_saco_parte = "N";
        
        this.llenarListas(20, this.servicio.rBD() + ".cat_maquinas", "");
        this.llenarListas(5, this.servicio.rBD() + ".cat_areas", "");
        this.llenarListas(107, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 105 " );
     
        this.detalle.equipo = "-1";
        this.detalle.multiplicador = "1";
        this.detalle.base = "0";
        this.detalle.sensor = "";
        this.detalle.tipo = "0";
        this.detalle.area = "0";
        this.detalle.clasificacion = "0";
      }
      else if (this.miSeleccion == 21) 
      {
        this.paroEnCurso = false;
        this.detalle.maquina = "0";
        this.llenarListas(23, this.servicio.rBD() + ".cat_areas", "");
        this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 45 ");
        this.llenarListas(4, this.servicio.rBD() + ".cat_maquinas", " WHERE a.oee = 'S' ");    
        this.detalle.tipo = "0";
        this.detalle.estado = "P";
        this.detalle.clase = 0;
        this.detalle.area = "0";
        this.detalle.paro = "";
        this.detalle.finaliza_sensor = "S";
        this.detalle.desde = "00:00:00";
        this.detalle.hasta = "23:59:59";
        this.detalle.notas = "";
        //this.detalle.masivo = "N";
        //this.detalle.hora_inicial = "00:00:00";
        //this.detalle.hora_final = "00:59:59";
        this.detalle.fdesde = new Date();
        this.detalle.fhasta = new Date();
      }
      else if (this.miSeleccion == 27) 
      {
        this.detalle.tipo_cantidad = "S";
        this.detalle.parte = "0";
        this.detalle.turno = "0";
        this.detalle.equipo = "0";
        if (this.loteLista)
        {
          this.detalle.lote = "0";
          this.lotes = [];
        }
        else
        {
          this.detalle.orden = "";
          this.detalle.lote = "0";
          this.fechasLote = [];
          this.turnosLote = [];
        }
        this.detalle.area = "0";
        this.detalle.tipo = "0";
        this.detalle.rechazo = "";
        this.detalle.notas = "";
        this.detalle.origen = "1";
        this.detalle.cantidad = "0";
        this.detalle.existe = 0;
        this.detalle.nuevo = true;
        this.detalle.campos = ";;;;";
        this.corteActual = 0;
        this.detalle.fecha = "0"; //new Date();
        this.llenarListas(23, this.servicio.rBD() + ".cat_areas", "");
        this.llenarListas(115, this.servicio.rBD() + ".cat_partes", "");
        this.llenarListas(118, this.servicio.rBD() + ".cat_turnos", "");
        this.llenarListas(106, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 105 " );
        this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1420])
        this.llenarListas(104, this.servicio.rBD() + ".cat_maquinas", " WHERE a.oee = 'S' ");  
        this.cantidadValidada = false;   
        this.cantidadActual = 0; 
      }
      else if (this.miSeleccion == 9) 
      {
        this.detalle.usuario = 0;
        this.llenarListas(22, this.servicio.rBD() + ".cat_usuarios", "");
      }
      else if (this.miSeleccion == 7) 
      {
        this.llenarListas(900, this.servicio.rBD() + ".consultas_cab a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.usuario = b.id ", "WHERE (a.publico = 'S' OR a.usuario = 1) AND NOT ISNULL(a.nombre) AND a.nombre <> ''");
        this.detalle.orden = 0;
        this.detalle.tipo = 0;
        this.detalle.consulta = "0";
      }
      this.bot1Sel = false;
      this.bot2Sel = false;
      this.bot3Sel = false;
      this.bot4Sel = false;
      this.bot5Sel = false;
      this.bot6Sel = false;
      this.bot7Sel = false;
      this.bot3 = true;
      this.bot4 = true;
      this.bot5 = false;
      this.bot6 = false;
      this.bot7 = false;
      this.editando = true;
      this.faltaMensaje = this.servicio.rTraduccion()[134]
      setTimeout(() => {
        if (this.miSeleccion < 17 || this.miSeleccion == 21 || this.miSeleccion == 25 || this.miSeleccion == 27 || this.miSeleccion >= 28)
        {
          if (this.txtNombre)
          {
            this.txtNombre.nativeElement.focus();
          }  
        }
        if (this.miSeleccion == 18)
        {
          if (this.txtT9)
          {
            this.txtT9.nativeElement.focus();
          }  
        }
        else
        {
          if (this.lstC0)
          {
            if (this.vista17== 1)
            {
              this.txtT1.nativeElement.focus();
            }
            else
            {
              this.lstC0.focus();
            }
          }
        }
        
        this.animando = true;       
      }, 400);
}


  edicionCancelada()
  {
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = this.servicio.rTraduccion()[1388]
    mensajeCompleto.tiempo = 2000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
  }

  cancelar()
  {
    if (this.bot4 && this.modelo == 4)
    {
      this.bot4Sel = false;
      this.edicionCancelada();              
      this.despuesBusqueda = 0;
      if (this.detalle.id == 0)
      {
        this.inicializarPantalla();
        return;
      }
      else
      {
        this.editar(-1)
      }
    }
  }

  inicializarPantalla()
  {
    this.editando = false;
    this.detalle = [];
    this.detalle.admin = 'N';
    this.detalle.id = 0;
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.error04 = false;
    this.error05 = false;
    this.error06 = false;
    this.error07 = false;
    this.error08 = false;
    this.error09 = false;
    this.error10 = false;
    this.error20 = false;
    this.error21 = false;
    this.error22 = false;
    this.error23 = false;
    this.error24 = false;
    this.error25 = false;
    this.error30 = false;
    this.error31 = false;
    this.error32 = false;
    this.error33 = false;
    this.error34 = false;
    this.error35 = false;
    this.faltaMensaje = "";
    //
      
    this.detalle.nombre = "";
      this.detalle.referencia = "";
      this.detalle.notas = "";
      this.detalle.imagen = "";
      this.detalle.nombre = "";
      //
      this.detalle.linea = "0";
      this.detalle.maquina = "0";
      this.detalle.area = "0";
      this.detalle.telefonos = "";
      this.detalle.mmcall = "";
      this.detalle.correos = "";
      //
      this.detalle.agrupador_1 = "0";
      this.detalle.agrupador_2 = "0";
      this.detalle.tipo = "0";
      this.mostrarImagenRegistro = "S";
      this.mensajeImagen = this.servicio.rTraduccion()[358]
      this.detalle.imagen = "";
      this.detalle.url_mmcall = "";
      this.detalle.estatus = "A";
      this.detalle.id = 0;
      this.detalle.creado = "";
      this.detalle.modificado = "";
      this.detalle.modificacion = null;
      this.detalle.creacion = null;
    //
    this.detalle.referencia = "";
    this.detalle.disponibilidad = "0";
    this.detalle.nombre = "";
    this.detalle.inicia = this.servicio.fecha(1, "", "HH") + ":00:00";
    this.detalle.termina = this.servicio.fecha(1, "", "HH") + ":59:00";
    this.detalle.cambiodia = "N";
    this.detalle.especial = "N";
    this.detalle.tipo = "0";
    this.detalle.mover = "0";
      
    this.cancelarEdicion = false;
    this.mostrarImagenRegistro = "S";
    this.editando = false;
    this.detalle.estatus = "A"
    this.bot1Sel = false;
    this.bot2Sel = false;
    this.bot3Sel = false;
    this.bot4Sel = false;
    this.bot5Sel = false;
    this.bot6Sel = false;
    this.bot7Sel = false;
    this.bot3 = false;
    this.bot4 = false;
    this.bot5 = false;
    this.bot6 = false;
    this.bot7 = false;
    if (this.miSeleccion==12)
    {
      this.detalle.area = "S";
      this.detalle.maquina = "S";
      this.detalle.operacion = "S";
      this.detalle.mapa = "S";
      this.detalle.linea = "S";
      this.detalle.plantas = "S";
      this.detalle.correo = "";
      this.detalle.idioma = 0;
      this.detalle.planta_defecto = 0;
      this.asociarTablas(0);
    }
    else if (this.miSeleccion==4)
    {
      this.detalle.area = "S";
      this.detalle.maquina = "S";
      this.detalle.linea = "S";
      this.asociarTablasFalla(0);
    
    }
    else if (this.miSeleccion==25)
    {
      this.detalle.maquinas = "S";
      this.asociarTablasHerramental(0);
    
    }
    else if (this.miSeleccion==28)
    {
      this.detalle.maquinas = "S";
      this.asociarVariablesMaquinas(0);
      this.asociarValores(0);
      this.detalle.mensaje = "";
      this.detalle.titulo = "";
      this.detalle.mensaje_mmcall = "";
    }
    else if (this.miSeleccion==32)
    {
      this.asociarVariablesMaquinas(0);
      this.asociarValores(0);
      this.detalle.mensaje = "";
      this.detalle.titulo = "";
      this.detalle.mensaje_mmcall = "";
    }
    else if (this.miSeleccion==17)
    {
      this.piezasAntes = 0;
      this.equipoAntes = -1;
      if (this.vista17==0)
      {
        this.detalle.equipo = "-1";
        this.detalle.parte = "-1";
        this.detalle.tiempo = "0";
        this.detalle.piezas = 0;
        this.detalle.alta = 0;
        this.detalle.baja = 0;
        this.detalle.unidad = "";
      
      }
      else
      {
        this.detalle.equipo = "-1";
        this.detalle.parte = "N";
        this.detalle.tiempo = "0";
        this.detalle.piezas = 0;
        this.detalle.alta = 0;
        this.detalle.baja = 0;
        this.detalle.unidad = "";
      }  
    
    }
    else if (this.miSeleccion==18)
    {
      this.detalle.parteID = 0;
      this.detalle.parte = this.servicio.rTraduccion()[1495];
      this.detalle.loteID = 0;
      this.detalle.lote = this.servicio.rTraduccion()[1495];
      
      this.detalle.equipo = "0";
      this.detalle.turno = "0";
      this.detalle.objetivo = "0";
      this.detalle.fijo = "S";
      this.detalle.desde = "";
      this.detalle.hasta = "";
      this.detalle.reinicio = "0";
    }

    else if (this.miSeleccion==19)
    {
      this.detalle.linea = "-1";
      this.detalle.equipo = "-1";
      this.detalle.oee = "0";
      this.detalle.dis = "0";
      this.detalle.ftq = "0";
      this.detalle.efi = "0";
      this.detalle.fijo = "S";
      this.detalle.desde = "";
      this.detalle.hasta = "";
    }
    else if (this.miSeleccion==20)
    {
      this.detalle.equipo = "-1";
      this.detalle.multiplicador = "1";
      this.detalle.base = "0";
      this.detalle.tipo = "0";
      this.detalle.clasificacion = "0";
      this.detalle.area = "0";
    }
    else if (this.miSeleccion==29)
    {
      this.detalle.mensaje = "";
      this.detalle.titulo = "";
      this.detalle.mensaje_mmcall = "";
    }
    else if (this.miSeleccion==21)
    {
      this.detalle.maquinas = "S";
      this.llenarListas(4, this.servicio.rBD() + ".cat_maquinas", " WHERE a.oee = 'S' ");
      this.detalle.tipo = "0";
      this.detalle.estado = "P";
      this.detalle.area = "";
      this.detalle.paro = "";
      this.detalle.clase = 0;
      this.detalle.finaliza_sensor = "S";
      this.detalle.desde = "00:00:00";
      this.detalle.hasta = "23:59:59";
      this.detalle.fdesde = new Date();
      this.detalle.fhasta = new Date();
    }
    else if (this.miSeleccion == 27) 
      {
        this.detalle.campos = ";;;;";
        this.detalle.nuevo = true;
        this.detalle.parte = "0";
        this.detalle.turno = "0";
        this.detalle.equipo = "0";
        this.detalle.lote = "0";
        this.detalle.orden = "";
        this.detalle.tipo = "0";
        this.detalle.area = "0";
        this.detalle.rechazo = "";
        this.detalle.notas = "";
        this.detalle.origen = "1";
        this.corteActual = 0;
        this.detalle.cantidad = 0;
        this.cantidadActual = 0;
        this.detalle.fecha = new Date();
      }
      else if (this.miSeleccion == 30) 
      {
        this.detalle.frecuencia = "T";
        this.detalle.fdesde = "";
        this.detalle.desde = "";
        this.detalle.checklists = "S";
        this.detalle.anticipacion = "N";
        this.detalle.tiempo = 0;
        this.detalle.mensaje = "";
        this.detalle.mensaje_mmcall = "";
        this.detalle.titulo = "";
        
        this.detalle.mensaje2 = "";
        this.detalle.mensaje_mmcall2 = "";
        this.detalle.titulo2 = "";
        this.detalle.frecuencia = "T";
        this.checklistPlan(0);
        this.detalle.ejecucion = "S";
        this.detalle.seleccionMensaje = ["C"];
        this.detalle.seleccionMensaje2 = ["C"];
      }
      else if(this.miSeleccion == 8)
      {
        this.detalle.evento = "0";
        this.detalle.linea = "S";
        this.detalle.falla = "S";
        this.detalle.proceso = "S";
        this.detalle.maquina = "S";
        this.detalle.area = "S";     
        this.asociarTablasAlerta(0);
        this.detalle.escalar1 = "N";
        this.detalle.escalar2 = "N";
        this.detalle.escalar3 = "N";
        this.detalle.escalar4 = "N";
        this.detalle.escalar5 = "N";
      }
    setTimeout(() => {
        this.txtNombre.nativeElement.focus();
    }, 300);
  }

  copiar()
  {
    if (this.miSeleccion == 21 && this.detalle.estado =='C')
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1489], tiempo: 0, mensaje: this.servicio.rTraduccion()[1490], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", boton3STR: "", icono3: "", icono0: "i_falla" }
      });
      return;
    }
    if (this.bot5)
    {
      if (this.editando && !this.cancelarEdicion)
      {
        this.deshacerEdicion(0, 3)
        return;
      } 
      
      this.despuesBusqueda = 1;
      this.detalle.loteID = 0;
      this.editar(-1);
      this.yaValidado = -1;
      
    } 
  }

  deshacerEdicion(parametro: number, desde: number)
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo', data: { titulo: this.servicio.rTraduccion()[1427], tiempo: 0, mensaje: this.servicio.rTraduccion()[1491], alto: "60", id: 0, accion: 0, botones: 3, boton1STR: this.servicio.rTraduccion()[27], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_guardar" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        this.cancelarEdicion = true;
        this.guardar();     
        if (desde == 99)
        {
          this.volver()
          //this.procesarPantalla(parametro)
        }
        else if (desde == 2)
        {
          this.nuevo_siguiente();
        }
        else if (desde == 3)
        {
          this.despuesBusqueda = 1;
          this.editar(-1);
        }
      }
      else if (result.accion == 2) 
      {
        this.cancelarEdicion = true;
        this.edicionCancelada();      
        if (desde == 99)
        {
          this.volver()
          //this.procesarPantalla(parametro)
        }
        else if (desde == 2)
        {
          this.nuevo_siguiente();
        }
        else if (desde == 3)
        {
          this.despuesBusqueda = 1;
          this.editar(-1);
        }
      }
    });
  }

  llenarListas(arreglo: number, nTabla: string, cadWhere: string)
  {
    let sentencia = "SELECT id, nombre FROM " + nTabla + " " + cadWhere + " ORDER BY nombre";
    if (arreglo == 15 || arreglo == 115)
    {
      sentencia = "SELECT a.id, IF(ISNULL(a.referencia), a.nombre, CONCAT(a.nombre, '" + this.servicio.rTraduccion()[2637] + "', a.referencia, ')')) AS nombre FROM " + this.servicio.rBD() + ".cat_partes a " + cadWhere  + " ORDER BY a.nombre ";
    }
    else if (arreglo == 31)
    {
      sentencia = "SELECT alerta, nombre FROM " + nTabla + " " + cadWhere + " ORDER BY nombre";
    }
    else if (arreglo == 900)
    {
      sentencia = "SELECT a.id, a.nombre, b.referencia, a.usuario FROM " + nTabla + " " + cadWhere + " ORDER BY a.nombre";
    }
    else if (arreglo == 16 || arreglo == 160 || arreglo == 4 || arreglo == 104 || arreglo == 20)
    {
      sentencia = "SELECT a.id, IF(ISNULL(b.nombre), a.nombre, CONCAT(a.nombre, ' / ', b.nombre)) AS nombre FROM " + nTabla + " a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas b ON a.linea = b.id " + cadWhere + " ORDER BY nombre";
    }
    else if (arreglo == 17 || arreglo == 117)
    {
      sentencia = "SELECT a.id, CONCAT(a.numero, ' / ', c.nombre) AS nombre FROM " + this.servicio.rBD() + ".lotes a LEFT JOIN " + this.servicio.rBD() + ".cat_partes c ON a.parte = c.id " + cadWhere  + " ORDER BY a.numero ";
    }
    else if (arreglo > 10000)
    {
      sentencia = "SELECT id, nombre FROM " + nTabla + " " + cadWhere + " ORDER BY orden";
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if ((arreglo != 7 && arreglo!= 9 && arreglo < 15) ||  arreglo == 30 || arreglo == 29 || arreglo == 22 ||  arreglo == 1110 ||  arreglo == 1115 ||  arreglo == 1120 || arreglo == 107 || arreglo == 93  || arreglo == 205 || arreglo == 900)
      {
        resp.splice(0, 0, {id: "0", nombre: this.servicio.rTraduccion()[1492]});  
      }
      else if (arreglo == 105 || arreglo == 200 || arreglo == 110 || arreglo == 149)
      {
        resp.splice(0, 0, {id: "0", nombre: this.servicio.rTraduccion()[1493]});  
      }
      else if (arreglo == 100)
      {
        resp.splice(0, 0, {id: "0", nombre: this.servicio.rTraduccion()[3559]});  
      }

      else if (arreglo == 16 || arreglo == 18 || arreglo == 19)

      {
        resp.splice(0, 0, {id: "0", nombre: this.servicio.rTraduccion()[1494]});  
      }
      else if (arreglo == 1121)
      {
        resp.splice(0, 0, {id: "0", nombre: this.servicio.rTraduccion()[589]});  
      }

      else if (arreglo == 17)

      {
        resp.splice(0, 0, {id: "0", nombre: this.servicio.rTraduccion()[1495]});  
      }
      if (arreglo == 1)
      {
        this.agrupadores1 = resp
      }
      else if (arreglo == 2)
      {
        this.agrupadores2 = resp
      }
      else if (arreglo == 3 || arreglo == 19)
      {
        this.lineas = resp
      }
      else if (arreglo == 4 || arreglo == 104 || arreglo == 114 || arreglo == 16 || arreglo == 160 || arreglo == 20)
      {
        if (arreglo == 114)
        {
          this.maquinas = resp
        }
        else
        {
          this.maquinas = resp
        }

        if (this.creando)
        {
          if (this.maquinas.length == 2)
          {
            this.detalle.equipo = this.maquinas[1].id;
            this.creando = false;
          }
        }

      }
      else if (arreglo == 5 || arreglo == 23)
      {
        this.areas = resp
      }
      else if (arreglo == 200)
      {
        this.tecnicos = resp;
      }
      else if (arreglo == 110)
      {
        this.cargos = resp;
      }
      else if (arreglo == 900)
      {
        this.consultas = resp;
      }
      else if (arreglo == 6 || arreglo == 106 || arreglo == 107 || arreglo == 1115)
      {
        this.tipos = resp
      }
      else if (arreglo == 7)
      {
        this.tablas = resp
      }
      else if (arreglo == 8)
      {
        this.fallas = resp
      }
      else if (arreglo == 9 || arreglo == 29)
      {
        this.listas = resp
      }
      else if (arreglo == 149)
      {
        this.tecnicos = resp
      }
      else if (arreglo == 93)
      {
        this.listas = resp
      }
      else if (arreglo == 10 || arreglo == 100)
      {
        this.listas = resp
      }
      else if (arreglo == 105)
      {
        this.idiomas = resp
      }
      else if (arreglo == 11 || arreglo == 1110 || arreglo == 1120 || arreglo == 1121 || arreglo == 205)
      {
        this.fallas = resp
      }
      else if (arreglo == 12 || arreglo == 32)
      {
        this.tipos = resp
      }
      else if (arreglo == 13)
      {
        this.tablas = resp
      }
      else if (arreglo == 14 || arreglo == 18 || arreglo == 118)
      {
        this.turnos = resp
      }
      else if (arreglo == 15 || arreglo == 115)
      {
        this.partes = resp
        if (this.miSeleccion == 18)
        {
          this.partesF = this.partes;
        }
      }
      else if (arreglo == 17 || arreglo == 117)
      {
        this.lotes = resp
      }
      else if (arreglo == 21)
      {
        this.paros = resp
      }
      else if (arreglo == 22)
      {
        this.usuarios = resp
      }
      else if (arreglo == 30)
      {
        this.procesos = resp
      }
      else if (arreglo == 31)
      {
        this.eventos = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  actualizar()
  {
    this.textoBuscar = "";
    this.modelo = this.modelo == 3 ? 13 : 12;
    this.rRegistros(this.miSeleccion);
  }

  adecuar()
  {
    this.verTabla = false;
    if (this.miSeleccion == 1)
    {
      /* this.titulos = ["", this.servicio.rTraduccion()[1496], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1497], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1499], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "1.12", this.servicio.rTraduccion()[1500], this.servicio.rTraduccion()[1501] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1560], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1565], this.servicio.rTraduccion()[1565], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1566] ]; */
    }
    else if (this.miSeleccion == 2)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1502], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1497], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1503], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "1.13", this.servicio.rTraduccion()[1504], this.servicio.rTraduccion()[1505], this.servicio.rTraduccion()[1506], "1.16", "1.17", "1.18", "1.19", this.servicio.rTraduccion()[1342] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1567], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1568], this.servicio.rTraduccion()[1568], this.servicio.rTraduccion()[1569], "16", "17", "18", "19", this.servicio.rTraduccion()[1566] ];
    }
    else if (this.miSeleccion == 3)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1507], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1497], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1508], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "12", this.servicio.rTraduccion()[1509], this.servicio.rTraduccion()[1510],,,,,,,,,,,,,,,,,,,,,,,this.servicio.rTraduccion()[1611] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1570], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1571], this.servicio.rTraduccion()[1571], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1566],,,,,,,,,,,,,,,,,this.servicio.rTraduccion()[1610],7,8,9,10 ];
    }
    else if (this.miSeleccion == 28)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1511], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[3539], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1512], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "12", this.servicio.rTraduccion()[1509], this.servicio.rTraduccion()[1510],,,,,,,,,,,,,,,,,,,,,,,this.servicio.rTraduccion()[1611] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1572], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[3540], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1571], this.servicio.rTraduccion()[1571], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1566],,,,,,,,,,,,,,,,,this.servicio.rTraduccion()[1610],7,8,9,10 ];
    }
    else if (this.miSeleccion == 29)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1513], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[3541], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1514], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "12", this.servicio.rTraduccion()[1509], this.servicio.rTraduccion()[1510],,,,,,,,,,,,,,,,,,,,,,,this.servicio.rTraduccion()[1611] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1573], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[3542], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1571], this.servicio.rTraduccion()[1571], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1566],,,,,,,,,,,,,,,,,this.servicio.rTraduccion()[1610],7,8,9,10 ];
    }
    else if (this.miSeleccion == 30)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1515], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1516], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "12", this.servicio.rTraduccion()[1517], this.servicio.rTraduccion()[1518], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1342], this.servicio.rTraduccion()[646], this.servicio.rTraduccion()[599], this.servicio.rTraduccion()[1519], this.servicio.rTraduccion()[1520], this.servicio.rTraduccion()[1521], this.servicio.rTraduccion()[1522], this.servicio.rTraduccion()[1523], this.servicio.rTraduccion()[1524], this.servicio.rTraduccion()[1525], this.servicio.rTraduccion()[1526], this.servicio.rTraduccion()[1527], this.servicio.rTraduccion()[1528], this.servicio.rTraduccion()[1529], this.servicio.rTraduccion()[1530], this.servicio.rTraduccion()[1531], this.servicio.rTraduccion()[1532]   ];
      this.ayudas = ["", this.servicio.rTraduccion()[1574], this.servicio.rTraduccion()[1561], "", "", "", this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1575], this.servicio.rTraduccion()[1575], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1576], this.servicio.rTraduccion()[1577], this.servicio.rTraduccion()[1578], this.servicio.rTraduccion()[1579], this.servicio.rTraduccion()[1580], this.servicio.rTraduccion()[1581], this.servicio.rTraduccion()[1582], this.servicio.rTraduccion()[1583], this.servicio.rTraduccion()[1584], this.servicio.rTraduccion()[1584], this.servicio.rTraduccion()[1585], this.servicio.rTraduccion()[1586], this.servicio.rTraduccion()[1587], this.servicio.rTraduccion()[1588], this.servicio.rTraduccion()[1530], this.servicio.rTraduccion()[1589]    ];
    }
    else if (this.miSeleccion == 4)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1533], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1497], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1534], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], this.servicio.rTraduccion()[1535], this.servicio.rTraduccion()[1517], this.servicio.rTraduccion()[1518], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1342], this.servicio.rTraduccion()[646], this.servicio.rTraduccion()[599],"1","2","3","4","5","6","7","8","9","10",this.servicio.rTraduccion()[1611],"d1","d2","d3",this.servicio.rTraduccion()[1611],"d5","d6","10"  ];
      this.ayudas = ["", this.servicio.rTraduccion()[1590], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11",this.servicio.rTraduccion()[1612], this.servicio.rTraduccion()[1575], this.servicio.rTraduccion()[1575], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1576], this.servicio.rTraduccion()[1577], this.servicio.rTraduccion()[1578],,,,,,,,,,,,,,,this.servicio.rTraduccion()[1613] ];
    }
    else if (this.miSeleccion == 25)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1536], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1497], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1537], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], this.servicio.rTraduccion()[1535], this.servicio.rTraduccion()[1517], this.servicio.rTraduccion()[1518], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1342], this.servicio.rTraduccion()[1538], this.servicio.rTraduccion()[599],"1","2","3","4","5","6","7","8","9","10",this.servicio.rTraduccion()[1611],"d1","d2","d3",this.servicio.rTraduccion()[1611],"d5","d6","10"  ];
      this.ayudas = ["", this.servicio.rTraduccion()[1591], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11",this.servicio.rTraduccion()[1612], this.servicio.rTraduccion()[1575], this.servicio.rTraduccion()[1575], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1576], this.servicio.rTraduccion()[1577], this.servicio.rTraduccion()[1578],,,,,,,,,,,,,,,this.servicio.rTraduccion()[1613] ];
    }
    else if (this.miSeleccion == 5)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1539], this.servicio.rTraduccion()[1519], this.servicio.rTraduccion()[1540], "4", "85", this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "12", this.servicio.rTraduccion()[1517], this.servicio.rTraduccion()[1518], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1342], this.servicio.rTraduccion()[646], this.servicio.rTraduccion()[599], this.servicio.rTraduccion()[1519], this.servicio.rTraduccion()[1497], this.servicio.rTraduccion()[1541] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1592], this.servicio.rTraduccion()[1593], "", "", "", this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1575], this.servicio.rTraduccion()[1575], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1576], this.servicio.rTraduccion()[1577], this.servicio.rTraduccion()[1578], this.servicio.rTraduccion()[1579], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1594] ];
    }
    else if (this.miSeleccion == 6)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1542], this.servicio.rTraduccion()[698], "3", "4", "85", this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "12", this.servicio.rTraduccion()[1517], this.servicio.rTraduccion()[1518], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1342], this.servicio.rTraduccion()[646], this.servicio.rTraduccion()[599], this.servicio.rTraduccion()[1519], this.servicio.rTraduccion()[1520], this.servicio.rTraduccion()[1521], this.servicio.rTraduccion()[1522] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1595], this.servicio.rTraduccion()[1561], "", "", "", this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1575], this.servicio.rTraduccion()[1575], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1576], this.servicio.rTraduccion()[1577], this.servicio.rTraduccion()[1578], this.servicio.rTraduccion()[1579], this.servicio.rTraduccion()[1580], this.servicio.rTraduccion()[1581], this.servicio.rTraduccion()[1582] ];
    }
    else if (this.miSeleccion == 7)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1543], this.servicio.rTraduccion()[698], "3", "4", "5", this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "12", this.servicio.rTraduccion()[1517], this.servicio.rTraduccion()[1518], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1342], this.servicio.rTraduccion()[646], this.servicio.rTraduccion()[599], this.servicio.rTraduccion()[1519], this.servicio.rTraduccion()[1520], this.servicio.rTraduccion()[1521], this.servicio.rTraduccion()[1522], this.servicio.rTraduccion()[1523], this.servicio.rTraduccion()[1524], this.servicio.rTraduccion()[1525], this.servicio.rTraduccion()[1526], this.servicio.rTraduccion()[1527], this.servicio.rTraduccion()[1528], this.servicio.rTraduccion()[1529], this.servicio.rTraduccion()[1530], this.servicio.rTraduccion()[1531], this.servicio.rTraduccion()[1532]   ];
      this.ayudas = ["", this.servicio.rTraduccion()[1574], this.servicio.rTraduccion()[1561], "", "", "", this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1575], this.servicio.rTraduccion()[1575], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1576], this.servicio.rTraduccion()[1577], this.servicio.rTraduccion()[1578], this.servicio.rTraduccion()[1579], this.servicio.rTraduccion()[1580], this.servicio.rTraduccion()[1581], this.servicio.rTraduccion()[1582], this.servicio.rTraduccion()[1583], this.servicio.rTraduccion()[1584], this.servicio.rTraduccion()[1584], this.servicio.rTraduccion()[1585], this.servicio.rTraduccion()[1586], this.servicio.rTraduccion()[1587], this.servicio.rTraduccion()[1588], this.servicio.rTraduccion()[1530], this.servicio.rTraduccion()[1589]    ];
    }
    else if (this.miSeleccion == 8)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1542], this.servicio.rTraduccion()[698], "3", "4", "85", this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "12", this.servicio.rTraduccion()[1517], this.servicio.rTraduccion()[1518], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1342], this.servicio.rTraduccion()[646], this.servicio.rTraduccion()[599], this.servicio.rTraduccion()[1519], this.servicio.rTraduccion()[1520], this.servicio.rTraduccion()[1521], this.servicio.rTraduccion()[1522] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1595], this.servicio.rTraduccion()[1561], "", "", "", this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1575], this.servicio.rTraduccion()[1575], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1576], this.servicio.rTraduccion()[1577], this.servicio.rTraduccion()[1578], this.servicio.rTraduccion()[1579], this.servicio.rTraduccion()[1580], this.servicio.rTraduccion()[1581], this.servicio.rTraduccion()[1582] ];
    }
    else if (this.miSeleccion == 9)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1544], this.servicio.rTraduccion()[698], "3", "4", "85", this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[1545], "12", this.servicio.rTraduccion()[1517], this.servicio.rTraduccion()[1518], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1342], this.servicio.rTraduccion()[646], this.servicio.rTraduccion()[599], this.servicio.rTraduccion()[1519], this.servicio.rTraduccion()[1520], this.servicio.rTraduccion()[1521], this.servicio.rTraduccion()[1522] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1596], this.servicio.rTraduccion()[1561], "", "", "", this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1575], this.servicio.rTraduccion()[1575], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1576], this.servicio.rTraduccion()[1577], this.servicio.rTraduccion()[1578], this.servicio.rTraduccion()[1579], this.servicio.rTraduccion()[1580], this.servicio.rTraduccion()[1581], this.servicio.rTraduccion()[1582] ];
    }
    else if (this.miSeleccion == 12)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1328], this.servicio.rTraduccion()[1546], this.servicio.rTraduccion()[1547], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1548], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "1.13", this.servicio.rTraduccion()[1549], this.servicio.rTraduccion()[499], this.servicio.rTraduccion()[500], this.servicio.rTraduccion()[501], "1.17", this.servicio.rTraduccion()[1550], this.servicio.rTraduccion()[1551], this.servicio.rTraduccion()[1552], this.servicio.rTraduccion()[1553], this.servicio.rTraduccion()[1554] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1597], this.servicio.rTraduccion()[1598], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1599], this.servicio.rTraduccion()[1600], this.servicio.rTraduccion()[1601], this.servicio.rTraduccion()[1602], "16", this.servicio.rTraduccion()[1556], this.servicio.rTraduccion()[1603], this.servicio.rTraduccion()[1604], this.servicio.rTraduccion()[1605], this.servicio.rTraduccion()[1606] ];
    }

    else if (this.miSeleccion == 14)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1555], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1547], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1548], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "1.13", this.servicio.rTraduccion()[1549], this.servicio.rTraduccion()[499], this.servicio.rTraduccion()[500], this.servicio.rTraduccion()[501], "1.17", this.servicio.rTraduccion()[1556], this.servicio.rTraduccion()[1557], this.servicio.rTraduccion()[1558] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1607], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1599], this.servicio.rTraduccion()[1600], this.servicio.rTraduccion()[1601], this.servicio.rTraduccion()[1608], "16", this.servicio.rTraduccion()[1556], this.servicio.rTraduccion()[1603], this.servicio.rTraduccion()[1604], this.servicio.rTraduccion()[1566] ];
    }


    //
    if (this.miSeleccion == 1)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1559], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1497], this.servicio.rTraduccion()[1498], this.servicio.rTraduccion()[1499], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[748], this.servicio.rTraduccion()[749], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[751], this.servicio.rTraduccion()[752], "1.12", this.servicio.rTraduccion()[1500], this.servicio.rTraduccion()[1501] ];
      this.ayudas = ["", this.servicio.rTraduccion()[1609], this.servicio.rTraduccion()[1561], this.servicio.rTraduccion()[1562], this.servicio.rTraduccion()[1563], this.servicio.rTraduccion()[1564], this.servicio.rTraduccion()[851], "7", "8", "9", "10", "11","12", this.servicio.rTraduccion()[1565], this.servicio.rTraduccion()[1565], "15", "16", "17", "18", "19", this.servicio.rTraduccion()[1566] ];
    }


  }

  inactivar()
  {
    if (this.miSeleccion == 21 && this.paroEnCurso)
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "430px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1614], tiempo: 0, mensaje: this.servicio.rTraduccion()[1615], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", boton3STR: "", icono3: "", icono0: "i_falla" }
      });
      return;
    }
    let adicional: string = "";
    let mensajeEliminar = this.servicio.rTraduccion()[1616];
    if (this.miSeleccion == 21)
    {
      mensajeEliminar = this.servicio.rTraduccion()[1617];
    }
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1618], mensaje: mensajeEliminar, id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[555], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_inactivar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
        {
          if (result.accion == 1) 
          {
            let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_lineas SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();";
            if (this.miSeleccion == 2)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_maquinas SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET maquinas = NOW();";
            }
            else if (this.miSeleccion == 3)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_areas SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();";
            }
            else if (this.miSeleccion == 28)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_variables SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET variables = NOW();";
            }
            else if (this.miSeleccion == 29)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_checklists SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET checklists = NOW();";
            }
            else if (this.miSeleccion == 4)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_fallas SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET fallas = NOW();";
            }
            else if (this.miSeleccion == 5)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_generales SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();";
            }
            else if (this.miSeleccion == 6)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_distribucion SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET distribucion = NOW();";
            }
            else if (this.miSeleccion == 7)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_correos SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
            }
            else if (this.miSeleccion == 8)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_alertas SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW()  WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = NOW();";
            }
            else if (this.miSeleccion == 9)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_turnos SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW()  WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET turnos = NOW();";
            }
            else if (this.miSeleccion == 12)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW()  WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 14)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".politicas SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW()  WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".politicas SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 21)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".detalleparos SET estatus = 'I' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              this.detalle.estatus = "I";
              this.bot6 = false;
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[1383]
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            })
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

  eliminar()
  {
    if (this.miSeleccion == 27 && this.detalle.existe==0)
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "430px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1619], tiempo: 0, mensaje: this.servicio.rTraduccion()[1620], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", boton3STR: "", icono3: "", icono0: "i_falla" }
      });
      return;
    }
    if (this.miSeleccion == 21 && this.paroEnCurso)
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1621], tiempo: 0, mensaje: this.servicio.rTraduccion()[1622], alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", boton3STR: "", icono3: "", icono0: "i_falla" }
      });
      return;
    }
    let adicional: string = "";
    let mensajeEliminar = this.servicio.rTraduccion()[1623];
    if (this.miSeleccion == 21)
    {
      mensajeEliminar = this.servicio.rTraduccion()[1624];
    }
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1625], mensaje: mensajeEliminar, id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[388], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_eliminar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
        {
          if (result.accion == 1) 
          {
            let sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_lineas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();";
            if (this.miSeleccion == 2)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_maquinas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET maquinas = NOW();";
            }
            else if (this.miSeleccion == 3)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_areas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();";
            }
            else if (this.miSeleccion == 28)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_variables WHERE id = " + +this.detalle.id + ";DELETE FROM " + this.servicio.rBD() + ".relacion_variables_equipos WHERE variable = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET variables = NOW();";
            }
            else if (this.miSeleccion == 29)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_checklists WHERE id = " + +this.detalle.id + ";DELETE FROM " + this.servicio.rBD() + ".det_checklists WHERE checklist = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET checklists = NOW();";
            }
            else if (this.miSeleccion == 30)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".plan_checklists WHERE id = " + +this.detalle.id + ";DELETE FROM " + this.servicio.rBD() + ".det_plan_checklists WHERE plan = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET planes_checklists = NOW();";
            }
            else if (this.miSeleccion == 4)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_fallas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET fallas = NOW();";
            }
            else if (this.miSeleccion == 5)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_generales WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();";
            }
            else if (this.miSeleccion == 6)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_distribucion WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET distribucion = NOW();";
            }
            else if (this.miSeleccion == 7)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_correos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
            }
            else if (this.miSeleccion == 8)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_alertas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = NOW();";
            }
            else if (this.miSeleccion == 9)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_turnos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET turnos = NOW();";
            }
            else if (this.miSeleccion == 10)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".traduccion WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET traducciones = NOW();";
            }
            else if (this.miSeleccion == 12)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 14)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".politicas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET politicas = NOW();";
            }
            else if (this.miSeleccion == 17)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET rates = NOW();";
              if (this.vista17 == 1)
              {
                sentencia = "DELETE FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE equipo = " + +this.equipoAntes + " AND piezas = " + this.detalle.piezas + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET rates = NOW();";
              }
            }
            else if (this.miSeleccion == 18)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".equipos_objetivo WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET objetivos = NOW();";
            }
            else if (this.miSeleccion == 19)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".estimados WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET estimados = NOW();";
            }
            else if (this.miSeleccion == 20)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".relacion_procesos_sensores WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET sensores = NOW();";
            }
            else if (this.miSeleccion == 21)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".detalleparos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET paros = NOW();";
            }
            else if (this.miSeleccion == 27)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".detallerechazos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET rechazos = NOW();";
              if (this.detalle.origen==0)
              {
                sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".lecturas_cortes SET calidad_clasificada = calidad_clasificada - " + (+this.detalle.cantidad - this.cantidadActual) + " WHERE id = " + this.detalle.corte;
              }
              else if (this.detalle.origen == 1)
              {
                let cadAdic = "";
                if (this.detalle.cantidad_antes > 0)
                {
                  cadAdic = ", produccion = produccion - " + +this.detalle.cantidad + ", produccion_tc = produccion_tc - " + +this.detalle.cantidad * this.rateEquipo;
                }
                sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET calidad = calidad - " + +this.detalle.cantidad + ", calidad_tc = calidad_tc - " + +this.detalle.cantidad * this.rateEquipo + cadAdic + " WHERE corte = " + this.detalle.corte + ";UPDATE " + this.servicio.rBD() + ".lecturas_cortes SET calidad = calidad - " + +this.detalle.cantidad + ", calidad_tc = calidad_tc - " + +this.detalle.cantidad * this.rateEquipo + ", calidad_clasificada = calidad_clasificada - " + +this.detalle.cantidad + cadAdic + " WHERE id = " + this.detalle.corte
              }
            }
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              this.detalle.estatus = "I";
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[1382]
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
              this.regresar();
            })
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

  exportar()
  {
    let nombreReporte = this.servicio.rTraduccion()[1652]
    let catalogo = this.servicio.rTraduccion()[1632]
    if (this.miSeleccion == 2)
    {
      nombreReporte = this.servicio.rTraduccion()[1653]
      catalogo = this.servicio.rTraduccion()[1633]
    }
    else if (this.miSeleccion == 3)
    {
      nombreReporte = this.servicio.rTraduccion()[1648]
      catalogo = this.servicio.rTraduccion()[1627]
    }
    else if (this.miSeleccion == 28)
    {
      nombreReporte = this.servicio.rTraduccion()[1654]
      catalogo = this.servicio.rTraduccion()[1643]
    }
    else if (this.miSeleccion == 29)
    {
      nombreReporte = this.servicio.rTraduccion()[1649]
      catalogo = this.servicio.rTraduccion()[1628]
    }
    else if (this.miSeleccion == 30)
    {
      nombreReporte = this.servicio.rTraduccion()[3524]
      catalogo = this.servicio.rTraduccion()[3525]
    }
    else if (this.miSeleccion == 4)
    {
      if (this.vezExportar == 0)
      {
        nombreReporte = this.servicio.rTraduccion()[1650]
        catalogo = this.servicio.rTraduccion()[1631]
      }
      else
      {
        nombreReporte = this.servicio.rTraduccion()[1663]
        catalogo = this.servicio.rTraduccion()[1646]
      }
      
    }
    else if (this.miSeleccion == 5)
    {
      nombreReporte = this.servicio.rTraduccion()[1651]
      catalogo = this.servicio.rTraduccion()[1638]
    }
    else if (this.miSeleccion == 6)
    {
      nombreReporte = this.servicio.rTraduccion()[1662]
      catalogo = this.servicio.rTraduccion()[1637]
    }
    else if (this.miSeleccion == 7)
    {
      nombreReporte = this.servicio.rTraduccion()[1655]
      catalogo = this.servicio.rTraduccion()[1629]
      
    }
    else if (this.miSeleccion == 8)
    {
      nombreReporte = this.servicio.rTraduccion()[1647]
      catalogo = this.servicio.rTraduccion()[1626]
    }
    else if (this.miSeleccion == 9)
    {
      nombreReporte = this.servicio.rTraduccion()[1666]
      catalogo = this.servicio.rTraduccion()[1641]
    }
    else if (this.miSeleccion == 10)
    {
      nombreReporte = this.servicio.rTraduccion()[1665]
      catalogo = this.servicio.rTraduccion()[1640]
    }
    else if (this.miSeleccion == 14)
    {
      nombreReporte = this.servicio.rTraduccion()[1659]
      catalogo = this.servicio.rTraduccion()[1635]
    }
    else if (this.miSeleccion == 12)
    {
      nombreReporte = this.servicio.rTraduccion()[1667]
      catalogo = this.servicio.rTraduccion()[1642]
    }
    else if (this.miSeleccion == 17)
    {
      nombreReporte = this.servicio.rTraduccion()[1660]
      catalogo = this.servicio.rTraduccion()[1636]
    }
    else if (this.miSeleccion == 18)
    {
      nombreReporte = this.servicio.rTraduccion()[1657]
      catalogo = this.servicio.rTraduccion()[1634]
    }
    else if (this.miSeleccion == 19)
    {
      nombreReporte = this.servicio.rTraduccion()[1656]
      catalogo = this.servicio.rTraduccion()[1630]
    }
    else if (this.miSeleccion == 20)
    {
      nombreReporte = this.servicio.rTraduccion()[1664]
      catalogo = this.servicio.rTraduccion()[1639]
    }
    else if (this.miSeleccion == 21)
    {
      nombreReporte = this.servicio.rTraduccion()[1658]
      catalogo = this.servicio.rTraduccion()[493]
    }
    else if (this.miSeleccion == 25)
    {
      nombreReporte = this.servicio.rTraduccion()[2035]
      catalogo = this.servicio.rTraduccion()[1269]
    }
    let cadExportar = this.sentenciaR;
    if (this.miSeleccion == 4 && this.vezExportar == 1)
    {
      cadExportar = this.sentenciaR2;
    }
    let campos =  {accion: 100, sentencia: cadExportar};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {

        if (this.miSeleccion == 27)
        {
          resp.splice(0, 0, {a01: 'ID documento', a02: "ID registro sensor", a03: "Fecha de reporte", a04: 'Cantidad en piezas', a05: "Texto del rechazo", a06: "Notas del rechazo", a07: "Area asociada", a08: "ID del area", a09: "" + this.servicio.rTraduccion()[1692] + "", a10: "ID del equipo", a11: '" + this.servicio.rTraduccion()[149] + "', a12: 'ID de la linea', a13: 'Clasificacion del rechazo', a14: 'ID de la clasificacion', a15: 'Numero de parte', a16: 'ID del numero de parte', a17: 'Turno asociado', a18: 'ID del turno', a19: 'Numero de lote', a20: 'ID del lote', a21: 'Facha de actualizacion', a22: 'Nombre del usuario que documento', a23: 'ID del usuario' })
          nombreReporte = this.servicio.rTraduccion()[1661]
          catalogo = this.servicio.rTraduccion()[494]
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[1386]
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }

        this.servicio.generarReporte(resp, catalogo, nombreReporte)
        if (this.vezExportar == 0 && this.miSeleccion==4)
        {
          this.vezExportar = 1;
          this.exportar();
        }
      }
      else
      {
        this.detalle.inicializada = "S";
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[2010]
        mensajeCompleto.tiempo = 2500;
        this.servicio.mensajeToast.emit(mensajeCompleto)
      }
    })
  }

  listarListados(id: number)
  {
    let filtroAdic = " AND a.id < 100";
    if (this.detalle.tipo == 1)
    {
      filtroAdic = " AND a.id > 100";
    }
    else if (this.detalle.tipo > 1)
    {
      this.listados = []
      return;
    }
    let sentencia = "SELECT a.id, a.nombre, a.datos, IF(ISNULL(b.reporte), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".int_listados a LEFT JOIN " + this.servicio.rBD() + ".det_correo b ON a.id = b.reporte AND b.correo = " + id + " WHERE a.estatus = 'A' AND a.idioma = " + this.servicio.rIdioma().id + " "  + filtroAdic + " ORDER BY seleccionado DESC, a.orden;"

    
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.listados = resp;  
      }, 100);
      
    });
  }

  asociarTablasHerramental(id: number)
  {
    let sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, IF(ISNULL(b.parte), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".relacion_partes_maquinas b ON a.id = b.maquina AND b.parte = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.maquinasSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.maquinasSel = resp;  
    });
  }

  asociarVariablesMaquinas(id: number)
  {
    let sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, IF(ISNULL(b.variable), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".relacion_variables_equipos b ON a.id = b.maquina AND b.variable = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id ORDER BY seleccionado DESC, a.nombre"
    if (id == 0)
    {
      sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.maquinasSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.maquinasSel = resp;  
    });
  }

  asociarValores(id: number)
  {
    this.arreHover1 = [];
  
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".variables_valores WHERE variable = " + id + " ORDER BY orden"
    this.opcionesSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.arreHover1.length = resp.length
      this.opcionesSel = resp;  
    });
  }

  asociarTablasFalla(id: number)
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_lineas a LEFT JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones b ON a.id = b.proceso AND b.tipo = 1 AND b.falla = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_lineas a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.lineasSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.lineasSel = resp;  
      
    });
    sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.falla = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.maquinasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.maquinasSel = resp;  
      
    });
    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_areas a LEFT JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones b ON a.id = b.proceso AND b.tipo = 3 AND b.falla = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_areas a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.areasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.areasSel = resp;  
      
    });
    
  
  }

  asociarTablasAlerta(id: number)
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_lineas a LEFT JOIN " + this.servicio.rBD() + ".relacion_alertas_operaciones b ON a.id = b.proceso AND b.tipo = 1 AND b.alerta = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_lineas a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.lineasSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.lineasSel = resp;  
      
    });
    sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".relacion_alertas_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.alerta = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.maquinasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.maquinasSel = resp;  
      
    });
    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_areas a LEFT JOIN " + this.servicio.rBD() + ".relacion_alertas_operaciones b ON a.id = b.proceso AND b.tipo = 3 AND b.alerta = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_areas a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.areasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.areasSel = resp;  
      
    });

    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_fallas a LEFT JOIN " + this.servicio.rBD() + ".relacion_alertas_operaciones b ON a.id = b.proceso AND b.tipo = 4 AND b.alerta = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_fallas a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.fallasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.fallasSel = resp;  
      
    });

    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".relacion_alertas_operaciones b ON a.id = b.proceso AND b.alerta = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_procesos a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.areasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.operacionesSel = resp;  
      
    });
  
  }

  asociarTablas(id: number)
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_lineas a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 1 AND b.usuario = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_lineas a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.lineasSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.lineasSel = resp;  
      
    });
    sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.usuario = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id ORDER BY seleccionado DESC, nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' ORDER BY nombre"
    }
    this.maquinasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.maquinasSel = resp;  
      
    });
    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_areas a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 3 AND b.usuario = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_areas a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.areasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.areasSel = resp;  
      
    });

    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".mapas a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 6 AND b.usuario = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".mapas a WHERE a.activo <> 9 ORDER BY a.nombre"
    }
    this.mapasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.mapasSel = resp;  
      
    });

    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_plantas a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 4 AND b.usuario = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_plantas a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.plantasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.plantasSel = resp;  
      
    });

    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 0 AND b.usuario = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_procesos a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.areasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.operacionesSel = resp;  
      
    });


    let whereAdicional = " AND a.id IN (15, 80, 103, 104, 112, 120, 130, 140, 170, 180, 200, 210, 220, 240, 260, 290, 300, 310, 330, 200, 210, 220, 230, 240, 250, 242)";
      /* if (this.servicio.rVersion().modulos[0] == 1)

      {
        whereAdicional = whereAdicional + " AND (a.id IN (20, 30, 40, 50, 60, 70, 80, 90, 100, 112, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250)"
      }
      if (this.servicio.rVersion().modulos[2] == 1)
      {
        whereAdicional = whereAdicional + " OR a.id IN (242, 243)"
      }
      if (this.servicio.rVersion().modulos[3] == 1)
      {
        whereAdicional = whereAdicional + " OR a.id IN (350, 242)"
      }
      if (this.servicio.rVersion().modulos[4] == 1)
      {
        whereAdicional = whereAdicional + " OR a.id IN (242, 295, 296, 297, 298, 241, 101, 102, 105, 106, 104, 111, 110, 107, 108, 109)"
      }
      if (this.servicio.rVersion().modulos[5] == 1)
      {
        whereAdicional = whereAdicional + " OR a.id IN (242, 104, 260, 270, 280, 290, 300, 310, 320, 330, 340, 360, 370, 380)"
      }
      if (this.servicio.rVersion().modulos[6] == 1)
      {
        whereAdicional = whereAdicional + " OR (a.id >= 385 AND a.id <= 460)"

      } 
      whereAdicional = whereAdicional ? whereAdicional + ") " : "";*/

      
    
    sentencia = "SELECT a.id, CASE WHEN a.rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN a.rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN a.rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN a.rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN a.rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN a.rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, a.nombre, IF(ISNULL(b.opcion), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_opciones b ON a.id = b.opcion AND b.usuario = " + id + " WHERE a.visualizar = 'S' AND a.idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, CASE WHEN a.rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN a.rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN a.rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN a.rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN a.rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN a.rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones a  WHERE a.visualizar = 'S' AND a.idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, a.nombre";
    }
    this.opcionesSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.opcionesSel = resp;  
      
    });

    
  }

  
  llenarVariables(id: number)
  {
    let sentencia = "SELECT a.*, b.orden, '' AS valor, IFNULL(c.nombre, '') AS unidad FROM " + this.servicio.rBD() + ".cat_variables a LEFT JOIN " + this.servicio.rBD() + ".det_checklist b ON a.id = b.variable AND b.checklist = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_generales c ON a.unidad = c.id ORDER BY b.orden, a.nombre"
    this.cVariables = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.cVariables = resp;  
      
    });
  }

  variables(id: number)
  {
    let cadAdicional = "";
    if (this.detalle.equipo != 0)
    {
      cadAdicional = " WHERE a.maquinas = 'S' OR (SELECT COUNT(*) FROM " + this.servicio.rBD() + ".relacion_variables_equipos WHERE variable = a.id AND maquina = " + this.detalle.equipo + ") > 0 "
    }
    let sentencia = "SELECT a.id, b.orden, a.nombre, IFNULL(c.nombre, '') AS unidad, IF(ISNULL(b.checklist), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_variables a LEFT JOIN " + this.servicio.rBD() + ".det_checklist b ON a.id = b.variable AND b.checklist = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_generales c ON a.unidad = c.id " + cadAdicional + " ORDER BY seleccionado DESC, b.orden, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, 0 AS orden, a.nombre, IFNULL(c.nombre, '') AS unidad, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_variables a LEFT JOIN " + this.servicio.rBD() + ".cat_generales c ON a.unidad = c.id " + cadAdicional + " ORDER BY a.nombre"
    }
    this.opcionesSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        for (var i = 0; i < resp.length; i++) 
        {
          resp[i].orden = !resp[i].orden ? (i + 1) : resp[i].orden;
          resp[i].seleccionado = resp[i].seleccionado == 1;
        }
        this.opcionesSel = resp;  
      
    });
  }

  equiposVariables(id: number)
  {
    let sentencia = "SELECT a.id, IFNULL(c.nombre, a.nombre, CONCAT(a.nombre, ' / ', c.nombre)) AS nombre, IF(ISNULL(b.variable), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".relacion_variables_equipos b ON a.id = b.equipo AND b.variable = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id ORDER BY seleccionado DESC, nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, IFNULL(c.nombre, a.nombre, CONCAT(a.nombre, ' / ', c.nombre)) AS nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' ORDER BY nombre"
    }
    this.opcionesSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.opcionesSel = resp;  
      
    });
  }

  checklistPlan(id: number)
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.checklist), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_checklists a LEFT JOIN " + this.servicio.rBD() + ".det_plan_checklists b ON a.id = b.checklist AND b.plan = " + id + " ORDER BY seleccionado DESC, nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_checklists a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.opcionesSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.opcionesSel = resp;  
      
    });
  }

  checklistRegistros()
  {
    let id = this.detalle.id;
    let tipo = this.detalle.asignacion; 
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.registro), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".relacion_plan_checklists b ON a.id = b.registro AND b.plan = " + id + " AND b.tipo = " + tipo + " WHERE a.tabla = " + (tipo == 0 || tipo == 2 ? "70" : "130") + " ORDER BY seleccionado DESC, nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a WHERE a.estatus = 'A' AND a.tabla = " + (tipo == 0 || tipo == 2 ? "70" : "130") + " ORDER BY a.nombre"
    }
    if (tipo == 4)
    {
      sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.registro), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".relacion_plan_checklists b ON a.id = b.registro AND b.plan = " + id + " AND b.tipo = " + tipo + "  ORDER BY seleccionado DESC, nombre"
      if (id==0)
      {
        sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_usuarios a WHERE a.estatus = 'A' ORDER BY a.nombre"
      }
    }
    this.registrosSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.registrosSel = resp;
      }, 200);
          
      
    });
  }

  modTabla(event: any)
  {
    if (event.value == 45)
    {
      if (this.detalle.url_mmcall == "")
      {
        this.detalle.url_mmcall = "N"
      }
    }
    else
    {
      if (this.detalle.url_mmcall = "N" || this.detalle.url_mmcall == "S")
      {
        this.detalle.url_mmcall = "";
      }
    }
  }

  seleccion(tipo: number, event: any) 
    {
      if (event.value == 1 || event.value == 0)
      {
        if (tipo == 0)
        {
          for (var i = 0; i < this.operacionesSel.length; i++) 
          {
            this.operacionesSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.operacion = "N";  
          }, 300);
        }
        if (tipo == 9)
        {
          for (var i = 0; i < this.plantasSel.length; i++) 
          {
            this.plantasSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.plantas = "N";  
          }, 300);
        }
        else if (tipo == 1)
        {
          for (var i = 0; i < this.lineasSel.length; i++) 
          {
            this.lineasSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.linea = "N";  
          }, 300);
        }
        else if (tipo == 11)
        {
          for (var i = 0; i < this.mapasSel.length; i++) 
          {
            this.mapasSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.mapa = "N";  
          }, 300);
        }
        else if (tipo == 6)
        {
          for (var i = 0; i < this.listados.length; i++) 
          {
            this.listados[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.selListadoT = "N";  
          }, 300);
        }
        else if (tipo == 2)
        {
          for (var i = 0; i < this.maquinasSel.length; i++) 
          {
            this.maquinasSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.maquinas = "N";
            if (this.miSeleccion==4 || this.miSeleccion==12 || this.miSeleccion==8)
            {
              this.detalle.maquina = "N";
            }
              
          }, 300);
        }
        else if (tipo == 13)
        {
          for (var i = 0; i < this.partesSel.length; i++) 
          {
            this.partesSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.parte = "N";  
          }, 300);
        }
        else if (tipo == 3)
        {
          for (var i = 0; i < this.areasSel.length; i++) 
          {
            this.areasSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.area = "N";  
          }, 300);
        }
        else if (tipo == 4)
        {
          for (var i = 0; i < this.opcionesSel.length; i++) 
          {
            this.opcionesSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.opciones = "N";  
          }, 300);
        }
        else if (tipo == 7)
        {
          for (var i = 0; i < this.fallasSel.length; i++) 
          {
            this.fallasSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.area = "N";  
          }, 300);
        }
  
        else if (tipo == 8)
        {
          for (var i = 0; i < this.opcionesSel.length; i++) 
          {
            this.opcionesSel[i].seleccionado = event.value == 1;
          }
          setTimeout(() => {
            this.detalle.variables = "S";  
          }, 300);
        }
        else if (tipo == 10)
        {
          for (var i = 0; i < this.opcionesSel.length; i++) 
          {
            this.opcionesSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.checklists = "N";  
          }, 200);
        }
        else if (tipo == 14)
        {
          for (var i = 0; i < this.registrosSel.length; i++) 
          {
            this.registrosSel[i].seleccionado = event.value;
          }
          setTimeout(() => {
            this.detalle.asignadores = "N";  
          }, 200);
        }
      }
      
      else if (tipo == 5)
      {
        let sentencia = ""

        let whereAdicional = " AND id IN (15, 80, 103, 104, 112, 120, 130, 140, 170, 180, 200, 210, 220, 240, 260, 290, 300, 310, 330, 200, 210, 220, 230, 240, 250, 242)";
    
        /* if (this.servicio.rVersion().modulos[0] == 1)

        {
          whereAdicional = whereAdicional + " AND (id IN (20, 30, 40, 50, 60, 70, 80, 90, 100, 112, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250)"
        }
        if (this.servicio.rVersion().modulos[2] == 1)
        {
          whereAdicional = whereAdicional + " OR id IN (242, 243)"
        }
        if (this.servicio.rVersion().modulos[3] == 1)
        {
          whereAdicional = whereAdicional + " OR id IN (350, 242)"
        }
        if (this.servicio.rVersion().modulos[4] == 1)
        {
          whereAdicional = whereAdicional + " OR id IN (242, 295, 296, 297, 298, 241, 101, 102, 105, 106, 104, 111, 110, 107, 108, 109)"
        }
        if (this.servicio.rVersion().modulos[5] == 1)
        {
          whereAdicional = whereAdicional + " OR id IN (242, 104, 260, 270, 280, 290, 300, 310, 320, 330, 340, 360, 370, 380)"
        }
        if (this.servicio.rVersion().modulos[6] == 1)
        {
          whereAdicional = whereAdicional + " OR (id >= 385 AND id <= 460)"
        }
        whereAdicional = whereAdicional ? whereAdicional + ") " : "";

       */

        if (event.value == "A") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, 1 AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
        }
        else if (event.value == "G") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, IF(rol = 'G' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
        }
        else if (event.value == "S") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, IF(rol = 'S' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
        }
        else if (event.value == "T") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, IF(rol = 'T' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
        }
        else if (event.value == "O") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, IF(rol = 'O' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
        }

        this.opcionesSel = [];
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          this.opcionesSel = resp;  
        });
      }
    }  

    colocarOpciones()
    {
      let sentencia = ""

      let whereAdicional = " AND id IN (15, 80, 103, 104, 112, 120, 130, 140, 170, 180, 200, 210, 220, 240, 260, 290, 300, 310, 330, 200, 210, 220, 230, 240, 250, 242)";
    
    /*   if (this.servicio.rVersion().modulos[0] == 1)

      {
        whereAdicional = whereAdicional + " AND (id IN (20, 30, 40, 50, 60, 70, 80, 90, 100, 112, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250)"
      }
      if (this.servicio.rVersion().modulos[2] == 1)
      {
        whereAdicional = whereAdicional + " OR id IN (242, 243)"
      }
      if (this.servicio.rVersion().modulos[3] == 1)
      {
        whereAdicional = whereAdicional + " OR id IN (350, 242)"
      }
      if (this.servicio.rVersion().modulos[4] == 1)
      {
        whereAdicional = whereAdicional + " OR id IN (242, 295, 296, 297, 298, 241, 101, 102, 105, 106, 104, 111, 110, 107, 108, 109)"
      }
      if (this.servicio.rVersion().modulos[5] == 1)
      {
        whereAdicional = whereAdicional + " OR id IN (242, 104, 260, 270, 280, 290, 300, 310, 320, 330, 340, 360, 370, 380)"
      }
      if (this.servicio.rVersion().modulos[6] == 1)
      {
        whereAdicional = whereAdicional + " OR (id >= 385 AND id <= 460)"
      }

      whereAdicional = whereAdicional ? whereAdicional + ") " : ""; */

      if (this.detalle.rol == "A") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, 1 AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
      }
      else if (this.detalle.rol == "G") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, IF(rol = 'G' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
      }
      else if (this.detalle.rol == "S") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, IF(rol = 'S' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
      }
      else if (this.detalle.rol == "T") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, IF(rol = 'T' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
      }
      else if (this.detalle.rol == "O") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '" + this.servicio.rTraduccion()[1398] + "' WHEN rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' WHEN rol = 'S' THEN '" + this.servicio.rTraduccion()[1078] + "' WHEN rol = 'T' THEN '" + this.servicio.rTraduccion()[1399] + "' WHEN rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' END AS erol, nombre, IF(rol = 'O' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones  WHERE visualizar = 'S' AND idioma = " + this.servicio.rIdioma().id + " " + whereAdicional + " ORDER BY seleccionado DESC, nombre"
      }

      this.opcionesSel = [];
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        this.opcionesSel = resp;  
      });
    }

  reiniciar()
  {
    let adicional: string = "";
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "480px", panelClass: 'dialogo', data: { titulo: this.servicio.rTraduccion()[1668], mensaje: this.servicio.rTraduccion()[1669], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[1670], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_grupos" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
        {
          if (result.accion == 1) 
          {
            let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET inicializada = 'S' WHERE id = " + this.detalle.id;
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              
              this.detalle.inicializada = "S";
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[1387]
              mensajeCompleto.tiempo = 2500;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            })
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

  vista(id: number)
  {
    if (id==17)
    {
      this.vista17 = this.vista17 == 0 ? 1 : 0;
      if (this.vista17 == 0)
      {
        this.litVista17 = this.servicio.rTraduccion()[1195];
        this.icoVista17 = "i_maquina";
      }
      else
      {
        this.litVista17 = this.servicio.rTraduccion()[1671];
        this.icoVista17 = "i_rates";
      }
      this.rRegistros(this.miSeleccion)
    }
  }


  buscarIndice(index: number, item) {
    return item.id;
  }

  buscarLotes()
  {
    this.llenarListas(117, this.servicio.rBD() + ".lotes", "WHERE a.estatus = 'A' AND a.parte = " + +this.detalle.parte);
  }

  verMacros()
  {
    let mensajeTotal = "<strong>[0]</strong>" + this.servicio.rTraduccion()[201] + ".<br><strong>[1]</strong> " + this.servicio.rTraduccion()[625] + ".<br><strong>[2]</strong> " + this.servicio.rTraduccion()[646] + ".<br><strong>[3]</strong> " + this.servicio.rTraduccion()[599] + ".<br><strong>[4]</strong> " + this.servicio.rTraduccion()[174] + ".<br><strong>[5]</strong> " + this.servicio.rTraduccion()[1680] + ".<br><br><strong>[11]</strong> " + this.servicio.rTraduccion()[1681] + ".<br>";
    if (this.servicio.rVersion().modulos[5] == 1)
    {
      mensajeTotal = mensajeTotal + "<strong>[12]</strong> " + this.servicio.rTraduccion()[1682] + ".<br><strong>[13]</strong> " + this.servicio.rTraduccion()[1683] + ".<br><br>";
    }
    mensajeTotal = mensajeTotal + "<strong>[20]</strong> " + this.servicio.rTraduccion()[1684] + ".<br><strong>[30]</strong> " + this.servicio.rTraduccion()[1685] + ".<br><strong>[31]</strong> " + this.servicio.rTraduccion()[1686] + " 1.<br><strong>[32]</strong> " + this.servicio.rTraduccion()[1686] + " 2.<br><strong>[33]</strong> " + this.servicio.rTraduccion()[1686] + " 3.<br><strong>[34]</strong> " + this.servicio.rTraduccion()[1686] + " 4.<br><strong>[35]</strong> " + this.servicio.rTraduccion()[1686] + " 5.<br>";
    if (this.servicio.rVersion().modulos[4] == 1)
    {
      mensajeTotal = mensajeTotal + "<strong>" + this.servicio.rTraduccion()[1687] + "</strong><br><strong>[40]</strong> " + this.servicio.rTraduccion()[1702] + ".<br><strong>[41]</strong> " + this.servicio.rTraduccion()[1699] + ".<br><strong>[42]</strong> " + this.servicio.rTraduccion()[1704] + ".<br><strong>[43]</strong> " + this.servicio.rTraduccion()[1691] + ".<br><strong>[44]</strong> " + this.servicio.rTraduccion()[1700] + ".<br><strong>[45]</strong> " + this.servicio.rTraduccion()[1707] + ".<br><strong>" + this.servicio.rTraduccion()[1710] + "</strong><br><strong>[50]</strong> " + this.servicio.rTraduccion()[1711] + ".<br><strong>[51]</strong> " + this.servicio.rTraduccion()[1694] + ".<br><strong>[52]</strong> " + this.servicio.rTraduccion()[1688] + ".<br><strong>" + this.servicio.rTraduccion()[1710] + "</strong><br><strong>[60]</strong> " + this.servicio.rTraduccion()[1712] + ".<br><strong>[61]</strong> " + this.servicio.rTraduccion()[1692] + ".<br><strong>[62]</strong> " + this.servicio.rTraduccion()[1693] + ".<br><strong>[63]</strong> " + this.servicio.rTraduccion()[1695] + ".<br><strong>[64]</strong> " + this.servicio.rTraduccion()[1689] + ".<br><strong>" + this.servicio.rTraduccion()[1706] + "</strong><br><strong>[70]</strong> " + this.servicio.rTraduccion()[1712] + ".<br><strong>[71]</strong> " + this.servicio.rTraduccion()[1708] + ".<br><strong>[72]</strong> " + this.servicio.rTraduccion()[1701] + ".<br><strong>[73]</strong> " + this.servicio.rTraduccion()[1709] + ".<br><strong>" + this.servicio.rTraduccion()[1703] + "</strong><br><strong>[80]</strong> " + this.servicio.rTraduccion()[1713] + ".<br><strong>[81]</strong> " + this.servicio.rTraduccion()[1696] + ".<br><strong>[82]</strong> " + this.servicio.rTraduccion()[1690] + ".<br><strong>[83]</strong> " + this.servicio.rTraduccion()[1697] + ".<br><strong>[84]</strong> " + this.servicio.rTraduccion()[1705] + ".<br>";
    }
    mensajeTotal = mensajeTotal + "<strong>[90]</strong> " + this.servicio.rTraduccion()[1714] + ".";
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "400px", panelClass: 'dialogo', data: { titulo: this.servicio.rTraduccion()[1679], tiempo: -1, mensaje: mensajeTotal, alto: "300", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_general" }
    });
  }

  defecto(id: number)
  {
    this.opcionesSel[id].defecto = this.opcionesSel[id].defecto == "S" ? "N" : "S";

    if (this.opcionesSel[id].defecto == "S")
    {
      for (var i = 0; i < this.opcionesSel.length; i++) 
      {
        if (i != id)
        {
          this.opcionesSel[i].defecto = "N"
        }
      }
    }
  }

  alarmar(id: number)
  {
    this.opcionesSel[id].alarmar = this.opcionesSel[id].alarmar == "S" ? "N" : "S";
  }

  subir(id: number)
  {
    this.opcionesSel.splice(id - 1, 0, this.opcionesSel[id])
    this.opcionesSel.splice(id + 1, 1);
    for (var i = 0; i < this.opcionesSel.length ; i++) 
    {
      this.opcionesSel[i].orden = i + 1;
    }
    let alfa: any;
    this.cambiando(alfa)
  }

  bajar(id: number)
  {
    this.opcionesSel.splice(id + 2, 0, this.opcionesSel[id])
    this.opcionesSel.splice(id, 1);
    for (var i = 0; i < this.opcionesSel.length ; i++) 
    {
      this.opcionesSel[i].orden = i + 1;
    }
    let alfa: any;
    this.cambiando(alfa)
  }

  inicializarValores()
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1677], mensaje: this.servicio.rTraduccion()[1678], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[553], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_inactivar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
        {
          if (result.accion == 1) 
          {
            this.opcionesSel = [];
            let alfa: any;
            this.cambiando(alfa)
          }
        }
    })
  }

  agregarValor()
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "400px", panelClass: 'dialogo', data: { agregarValor: 1, totalValores: this.opcionesSel.length, orden: -1, titulo: this.servicio.rTraduccion()[1676], mensaje: "", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_variables" }
    });
    respuesta.afterClosed().subscribe(result => 
      {
        if (result)
          {
            if (result.accion == 1) 
            {
              let posicion = this.opcionesSel.length + 1;
              if (result.orden > 1)
              {
                posicion = result.orden;
                for (var i = posicion - 1; i < this.opcionesSel.length; i++) 
                {
                  this.opcionesSel[i].orden = +this.opcionesSel[i].orden + 1;
                }
              }
              else if (result.orden == 0)
              {
                posicion = 1;
                for (var i = 0; i < this.opcionesSel.length; i++) 
                {
                  this.opcionesSel[i].orden = +this.opcionesSel[i].orden + 1;
                }
              }
              this.opcionesSel.splice(posicion - 1, 0, {orden: posicion, equipo: 0, variable: this.detalle.id, alarmar: "N", defecto: "N", valor: result.valorVariable });
              let alfa: any;
              this.cambiando(alfa)
            }
          }
      })
  }

  modificarValor(id: number)
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "400px", panelClass: 'dialogo', data: { valorVariable: this.opcionesSel[id].valor, agregarValor: 2, totalValores: this.opcionesSel.length, orden: id, titulo: this.servicio.rTraduccion()[1675], mensaje: "", id: 0, accion: 0, tiempo: 0, botones: 3, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1674], icono3: "i_eliminar", icono0: "i_variables" }
    });
    respuesta.afterClosed().subscribe(result => 
      {
        if (result)
          {
            if (result.accion == 1) 
            {
              if (result.orden == 0 && id == 0 || result.orden == 1 && id == this.opcionesSel.length - 1 || result.orden > 1 && result.orden == id + 1)
              {
                this.opcionesSel[id].valor = result.valorVariable;
              }
              else
              {
                this.opcionesSel.splice(id, 1);
                let posicion = this.opcionesSel.length + 1;
                if (result.orden > 1)
                {
                  posicion = result.orden;
                }
                else if (result.orden == 0)
                {
                  posicion = 1;
                }
                this.opcionesSel.splice(posicion - 1, 0, {orden: posicion, equipo: 0, variable: this.detalle.id, alarmar: "N", defecto: "N", valor: result.valorVariable });
                for (var i = 0; i < this.opcionesSel.length; i++) 
                {
                  this.opcionesSel[i].orden = i + 1;
                }
                
              }
              let alfa: any;
              this.cambiando(alfa)
            }
            else if (result.accion == 3) 
            {
              this.opcionesSel.splice(id, 1);
              if (id < this.opcionesSel.length)
              {
                for (var i = id; i < this.opcionesSel.length + 1; i++) 
                {
                  if (i < this.opcionesSel.length)
                  {
                    this.opcionesSel[i].orden = i + 1;
                  }
                }
              }
              let alfa: any;
              this.cambiando(alfa)
            }
          }
      })
  }

  iniVariable(id: number)
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "400px", panelClass: 'dialogo', data: { valorVariable: this.detalle.van, modificarVan: true, totalValores: this.opcionesSel.length, orden: id, titulo: this.servicio.rTraduccion()[1673], mensaje: "", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1674], icono3: "i_eliminar", icono0: "i_variables" }
    });
    respuesta.afterClosed().subscribe(result => 
      {
        if (result)
          {
            if (result.accion == 1) 
            {
              if (result.valorVariable >= +this.detalle.tope)
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[1385]
                mensajeCompleto.tiempo = 4000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
              else
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-normal";
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[1392]
                mensajeCompleto.tiempo = 4000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
              this.detalle.van = result.valorVariable; 
              let alfa: any;
              this.cambiando(alfa)
            }
          }
      })
  }

  buscarListas(id: number)
  {
    let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".lotes WHERE numero = '" + this.detalle.orden + "' AND estatus = 'A'";
    
    if (id == 0)
    {
      this.detalle.lote = 0;
    }
    if (id == 1)
    {
      sentencia = "SELECT dia AS fecha FROM " + this.servicio.rBD() + ".lecturas_cortes WHERE orden = " + this.detalle.lote + " AND equipo = " + this.detalle.equipo + " AND parte = " + this.detalle.parte + " GROUP BY fecha ORDER BY fecha ";
      this.fechasLote = [];
    }
    else if (id == 2)
    {
      if ((this.detalle.fecha).length != 10)
      {
        this.detalle.fecha = this.datepipe.transform(this.detalle.fecha, "yyyy/MM/dd");
      }
      let miFecha = this.servicio.fecha(2, this.detalle.fecha + " 10:00:00", "yyyy/MM/dd");
      
      this.turnosLote = [];
      sentencia = "SELECT a.turno AS id, b.nombre FROM " + this.servicio.rBD() + ".lecturas_cortes a LEFT JOIN " + this.servicio.rBD() + ".cat_turnos b ON a.turno = b.id WHERE a.orden = " + this.detalle.lote + " AND equipo = " + this.detalle.equipo + " AND dia = '" + miFecha + "' AND parte = " + this.detalle.parte + " GROUP BY id, b.nombre ORDER BY b.nombre ";
    }
    else if (id == 3)
    {
      this.maquinas = [];
      sentencia = "SELECT a.equipo AS id,  IF(ISNULL(c.nombre), b.nombre, CONCAT(b.nombre, ' / ', c.nombre)) AS nombre FROM " + this.servicio.rBD() + ".lecturas_cortes a LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas b ON a.equipo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON b.linea = c.id WHERE a.orden = " + this.detalle.lote + " AND parte = " + this.detalle.parte + " GROUP BY id, b.nombre ORDER BY b.nombre ";
    }
    else if (id == 4)
    {
      this.partes = [];
      sentencia = "SELECT a.parte AS id, IF(ISNULL(b.referencia), b.nombre, CONCAT(b.nombre, '" + this.servicio.rTraduccion()[2637] + "', b.referencia, ')')) AS nombre FROM " + this.servicio.rBD() + ".lecturas_cortes a LEFT JOIN " + this.servicio.rBD() + ".cat_partes b ON a.parte = b.id WHERE a.orden = " + this.detalle.lote + " GROUP BY id, nombre ORDER BY nombre ";
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        if (id == 0)
        {
          this.detalle.lote = resp[0].id;
          this.buscarListas(4)
                    
        }
        if (id == 1)
        {
          for (var i = 0; i < resp.length; i++) 
          {
            this.fechasLote.push({ fecha: this.servicio.fecha(2, resp[i].fecha + " 10:00:00", "yyyy/MM/dd") });
          }
          ;
          if (resp.length == 1)
          {
            this.detalle.fecha = this.servicio.fecha(2, resp[0].fecha + " 10:00:00", "yyyy/MM/dd");
            this.buscarListas(2);
          }
          else if (this.editando)
          {
            this.detalle.fecha = "0";
            this.detalle.turno = "0";
          }
          else
          {
            this.buscarListas(2);
          }
        }
        else if  (id == 2)
        {
          this.turnosLote = resp;
          if (resp.length == 1)
          {
            this.detalle.turno = resp[0].id; 
          }
          else if (this.editando)
          {
            this.detalle.turno = "0";
          }
          else
          {
            this.detalle.campos = this.servicio.fecha(2, this.detalle.fecha, "yyyy/MM/dd") + ";" + this.detalle.equipo + ";" + this.detalle.parte + ";" + this.detalle.turno + ";" + this.detalle.lote;
          }
        }
        else if  (id == 3)
        {
          this.maquinas = resp;
          if (resp.length == 1)
          {
            this.detalle.equipo = resp[0].id; 
            this.buscarListas(1);
          }
          else if (this.editando)
          {
            this.detalle.equipo = "0";
            this.detalle.fecha = "0";
            this.detalle.turno = "0";
          }
          else
          {
            this.buscarListas(1);
            
          }
        }
        else if  (id == 4)
        {
          this.partes = resp;
          if (resp.length == 1)
          {
            this.detalle.parte = resp[0].id; 
            this.buscarListas(3);
          }
          else if (this.editando)
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[3583];
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            this.detalle.parte = "0";
            this.detalle.equipo = "0";
            this.detalle.fecha = "0";
            this.detalle.turno = "0";
            this.fechasLote = [];
            this.turnosLote = [];
            this.maquinas = [];
          }
        }
      }
      else
      {
        if (id == 0)
        {
          let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[3582]
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          this.detalle.lote = 0;
          this.detalle.parte = "0";
          this.detalle.equipo = "0";
          this.detalle.fecha = "0";
          this.detalle.turno = "0";
          this.partes = [];
          this.fechasLote = [];
          this.turnosLote = [];
          this.maquinas = [];
        }
        
      }
    });
  }

  iniListas()
  {
    this.turnosLote = [];
    this.fechasLote = [];
    this.detalle.lote = "0";
    this.detalle.parte = "0";
    this.detalle.equipo = "0";
    this.detalle.fecha = "0";
    this.detalle.turno = "0";
  }

  crearNuevoLote()
  {
    let sentencia = "INSERT INTO " + this.servicio.rBD() + ".lotes (numero, parte, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.lote + "', " + this.detalle.parteID + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());";
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".lotes;";
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe(resp =>
      {
        this.detalle.loteID = resp[0].nuevoid
        sentencia = "SELECT a.id, a.numero AS nombre FROM " + this.servicio.rBD() + ".lotes a WHERE a.id = " + this.detalle.loteID;
        campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length > 0)
          {
            this.detalle.lote = resp[0].nombre;
            this.loteCopiado = true;
            this.lotesF = resp;
            this.llenarListas(17, this.servicio.rBD() + ".lotes", "WHERE a.estado <> 99 AND a.estatus = 'A'");
            this.guardar();
          }
        })
        
      })

    })
  }

  validarAlarma(evento: any, indice: number)
  {
    let alarmado = "";
    if (evento.target)
    {
      if (this.arreVariables[indice].tipo_valor == 0)
      {
        if (this.arreVariables[indice].maximo)
        {
          if (+this.arreVariables[indice].valor > +this.arreVariables[indice].maximo)
          {
            alarmado = "S";
          }
          else
          {
            alarmado = "N";
          }
        }
        if (this.arreVariables[indice].minimo && alarmado != "S")
        {
          if (+this.arreVariables[indice].valor < +this.arreVariables[indice].minimo)
          {
            alarmado = "S";
          }
          else
          {
            alarmado = "N";
          }
        }
        if (this.arreVariables[indice].valor==null)
        {
          alarmado = ""
        }
      }
      
    }
    else if (evento.value)
    {
      if (this.arreVariables[indice].tipo_valor == 1)
      {
        alarmado = "N";
        if (evento.value == "S" && (this.arreVariables[indice].alarma_binaria == 1 || this.arreVariables[indice].alarma_binaria == 3))
        {
          alarmado = "S"          
        }
        else if (evento.value == "N" && (this.arreVariables[indice].alarma_binaria == 2 || this.arreVariables[indice].alarma_binaria == 3))
        {
          alarmado = "S"          
        }
        
      }
      else if (this.arreVariables[indice].tipo_valor == 2)
      {
        alarmado = "N";
        for (var i = 0; i < this.arreValoresVariables.length; i++) 
        {
          if (this.arreValoresVariables[i].variable == this.arreVariables[indice].variable && this.arreValoresVariables[i].valor == evento.value && this.arreValoresVariables[i].alarmar=="S")
          {
            alarmado = "S"
            break;
          }
        }
      }
      
    }
    if (alarmado != "S" && this.arreVariables[indice].alarmado == "S" && this.tVariablesA > 0)
    {
      this.tVariablesA = this.tVariablesA - 1;        
    }
    else if (alarmado == "S" && this.arreVariables[indice].alarmado != "S" && this.tVariablesA < this.arreVariables.length)
    {
      this.tVariablesA = this.tVariablesA + 1;        
    }
    this. arreVariables[indice].alarmado = alarmado;
    if (this.arreVariables[indice].valor || (this.arreVariables[indice].valor == 0 && this.arreVariables[indice].tipo_valor == 0))
    {
      this.arreVariables[indice].clasecss = alarmado == "S" ? "A" : "P";
      this.arreVariables[indice].clasecssh = alarmado == "S" ? "A" : "P";
      if (alarmado == "S")
      {
        this.arreVariables[indice].hint = this.servicio.rTraduccion()[3543];
      }
      else if (this.arreVariables[indice].puede_alarmarse == "S")
      {
        this.arreVariables[indice].hint = this.servicio.rTraduccion()[3544];
      }
      else if (this.arreVariables[indice].requerida == "S")
      {
        this.arreVariables[indice].hint = this.servicio.rTraduccion()[180];
      }
      else
      {
        this.arreVariables[indice].hint = this.servicio.rTraduccion()[358];
      }
      if (this.arreVariables[indice].lleno != "S" && this.tVariablesC < this.arreVariables.length)
      {
        this.tVariablesC = this.tVariablesC + 1;
      }
      this.arreVariables[indice].lleno = "S";
    }
    else
    {
      if (this.arreVariables[indice].lleno == "S" && this.tVariablesC > 0)
      {
        this.tVariablesC = this.tVariablesC - 1;
      }
      this.arreVariables[indice].lleno = "N";
      if (this.arreVariables[indice].requerida == "S")
      {
        this.arreVariables[indice].hint = this.servicio.rTraduccion()[180];
        this.arreVariables[indice].clasecss = "P";
        this.arreVariables[indice].clasecssh = "A";
      }
      else
      {
        this.arreVariables[indice].clasecss = "P";
        this.arreVariables[indice].hint = this.servicio.rTraduccion()[358];
      }
    }
    
    this.varAlarmada = this.tVariablesA > 0;
    //this.tVariablesA = 0;
    //this.tVariablesC = 0;
    //for (var i = 0; i < this.arreVariables.length; i++) 
    //{
    //  if (this.arreVariables[i].valor || (this.arreVariables[i].valor == 0 && this.arreVariables[i].tipo_valor == 0))
    //  {
    //    this.tVariablesC = this.tVariablesC + 1;
    //  }
    //  if (this.arreVariables[i].alarmado == 'S')
    //  {
    //    this.tVariablesA = this.tVariablesA + 1;        
    //  }
    //}
    this.cadResumenVariables = this.servicio.rTraduccion()[3554].replace("campo_0", this.tVariables).replace("campo_1", this.tVariablesC).replace("campo_2", this.tVariables == 0 ? 0 : Math.floor(this.tVariablesC / this.tVariables * 100));
    this.cadAlarmados = this.tVariablesA > 0 ? this.servicio.rTraduccion()[3555].replace("campo_0", this.tVariablesA) : this.servicio.rTraduccion()[3607];
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

      this.detalle.parteID = 0;

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
      this.detalle.loteID = -1;
      this.servicio.activarSpinnerSmall.emit(true);
      if (miCad) 
      {
        for (var i = 0; i < this.lotes.length; i  ++)
        {
          if (this.lotes[i].nombre)
          {
            if (this.lotes[i].nombre.toLowerCase().indexOf(miCad.toLowerCase()) !== -1)
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
      if (evento.option)
      {
        if (+evento.option.value == 0)
        {

          this.detalle.parte = "";
          this.detalle.parteID = 0;
          this.detalle.kg_saco_defecto = 0;
          this.detalle.saco_pallets_defecto = 0;

          return;
        }
        else
        {
          idBuscar = +evento.option.value
        }
      }
      else
      {
        idBuscar = evento;
        if (+idBuscar == 0)
        {

          this.detalle.parte = "";
          this.detalle.parteID = 0;
          this.detalle.saco_pallets_defecto = 0;
          this.detalle.kg_saco_defecto = 0;

          return;
        }
      }
      //Buscar parte
      this.servicio.activarSpinnerSmall.emit(true);

      let sentencia = "SELECT id, kg_saco_defecto, saco_pallets_defecto, IF(ISNULL(referencia), nombre, CONCAT(nombre, '" + this.servicio.rTraduccion()[2637] + "', referencia, ')')) AS nombre FROM " + this.servicio.rBD() + ".cat_partes WHERE id = " + idBuscar;

      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          this.detalle.parte = resp[0].nombre; 
          this.partesF = resp;
          this.detalle.parteID = resp[0].id;
          this.detalle.sacos_tarima = resp[0].saco_pallets_defecto
          this.detalle.kg_saco = resp[0].kg_saco_defecto;

          if (+this.detalle.kg_saco > 0 && (+this.detalle.kg_saco != +resp[0].kg_saco_defecto || +this.detalle.sacos_tarima != +resp[0].saco_pallets_defecto) && !this.cancelando)
          {
            this.cancelando = true;
            const respuesta = this.dialogo.open(DialogoComponent, {
              width: "520px", panelClass: 'dialogo', data: { titulo: this.servicio.rTraduccion()[3760], mensaje: this.servicio.rTraduccion()[3761], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[272], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_partes" }
            });
            respuesta.afterClosed().subscribe(result => 
            {
              if (result)
              {
                if (result.accion == 1)
                {
                  
                  this.detalle.sacos_tarima = resp[0].saco_pallets_defecto
                  this.detalle.kg_saco = resp[0].kg_saco_defecto;
                  this.calcularSacos(1);
                  this.cambiando(1);
                  
                }
              }
            })
          }
        }
        setTimeout(() => {
          this.servicio.activarSpinnerSmall.emit(false);
        }, 100);
      })
    }
    else if (indice == 2)
    {
      let idBuscar: number;
      if (evento.option)
      {
        if (+evento.option.value == 0)
        {
          this.detalle.lote = this.servicio.rTraduccion()[1495];
          this.detalle.loteID = 0;
          return;
        }
        else
        {
          idBuscar = +evento.option.value
        }
      }
      else
      {
        idBuscar = evento;
        if (idBuscar == 0)
        {
          this.detalle.lote = this.servicio.rTraduccion()[1495];
          this.detalle.loteID = 0;
          return;
        }
      }
      //Buscar parte
      this.servicio.activarSpinnerSmall.emit(true);
      let sentencia = "SELECT a.id, a.id AS parte, a.numero AS nombre FROM " + this.servicio.rBD() + ".lotes a WHERE a.id = " + idBuscar;
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          this.detalle.lote = resp[0].nombre; 
          this.detalle.loteID = resp[0].id;
          this.lotesF = resp;
          if (this.detalle.parteID<=0)
          {
            if (resp[0].parte)
            {
              this.detalle.parte = resp[0].parte;
              this.buscarDatos(1, this.detalle.parte);
            }
            else
            {
              this.detalle.parte = this.servicio.rTraduccion()[1495];
              this.detalle.parteID = 0;
            }
            
          }
        }
        setTimeout(() => {
          this.servicio.activarSpinnerSmall.emit(false);
        }, 100);
      })
    }
  }


  calcularSacos(indice: number)
  {
    let tmp: number = 0;
    if (indice == 1)
    {
      let tmp: number = 0;
      if (+this.detalle.kg_saco > 0)
      {
        tmp = this.detalle.objetivo / +this.detalle.kg_saco;
        if (tmp - Math.floor(tmp) > 0)
        {
          tmp = Math.floor(tmp) + 1;
        }
        this.detalle.sacos = tmp;
      }
      else
      {
        this.detalle.sacos = 0;
      }
      if (+this.detalle.sacos_tarima > 0)
      {
        tmp = +this.detalle.sacos / +this.detalle.sacos_tarima;
        if (tmp - Math.floor(tmp) > 0)
        {
          tmp = Math.floor(tmp) + 1;
        }
        this.detalle.tarimas = tmp;
      }
      else
      {
        this.detalle.tarimas = 0;
      }
    }
    else if (indice == 2)
    {
      this.detalle.sacos = Math.round(+this.detalle.tarimas * +this.detalle.sacos_tarima);
      this.detalle.objetivo = Math.round(+this.detalle.sacos * +this.detalle.kg_saco);
    }
    else if (indice == 3)
    {
      if (+this.detalle.sacos_tarima > 0)
      {
        tmp = +this.detalle.sacos / +this.detalle.sacos_tarima;
        if (tmp - Math.floor(tmp) > 0)
        {
          tmp = Math.floor(tmp) + 1;
        }
        this.detalle.tarimas = tmp;
      }
      else
      {
        this.detalle.tarimas = 0;
      }
      this.detalle.objetivo = Math.round(+this.detalle.sacos * +this.detalle.kg_saco);
    }
  }  

  
}
