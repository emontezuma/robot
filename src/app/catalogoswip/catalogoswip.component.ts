import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, GuardsCheckStart, Router } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DialogowipComponent } from '../dialogowip/dialogowip.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { ViewportRuler } from "@angular/cdk/overlay";
import { CdkDrag, CdkDragStart, CdkDropList, CdkDropListGroup, CdkDragMove, CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-catalogoswip',
  templateUrl: './catalogoswip.component.html',
  styleUrls: ['./catalogoswip.component.css'],
  animations: [
    trigger('esquema', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(5px)' }),
        animate('0.1s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.2s', style({ opacity: 0, transform: 'translateY(5px)' }))
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

export class CatalogoswipComponent implements OnInit {

  @ViewChild("txtBuscar", { static: false }) txtBuscar: ElementRef;
  @ViewChild("txtDesde", { static: false }) txtDesde: ElementRef;
  @ViewChild("txtFechaDesde", { static: false }) txtFechaDesde: ElementRef;
  @ViewChild("txtNombre", { static: false }) txtNombre: ElementRef;
  @ViewChild("txtRepetir", { static: false }) txtRepetir: ElementRef;
  @ViewChild("txtAcumular", { static: false }) txtAcumular: ElementRef;
  @ViewChild("txtRepetir0", { static: false }) txtRepetir0: ElementRef;
  @ViewChild("txtRepetir1", { static: false }) txtRepetir1: ElementRef;
  @ViewChild("txtRepetir2", { static: false }) txtRepetir2: ElementRef;
  @ViewChild("txtRepetir3", { static: false }) txtRepetir3: ElementRef;
  @ViewChild("txtAnticipo", { static: false }) txtAnticipo: ElementRef;
  @ViewChild("txtReferencia", { static: false }) txtReferencia: ElementRef;
  @ViewChild("txtCapacidad_proceso", { static: false }) txtCapacidad_proceso: ElementRef;
  @ViewChild("lstProceso", { static: false }) lstProceso: MatSelect;
  @ViewChild("lstProcesos", { static: false }) lstProcesos: MatSelect;
  @ViewChild("lstProceso2", { static: false }) lstProceso2: MatSelect;
  @ViewChild("txtCapacidad_stock", { static: false }) txtCapacidad_stock: ElementRef;
  @ViewChild("txtTiempo_stock", { static: false }) txtTiempo_stock: ElementRef;
  @ViewChild("txtTiempo_proceso", { static: false }) txtTiempo_proceso: ElementRef;
  @ViewChild(CdkDropListGroup, { static: false }) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList, { static: false }) placeholder: CdkDropList;
  @ViewChild("lista2", { static: false }) lista2: MatSelectionList;

  scrollingSubscription: Subscription;
  vistaCatalogo: Subscription;
  //URL_FOLDER = "http://localhost:8081/sigma/assets/datos/";  
  URL_FOLDER = "/robot/assets/datos/";  
  constructor
  (
    public servicio: ServicioService,
    private route: ActivatedRoute,
    private router: Router, 
    public scroll: ScrollDispatcher,
    private http: HttpClient,
    public dialogo: MatDialog, 
    private viewportRuler: ViewportRuler

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
      if (this.router.url.substr(0, 13) == "/catalogoswip")
      {
        this.altoPantalla = this.servicio.rPantalla().alto - 105;
        this.anchoPantalla = this.servicio.rPantalla().ancho - 10;
        this.verBarra = "auto";
      }
    });
    this.emit20 = this.servicio.quitarBarra.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 13) == "/catalogoswip")
      {
        this.altoPantalla = this.servicio.rPantalla().alto - 105;
        this.anchoPantalla = this.servicio.rPantalla().ancho - 10 + 300;
      }
    });
    this.emit30 = this.servicio.teclaBuscar.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 13) == "/catalogoswip")
      {
        this.buscar();
      }
    });
    this.emit40 = this.servicio.teclaEscape.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 13) == "/catalogoswip")
      {
        this.cancelar();
      }
    });
    this.emit50 = this.servicio.cambioIdioma.subscribe((data: boolean)=>
    {
      if (this.router.url.substr(0, 13) == "/catalogoswip")
      {
        this.adecuar();
      }
    })
    this.emit60 = this.vistaCatalogo = this.servicio.vista.subscribe((vista: number)=>
    {
      vista = vista - 2000;
      this.maestroActual = vista - 1;
      if (vista == 1)
      {
        this.indices = [{ nombre: this.servicio.rTraduccion()[1771], icono: "i_procesos"} ];
        this.nivelActual = 1;
      }
      else if (vista == 2)
      {
        this.indices = [{ nombre: this.servicio.rTraduccion()[1772], icono: "i_rutas"} ];
        this.nivelActual = 0;
      }
      else if (vista == 3)
      {
        this.listarRutas();
        this.indices = [{ nombre: this.servicio.rTraduccion()[505], icono: "i_partes"} ];
        this.nivelActual = 0;
      }
      else if (vista == 6)
      {
        this.indices = [{ nombre: this.servicio.rTraduccion()[507], icono: "i_situaciones"} ];
        this.nivelActual = 0;
      }
      else if (vista == 7)
      {
        this.indices = [{ nombre: this.servicio.rTraduccion()[1774], icono: "i_horarios"} ];
        this.nivelActual = 0;
      }
      this.pantalla = 2;
      this.verRegistro = (this.verRegistro != 0 ? 1 : 0);  
      this.noAnimar = this.servicio.rHuboError();
      this.procesarPantalla(1);
    });
    this.emit70 = this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    this.target = null;
    this.source = null;
    let vista = this.servicio.rVista();
    vista = vista - 2000;
    this.maestroActual = vista - 1;
    this.arreHover4 = [];
    if (vista == 1)
    {
      this.indices = [{ nombre: this.servicio.rTraduccion()[1771], icono: "i_procesos"} ];
      this.nivelActual = 1;
    }
    else if (vista == 2)
    {
      this.indices = [{ nombre: this.servicio.rTraduccion()[1772], icono: "i_rutas"} ];
      this.nivelActual = 0;      
    }
    else if (vista == 3)
    {
      this.indices = [{ nombre: this.servicio.rTraduccion()[505], icono: "i_partes"} ];
      this.nivelActual = 0;
    }
     else if (vista == 6)
    {
      this.indices = [{ nombre: this.servicio.rTraduccion()[507], icono: "i_situaciones"} ];
      this.nivelActual = 0;
    }
    else if (vista == 7)
    {
      this.indices = [{ nombre: this.servicio.rTraduccion()[1774], icono: "i_horarios"} ];
      this.nivelActual = 0;
    }
    this.arreHover4.length = this.indices.length;
    this.verRegistro = (this.verRegistro != 0 ? 1 : 0);   
    this.pantalla = 2;
    this.verRegistro = (this.verRegistro != 0 ? 1 : 0);  
    this.noAnimar = this.servicio.rHuboError();
    this.procesarPantalla(1);  
    this.validarTabla();
    this.servicio.validarLicencia(1)
    this.servicio.mostrarBmenu.emit(0);
  }

  botonera: any = [false, true, true, true, true, true, false, true, true, true, true, false]
  ayuda01: string = this.servicio.rTraduccion()[1781]
  ayuda02: string = this.servicio.rTraduccion()[1783]
  ayuda03: string = this.servicio.rTraduccion()[1787]
  ayuda04: string = this.servicio.rTraduccion()[1784]
  ayuda05: string = this.servicio.rTraduccion()[1778]
  ayuda06: string = this.servicio.rTraduccion()[1779]
  ayuda07: string = this.servicio.rTraduccion()[1785]
  ayuda08: string = this.servicio.rTraduccion()[1782]
  ayuda09: string = this.servicio.rTraduccion()[1792]
  ayuda10: string = this.servicio.rTraduccion()[1788]
  ayuda11: string = this.servicio.rTraduccion()[1789]
  ayuda12: string = this.servicio.rTraduccion()[1790]
  ayuda13: string = this.servicio.rTraduccion()[1791]
  ayuda14: string = this.servicio.rTraduccion()[1775]
  ayuda15: string = this.servicio.rTraduccion()[1786]
  noLeer: boolean = false;
  hayFiltro: boolean = false;
  alarmados: number = 0;
  sondeo: number = 0;
  mensajePadre: string = "";

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

  botAbrir: boolean = false;
  arreHover: any = [];
  arreHover2: any = [];
  arreHover3: any = [];
  arreHover4: any = [];
  arreHover5: any = [];
  arreHover6: any = [];
  arreHover7: any = [];
  arreHover8: any = [];
  
  titulos: any = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
  
  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  
  resecuenciar: boolean = false;
  botonera1: number = 1;

  segStock: string = this.servicio.rTraduccion()[371];
  segProceso: string = this.servicio.rTraduccion()[371];
  segSetup: string = this.servicio.rTraduccion()[371];
  segSetupI: string = this.servicio.rTraduccion()[371];
  
  estatusActual: string = "";
  secuenciaActual: string = "";
  iconoGeneral: string = "";
  
  cancelarEdicion: boolean = false;

  //URL_BASE = "http://localhost:8081/sigma/api/upload.php";
  //URL_IMAGENES = "http://localhost:8081/sigma/assets/imagenes/";

  URL_BASE = "/robot/api/upload.php"
  URL_IMAGENES = "/robot/assets/imagenes/";

  estadoArriba: string = this.servicio.rTraduccion()[1780]
  mensajeImagen: string = this.servicio.rTraduccion()[358];

  faltaMensaje: string = "";
  despuesBusqueda: number = 0;
  mostrarImagenRegistro: string = "N";
  verIrArriba: boolean = false;
  verBarra: string = this.servicio.rTraduccion()[1776]
  nombreRuta: string = "";
  offSet: number;
  registroActual: number = 0;
  copiandoDesde: number = 0;
  idNivel0: number = 0;
  nivelActual: number = 0;
  textoBuscar: string = "";
  detalleRegistro: any = [];
  maquinasSel: any = [];
  verBuscar: boolean = true;
  noAnimar: boolean = false;  
  verImagen: boolean = false;
  verAhora: boolean = false;
  editando: boolean = false;
  verRegistro: number = 0;
  tiempoRevision: number = 5000;
  seleccionAlerta = [];
  seleccionescalar1 = [];
  seleccionescalar2 = [];
  seleccionescalar3 = [];
  seleccionescalar4 = [];
  seleccionescalar5 = [];
  seleccionProcesos = [];
  etiBuscar: string = this.servicio.rTraduccion()[1777]

  nuevoRegistro: string = ";"
  maestroActual: number = 0;
  altoPantalla: number = this.servicio.rPantalla().alto - 105;
  anchoPantalla: number = this.servicio.rPantalla().ancho - 10;
  errorTitulo: string = "[" + this.servicio.rTraduccion()[6] + "]";
  errorMensaje: string = "";
  pantalla: number = 2;

  literalSingular: string = "";
  literalSingularArticulo: string = "";
  literalPlural: string = "";
  
  colorLetrasBotones: string = "";
  colorLetrasBotonesDes: string = "";
  colorFondoBoton: string = "";
  
  colorLetrasTitulo: string = "";
  colorBarraSuperior: string = "";
  
  colorSN: string = "";
  colorLetrasBox: string = "";
  colorFondo: string = "";
  colorFondoCabecera: string = "";
  colorBorde: string = "";
  colorFondoTarjeta: string = "";
  actualizarMaestro: boolean = false;
  
  edicion: boolean = true;
  registros: any = [];
  secuencias: any = [];
  arrFiltrado: any = [];
  partes: any = [];
  rutas: any = [];
  equipos: any = [];
  operaciones: any = [];
  procesos: any = [];
  listas: any = [];
  indices: any = [{ nombre: this.servicio.rTraduccion()[1771], icono: "i_procesos"} ]
  cronometro: any;
  

  ngAfterViewInit() {
    let phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentNode.removeChild(phElement);
  }

  ngOnInit()
  {
    this.servicio.validarLicencia(1)
    this.servicio.mostrarBmenu.emit(0);
  }

  ngOnDestroy() {
    if (this.scrollingSubscription) 
    {
      this.scrollingSubscription.unsubscribe()
    }
    

    if (this.vistaCatalogo) 
    {
      this.vistaCatalogo.unsubscribe()
    }
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

  ascendenteID(a, b)
  {
    let comparison = 0;
    if (+a.id > +b.id) {
      comparison = 1;
    } else if (+a.id < +b.id) {
      comparison = -1;
    }
    return comparison;
  }

  llenarRegistros()
  {
    this.servicio.activarSpinner.emit(true);       
    let sentencia = "SELECT a.id, a.nombre, a.capacidad_stock, IFNULL(c.tmaquinas , 0) AS tmaquinas, IFNULL(c.capacidad_proceso, 0) AS capacidad_proceso, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen, 'S' AS mostrarImagen FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN (SELECT proceso, COUNT(*) AS tmaquinas, SUM(capacidad) AS capacidad_proceso FROM " + this.servicio.rBD() + ".cat_maquinas WHERE estatus = 'A' GROUP BY proceso) AS c ON c.proceso = a.id ORDER BY a.nombre";
    if (this.maestroActual == 0 && this.nivelActual == 0) //Rutas de producción
    {
      this.iconoGeneral = "i_procesos";
      this.nuevoRegistro = this.servicio.rTraduccion()[1797]
      this.literalSingular = this.servicio.rTraduccion()[1765]
      this.literalPlural = this.servicio.rTraduccion()[1771]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1805]
      this.etiBuscar = this.servicio.rTraduccion()[1777]
      
    }
    if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
    {
      sentencia = "SELECT a.id, a.nombre, a.capacidad AS capacidad_proceso, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, a.imagen, 'S' AS mostrarImagen, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.proceso = " + this.idNivel0 + " ORDER BY a.nombre";
      this.iconoGeneral = "i_maquina";
      this.nuevoRegistro = this.servicio.rTraduccion()[1794]
      this.literalSingular = this.servicio.rTraduccion()[568]
      this.literalPlural = this.servicio.rTraduccion()[588]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1803]
      this.etiBuscar = this.servicio.rTraduccion()[1280]
      
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
    {
      sentencia = "SELECT a.id, a.nombre, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen, (SELECT COUNT(*) FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = a.id) AS tmaquinas FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre";
      this.nuevoRegistro = this.servicio.rTraduccion()[1799]
      this.literalSingular = this.servicio.rTraduccion()[664]
      this.literalPlural = this.servicio.rTraduccion()[1802]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1807]
      this.etiBuscar = this.servicio.rTraduccion()[1810]
      this.iconoGeneral = "i_rutas";
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1) //Líneas de producción
    {
      sentencia = "SELECT a.id, a.secuencia, a.nombre, a.tiempo_stock, a.tiempo_proceso, a.tiempo_setup, a.tiempo_setup_idem, a.piezas_finalizar_paro, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, d.imagen, 'S' AS mostrarImagen FROM " + this.servicio.rBD() + ".det_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_procesos d ON a.proceso = d.id WHERE a.ruta = " + this.idNivel0 + " ORDER BY a.secuencia";
      this.iconoGeneral = "i_flujo";
      this.nuevoRegistro = this.servicio.rTraduccion()[1798]
      this.literalSingular = this.servicio.rTraduccion()[705]
      this.literalPlural = this.servicio.rTraduccion()[487]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1806]
      this.etiBuscar = this.servicio.rTraduccion()[1809]
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0) //Rutas de producción
    {
      this.listarRutas();
      this.iconoGeneral = "i_partes";
      sentencia = "SELECT a.id, IFNULL(a.referencia, '') AS referencia, a.nombre, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, a.imagen, 'S' AS mostrarImagen FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre";
      this.nuevoRegistro = this.servicio.rTraduccion()[1796]
      this.literalSingular = this.servicio.rTraduccion()[728]
      this.literalPlural = this.servicio.rTraduccion()[1269]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1235]
      this.etiBuscar = this.servicio.rTraduccion()[567]
    }
      else if (this.maestroActual == 5 && this.nivelActual == 0) 
    {
      sentencia = "SELECT a.id, IF(a.tipo = 0, '" + this.servicio.rTraduccion()[1811] + "', '" + this.servicio.rTraduccion()[1756] + "') as tipo, a.nombre, a.referencia, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') AS estatus, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_situaciones a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre";
      this.nuevoRegistro = this.servicio.rTraduccion()[1800]
      this.literalSingular = this.servicio.rTraduccion()[1801]
      this.literalPlural = this.servicio.rTraduccion()[1802]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1808]
      this.etiBuscar = this.servicio.rTraduccion()[1801]
      this.iconoGeneral = "i_situaciones";
    }
    else if (this.maestroActual == 6 && this.nivelActual == 0) 
    {
      this.listarProcesos(1);
      this.iconoGeneral = "i_horarios";
      sentencia = "SELECT a.id, a.desde, a.hasta, a.tipo, a.dia, 'S' AS mostrarImagen, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[1812] + "') as pnombre, CASE WHEN a.dia = 0 THEN '" + this.servicio.rTraduccion()[1757] + "' WHEN a.dia = 1 THEN '" + this.servicio.rTraduccion()[1759] + "' WHEN a.dia = 2 THEN '" + this.servicio.rTraduccion()[1760] + "' WHEN a.dia = 3 THEN '" + this.servicio.rTraduccion()[1761] + "' WHEN a.dia = 4 THEN '" + this.servicio.rTraduccion()[1758] + "' WHEN a.dia = 5 THEN '" + this.servicio.rTraduccion()[1763] + "' WHEN a.dia = 6 THEN '" + this.servicio.rTraduccion()[1762] + "' WHEN a.dia = 9 THEN a.fecha END as nombre, a.proceso FROM " + this.servicio.rBD() + ".horarios a LEFT JOIN " + this.servicio.rBD() + ".cat_procesos b ON a.proceso = b.id ORDER BY a.dia";
      this.nuevoRegistro = this.servicio.rTraduccion()[1795]
      this.literalSingular = this.servicio.rTraduccion()[603]
      this.literalPlural = this.servicio.rTraduccion()[1774]
      this.literalSingularArticulo = this.servicio.rTraduccion()[1804]
      this.etiBuscar = this.servicio.rTraduccion()[603]
    }
     let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.verImagen = true;
      if ( JSON.stringify(this.arrFiltrado) != JSON.stringify(resp))
      {
        this.arreHover.length = resp.length;
        this.arreHover5.length = resp.length;
        this.arrFiltrado = resp;
        this.registros = resp;
        this.contarRegs();
        setTimeout(() => {
          this.servicio.activarSpinner.emit(false); 
          this.txtBuscar.nativeElement.focus();   
        }, 300);
      }
      else
      {
        setTimeout(() => {
          this.servicio.activarSpinner.emit(false);    
        }, 300);   
      }
    }, 
    error => 
      {
        setTimeout(() => {
          this.servicio.activarSpinner.emit(false);    
        }, 300);    
      })
  }

  adecuar()
  {
    if (this.maestroActual == 0 && this.nivelActual == 0)
    {
      //0. Proceso origen de esta operación      
      this.titulos = ["", this.servicio.rTraduccion()[1766], "", this.servicio.rTraduccion()[1868], "", this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1814], this.servicio.rTraduccion()[704], this.servicio.rTraduccion()[707], "", this.servicio.rTraduccion()[1815], this.servicio.rTraduccion()[1816], this.servicio.rTraduccion()[1817], this.servicio.rTraduccion()[604], this.servicio.rTraduccion()[1818], this.servicio.rTraduccion()[1819], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[1820], "" ]
      this.indices = [{ nombre: this.servicio.rTraduccion()[1771], icono: "i_procesos"}, { nombre: this.servicio.rTraduccion()[588], icono: "i_maquina"} ];
    }
    else if (this.maestroActual == 0 && this.nivelActual == 1)
    {
      this.listarProcesos(1);
      this.titulos = [this.servicio.rTraduccion()[1719], this.servicio.rTraduccion()[1766], "", this.servicio.rTraduccion()[1813], "", this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1814], this.servicio.rTraduccion()[704], this.servicio.rTraduccion()[707], "", this.servicio.rTraduccion()[1815], this.servicio.rTraduccion()[1816], this.servicio.rTraduccion()[1817], this.servicio.rTraduccion()[604], this.servicio.rTraduccion()[1818], this.servicio.rTraduccion()[1819], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[1820], this.servicio.rTraduccion()[1821], this.servicio.rTraduccion()[1821] ]
      this.indices = [{ nombre: this.servicio.rTraduccion()[1771], icono: "i_procesos"}, { nombre: this.servicio.rTraduccion()[588], icono: "i_maquina"} ];
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0)
    {
      this.titulos = ["", this.servicio.rTraduccion()[1766], "", this.servicio.rTraduccion()[1813], "", this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1814], this.servicio.rTraduccion()[704], this.servicio.rTraduccion()[707], this.servicio.rTraduccion()[1869], this.servicio.rTraduccion()[1870], this.servicio.rTraduccion()[1871], this.servicio.rTraduccion()[1817], this.servicio.rTraduccion()[604], this.servicio.rTraduccion()[1818], this.servicio.rTraduccion()[1819], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[1820], "" ]
      this.indices = [{ nombre: this.servicio.rTraduccion()[1772], icono: "i_rutas"}, { nombre: this.servicio.rTraduccion()[1875], icono: "i_flujo"} ];
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      this.titulos = [this.servicio.rTraduccion()[1874], this.servicio.rTraduccion()[1766], this.servicio.rTraduccion()[1822], this.servicio.rTraduccion()[1813], this.servicio.rTraduccion()[1823], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1814], this.servicio.rTraduccion()[704], this.servicio.rTraduccion()[707], "", this.servicio.rTraduccion()[1824], this.servicio.rTraduccion()[1816], this.servicio.rTraduccion()[1817], this.servicio.rTraduccion()[604], this.servicio.rTraduccion()[1818], this.servicio.rTraduccion()[1819], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[1820], this.servicio.rTraduccion()[1825], this.servicio.rTraduccion()[1826], this.servicio.rTraduccion()[1827], this.servicio.rTraduccion()[1828], this.servicio.rTraduccion()[1829] ]
      this.indices = [{ nombre: this.servicio.rTraduccion()[1772], icono: "i_rutas"}, { nombre: this.servicio.rTraduccion()[1875], icono: "i_flujo"} ];
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      this.listarRutas();
      this.titulos = ["", this.servicio.rTraduccion()[559], this.servicio.rTraduccion()[1822], this.servicio.rTraduccion()[1813], this.servicio.rTraduccion()[1830], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1814], this.servicio.rTraduccion()[704], this.servicio.rTraduccion()[707], "", this.servicio.rTraduccion()[1824], this.servicio.rTraduccion()[1816], this.servicio.rTraduccion()[1817], this.servicio.rTraduccion()[604], this.servicio.rTraduccion()[1818], this.servicio.rTraduccion()[1819], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[1820], this.servicio.rTraduccion()[1825], this.servicio.rTraduccion()[1825], this.servicio.rTraduccion()[1872], ]
      this.indices = [{ nombre: this.servicio.rTraduccion()[505], icono: "i_partes"} ];
      this.llenarMaquinas(this.registroActual)
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0)
    {
      this.titulos = [this.servicio.rTraduccion()[1877], this.servicio.rTraduccion()[1766], this.servicio.rTraduccion()[1822], this.servicio.rTraduccion()[1813], this.servicio.rTraduccion()[1830], this.servicio.rTraduccion()[698], this.servicio.rTraduccion()[1814], this.servicio.rTraduccion()[704], this.servicio.rTraduccion()[707], "", this.servicio.rTraduccion()[1824], this.servicio.rTraduccion()[1816], this.servicio.rTraduccion()[1817], this.servicio.rTraduccion()[604], this.servicio.rTraduccion()[1818], this.servicio.rTraduccion()[1819], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[1820], this.servicio.rTraduccion()[1825], "", this.servicio.rTraduccion()[1831], this.servicio.rTraduccion()[1832], this.servicio.rTraduccion()[1833] ]
      this.indices = [{ nombre: this.servicio.rTraduccion()[507], icono: "i_situaciones"} ];
    }
    else if (this.maestroActual == 6 && this.nivelActual == 0)
    {
      this.listarProcesos(1);
      this.titulos = [this.servicio.rTraduccion()[1719], this.servicio.rTraduccion()[1834], this.servicio.rTraduccion()[1835], this.servicio.rTraduccion()[1836], this.servicio.rTraduccion()[1837], this.servicio.rTraduccion()[1838], this.servicio.rTraduccion()[1814], this.servicio.rTraduccion()[704], this.servicio.rTraduccion()[707], "", this.servicio.rTraduccion()[1824], this.servicio.rTraduccion()[1816], this.servicio.rTraduccion()[1817], this.servicio.rTraduccion()[604], this.servicio.rTraduccion()[1818], this.servicio.rTraduccion()[1819], this.servicio.rTraduccion()[750], this.servicio.rTraduccion()[1820], this.servicio.rTraduccion()[1825], "", this.servicio.rTraduccion()[1831], this.servicio.rTraduccion()[1832], this.servicio.rTraduccion()[1833] ]
      this.indices = [{ nombre: this.servicio.rTraduccion()[1774], icono: "i_horarios"} ];
    }
  }

  recuperar()
  {
    let sentencia = "SELECT a.*, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "') AS fcreacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + this.registroActual; 
    this.arreHover4 = [];
    this.arreHover6 = [];
    this.arreHover7 = [];
    this.arreHover8 = [];
    if (this.maestroActual == 0 && this.nivelActual == 0)
    {
      this.arreHover4.length = 2;
    }
    else if (this.maestroActual == 0 && this.nivelActual == 1)
    {
      this.listarProcesos(1);
      sentencia = "SELECT a.*, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "') AS fcreacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + this.registroActual; 
      this.arreHover4.length = 2;
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0)
    {
      sentencia = "SELECT a.*, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "') AS fcreacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio, (SELECT COUNT(*) FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = a.id) AS cuenta FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + this.registroActual; 
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      sentencia = "SELECT a.*, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "') AS fcreacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".det_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + this.registroActual; 
      this.listarProcesos(1);
      this.listarSecuencias();
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      this.listarRutas();
      sentencia = "SELECT a.*, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "') AS fcreacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + this.registroActual; 
      this.llenarMaquinas(this.registroActual)
      //this.servicio.mensajeSuperior.emit("Gestión de Números de parte")
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0)
    {
      sentencia = "SELECT a.*, IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "') AS fcreacion, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucreacion, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_situaciones a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + this.registroActual; 
    }
    else if (this.maestroActual == 6 && this.nivelActual == 0)
    {
      this.listarProcesos(1);
      sentencia = "SELECT * FROM " + this.servicio.rBD() + ".horarios WHERE id = " + this.registroActual; 
    }
    this.adecuar();
    
    this.arreHover4.length = this.indices.length;
    
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.botonera1 = 2;
        this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1878] + this.literalSingular);    
        this.detalleRegistro = resp[0];
        if (this.detalleRegistro.proceso=="0" && (this.maestroActual == 6 || this.maestroActual == 4))
        {
          this.detalleRegistro.proceso = 0;
        }
        
        this.detalleRegistro.fecha = new Date(this.detalleRegistro.fecha)
        this.registroActual = resp[0].id;
        if (this.nivelActual == 1)
        {
          this.detalleRegistro.asociado = this.nombreRuta;
          this.detalleRegistro.asociadoID = this.idNivel0;
        }
        else
        {
          this.nombreRuta = this.detalleRegistro.nombre;
          this.idNivel0 = this.detalleRegistro.id;
        }
        if (this.detalleRegistro.referencia != "ADMIN" || this.despuesBusqueda == 1)
        {
          this.detalleRegistro.admin = "N";
        }
        this.cancelarEdicion = false;
        this.mostrarImagenRegistro = "S";
        this.estatusActual = this.detalleRegistro.estatus;
        this.secuenciaActual = this.detalleRegistro.secuencia;
        this.botonera[3]= false;
        this.botonera[4]= this.detalleRegistro.estatus == "I";
        this.botonera[5]= false;

        if (this.detalleRegistro.sms == "S")
        this.seleccionAlerta.push("S");
        if (this.detalleRegistro.llamada == "S")
        this.seleccionAlerta.push("L");
        if (this.detalleRegistro.correo == "S")
        this.seleccionAlerta.push("C");
        if (this.detalleRegistro.mmcall == "S")
        this.seleccionAlerta.push("M");


        if (this.detalleRegistro.sms1 == "S")
        this.seleccionescalar1.push("S");
        if (this.detalleRegistro.llamada1 == "S")
        this.seleccionescalar1.push("L");
        if (this.detalleRegistro.correo1 == "S")
        this.seleccionescalar1.push("C");
        if (this.detalleRegistro.mmcall1 == "S")
        this.seleccionescalar1.push("M");
        if (this.detalleRegistro.sms2 == "S")
        this.seleccionescalar2.push("S");
        if (this.detalleRegistro.llamada2 == "S")
        this.seleccionescalar2.push("L");
        if (this.detalleRegistro.correo2 == "S")
        this.seleccionescalar2.push("C");
        if (this.detalleRegistro.mmcall2 == "S")
        this.seleccionescalar2.push("M");
        if (this.detalleRegistro.sms3 == "S")
        this.seleccionescalar3.push("S");
        if (this.detalleRegistro.llamada3 == "S")
        this.seleccionescalar3.push("L");
        if (this.detalleRegistro.correo3 == "S")
        this.seleccionescalar3.push("C");
        if (this.detalleRegistro.mmcall3 == "S")
        this.seleccionescalar3.push("M");
        this.calculoSeg(1);
        this.calculoSeg(2);
        this.calculoSeg(3);
        this.calculoSeg(4);
        if (this.maestroActual==7)
        {
          this.seleccionProcesos = []; 
          sentencia = "SELECT proceso FROM " + this.servicio.rBD() + ".relacion_usuarios_operaciones WHERE usuario = " + this.registroActual + " AND tipo = 0"; 
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp2 =>
          {
            var i;
            for (i = 0; i < +resp2.length; i++ )
            {
              this.seleccionProcesos.push(resp2[i].proceso);  
            }  
          })
        }
        this.copiandoDesde = 0;
        if (this.despuesBusqueda == 1)
        {
          this.copiandoDesde = this.detalleRegistro.id;
          this.registroActual = 0;
          this.mostrarImagenRegistro = "S";
          this.detalleRegistro.estatus = "A"
          this.botonera[1] = false;
          this.botonera[2] = false;
          this.editando = true;
          this.faltaMensaje = this.servicio.rTraduccion()[134]
          this.detalleRegistro.id = 0;
          this.detalleRegistro.fcambio = "";
          this.detalleRegistro.ucambio = "";
          this.detalleRegistro.fcreacion = "";
          this.detalleRegistro.ucreacion = "";
        }
        else
        {
          this.editando = false;
          this.botonera[1]= true;
          this.botonera[2]= true;
        }
        this.llenarListas();
    }, 
    error => 
      {
        console.log(error)
      })
  }

  buscarRegistro(accion: number)
  {
    let catalogo = "" + this.servicio.rBD() + ".cat_procesos"
    if (this.maestroActual == 0 && this.nivelActual == 1) 
    {
      catalogo = "" + this.servicio.rBD() + ".cat_maquinas"
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) //Líneas de producción
    {
      catalogo = "" + this.servicio.rBD() + ".cat_rutas"
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1) //Líneas de producción
    {
      catalogo = "" + this.servicio.rBD() + ".det_rutas"
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0) //Líneas de producción
    {
      catalogo = "" + this.servicio.rBD() + ".cat_partes"
    }
    else if (this.maestroActual == 3 && this.nivelActual == 0) //Líneas de producción
    {
      catalogo = "" + this.servicio.rBD() + ".cat_distribucion"
    }
    else if (this.maestroActual == 4 && this.nivelActual == 0) //Líneas de producción
    {
      catalogo = "" + this.servicio.rBD() + ".cat_alertas"
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0) //Líneas de producción
    {
      catalogo = "" + this.servicio.rBD() + ".cat_situaciones"
    }
    else if (this.maestroActual == 6 && this.nivelActual == 0) //Líneas de producción
    {
      catalogo = "" + this.servicio.rBD() + ".horarios"
    }
    else if (this.maestroActual == 7 && this.nivelActual == 0) //Líneas de producción
    {
      catalogo = "" + this.servicio.rBD() + ".cat_usuarios"
    }
    let sentencia: string = "";
    if (accion == 1)
    {
      this.recuperar()
      return;
    }
    else
    {
      if (this.editando && !this.cancelarEdicion)
      {
        this.deshacerEdicion(accion, 2);
        return;
      }
    }
    this.verRegistro = 22;
    if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      if (accion == 2)
      {
        sentencia = "SELECT MIN(secuencia) AS id FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0;
      }
      else if (accion == 3)
      {
        sentencia = " SELECT (SELECT secuencia FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + " AND secuencia > " + this.secuenciaActual + " ORDER BY secuencia ASC LIMIT 1) AS id UNION ALL (SELECT MIN(secuencia) FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + ") ORDER BY 1 DESC LIMIT 1;"
      }
      else if (accion == 4)
      {
        sentencia  = " SELECT (SELECT MAX(secuencia) FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + ") AS id UNION ALL (SELECT secuencia FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + " AND secuencia < " + this.secuenciaActual + " ORDER BY 1 DESC LIMIT 1) ORDER BY 1 ASC LIMIT 1;"
      }
      else if (accion == 5)
      {
        sentencia = " SELECT MAX(secuencia) AS id FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + ";";
      }
    }
    else if (this.maestroActual == 0 && this.nivelActual == 1)
    {
      if (accion == 2)
      {
        sentencia = "SELECT MIN(id) AS id FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = " + this.idNivel0;
      }
      else if (accion == 3)
      {
        sentencia = " SELECT (SELECT id FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = " + this.idNivel0 + " AND id > " + this.registroActual + " ORDER BY id ASC LIMIT 1) AS id UNION ALL (SELECT MIN(id) FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = " + this.idNivel0 + ") ORDER BY 1 DESC LIMIT 1;"
      }
      else if (accion == 4)
      {
        sentencia  = " SELECT (SELECT MAX(id) FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = " + this.idNivel0 + ") AS id UNION ALL (SELECT id FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = " + this.idNivel0 + " AND id < " + this.registroActual + " ORDER BY 1 DESC LIMIT 1) ORDER BY 1 ASC LIMIT 1;"
      }
      else if (accion == 5)
      {
        sentencia = " SELECT MAX(id) AS id FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = " + this.idNivel0 + ";";
      }
    }
    else
    {
      if (accion == 2)
      {
        sentencia = "SELECT MIN(id) AS id FROM " + catalogo;
      }
      else if (accion == 3)
      {
        sentencia = " SELECT (SELECT id FROM " + catalogo + " WHERE id > " + this.registroActual + " ORDER BY id ASC LIMIT 1) AS id UNION ALL (SELECT MIN(id) FROM " + catalogo + ") ORDER BY 1 DESC LIMIT 1;"
      }
      else if (accion == 4)
      {
        sentencia  = " SELECT (SELECT MAX(id) FROM " + catalogo + ") AS id UNION ALL (SELECT id FROM " + catalogo + " WHERE id < " + this.registroActual + " ORDER BY 1 DESC LIMIT 1) ORDER BY 1 ASC LIMIT 1;"
      }
      else if (accion == 5)
      {
        sentencia = " SELECT MAX(id) AS id FROM " + catalogo;
      }
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp[0].id)
      {
        if (this.maestroActual == 1 && this.nivelActual == 1)
        {
          sentencia = " SELECT id FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + " AND secuencia = " + resp[0].id + ";";
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            this.registroActual = resp[0].id;
            this.recuperar()
          });
        }
        else
        {
          this.registroActual = resp[0].id;
          this.recuperar()
        }
        
      }
      else
      {
        this.procesarPantalla(this.maestroActual)
      }
    })
    
  }

  revisar()
  {
    if (this.actualizarMaestro && this.verRegistro == 1)
    {
      
      let sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".actualizaciones WHERE procesos = 'S'";
      if (this.maestroActual == 0 && this.nivelActual == 1)
      {
        sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".actualizaciones WHERE cat_maquinas = 'S'";
      }
      else if (this.maestroActual == 1 && this.nivelActual == 0)
      {
        sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".actualizaciones WHERE rutas = 'S'";
      }
      else if (this.maestroActual == 1 && this.nivelActual == 1)
      {
        sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".actualizaciones WHERE det_rutas = 'S'";
      }
      else if (this.maestroActual == 2 && this.nivelActual == 0)
      {
        sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".actualizaciones WHERE partes = 'S'";
      }
      else if (this.maestroActual == 3 && this.nivelActual == 0)
      {
        sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".actualizaciones WHERE recipientes = 'S'";
      }
      else if (this.maestroActual == 4 && this.nivelActual == 0)
      {
        sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".actualizaciones WHERE alertas = 'S'";
      }
      else if (this.maestroActual == 5 && this.nivelActual == 0)
      {
        sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".actualizaciones WHERE situaciones = 'S'";
      }
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp[0].cuenta > 0)
          {
            //Se revisa la tabla para 
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[2554];
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            this.llenarRegistros();

            //Se actualiza la tabla
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET procesos = 'N'";
            if (this.maestroActual == 0 && this.nivelActual == 1)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET cat_maquinas = 'N'";
            }
            else if (this.maestroActual == 1 && this.nivelActual == 0)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET rutas = 'N'";
            }
            else if (this.maestroActual == 1 && this.nivelActual == 1)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET det_rutas = 'N'";
            }
            else if (this.maestroActual == 2 && this.nivelActual == 0)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET partes = 'N'";
            }
            else if (this.maestroActual == 3 && this.nivelActual == 0)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET recipientes = 'N'";
            }
            else if (this.maestroActual == 4 && this.nivelActual == 0)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = 'N'";
            }
            else if (this.maestroActual == 5 && this.nivelActual == 0)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET situaciones = 'N'";
            }
            campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
              {
                //setTimeout(() => {
                //  this.revisar()  
                //}, +this.tiempoRevision);
              })
          }
        },
      error => 
        {
          //setTimeout(() => {
          //  this.revisar()  
         // }, +this.tiempoRevision);
        }
      )
      //setTimeout(() => {
      //  this.revisar()  
      //}, +this.tiempoRevision);
    }
  }

  

  contarRegs()
  {
    if (this.router.url.substr(0, 13) != "/catalogoswip" )
    {
      return;
    }
    let mensaje = "";
    
    let cadAdicional: string = (this.registros.length != this.arrFiltrado.length ? this.servicio.rTraduccion()[65].replace("campo_0", this.arrFiltrado.length) : "");
    this.hayFiltro = this.registros.length != this.arrFiltrado.length;
    if (this.registros.length > 0)
    {
      mensaje = this.servicio.rTraduccion()[66] + (this.registros.length == 1 ? " un " + this.literalSingular : this.registros.length + " " + this.literalPlural) 
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
    let conRuta = "";
    if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      conRuta =  this.servicio.rTraduccion()[1881] + "'" + this.nombreRuta + "'"
    }
    else if (this.maestroActual == 0 && this.nivelActual == 1)
    {
      conRuta =  this.servicio.rTraduccion()[1882] + "'" + this.nombreRuta + "'"
    }
    mensaje = mensaje + " " + cadAdicional + " " + conRuta + " " + cadAlarmas
    this.servicio.mensajeInferior.emit(mensaje);          
  }
  
  cambioMaestro()
  {
    if (this.maestroActual == 1)
    {

    }
  }

  imagenError(id: number)
  {
    //if (this.accion == "in")
    {
      this.registros[id].mostrarImagen = "N";
      
    }
  }

  imagenErrorRegistro()
  {
    //if (this.accion == "in")
    {
      this.mostrarImagenRegistro = "N";
      this.mensajeImagen = this.servicio.rTraduccion()[1883]
    }
  }

  editar(id: number)
  {
    this.registroActual = id;    
    this.despuesBusqueda = 0;
    this.buscarRegistro(1);    
    this.verRegistro = 22;
  }

  salidaEfecto(evento: any)
  {
    if (evento.toState)
    {
      this.verRegistro = (this.verRegistro == 21 || this.verRegistro == 1 ? 1 : 2);
      
      
    }
    this.verImagen = this.verRegistro == 1;  
  }

  procesarPantalla(id: number)
  {
    if (this.editando && !this.cancelarEdicion)
    {
      this.deshacerEdicion(id, 1)
      return;
    }   
    this.botonera1 = 1;
    this.verImagen = false;
    if (!this.noAnimar)
    {
      this.verRegistro = (this.verRegistro == 0 || this.verRegistro == 21 ? 1 : 21);  
    }
    else
    {
      this.verRegistro = 1;
    }  
    if (id == 1 && this.maestroActual == 0)
      {
        this.nivelActual = 0;
        this.indices = [];
        
        //this.servicio.mensajeSuperior.emit("Gestión de Procesos")
      }
    else if (id == 1 && this.maestroActual == 1)
    {
      this.nivelActual = 0;
      this.indices = [];
      //this.servicio.mensajeSuperior.emit("Gestión de Rutas de fabricación")
      
      this.revisar();
    }
    else if (id == 2 && this.maestroActual == 1)
    {
      if (!this.idNivel0 || this.idNivel0 == 0)
      {
        this.idNivel0 = this.registroActual;
      }
      
      this.nivelActual = 1;
    
      this.indices = this.indices = [{ nombre: this.servicio.rTraduccion()[1772], icono: "i_rutas"} ];
      //this.servicio.mensajeSuperior.emit("Gestión de Rutas de fabricación/Operaciones")
      this.revisar();
    
    }
    else if (id == 2 && this.maestroActual == 0)
    {
      if (!this.idNivel0 || this.idNivel0 == 0)
      {
        this.idNivel0 = this.registroActual;
      }
      
      this.nivelActual = 1;
    
      this.indices = this.indices = [{ nombre: this.servicio.rTraduccion()[1771], icono: "i_procesos"} ];
      //this.servicio.mensajeSuperior.emit("Gestión de Procesos/Equipamiento")
      this.revisar();
    
    }
    else if (id == 1 && this.maestroActual == 2)
    {
      this.nivelActual = 0;
      this.indices = [];
     //this.servicio.mensajeSuperior.emit("Gestión de Números de parte")
    }
    else if (id == 1 && this.maestroActual == 3)
    {
      this.nivelActual = 0;
      this.indices = [];
     //this.servicio.mensajeSuperior.emit("Gestión de Recipientes")
    }
    else if (id == 1 && this.maestroActual == 4)
    {
      this.nivelActual = 0;
      this.indices = [];
      //this.servicio.mensajeSuperior.emit("Gestión de Alertas")
    }
    else if (id == 1 && this.maestroActual == 5)
    {
      this.nivelActual = 0;
      this.indices = [];
      //this.servicio.mensajeSuperior.emit("Gestión de Situaciones")
    }
    else if (id == 1 && this.maestroActual == 6)
    {
      this.nivelActual = 0;
      this.indices = [];
      //this.servicio.mensajeSuperior.emit("Gestión de Horarios")
    }
    this.arreHover4.length = this.indices.length;
    this.llenarRegistros();
    this.revisar();
  }

  escapar()
  {
    this.buscar()
  }

  buscar()
  {
    setTimeout(() => {
      this.txtBuscar.nativeElement.focus();
    }, 50);
  }

  descargar()
  {
    let catalogo = "procesos_cabecera"
    let sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1884] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1716] + "', '" + this.servicio.rTraduccion()[1715] + "', '" + this.servicio.rTraduccion()[1885] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[1886] + "', '" + this.servicio.rTraduccion()[1887] + "', '" + this.servicio.rTraduccion()[707] + "' UNION ALL SELECT a.id, a.nombre, a.referencia, a.capacidad_stock, IFNULL((SELECT SUM(capacidad) FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = a.id and estatus = 'A'), 0), IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id"; 
    let sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".cat_procesos;";
    if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
    { 
      catalogo = "equipos"
      sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".cat_maquinas;";
      sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1888] + "', '" + this.servicio.rTraduccion()[1767] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1889] + "', '" + this.servicio.rTraduccion()[1890] + "', '" + this.servicio.rTraduccion()[1885] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[1886] + "', '" + this.servicio.rTraduccion()[1887] + "', '" + this.servicio.rTraduccion()[707] + "' UNION ALL SELECT a.id, a.nombre, a.capacidad, a.referencia, IF(a.programar = 'S', '" + this.servicio.rTraduccion()[1891] + "', '" + this.servicio.rTraduccion()[1892] + "'), IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_procesos d ON a.proceso = d.id"; 
          
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
    {
      catalogo = "rutas_fabricacion"
      sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1893] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1894] + "', '" + this.servicio.rTraduccion()[1895] + "', '" + this.servicio.rTraduccion()[1885] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[1886] + "', '" + this.servicio.rTraduccion()[1887] + "', '" + this.servicio.rTraduccion()[707] + "' UNION ALL SELECT a.id, a.nombre, a.referencia, a.inicia, a.finaliza, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id"; 
      sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".cat_rutas;";
      
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1) //Líneas de producción
    {
      catalogo = "operaciones"
      sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".det_rutas;";
      sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1896] + "', '" + this.servicio.rTraduccion()[1897] + "', '" + this.servicio.rTraduccion()[1898] + "', '" + this.servicio.rTraduccion()[1899] + "', '" + this.servicio.rTraduccion()[1900] + "', 'Número de piezas a esperar para finalizar el changeover', '" + this.servicio.rTraduccion()[1901] + "', '" + this.servicio.rTraduccion()[1902] + "', '" + this.servicio.rTraduccion()[1890] + "', '" + this.servicio.rTraduccion()[1885] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[1886] + "', '" + this.servicio.rTraduccion()[1887] + "', '" + this.servicio.rTraduccion()[707] + "' UNION ALL SELECT a.id, a.nombre, a.secuencia, a.tiempo_stock, a.tiempo_setup, a.tiempo_setup_idem, a.piezas_finalizar_paro, a.tiempo_proceso, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') FROM " + this.servicio.rBD() + ".det_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_procesos d ON a.proceso = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_rutas e ON a.ruta = e.id"; 
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0) //Rutas de producción
    {
      catalogo = "numeros_de_parte"
      sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".cat_partes;";
      sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1903] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1872] + "', '" + this.servicio.rTraduccion()[1904] + "', '" + this.servicio.rTraduccion()[1885] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[1886] + "', '" + this.servicio.rTraduccion()[1887] + "', '" + this.servicio.rTraduccion()[707] + "' UNION ALL SELECT a.id, a.nombre, a.referencia, IF(a.tipo = 0, '" + this.servicio.rTraduccion()[1905] + "', IF(a.tipo = 1, '" + this.servicio.rTraduccion()[1906] + "', '" + this.servicio.rTraduccion()[988] + "')), IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_rutas d ON a.ruta = d.id"; 
    }
    else if (this.maestroActual == 3 && this.nivelActual == 0) 
    {
      catalogo = "recipientes"
      sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".cat_distribucion;";
      sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1542] + "', '" + this.servicio.rTraduccion()[1907] + "', '" + this.servicio.rTraduccion()[1908] + "', '" + this.servicio.rTraduccion()[1909] + "', '" + this.servicio.rTraduccion()[1885] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[1886] + "', '" + this.servicio.rTraduccion()[1887] + "', '" + this.servicio.rTraduccion()[707] + "' UNION ALL SELECT a.id, a.nombre, a.telefonos, a.correos, a.mmcall, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id"; 
    }
    else if (this.maestroActual == 4 && this.nivelActual == 0) 
    {
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0) 
    {
      catalogo = "situaciones_calidad"
      sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".cat_situaciones;";
      sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1910] + "', '" + this.servicio.rTraduccion()[698] + "', '" + this.servicio.rTraduccion()[1911] + "', '" + this.servicio.rTraduccion()[1885] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[1886] + "', '" + this.servicio.rTraduccion()[1887] + "', '" + this.servicio.rTraduccion()[707] + "' UNION ALL SELECT a.id, a.nombre, a.referencia, IF(a.tipo = 0, '" + this.servicio.rTraduccion()[1912] + "', '" + this.servicio.rTraduccion()[1913] + "'), IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') FROM " + this.servicio.rBD() + ".cat_situaciones a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id"; 
    }
    else if (this.maestroActual == 6 && this.nivelActual == 0) 
    {
      catalogo = "horarios"
      sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".horarios;";
      sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[579] + "', '" + this.servicio.rTraduccion()[1719] + "', '" + this.servicio.rTraduccion()[1914] + "', '" + this.servicio.rTraduccion()[1915] + "', '" + this.servicio.rTraduccion()[1916] + "', '" + this.servicio.rTraduccion()[1917] + "' UNION ALL SELECT a.id, IF(a.tipo = 'S', '" + this.servicio.rTraduccion()[1718] + "', '" + this.servicio.rTraduccion()[1918] + "'), IFNULL(b.nombre, '" + this.servicio.rTraduccion()[1087] + "'), CASE WHEN a.dia = 0 THEN '" + this.servicio.rTraduccion()[1757] + "' WHEN a.dia = 1 THEN '" + this.servicio.rTraduccion()[1759] + "' WHEN a.dia = 2 THEN '" + this.servicio.rTraduccion()[1760] + "' WHEN a.dia = 3 THEN '" + this.servicio.rTraduccion()[1761] + "' WHEN a.dia = 4 THEN '" + this.servicio.rTraduccion()[1758] + "' WHEN a.dia = 5 THEN '" + this.servicio.rTraduccion()[1763] + "' WHEN a.dia = 6 THEN '" + this.servicio.rTraduccion()[1762] + "' WHEN a.dia = 9 THEN '" + this.servicio.rTraduccion()[1915] +"' END, IF(a.dia = 9, a.fecha, '" + this.servicio.rTraduccion()[8] + "'), a.desde, a.hasta FROM " + this.servicio.rBD() + ".horarios a LEFT JOIN " + this.servicio.rBD() + ".cat_procesos b ON a.proceso = b.id"; 
    }
    else if (this.maestroActual == 7 && this.nivelActual == 0) 
    {
      catalogo = "usuarios"
      sentenciaC = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".cat_usuarios;";
      sentenciaR = "SELECT '" + this.servicio.rTraduccion()[558] + "', '" + this.servicio.rTraduccion()[1919] + "', '" + this.servicio.rTraduccion()[1328] + "', '" + this.servicio.rTraduccion()[1920] + "', '" + this.servicio.rTraduccion()[1921] + "', '" + this.servicio.rTraduccion()[1922] + "', '" + this.servicio.rTraduccion()[1923] + "', '" + this.servicio.rTraduccion()[1924] + "', '" + this.servicio.rTraduccion()[1925] + "', '" + this.servicio.rTraduccion()[1926] + "', '" + this.servicio.rTraduccion()[1885] + "', '" + this.servicio.rTraduccion()[748] + "', '" + this.servicio.rTraduccion()[1886] + "', '" + this.servicio.rTraduccion()[1887] + "', '" + this.servicio.rTraduccion()[707] + "' UNION ALL SELECT a.id, a.referencia, a.nombre, IF(a.admin = 'S', '" + this.servicio.rTraduccion()[1891] + "', '" + this.servicio.rTraduccion()[1892] + "'), CASE WHEN a.rol = 'A' THEN '" + this.servicio.rTraduccion()[984] + "' WHEN a.rol = 'C' THEN '" + this.servicio.rTraduccion()[1927] + "' WHEN a.rol = 'O' THEN '" + this.servicio.rTraduccion()[1039] + "' WHEN a.rol = 'G' THEN '" + this.servicio.rTraduccion()[1022] + "' END, IF(a.operacion = 'S', '" + this.servicio.rTraduccion()[1891] + "', '" + this.servicio.rTraduccion()[1892] + "'), IF(a.calidad = 'S', '" + this.servicio.rTraduccion()[1891] + "', '" + this.servicio.rTraduccion()[1892] + "'), IF(a.reversos = 'S', '" + this.servicio.rTraduccion()[1891] + "', '" + this.servicio.rTraduccion()[1892] + "'), IF(a.programacion = 'S', '" + this.servicio.rTraduccion()[1891] + "', '" + this.servicio.rTraduccion()[1892] + "'), IF(a.inventario = 'S', '" + this.servicio.rTraduccion()[1891] + "', '" + this.servicio.rTraduccion()[1892] + "'), IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.creacion, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "'), IF(a.estatus = 'A', '" + this.servicio.rTraduccion()[1154] + "', '" + this.servicio.rTraduccion()[1155] + "') FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id"; 
    }
    let campos = {accion: 100, sentencia: sentenciaC};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp[0].cuenta == 0)
      {
        const respuesta = this.dialogo.open(DialogowipComponent, {
          width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1928], mensaje: this.servicio.rTraduccion()[1929], alto: "30", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", icono0: "iconshock-materialblack-mail-block" }
        });

      }
      else
      {
        let campos = {accion: 100, sentencia: sentenciaR};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          this.servicio.generarReporte(resp, catalogo, catalogo + ".csv")
        })
      }
    })
  }

  filtrar()
  {
    this.sondeo = 0;
    this.registros = this.aplicarFiltro(this.textoBuscar);
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

  cambiando(evento: any)
  {
    
    if (!this.editando)
    {
      this.botonera[1] = false;
      this.botonera[2] = false;
      this.botonera[3] = true;
      this.botonera[4] = true;
      this.botonera[5] = true;
      this.editando = true;
      this.faltaMensaje = this.servicio.rTraduccion()[134]
      this.detalleRegistro.fcambio = "";
      this.detalleRegistro.ucambio = "";
      this.cancelarEdicion = false;
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
  
  onFileSelected(event)
  {

    const fd = new FormData();
    fd.append('imagen', event.target.files[0], event.target.files[0].name);
    this.botonera[1] = false;
    this.botonera[2] = false;
    this.botonera[3] = true;
    this.botonera[4] = true;
    this.botonera[5] = true;
    this.editando = true;
    this.faltaMensaje = this.servicio.rTraduccion()[134]
    this.mostrarImagenRegistro = "S";
    this.mensajeImagen = this.servicio.rTraduccion()[358]
    this.faltaMensaje = this.servicio.rTraduccion()[134]
    this.mostrarImagenRegistro = "S";
    this.mensajeImagen = this.servicio.rTraduccion()[358]
    this.detalleRegistro.imagen = this.URL_IMAGENES + event.target.files[0].name;
        

    /** In Angular 5, including the header Content-Type can invalidate your request */
    this.http.post(this.URL_BASE, fd)
    .subscribe(res => {
      console.log(this.URL_BASE);
      console.log(res);
      
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[1389];
      mensajeCompleto.tiempo = 3000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      })
  }

  cancelar()
  {
    if (!this.botonera[2])
    {
      this.edicionCancelada();              
      this.despuesBusqueda = 0;
      if (!this.registroActual)
      {
        this.inicializarPantalla();
        return;
      }
      else
      {
        this.buscarRegistro(1)
      }
    }
  }

  copiar()
  {
    if (!this.botonera[3])
    {
      if (this.editando && !this.cancelarEdicion)
      {
        this.deshacerEdicion(0, 99)
        return;
      } 
      this.despuesBusqueda = 1;
      this.buscarRegistro(1);
      
    } 
  }

  validarEliminar()
  {
    if (this.detalleRegistro.admin=="S")
    {
      const respuesta = this.dialogo.open(DialogowipComponent, {
        width: "400px", height: "210px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1930], mensaje: this.servicio.rTraduccion()[1931], alto: "40", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", icono0: "iconshock-materialblack-mail-block" }
      });
      return;
    } 
    let idBuscar = this.registroActual
    let sentencia = "";
    if (this.maestroActual == 0 && this.nivelActual == 0) //Rutas de producción
    {
      sentencia = "SELECT COUNT(*) AS totalr FROM " + this.servicio.rBD() + ".det_rutas WHERE estatus = 'A' AND proceso = " + idBuscar; 
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
    {
      sentencia = "SELECT COUNT(*) AS totalr FROM " + this.servicio.rBD() + ".cat_partes WHERE estatus = 'A' AND ruta = " + idBuscar; 
    }
    if (sentencia)
    {
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp && resp[0].totalr > 0)
        {
          let mensaje = this.servicio.rTraduccion()[1982].replace("campo_0", resp[0].totalr)
          if (this.maestroActual == 1)
          {
            mensaje = this.servicio.rTraduccion()[2002].replace("campo_0", resp[0].totalr)
          }
          const respuesta = this.dialogo.open(DialogowipComponent, {
            width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[388] + " " +this.literalSingular, mensaje: mensaje, alto: "80", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", icono0: "iconshock-materialblack-mail-block" }
          });
        }
        else
        {
          this.eliminar(idBuscar);
        }
      })
    }
    else
    {
      this.eliminar(idBuscar); 
    }
  }

  nuevo()
  {
    this.calculoSeg(1);
    this.calculoSeg(2);
    this.calculoSeg(3);
    this.calculoSeg(4);
    this.adecuar();
    if (this.maestroActual == 0 && this.nivelActual == 1)
    {
      this.listarProcesos(0);
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      this.listarProcesos(0);
      this.listarSecuencias();
      this.detalleRegistro.secuencia = "0";
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      this.llenarMaquinas(0)
    }
    else if (this.maestroActual == 4 && this.nivelActual == 0)
    {
      this.listaListas();
      this.listarProcesos(1);
    }
    else if (this.maestroActual == 6 && this.nivelActual == 0)
    {
      this.listarProcesos(1);
      this.botonera[1] = false;
      this.botonera[2] = false;
      this.editando = true;
      this.cancelarEdicion = true;
      this.faltaMensaje = this.servicio.rTraduccion()[134]
        
    }
    this.arreHover4.length = this.indices.length;
    
    this.copiandoDesde = 0;
    this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[1878] + this.literalSingular);    
    if (!this.botonera[0])
    {
      if (this.editando && !this.cancelarEdicion)
      {
        this.deshacerEdicion(0, 99)
        return;
      } 
      this.despuesBusqueda = 0;
      //
      this.botonera1 = 2;

      this.detalleRegistro.id = 0;
      this.detalleRegistro.proceso = 0;
      this.detalleRegistro.nombre = "";
      this.detalleRegistro.admin = "N";
      this.detalleRegistro.asociado = this.nombreRuta;
      this.detalleRegistro.asociadoID = this.idNivel0;
      this.detalleRegistro.referencia = "";
      this.detalleRegistro.notas = "";
      this.detalleRegistro.operacion = "S";
      this.detalleRegistro.programacion = "N";
      this.detalleRegistro.inventario = "N";
      this.detalleRegistro.calidad = "N";
      this.detalleRegistro.rol = "O";
      this.detalleRegistro.dia = "0";
      this.detalleRegistro.reversos = "N";
      this.seleccionProcesos = [];
      this.detalleRegistro.acumular = "N";
      this.detalleRegistro.acumular_veces = "0";
      this.detalleRegistro.acumular_tiempo = "0";
      this.detalleRegistro.fecha = new Date();
      this.detalleRegistro.acumular_inicializar = "S";
      this.detalleRegistro.reduccion_setup = "S";
      this.detalleRegistro.repetir = "N";
      this.detalleRegistro.repetir0 = "N";
      this.detalleRegistro.repetir1 = "N";
      this.detalleRegistro.repetir2 = "N";
      this.detalleRegistro.repetir3 = "N";
      this.detalleRegistro.escalar1 = "N";
      this.detalleRegistro.escalar2 = "N";
      this.detalleRegistro.escalar3 = "N";

      this.detalleRegistro.repetir_tiempo = "0";
      this.detalleRegistro.acumular_tipo_mensaje = "T";
      this.detalleRegistro.informar_resolucion = "S";
      this.seleccionAlerta = ["M", "C"];
      this.seleccionescalar1 = ["C"];
      this.seleccionescalar2 = ["C"];
      this.seleccionescalar3 = ["C"];
      this.detalleRegistro.tiempo1 = "0";
      this.detalleRegistro.tipo = (this.maestroActual==6 ? "S" : "0");
      this.detalleRegistro.programar = "N";
      this.detalleRegistro.tiempo2 = "0";
      this.detalleRegistro.tiempo3 = "0";
      this.detalleRegistro.tiempo0 = "0";
      this.detalleRegistro.lista = "0"
      this.detalleRegistro.lista1 = "0"
      this.detalleRegistro.lista2 = "0"
      this.detalleRegistro.lista3 = "0"
      this.detalleRegistro.acumular_mensaje= ""
      this.detalleRegistro.fecha = new Date();
      this.detalleRegistro.desde= "00:00:00"
      this.detalleRegistro.hasta= "23:59:59"
      this.detalleRegistro.imagen = "";
      this.detalleRegistro.capacidad_stock = 0;
      this.detalleRegistro.capacidad = 0;
      this.detalleRegistro.tiempo_proceso = 0;
      this.detalleRegistro.tiempo_setup = 0;
      this.detalleRegistro.tiempo_setup_idem = 0;
      this.detalleRegistro.piezas_finalizar_paro = 0;
      this.detalleRegistro.tiempo_stock = 0;
      this.detalleRegistro.estatus = "A"
      this.detalleRegistro.id = 0;
      this.detalleRegistro.fcambio = "";
      this.detalleRegistro.ucambio = "";
      this.detalleRegistro.fcreacion = "";
      this.detalleRegistro.ucreacion = "";
      //
      this.registroActual = 0;
      this.cancelarEdicion = true;
      this.mostrarImagenRegistro = "S";
      this.editando = false;
      if (this.maestroActual!=6)
      {
        this.botonera[1] = true;
        this.botonera[2] = true;
        this.botonera[3] = true;
        this.botonera[4] = true;
        this.botonera[5] = true;
      }
      setTimeout(() => {
        if (this.maestroActual == 1 && this.nivelActual == 1)
        {
          this.lstProceso.focus();
        }
        else if (this.maestroActual == 6 && this.nivelActual == 1)
        {
          this.lstProceso.focus();
        }
        else
        {
          this.txtNombre.nativeElement.focus();
        }
      }, 300);
    } 
  }

  listarProcesos(id: number)
  {
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_procesos ORDER BY nombre;"
    this.procesos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.procesos = resp;
      if (id == 0)
      {
        if (this.procesos.length > 0)
        {
          this.detalleRegistro.proceso = this.procesos[0].id;
        }
      }       
      
    });
  }
  
  listarRutas()
  {
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_rutas ORDER BY nombre;"
    this.rutas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.rutas = resp;
    });
  }

  listaListas()
  {
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_distribucion ORDER BY nombre;"
    this.listas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.listas = resp;
    });
  }

  listarSecuencias()
  {
    this.secuencias = [ { id: "-1", nombre: this.servicio.rTraduccion()[1932] }, {id: "0", nombre: this.servicio.rTraduccion()[1933] } ];
    let sentencia = "SELECT COUNT(*) as cuenta FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + ";";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp[0].cuenta)
      {
        var i;
        for (i = 1; i <= +resp[0].cuenta; i++ )
        {
          this.secuencias.push({ id:  (i + ''), nombre: i });
        }
      }         
    });
  }

  nuevoRegistroGral()
  {
    this.nuevo();    
    this.verRegistro = 22;
  }

  validarTabla()
  {
    let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_procesos LIMIT 1";
    if (this.maestroActual == 0 && this.nivelActual == 1) 
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_maquinas LIMIT 1";
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) 
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_rutas LIMIT 1";
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".det_rutas LIMIT 1";
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_partes LIMIT 1";
    }
    else if (this.maestroActual == 3 && this.nivelActual == 0)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_distribucion LIMIT 1";
    }
    else if (this.maestroActual == 4 && this.nivelActual == 0)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_alertas LIMIT 1";
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_situaciones LIMIT 1";
    }
    else if (this.maestroActual == 6 && this.nivelActual == 0)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".horarios LIMIT 1";
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        if (resp && resp[0].id > 0 && this.botonera[7])
        {
          this.botonera[7] = false;
          this.botonera[8] = false;
          this.botonera[9] = false;
          this.botonera[10] = false;
        }
        else if (!this.botonera[7])
        {
          this.botonera[7] = true;
          this.botonera[8] = true;
          this.botonera[9] = true;
          this.botonera[10] = true;
        }
    }) 
  }

  deshacerEdicion(parametro: number, desde: number)
  {
    const respuesta = this.dialogo.open(DialogowipComponent, {
      width: "530px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1427], mensaje: this.servicio.rTraduccion()[1879], alto: "60", id: 0, accion: 0, botones: 3, boton1STR: this.servicio.rTraduccion()[27], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[1880], icono2: "i_cancelar", boton3STR: "Regresar", icono3: "i_edicion", icono0: "i_guardar" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        this.cancelarEdicion = true;
        this.validarGuardar();      
      }
      else if (result.accion == 2) 
      {
        this.cancelarEdicion = true;
        this.edicionCancelada();      
        if (desde == 1)
        {
          this.procesarPantalla(parametro)
        }
        else if (desde == 2)
        {
          this.buscarRegistro(parametro)
        }        
      }
    });
  }

  validarGuardar()
  {
    if (this.maestroActual == 0 && this.nivelActual == 0)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1948]
      }
      if (!this.detalleRegistro.capacidad_stock || this.detalleRegistro.capacidad_stock == 0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1956]
      }
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        else
        {
          this.guardar();
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
          else if (!this.detalleRegistro.capacidad_stock || this.detalleRegistro.capacidad_stock == 0)
          {
            this.txtCapacidad_stock.nativeElement.focus()
          }
        }, 100);
      }

    }
    else if (this.maestroActual == 0 && this.nivelActual == 1)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1944]
      }
      if (!this.detalleRegistro.capacidad || this.detalleRegistro.capacidad == 0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1955]
      }
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        else
        {
          this.guardar();
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
          else if (!this.detalleRegistro.capacidad || this.detalleRegistro.capacidad == 0)
          {
            this.txtCapacidad_proceso.nativeElement.focus()
          }
        }, 100);
      }

    }

    else if (this.maestroActual == 1 && this.nivelActual == 0)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1946]
      }
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        else
        {
          this.guardar();
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
        }, 100);
      }

    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.proceso)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1951]
      }
      else if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1945]
      }
      if (!this.detalleRegistro.tiempo_stock || this.detalleRegistro.tiempo_stock == 0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1954]
      }
      if (!this.detalleRegistro.tiempo_proceso || this.detalleRegistro.tiempo_proceso == 0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1953]
      }
      
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        
        else
        {
          if (this.detalleRegistro.id != 0 && this.detalleRegistro.secuencia != this.secuenciaActual)
          {
            const respuesta = this.dialogo.open(DialogowipComponent, {
              width: "430px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1965], mensaje: this.servicio.rTraduccion()[2006], alto: "60", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[1967], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "iconshock-materialblack-mail-block" }
            });
            respuesta.afterClosed().subscribe(result => {
              if (result.accion == 1) 
              {
                this.resecuenciar = true;
                this.guardar();
              }
            });
          
            return;
          } 
          else
          {
            this.guardar();
          }
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.proceso)
          {
            this.lstProceso.focus()
          }
          else if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
          else if (!this.detalleRegistro.tiempo_stock || this.detalleRegistro.tiempo_stock == 0)
          {
            this.txtTiempo_stock.nativeElement.focus()
          }
          else if (!this.detalleRegistro.tiempo_proceso || this.detalleRegistro.tiempo_proceso == 0)
          {
            this.txtTiempo_proceso.nativeElement.focus()
          }

        }, 100);
      }

    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1957]
      }
      if (!this.detalleRegistro.ruta)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1959]
      }
      if (!this.detalleRegistro.referencia && this.detalleRegistro.tipo==0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1958]
      }
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        else
        {
          this.guardar();
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
          else if (!this.detalleRegistro.ruta)
          {
            this.lstProceso2.focus()
          }
          
          else if (!this.detalleRegistro.referencia)
          {
            this.txtReferencia.nativeElement.focus()
          }
        }, 100);
      }

    }
    else if (this.maestroActual == 3 && this.nivelActual == 0)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1949]
      }
      if (!this.detalleRegistro.correos && !this.detalleRegistro.telefonos && !this.detalleRegistro.mmcall)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1960]
      }
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        else
        {
          this.guardar();
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
          else if (!this.detalleRegistro.ruta)
          {
            //eemv
            this.lstProceso2.focus()
          }
        }, 100);
      }

    }
    else if (this.maestroActual == 4 && this.nivelActual == 0)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1943]
      }
      if (+this.detalleRegistro.tipo >4 && (!this.detalleRegistro.tiempo0 || this.detalleRegistro.tiempo0 == 0))
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1939]
      }
      if (!this.seleccionAlerta || this.seleccionAlerta.length == 0)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1941]
      }
      if (this.detalleRegistro.acumular =="S" && this.detalleRegistro.acumular_veces == 0 && this.detalleRegistro.acumular_tiempo == 0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1934]
      }
      if (this.detalleRegistro.repetir !="N" && (this.detalleRegistro.repetir_tiempo == 0 || !this.detalleRegistro.repetir_tiempo))
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1938]
      }
      if (this.detalleRegistro.escalar1 !="N" && this.detalleRegistro.tiempo1 == 0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1935]
      }
      if (this.detalleRegistro.escalar1!="S" && this.detalleRegistro.escalar2 !="N" && this.detalleRegistro.tiempo2 == 0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1936]
      }
      if (this.detalleRegistro.escalar1!="S" && this.detalleRegistro.escalar2!="S" && this.detalleRegistro.escalar3 !="N" && this.detalleRegistro.tiempo3 == 0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1937]
      }

      
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        else
        {
          this.guardar();
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
          if (+this.detalleRegistro.tipo >4 && (!this.detalleRegistro.tiempo0 || this.detalleRegistro.tiempo0 == 0))
          {
            this.txtAnticipo.nativeElement.focus()
          }
          else if (this.detalleRegistro.acumular =="S" && this.detalleRegistro.acumular_veces == 0 && this.detalleRegistro.acumular_tiempo == 0)
          {
            this.txtAcumular.nativeElement.focus()
          }
          else if (this.detalleRegistro.repetir !="N" && this.detalleRegistro.repetir_veces == 0)
          {
            this.txtRepetir.nativeElement.focus()
          }
          else if (this.detalleRegistro.escalar1 !="N" && this.detalleRegistro.tiempo1 == 0)
          {
            this.txtRepetir1.nativeElement.focus()
          }
          else if (this.detalleRegistro.escalar2 !="N" && this.detalleRegistro.tiempo2 == 0)
          {
            this.txtRepetir2.nativeElement.focus()
          }
          else if (this.detalleRegistro.escalar3 !="N" && this.detalleRegistro.tiempo3 == 0)
          {
            this.txtRepetir3.nativeElement.focus()
          }
        }, 100);
      }

    }
    else if (this.maestroActual == 5 && this.nivelActual == 0)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1947]
      }
      
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        else
        {
          this.guardar();
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
        }, 100);
      }

    }
    else if (this.maestroActual == 6 && this.nivelActual == 0)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (this.detalleRegistro.desde > this.detalleRegistro.hasta)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1961]
      }
      if (!this.detalleRegistro.fecha && this.detalleRegistro.dia==9)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1940]
      }
      if (errores == 0)
      {
          this.guardar();
      }
      else
      {
        setTimeout(() => {
          if (this.detalleRegistro.desde > this.detalleRegistro.hasta)
          {
            this.txtDesde.nativeElement.focus()
          }
          else 
          {
            this.txtFechaDesde.nativeElement.focus()
          }
        }, 100);
      }


    }
    else if (this.maestroActual == 7 && this.nivelActual == 0)
    {
      let errores = 0;
      this.faltaMensaje = "";
      if (!this.detalleRegistro.nombre)
      {
        errores = errores + 1;
        this.faltaMensaje = this.servicio.rTraduccion()[1793];
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1942]
      }
      if (!this.detalleRegistro.referencia)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1950]
      }
      if (!this.detalleRegistro.rol)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1952]
      }
      if (this.detalleRegistro.rol=="O" && this.seleccionProcesos.length==0)
      {
        errores = errores + 1;
        if (!this.faltaMensaje)
        {
          this.faltaMensaje = this.servicio.rTraduccion()[1793];
        }
        this.faltaMensaje = this.faltaMensaje + "<br>(" + errores + this.servicio.rTraduccion()[1962]
      }
      if (errores == 0)
      {
        if (this.detalleRegistro.id != 0 && this.detalleRegistro.estatus == "I" && this.estatusActual == "A")
        {
          this.validarInactivar(this.detalleRegistro.id, 2);            
        } 
        else
        {
          this.guardar();
        }
      }
      else
      {
        setTimeout(() => {
          if (!this.detalleRegistro.nombre)
          {
            this.txtNombre.nativeElement.focus()
          }
          else if (!this.detalleRegistro.referencia)
          {
            this.txtReferencia.nativeElement.focus()
          }
          else if (this.detalleRegistro.rol=="O" && this.seleccionProcesos.length==0)
          {
            this.lstProcesos.focus()
          }
        }, 100);
      }

    }
    
  }

  guardar()
  {
    this.editando = false;
    this.botonera[1] = true;
    this.botonera[2] = true;
    this.botonera[3] = false;
    this.botonera[4] = this.detalleRegistro.estatus == "I";
    this.botonera[5] = false;
    this.faltaMensaje = "";
    let campos = {};
    let sentencia = "";
    if (this.maestroActual == 0 && this.nivelActual == 0)
    {
      if (!this.detalleRegistro.capacidad_stock)
      {
        this.detalleRegistro.capacidad_stock = 0;
      }
      campos = 
      {
        accion: 1100, 
        id: this.detalleRegistro.id,  
        nombre: this.detalleRegistro.nombre, 
        referencia: (!this.detalleRegistro.referencia ? "" : this.detalleRegistro.referencia), 
        notas: (!this.detalleRegistro.notas ? "" : this.detalleRegistro.notas), 
        capacidad_stock: this.detalleRegistro.capacidad_stock, 
        imagen: (!this.detalleRegistro.imagen ? "" : this.detalleRegistro.imagen), 
        estatus: this.detalleRegistro.estatus,  
        reduccion_setup: this.detalleRegistro.reduccion_setup,  
        usuario: this.servicio.rUsuario().id,
        copiandoDesde: this.copiandoDesde 
      };
    }
    else if (this.maestroActual == 0 && this.nivelActual == 1)
    {
      if (!this.detalleRegistro.ruta || this.detalleRegistro.ruta == 0)
      {
        this.detalleRegistro.ruta = this.idNivel0;
      }
      if (!this.detalleRegistro.capacidad)
      {
        this.detalleRegistro.capacidad = 0;
      }
      campos = 
      {
        accion: 1500, 
        id: this.detalleRegistro.id,  
        proceso: this.detalleRegistro.proceso, 
        nombre: this.detalleRegistro.nombre, 
        referencia: (!this.detalleRegistro.referencia ? "" : this.detalleRegistro.referencia), 
        notas: (!this.detalleRegistro.notas ? "" : this.detalleRegistro.notas), 
        capacidad: this.detalleRegistro.capacidad, 
        estatus: this.detalleRegistro.estatus,  
        programar: this.detalleRegistro.programar,  
        usuario: this.servicio.rUsuario().id
      };
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0)
    {
      campos = 
      {
        accion: 1200, 
        id: this.detalleRegistro.id,  
        nombre: this.detalleRegistro.nombre, 
        referencia: (!this.detalleRegistro.referencia ? "" : this.detalleRegistro.referencia), 
        notas: (!this.detalleRegistro.notas ? "" : this.detalleRegistro.notas), 
        estatus: this.detalleRegistro.estatus,  
        usuario: this.servicio.rUsuario().id,
        copiandoDesde: this.copiandoDesde 
      };
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      if (!this.detalleRegistro.ruta || this.detalleRegistro.ruta == 0)
      {
        this.detalleRegistro.ruta = this.idNivel0;
      }
      if (!this.detalleRegistro.tiempo_proceso)
      {
        this.detalleRegistro.tiempo_proceso = 0;
      }
      if (!this.detalleRegistro.tiempo_stock)
      {
        this.detalleRegistro.tiempo_stock = 0;
      }
      if (!this.detalleRegistro.tiempo_setup)
      {
        this.detalleRegistro.tiempo_setup = 0;
      }
      if (!this.detalleRegistro.tiempo_setup_idem)
      {
        this.detalleRegistro.tiempo_setup_idem = 0;
      }
      if (!this.detalleRegistro.piezas_finalizar_paro)
      {
        this.detalleRegistro.piezas_finalizar_paro = 0;
      }
      ;
      
      campos = 
      {
        accion: 1300, 
        id: this.detalleRegistro.id,  
        ruta: this.detalleRegistro.ruta, 
        tiempo_stock: this.detalleRegistro.tiempo_stock, 
        tiempo_proceso: this.detalleRegistro.tiempo_proceso, 
        tiempo_setup: this.detalleRegistro.tiempo_setup,
        tiempo_setup_idem: this.detalleRegistro.tiempo_setup_idem, 
        piezas_finalizar_paro: this.detalleRegistro.piezas_finalizar_paro,
        nombre: this.detalleRegistro.nombre, 
        referencia: (!this.detalleRegistro.referencia ? "" : this.detalleRegistro.referencia), 
        notas: (!this.detalleRegistro.notas ? "" : this.detalleRegistro.notas), 
        secuencia: this.detalleRegistro.secuencia, 
        proceso: this.detalleRegistro.proceso, 
        estatus: this.detalleRegistro.estatus,  
        usuario: this.servicio.rUsuario().id 
      };
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      campos = 
      {
        accion: 1700, 
        id: this.detalleRegistro.id,  
        nombre: this.detalleRegistro.nombre, 
        tipo: this.detalleRegistro.tipo, 
        maquinas: this.detalleRegistro.maquinas, 
        ruta: this.detalleRegistro.ruta, 
        imagen: this.detalleRegistro.imagen, 
        referencia: this.detalleRegistro.referencia, 
        notas: (!this.detalleRegistro.notas ? "" : this.detalleRegistro.notas), 
        estatus: this.detalleRegistro.estatus,  
        usuario: this.servicio.rUsuario().id
      };
    }
    else if (this.maestroActual == 3 && this.nivelActual == 0)
    {
      campos = 
      {
        accion: 1800, 
        id: this.detalleRegistro.id,  
        nombre: this.detalleRegistro.nombre, 
        correos: (!this.detalleRegistro.correos ? "" : this.detalleRegistro.correos), 
        telefonos: (!this.detalleRegistro.telefonos ? "" : this.detalleRegistro.telefonos), 
        mmcall: (!this.detalleRegistro.mmcall ? "" : this.detalleRegistro.mmcall), 
        estatus: this.detalleRegistro.estatus,  
        usuario: this.servicio.rUsuario().id
      };
    }
    else if (this.maestroActual == 4 && this.nivelActual == 0)
    {
      let sms = -1;
      let llamada = -1;
      let mmcall = -1;
      let correo = -1;
      let sms1 = -1;
      let llamada1 = -1;
      let mmcall1 = -1;
      let correo1 = -1;
      let sms2 = -1;
      let llamada2 = -1;
      let mmcall2 = -1;
      let correo2 = -1;
      let sms3 = -1;
      let llamada3 = -1;
      let mmcall3 = -1;
      let correo3 = -1;

      
      if (this.seleccionAlerta)
      {
        sms = this.seleccionAlerta.findIndex(c => c=="S");
        mmcall = this.seleccionAlerta.findIndex(c => c=="M");
        llamada = this.seleccionAlerta.findIndex(c => c=="L");
        correo = this.seleccionAlerta.findIndex(c => c=="C");
      }
      if (this.seleccionescalar1)
      {
        sms1 = this.seleccionescalar1.findIndex(c => c=="S");
        mmcall1 = this.seleccionescalar1.findIndex(c => c=="M");
        llamada1 = this.seleccionescalar1.findIndex(c => c=="L");
        correo1 = this.seleccionescalar1.findIndex(c => c=="C");
      }
      if (this.seleccionescalar2)
      {
        sms2 = this.seleccionescalar2.findIndex(c => c=="S");
        mmcall2 = this.seleccionescalar2.findIndex(c => c=="M");
        llamada2 = this.seleccionescalar2.findIndex(c => c=="L");
        correo2 = this.seleccionescalar2.findIndex(c => c=="C");
      }
      if (this.seleccionescalar3)
      {
        sms3 = this.seleccionescalar3.findIndex(c => c=="S");
        mmcall3 = this.seleccionescalar3.findIndex(c => c=="M");
        llamada3 = this.seleccionescalar3.findIndex(c => c=="L");
        correo3 = this.seleccionescalar3.findIndex(c => c=="C");
      }
      if (!this.detalleRegistro.proceso || this.detalleRegistro.proceso == 0)
      {
        sms3 = this.seleccionescalar3.findIndex(c => c=="S");
        mmcall3 = this.seleccionescalar3.findIndex(c => c=="M");
        llamada3 = this.seleccionescalar3.findIndex(c => c=="L");
        correo3 = this.seleccionescalar3.findIndex(c => c=="C");
      }

      campos = 
      {
        accion: 1900, 
        id: this.detalleRegistro.id,  
        nombre: this.detalleRegistro.nombre, 
        tipo: this.detalleRegistro.tipo, 
        proceso: this.detalleRegistro.proceso, 
        escalar1: this.detalleRegistro.escalar1, 
        escalar2: this.detalleRegistro.escalar2, 
        escalar3: this.detalleRegistro.escalar3, 
        referencia: (!this.detalleRegistro.referencia ? "" : this.detalleRegistro.referencia), 
        notas: (!this.detalleRegistro.notas ? "" : this.detalleRegistro.notas), 
        acumular: this.detalleRegistro.acumular,
        acumular_veces: (!this.detalleRegistro.acumular_veces ? 0 : this.detalleRegistro.acumular_veces), 
        acumular_tiempo: (!this.detalleRegistro.acumular_tiempo ? 0 : this.detalleRegistro.acumular_tiempo), 
        acumular_inicializar: this.detalleRegistro.acumular_inicializar, 
        acumular_tipo_mensaje: (!this.detalleRegistro.acumular_tipo_mensaje ? "" : this.detalleRegistro.acumular_tipo_mensaje), 
        tiempo1: (!this.detalleRegistro.tiempo1 ? 0 : this.detalleRegistro.tiempo1), 
        tiempo2: (!this.detalleRegistro.tiempo2 ? 0 : this.detalleRegistro.tiempo2), 
        tiempo3: (!this.detalleRegistro.tiempo3 ? 0 : this.detalleRegistro.tiempo3), 
        tiempo0: (!this.detalleRegistro.tiempo0 ? 0 : this.detalleRegistro.tiempo0), 
        sms: (sms > -1 ? "S" : "N"), 
        llamada: (llamada > -1 ? "S" : "N"),
        mmcall: (mmcall > -1 ? "S" : "N"),
        correo: (correo > -1 ? "S" : "N"),

        sms1: (sms1 > -1 ? "S" : "N"), 
        llamada1: (llamada1 > -1 ? "S" : "N"),
        mmcall1: (mmcall1 > -1 ? "S" : "N"),
        correo1: (correo1 > -1 ? "S" : "N"),
        sms2: (sms2 > -1 ? "S" : "N"), 
        llamada2: (llamada2 > -1 ? "S" : "N"),
        mmcall2: (mmcall2 > -1 ? "S" : "N"),
        correo2: (correo2 > -1 ? "S" : "N"),
        sms3: (sms3 > -1 ? "S" : "N"), 
        llamada3: (llamada3 > -1 ? "S" : "N"),
        mmcall3: (mmcall3 > -1 ? "S" : "N"),
        correo3: (correo3 > -1 ? "S" : "N"),
        lista: (!this.detalleRegistro.lista ? "0" : this.detalleRegistro.lista),
        lista1: (!this.detalleRegistro.lista1 ? "0" : this.detalleRegistro.lista1),
        lista2: (!this.detalleRegistro.lista2 ? "0" : this.detalleRegistro.lista2),
        lista3: (!this.detalleRegistro.lista3 ? "0" : this.detalleRegistro.lista3),
        lista0: (!this.detalleRegistro.lista0 ? "0" : this.detalleRegistro.lista0),
        acumular_mensaje: (!this.detalleRegistro.acumular_mensaje ? "" : this.detalleRegistro.acumular_mensaje),
        repetir1: this.detalleRegistro.repetir1,
        repetir2: this.detalleRegistro.repetir2,
        repetir3: this.detalleRegistro.repetir3,
        informar_resolucion: this.detalleRegistro.informar_resolucion,
        repetir: this.detalleRegistro.repetir,
        repetir_tiempo: (!this.detalleRegistro.repetir_tiempo ? "0" : this.detalleRegistro.repetir_tiempo),
        estatus: this.detalleRegistro.estatus,  
        usuario: this.servicio.rUsuario().id
      };
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0)
    {
      campos = 
      {
        accion: 2000, 
        id: this.detalleRegistro.id,  
        nombre: this.detalleRegistro.nombre, 
        tipo: this.detalleRegistro.tipo, 
        referencia: this.detalleRegistro.referencia, 
        estatus: this.detalleRegistro.estatus,  
        usuario: this.servicio.rUsuario().id
      };
    }
    else if (this.maestroActual == 6 && this.nivelActual == 0)
    {
      if (!this.detalleRegistro.desde)
      {
        this.detalleRegistro.desde ="00:00:00";
      }
      if (!this.detalleRegistro.hasta)
      {
        this.detalleRegistro.hasta ="23:59:59";
      }
      campos = 
      {
        accion: 2100, 
        id: this.detalleRegistro.id,  
        dia: this.detalleRegistro.dia, 
        proceso: this.detalleRegistro.proceso, 
        tipo: this.detalleRegistro.tipo, 
        desde: this.detalleRegistro.desde, 
        hasta: this.detalleRegistro.hasta, 
        fecha: this.servicio.fecha(2, this.detalleRegistro.fecha, "yyyy/MM/dd"),
      };
    }

    else if (this.maestroActual == 7 && this.nivelActual == 0)
    {
      if (!this.detalleRegistro.rol)
      {
        this.detalleRegistro.rol = "O";
      }
      campos = 
      {
        accion: 2200, 
        id: this.detalleRegistro.id,  
        nombre: this.detalleRegistro.nombre, 
        notas: this.detalleRegistro.notas, 
        rol: this.detalleRegistro.rol, 
        programacion: this.detalleRegistro.programacion, 
        inventario: this.detalleRegistro.inventario, 
        reversos: this.detalleRegistro.reversos, 
        referencia: this.detalleRegistro.referencia, 
        calidad: this.detalleRegistro.calidad, 
        operacion: this.detalleRegistro.operacion, 
        estatus: this.detalleRegistro.estatus,  
        usuario: this.servicio.rUsuario().id
      };
    }
    this.servicio.consultasBD(campos).subscribe((datos: string) =>{
    if (datos)
    {
      sentencia = "";
      if (datos.substring(0, 1) == "A")
      {
        this.listarSecuencias();
        this.detalleRegistro.id = +datos.substring(1, 10);
        if (this.detalleRegistro.secuencia == -1)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = secuencia + 1 WHERE ruta = " + this.idNivel0 + ";UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = 1 WHERE id = " + this.detalleRegistro.id +";";
        }
        else if (this.detalleRegistro.secuencia == 0)
        {
          sentencia = "SET @nuevaSecuencia:= (SELECT COUNT(*) FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + ");UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = @nuevaSecuencia WHERE id = " + this.detalleRegistro.id +";";
        }
        else if (this.maestroActual == 1 && this.nivelActual == 1)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = secuencia + 1 WHERE ruta = " + this.idNivel0 + " AND secuencia >= " + this.detalleRegistro.secuencia + ";UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = " + this.detalleRegistro.secuencia + " WHERE id = " + this.detalleRegistro.id +";";
        }
      }
      else
      {
        if (this.detalleRegistro.secuencia == -1)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = secuencia + 1 WHERE ruta = " + this.idNivel0 + " AND secuencia < " + this.secuenciaActual + ";UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = 1 WHERE id = " + this.detalleRegistro.id +";";
        }
        else if (this.detalleRegistro.secuencia == 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = secuencia - 1 WHERE ruta = " + this.idNivel0 + " AND secuencia > " + this.secuenciaActual + ";UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = (SELECT COUNT(*) FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.idNivel0 + ") WHERE id = " + this.detalleRegistro.id +";";
        }
        else if (this.detalleRegistro.secuencia > this.secuenciaActual)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = secuencia - 1 WHERE ruta = " + this.idNivel0 + " AND secuencia > " + this.secuenciaActual + " AND secuencia <= " + this.detalleRegistro.secuencia +";UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = " + this.detalleRegistro.secuencia + " WHERE id = " + this.detalleRegistro.id +";";
        }
        else if (this.detalleRegistro.secuencia < this.secuenciaActual)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = secuencia + 1 WHERE ruta = " + this.idNivel0 + " AND secuencia >= " + this.detalleRegistro.secuencia + " AND secuencia < " + this.secuenciaActual +";UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = " + this.detalleRegistro.secuencia + " WHERE id = " + this.detalleRegistro.id +";";
        }
        
      }
      if (sentencia)
      {
        
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          sentencia = "SELECT secuencia FROM " + this.servicio.rBD() + ".det_rutas WHERE id = " + this.detalleRegistro.id +";";
          campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            this.detalleRegistro.secuencia = resp[0].secuencia + '';
            this.secuenciaActual = this.detalleRegistro.secuencia;
          });

        })  
      }
      this.resecuenciar = false;
      
      if (datos.substring(0, 1) == "A")
      {
        this.detalleRegistro.id = +datos.substring(1, 10);
        this.registroActual = this.detalleRegistro.id
        this.detalleRegistro.ucreacion = (this.servicio.rUsuario().nombre ? this.servicio.rUsuario().nombre : this.servicio.rTraduccion()[8]);
        this.detalleRegistro.fcreacion = new Date(); 
        this.llenarListas();
      }
      this.estatusActual = this.detalleRegistro.estatus;
      this.detalleRegistro.fcambio = new Date();
      this.detalleRegistro.ucambio = (this.servicio.rUsuario().nombre ? this.servicio.rUsuario().nombre : this.servicio.rTraduccion()[8]);
      this.botonera[4] = this.detalleRegistro.estatus == "I";
      this.cancelarEdicion = false;
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[2005];
      mensajeCompleto.tiempo = 2500;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET procesos = 'S'";
      if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET cat_maquinas = 'S'"
      }
      else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET rutas = 'S'"
      }
      else if (this.maestroActual == 1 && this.nivelActual == 1) //Rutas de producción
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET det_rutas = 'S'"
      }
      else if (this.maestroActual == 2 && this.nivelActual == 0) //Rutas de producción
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET partes = 'S'"
      }
      else if (this.maestroActual == 3 && this.nivelActual == 0) //Rutas de producción
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET recipientes = 'S'"
      }
      else if (this.maestroActual == 4 && this.nivelActual == 0) //Rutas de producción
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = 'S'"
      }
      else if (this.maestroActual == 5 && this.nivelActual == 0) //Rutas de producción
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET situaciones = 'S'"
      }
      else if (this.maestroActual == 7 && this.nivelActual == 0) //Rutas de producción
      {
        sentencia = "DELETE FROM " + this.servicio.rBD() + ".relacion_usuarios_operaciones WHERE usuario = " + this.detalleRegistro.id + " AND tipo = 0"
      }
      let campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        setTimeout(() => {
          this.revisar()  
        }, +this.tiempoRevision);
        if (this.maestroActual == 1 && this.nivelActual == 1)
        {
          let campos = {accion: 1400, id: this.detalleRegistro.ruta};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
          });
        }
        else if (this.maestroActual == 7 && this.seleccionProcesos.length>0)
        {
          let cadAgregar = "INSERT INTO relacion_usuarios_operaciones (usuario, proceso) VALUES"
          for (var i = 0; i < this.seleccionProcesos.length; i++ )
          {
            cadAgregar = cadAgregar + "(" + this.detalleRegistro.id + ", " + this.seleccionProcesos[i] + "),";  
          }
          cadAgregar = cadAgregar.substr(0, cadAgregar.length - 1) + ";";
          let campos = {accion: 200, sentencia: cadAgregar};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
          });
        }
        else if (this.maestroActual == 2 && this.lista2)
        {
          let seleccionados1 = this.lista2.selectedOptions.selected
          if (seleccionados1.length > 0)
          {
            let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".relacion_partes_maquinas WHERE parte = " + +this.detalleRegistro.id + ";INSERT INTO " + this.servicio.rBD() + ".relacion_partes_maquinas (parte, maquina) VALUES";
            for (var i = 0; i < seleccionados1.length; i++) 
            {
              cadTablas = cadTablas +  "(" + this.detalleRegistro.id + ", " + seleccionados1[i].value + "),";
            }
            cadTablas = cadTablas.substr(0, cadTablas.length - 1);
            let campos = {accion: 200, sentencia: cadTablas};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
            });
          }
        }
      })
    }})
  }
  
  llenarListas()
  {
    let sentencia = "SELECT c.id, c.referencia, c.nombre, c.estatus FROM " + this.servicio.rBD() + ".det_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_partes c ON a.ruta = c.ruta WHERE a.proceso = " + this.registroActual + " GROUP BY c.id, c.referencia, c.nombre, c.estatus ORDER BY c.nombre"
    if (this.maestroActual == 1 && this.nivelActual == 0) 
    {
      sentencia = "SELECT id, referencia, nombre, estatus FROM " + this.servicio.rBD() + ".cat_partes WHERE ruta = " + this.registroActual + " ORDER BY nombre"
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1) 
    {
      sentencia = "SELECT id, referencia, nombre, estatus FROM " + this.servicio.rBD() + ".cat_partes WHERE ruta = " + this.idNivel0 + " ORDER BY nombre"
    }
    this.arreHover2 = [];
    this.partes = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.partes = resp;          
      this.arreHover2.length = resp.length;
      setTimeout(() => {
        if (this.maestroActual == 1 && this.nivelActual == 1)
        {
          if (this.lstProceso)
          {
            this.lstProceso.focus();  
          }
        }
        else
        {
          this.txtNombre.nativeElement.focus();
        }
      }, 300);
    });
    if (this.maestroActual == 0 && this.nivelActual == 0) 
    {
      sentencia = "SELECT a.id, a.nombre, a.estatus FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".det_rutas b ON a.id = b.ruta WHERE b.proceso = " + this.registroActual + " GROUP BY a.id, a.nombre, a.estatus ORDER BY a.id;"
    }
    else if (this.maestroActual == 0 && this.nivelActual == 1) 
    {
      sentencia = "SELECT a.id, a.nombre, a.estatus FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas b ON a.id = b.proceso WHERE b.proceso = " + this.registroActual + " GROUP BY a.id, a.nombre, a.estatus ORDER BY a.id;"
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) 
    {
      sentencia = "SELECT id, secuencia, nombre, estatus FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + this.registroActual + " ORDER BY secuencia;"
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1) 
    {
      sentencia = "SELECT a.id, a.nombre, a.estatus FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".det_rutas b ON a.id = b.ruta WHERE b.id = " + this.registroActual + " GROUP BY a.id, a.nombre, a.estatus ORDER BY a.id;"
    }
    this.operaciones = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.operaciones = resp;                     
      this.arreHover5.length = resp.length;
      this.arreHover6.length = resp.length;
      this.arreHover7.length = resp.length;
      this.arreHover8.length = resp.length;
    
    });
    sentencia = "SELECT id, nombre, capacidad, estatus FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = " + this.registroActual + " ORDER BY nombre;"
    this.equipos = [];
    this.arreHover3 = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.equipos = resp;          
      this.arreHover3.length = resp.length;
    });
  }

  edicionCancelada()
  {
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = this.servicio.rTraduccion()[1388];
    mensajeCompleto.tiempo = 3000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
  }

  inicializarPantalla()
  {
    this.detalleRegistro = [];
    this.detalleRegistro.fecha = new Date();
    this.detalleRegistro.desde= "00:00:00"
    this.detalleRegistro.hasta= "23:59:59"
    this.detalleRegistro.tipo = (this.maestroActual==6 ? "S" : "0");
    this.registroActual = 0;
    this.cancelarEdicion = false;
    this.mostrarImagenRegistro = "S";
    this.editando = false;
    this.detalleRegistro.estatus = "A"
    this.botonera[1] = true;
    this.botonera[2] = true;
    this.botonera[3] = true;
    this.botonera[4] = true;
    this.botonera[5] = true;
    setTimeout(() => {
      if (this.maestroActual == 1 && this.nivelActual == 1)
      {
        this.lstProceso.focus();
      }
      else
      {
        this.txtNombre.nativeElement.focus();
      }
    }, 300);
    
  }

  validarInactivar(id: number, accion: number)
  {
    if (this.detalleRegistro.admin=="S")
    {
      const respuesta = this.dialogo.open(DialogowipComponent, {
        width: "400px", height: "210px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1930], mensaje: this.servicio.rTraduccion()[2004], alto: "40", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", icono0: "iconshock-materialblack-mail-block" }
      });
      return;
    }
    let idBuscar = (id == 0 ? this.registroActual : id);
    let sentencia = "";
    if (this.maestroActual == 0 && this.nivelActual == 0) //Rutas de producción
    {
      sentencia = "SELECT COUNT(*) AS totalr FROM " + this.servicio.rBD() + ".det_rutas WHERE estatus = 'A' AND proceso = " + idBuscar; 
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
    {
      sentencia = "SELECT COUNT(*) AS totalr FROM " + this.servicio.rBD() + ".cat_partes WHERE estatus = 'A' AND ruta = " + idBuscar; 
    }
    if (sentencia)
    {
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp && resp[0].totalr > 0)
        {
          if (accion == 2)
          {
            this.faltaMensaje = this.servicio.rTraduccion()[134]
          }
          let mensaje = this.servicio.rTraduccion()[1983].replace("campo_0", resp[0].totalr)
          if (this.maestroActual == 1 && this.nivelActual == 0)
          {
            mensaje = this.servicio.rTraduccion()[2003].replace("campo_0", resp[0].totalr)
          }
          const respuesta = this.dialogo.open(DialogowipComponent, {
            width: "400px", panelClass: 'dialogo_atencion', data: { titulo: "Inactivar " + this.literalSingular, mensaje: mensaje, alto: "80", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", icono0: "iconshock-materialblack-mail-block" }
          });
        }
        else if (accion == 1)
        {
          this.Inactivar(idBuscar);
        }
        else if (accion == 2)
        {
          this.guardar();
        }
      })
    }
    else
    {
      this.Inactivar(idBuscar);
    }
  }

  Inactivar(idBuscar: number)
  {
    let mensaje = this.servicio.rTraduccion()[1995]
    if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
    {
      mensaje = this.servicio.rTraduccion()[1993]
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
    {
      mensaje = this.servicio.rTraduccion()[2000]
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      mensaje = this.servicio.rTraduccion()[1999]
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1994]
    }
    else if (this.maestroActual == 3 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1996]
    }
    else if (this.maestroActual == 4 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1998]
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[2001]
    }
    else if (this.maestroActual == 7 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1997]
    }
    const respuesta = this.dialogo.open(DialogowipComponent, {
      width: "430px", panelClass: 'dialogo_atencion', data: { titulo: "Inactivar " + this.literalSingular, mensaje: mensaje, alto: "60", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[2626], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "iconshock-materialblack-mail-block" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_procesos SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_maquinas SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_rutas SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 1 && this.nivelActual == 1)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 2 && this.nivelActual == 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_partes SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 3 && this.nivelActual == 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_distribucion SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 4 && this.nivelActual == 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_alertas SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 5 && this.nivelActual == 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_situaciones SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 7 && this.nivelActual == 0)
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET estatus = 'I', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + idBuscar + ";"
        }
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = this.literalSingularArticulo + this.servicio.rTraduccion()[2627];
          this.detalleRegistro.estatus = "I"
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET procesos = 'S'";
          if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET cat_maquinas = 'S'"
          }
          else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET rutas = 'S'"
          }
          else if (this.maestroActual == 1 && this.nivelActual == 1) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET det_rutas = 'S'"
          }
          else if (this.maestroActual == 2 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET partes = 'S'"
          }
          else if (this.maestroActual == 3 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET recipientes = 'S'"
          }
          else if (this.maestroActual == 4 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = 'S'"
          }
          else if (this.maestroActual == 5 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET situaciones = 'S'"
          }
          let campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
            {
              setTimeout(() => {
                this.revisar()  
              }, +this.tiempoRevision);
            })
          if (this.verRegistro == 1)
          {
            let indice = this.registros.findIndex(c => c.id == idBuscar)
            {
              let sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
              {
                sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              }
              else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
              {
                sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              }
              else if (this.maestroActual == 1 && this.nivelActual == 1)
              {
                sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".det_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              }
              else if (this.maestroActual == 2 && this.nivelActual == 0)
              {
                sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              }
              else if (this.maestroActual == 3 && this.nivelActual == 0)
              {
                sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              }
              else if (this.maestroActual == 4 && this.nivelActual == 0)
              {
                sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_alertas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              }
              else if (this.maestroActual == 5 && this.nivelActual == 0)
              {
                sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_situaciones a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              }
              else if (this.maestroActual == 7 && this.nivelActual == 0)
              {
                sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
              }
              let campos = {accion: 100, sentencia: sentencia};  
              this.servicio.consultasBD(campos).subscribe( resp =>
              {
                this.registros[indice].estatus = this.servicio.rTraduccion()[1155];
                this.registros[indice].fcambio = resp[0].fcambio;
                this.registros[indice].ucambio = resp[0].ucambio;
                indice = this.arrFiltrado.findIndex(c => c.id == idBuscar)
                this.arrFiltrado[indice].estatus = this.servicio.rTraduccion()[1155];
                this.arrFiltrado[indice].fcambio = resp[0].fcambio;
                this.arrFiltrado[indice].ucambio = resp[0].ucambio;
              })
            } 
          }
        })
      }
    });
  }

  eliminar(idBuscar: number)
  {
    let mensaje = this.servicio.rTraduccion()[1986]
    if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
    {
      mensaje = this.servicio.rTraduccion()[1984]
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
    {
      mensaje = this.servicio.rTraduccion()[1991]
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      mensaje = this.servicio.rTraduccion()[1990]
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1985]
    }
    else if (this.maestroActual == 3 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1987]
    }
    else if (this.maestroActual == 4 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1989]
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1992]
    }
    else if (this.maestroActual == 7 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1988]
    }
    const respuesta = this.dialogo.open(DialogowipComponent, {
      width: "430px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[388] + " " +this.literalSingular, mensaje: mensaje, alto: "60", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[1981], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "iconshock-materialblack-general-trash-can" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_procesos WHERE id = " + idBuscar + ";;DELETE FROM " + this.servicio.rBD() + ".cat_maquinas WHERE proceso = " + idBuscar + ";";
        if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_maquinas WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_rutas WHERE id = " + idBuscar + ";DELETE FROM " + this.servicio.rBD() + ".det_rutas WHERE ruta = " + idBuscar + ";"
        }
        else if (this.maestroActual == 1 && this.nivelActual == 1) 
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".det_rutas WHERE id = " + idBuscar + ";";
        }
        else if (this.maestroActual == 2 && this.nivelActual == 0) 
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_partes WHERE id = " + idBuscar + ";";
        }
        else if (this.maestroActual == 3 && this.nivelActual == 0) 
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_distribucion WHERE id = " + idBuscar + ";";
        }
        else if (this.maestroActual == 4 && this.nivelActual == 0) 
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_alertas WHERE id = " + idBuscar + ";";
        }
        else if (this.maestroActual == 5 && this.nivelActual == 0) 
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_situaciones WHERE id = " + idBuscar + ";";
        }
        else if (this.maestroActual == 6 && this.nivelActual == 0) 
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".horarios WHERE id = " + idBuscar + ";";
        }
        else if (this.maestroActual == 7 && this.nivelActual == 0) 
        {
          sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id = " + idBuscar + ";";
        }
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          this.buscarRegistro(3)
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.literalSingularArticulo + this.servicio.rTraduccion()[2631];
          this.detalleRegistro.estatus = "I"
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET procesos = 'S';";
          if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET cat_maquinas = 'S';"
          }
          else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET rutas = 'S';"
          }
          else if (this.maestroActual == 1 && this.nivelActual == 1) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET det_rutas = 'S';"
          }
          else if (this.maestroActual == 2 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET partes = 'S';"
          }
          else if (this.maestroActual == 3 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET recipientes = 'S';"
          }
          else if (this.maestroActual == 4 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = 'S';"
          }
          else if (this.maestroActual == 5 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET situaciones = 'S';"
          }
          campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
            {
              setTimeout(() => {
                this.revisar()  
              }, +this.tiempoRevision);
              if (this.maestroActual == 1 && this.nivelActual == 1)
              {
                let campos = {accion: 1600, id: this.detalleRegistro.ruta};  
                this.servicio.consultasBD(campos).subscribe( resp =>
                {
                });
              }
            })
        })
      }
    });
  }

  reactivar(idBuscar: number)
  {
    let mensaje = this.servicio.rTraduccion()[1980]
    if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
    {
      mensaje = this.servicio.rTraduccion()[1979]
    }
    else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
    {
      mensaje = this.servicio.rTraduccion()[1978]
    }
    else if (this.maestroActual == 1 && this.nivelActual == 1)
    {
      mensaje = this.servicio.rTraduccion()[1977]
    }
    else if (this.maestroActual == 2 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1976]
    }
    else if (this.maestroActual == 3 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1975]
    }
    else if (this.maestroActual == 4 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1974]
    }
    else if (this.maestroActual == 5 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1973]
    }
    else if (this.maestroActual == 7 && this.nivelActual == 0)
    {
      mensaje = this.servicio.rTraduccion()[1972]
    }
    const respuesta = this.dialogo.open(DialogowipComponent, {
      width: "430px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1971] + this.literalSingular, mensaje: mensaje, alto: "60", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[1971], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "iconshock-materialblack-mail-block" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_procesos SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_maquinas SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_rutas SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 1 && this.nivelActual == 1) 
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 2 && this.nivelActual == 0) 
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_partes SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 3 && this.nivelActual == 0) 
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_distribucion SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 4 && this.nivelActual == 0) 
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_alertas SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 5 && this.nivelActual == 0) 
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_situaciones SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        }
        else if (this.maestroActual == 7 && this.nivelActual == 0) 
        {
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET estatus = 'A', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + "  WHERE id = " + idBuscar + ";"
        }
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          let indice = this.registros.findIndex(c => c.id == idBuscar);
          {
            let sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
            {
              sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            }
            else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
            {
              sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            }
            else if (this.maestroActual == 1 && this.nivelActual == 1)
            {
              sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".det_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            }
            else if (this.maestroActual == 2 && this.nivelActual == 0)
            {
              sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_partes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            }
            else if (this.maestroActual == 3 && this.nivelActual == 0)
            {
              sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            }
            else if (this.maestroActual == 4 && this.nivelActual == 0)
            {
              sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_alertas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            }
            else if (this.maestroActual == 5 && this.nivelActual == 0)
            {
              sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_situaciones a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            }
            else if (this.maestroActual == 7 && this.nivelActual == 0)
            {
              sentencia = "SELECT IFNULL(a.modificacion, '" + this.servicio.rTraduccion()[8] + "') AS fcambio, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "') AS ucambio FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.modificado = b.id WHERE a.id = " + idBuscar; 
            }
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              this.registros[indice].estatus = this.servicio.rTraduccion()[1154];
              this.registros[indice].fcambio = resp[0].fcambio;
              this.registros[indice].ucambio = resp[0].ucambio;
              indice = this.arrFiltrado.findIndex(c => c.id == idBuscar)
              this.arrFiltrado[indice].estatus = this.servicio.rTraduccion()[1154];
              this.arrFiltrado[indice].fcambio = resp[0].fcambio;
              this.arrFiltrado[indice].ucambio = resp[0].ucambio;
            })
          }
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = this.literalSingularArticulo + this.servicio.rTraduccion()[1970];
          this.detalleRegistro.estatus = "I"
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET procesos = 'S'";
          if (this.maestroActual == 0 && this.nivelActual == 1) //Rutas de producción
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET cat_maquinas = 'S'"
          }
          else if (this.maestroActual == 1 && this.nivelActual == 0) //Rutas de producción
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET rutas = 'S'"
          }
          else if (this.maestroActual == 1 && this.nivelActual == 1) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET det_rutas = 'S'"
          }
          else if (this.maestroActual == 2 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET partes = 'S'"
          }
          else if (this.maestroActual == 3 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET recipientes = 'S'"
          }
          else if (this.maestroActual == 4 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = 'S'"
          }
          else if (this.maestroActual == 5 && this.nivelActual == 0) 
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".actualizaciones SET situaciones = 'S'"
          }
          campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
            {
              setTimeout(() => {
                this.revisar()  
              }, +this.tiempoRevision);
            })
        })
      }
    });
  }

  calculoSeg(id: number)
  {
    if (id == 1)
    {
      if (Math.floor(this.detalleRegistro.tiempo_stock / 60) < 60)
      {
        this.segStock = (this.detalleRegistro.tiempo_stock / 60).toFixed(1) + this.servicio.rTraduccion()[373]
        if (this.detalleRegistro.tiempo_stock > 0 && this.segStock == this.servicio.rTraduccion()[1968])
        {
          this.segStock = this.servicio.rTraduccion()[1969];
        }
      }
      else
      {
        this.segStock = (this.detalleRegistro.tiempo_stock / 3600).toFixed(2) + this.servicio.rTraduccion()[374]
      }
    }
    else if (id == 2)
    {
      if (Math.floor(this.detalleRegistro.tiempo_proceso / 60) < 60)
      {
        this.segProceso = (this.detalleRegistro.tiempo_proceso / 60).toFixed(1) + this.servicio.rTraduccion()[373]
        if (this.detalleRegistro.tiempo_proceso > 0 && this.segProceso == this.servicio.rTraduccion()[1968])
        {
          this.segProceso = this.servicio.rTraduccion()[1969];
        }
      }
      else
      {
        this.segProceso = (this.detalleRegistro.tiempo_proceso / 3600).toFixed(2) + this.servicio.rTraduccion()[374]
      }
    }
    else if (id == 3)
    {
      if (Math.floor(this.detalleRegistro.tiempo_setup / 60) < 60)
      {
        this.segSetup = (this.detalleRegistro.tiempo_setup / 60).toFixed(1) + this.servicio.rTraduccion()[373]
        if (this.detalleRegistro.tiempo_setup > 0 && this.segSetup == this.servicio.rTraduccion()[1968])
        {
          this.segSetup = this.servicio.rTraduccion()[1969];
        }
      }
      else
      {
        this.segSetup = (this.detalleRegistro.tiempo_setup / 3600).toFixed(2) + this.servicio.rTraduccion()[374]
      }
    }
    else if (id == 4)
    {
      if (Math.floor(this.detalleRegistro.tiempo_setup_idem / 60) < 60)
      {
        this.segSetupI = (this.detalleRegistro.tiempo_setup_idem / 60).toFixed(1) + this.servicio.rTraduccion()[373]
        if (this.detalleRegistro.tiempo_setup_idem > 0 && this.segSetupI == this.servicio.rTraduccion()[1968])
        {
          this.segSetupI = this.servicio.rTraduccion()[1969];
        }
      }
      else
      {
        this.segSetupI = (this.detalleRegistro.tiempo_setup_idem / 3600).toFixed(2) + this.servicio.rTraduccion()[374]
      }
    }
  }

  explorar(id: number, nombre: string)
  {    
    this.idNivel0 = id;
    this.nivelActual = 1;
    this.nombreRuta = nombre;
    this.procesarPantalla(2);
  }

  dragMoved(e: CdkDragMove) {
    let point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  dropListDropped() 
  {
    if (!this.target)
      return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex)
    {
        moveItemInArray(this.registros, this.sourceIndex, this.targetIndex);
        const respuesta = this.dialogo.open(DialogowipComponent, {
          width: "430px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1965], mensaje: this.servicio.rTraduccion()[1966], alto: "60", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[1967], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "iconshock-materialblack-mail-block" }
        });
        respuesta.afterClosed().subscribe(result => {
        if (result.accion == 1) 
        {
          //Se reenumera el arreglo
          let sentencia = "";
          if (this.sourceIndex > this.targetIndex)
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = " + (+this.targetIndex + 1) + " WHERE id = " + this.registros[this.targetIndex].id + ";UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = secuencia + 1 WHERE ruta = " + this.idNivel0 + " AND secuencia >= " + (this.targetIndex + 1) + " AND secuencia < " + (this.sourceIndex + 1) + " AND id <> " + this.registros[this.targetIndex].id + ";";
          }
          else
          {
            sentencia = "UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = " + (+this.targetIndex + 1) + " WHERE id = " + this.registros[this.targetIndex].id + ";UPDATE " + this.servicio.rBD() + ".det_rutas SET secuencia = secuencia - 1 WHERE ruta = " + this.idNivel0 + " AND secuencia <= " + (this.targetIndex + 1) + " AND secuencia >= " + (this.sourceIndex + 1) + " AND id <> " + this.registros[this.targetIndex].id + ";";
          }
          if (sentencia)
          {
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              if (this.sourceIndex > this.targetIndex)
              {
                for (var i = this.targetIndex; i <= this.sourceIndex; i++)
                {
                  this.registros[i].secuencia = i + 1;
                }
              }
              else
              {
                for (var i = this.sourceIndex; i <= this.targetIndex; i++)
                {
                  this.registros[i].secuencia = i + 1;
                }
              }
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[1964];
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            });
          }
          
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[1963];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          moveItemInArray(this.registros, this.targetIndex, this.sourceIndex);
        }
      });
    }
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder)
      return true;

    if (drop != this.activeContainer)
      return false;

    let phElement = this.placeholder.element.nativeElement;
    let sourceElement = drag.dropContainer.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
    let dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';
      
      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex 
      ? dropElement.nextSibling : dropElement));

    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }

  recuperarProceso(evento: any)
  {
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_procesos WHERE id = " + this.detalleRegistro.proceso;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.detalleRegistro.nombre = this.detalleRegistro.nombre ? this.detalleRegistro.nombre : resp[0].nombre;
      if (!this.detalleRegistro.notas)
      {
        this.detalleRegistro.notas = resp[0].notas;
      }
      if (!this.detalleRegistro.referencia)
      {
        this.detalleRegistro.referencia = resp[0].referencia;
      }
    })
  }

  selectAll() {
    this.botonera[1] = false;
    this.botonera[2] = false;
    this.botonera[3] = true;
    this.botonera[4] = true;
    this.botonera[5] = true;
    this.editando = true;
    this.faltaMensaje = this.servicio.rTraduccion()[134]
    this.detalleRegistro.fcambio = "";
    this.detalleRegistro.ucambio = "";
    this.cancelarEdicion = false;
    var i;
    this.seleccionProcesos = [];
    for (i = 0; i < this.procesos.length; i++ )
    {
      this.seleccionProcesos.push(this.procesos[i].id);  
    } 
  }

  deselectAll() {
    this.seleccionProcesos = [];
    this.botonera[1] = false;
    this.botonera[2] = false;
    this.botonera[3] = true;
    this.botonera[4] = true;
    this.botonera[5] = true;
    this.editando = true;
    this.faltaMensaje = this.servicio.rTraduccion()[134]
    this.detalleRegistro.fcambio = "";
    this.detalleRegistro.ucambio = "";
    this.cancelarEdicion = false;
  }

  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
        const scrollPosition = this.viewportRuler.getViewportScrollPosition();

        return {
            x: point.pageX - scrollPosition.left,
            y: point.pageY - scrollPosition.top
        };
    }

    refrescar()
    {
      this.verRegistro = 21;
      this.llenarRegistros();
    }

    editarEquipo(id: number)
    {
      this.registroActual = id;    
      this.maestroActual = 0; 
      this.nivelActual = 1;
      this.despuesBusqueda = 0;
      this.buscarRegistro(1);    
      this.verRegistro = 22;
      this.iconoGeneral = "i_maquina"
    }

    editarItem(id: number)
    {
      this.registroActual = id;    
      this.maestroActual = 2; 
      this.nivelActual = 0;
      this.despuesBusqueda = 0;
      this.buscarRegistro(1);    
      this.verRegistro = 22;
      this.iconoGeneral = "i_partes"
    }

    editarDetalleRuta(id: number)
    {
      this.registroActual = id;    
      this.maestroActual = 1; 
      this.nivelActual = 1;
      this.despuesBusqueda = 0;
      this.buscarRegistro(1);    
      this.verRegistro = 22;
    }

    editarRuta(id: number)
    {
      this.registroActual = id;    
      this.maestroActual = 1; 
      this.nivelActual = 0;
      this.despuesBusqueda = 0;
      this.buscarRegistro(1);    
      this.verRegistro = 22;
      this.iconoGeneral = "i_rutas"
    }

    editarCabecera(id: number)
    {
      this.registroActual = id;    
      this.nivelActual = 0;
      this.despuesBusqueda = 0;
      this.buscarRegistro(1);    
      this.verRegistro = 22;
      this.iconoGeneral = "i_procesos"
    }
    
  iniClave()
  {
    const respuesta = this.dialogo.open(DialogowipComponent, {
      width: "400px", panelClass: 'dialogo_atencion', data: { titulo: "Inicializar contraseña de usuario ", mensaje: "Esta acción inicializará la contraseña de este usuario quién deberá cambiarla en su próximo inicio de sesión. ¿Desea continuar con esta operación?", alto: "80", id: 0, accion: 0, botones: 2, boton1STR: "Inicializar contraseña", icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "iconshock-materialblack-mail-block" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET inicializada = 'S' WHERE id = " + this.detalleRegistro.id 
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[1387];
            mensajeCompleto.tiempo = 3000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            
        })  
      }
    });
  }

  seleccion(tipo: number, event: any) 
    {
      this.cambiando("");
      if (tipo == 0)
      {
        if (event.value == 1) 
        {
          for (var i = 0; i < this.maquinasSel.length; i++) 
          {
            this.maquinasSel[i].seleccionado = 1;
          }
          setTimeout(() => {
            this.detalleRegistro.maquinas = "N";  
          }, 100);
        }
      }
    }

    llenarMaquinas(id: number)
    {
      let sentencia = "SELECT a.id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, IF(ISNULL(b.maquina), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".relacion_partes_maquinas b ON a.id = b.maquina AND b.parte = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id ORDER BY seleccionado DESC, a.nombre"
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

}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
};

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
  const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right; 
}
