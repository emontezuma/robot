import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
import { SesionComponent } from '../sesion/sesion.component';
import { DxChartComponent } from "devextreme-angular";
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.css'],
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

  
export class ExportarComponent implements OnInit {

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
  @ViewChild("listaTurnos", { static: false }) listaTurnos: MatSelectionList;
  @ViewChild("listaPartes", { static: false }) listaPartes: MatSelectionList;
  @ViewChild("listaLotes", { static: false }) listaLotes: MatSelectionList;
  @ViewChild("listaProcesos", { static: false }) listaProcesos: MatSelectionList;
  
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
    public datepipe: DatePipe,
    private viewportRuler: ViewportRuler
  ) {

    this.servicio.mensajeError.subscribe((mensaje: any)=>
    {
      let mensajes = mensaje.split(";");
      if (mensajes[0] == 1)
      {
        this.pantalla = 1;
        this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2007]);
        this.errorMensaje = mensajes[1];
      }
    });

    this.servicio.vista.subscribe((accion: number)=>
    {
      if (accion == 22)
      {
        this.graficando = true;
        this.filtrando = false;
        this.verTop = true;
        this.modelo = 11;
        this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2015]);   
      }
      else if (accion == 23)
      {
        this.graficando = true;
        this.filtrando = false;
        this.verTop = false;
        this.modelo = 13;
        this.iniLeerBD()
      }
      this.servicio.mostrarBmenu.emit(0);
    });
    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 9) == "/exportar")
      {
        this.revisarTiempo();
      }
    });
    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    this.rConfiguracion();
    this.aplicarConsulta(this.servicio.rConsulta());
    
    if (this.servicio.rVista() == 23)
      {
        this.modelo = 3;
        this.iniLeerBD()
        this.verTop = false;
      }
      else
      {
        this.verTop = true;
      }
  }

  ngOnInit() {
    this.servicio.validarLicencia(1)
    this.servicio.mostrarBmenu.emit(0);
  }

  verTop: boolean = true;
  yaConfirmado: boolean = false;
  modelo: number  = 1;
  offSet: number;
  verIrArriba: boolean = false;
  filtrarC: boolean = false;
  hayFiltro: boolean = false
  eliminar: boolean = false;
  editando: boolean = false;
  graficando: boolean = true;
  verBuscar: boolean = true;
  verTabla: boolean = false;
  cambioVista: boolean = true;
  movil: boolean = false;
  parIndicador: string = this.servicio.rIdioma().decimales
  verGrafico: boolean = false;
  error01: boolean = false;
  error02: boolean = false;
  error03: boolean = false;
  error04: boolean = false;
  
  nCatalogo: string = this.servicio.rTraduccion()[1189]
  verBarra: string = "";
  ultimoReporte: string = "";
  procesoReporte: string = "";
  cada5Seg: number = 0;
  nombreFile: string = "";
  ultimoID: number = 0;
  copiandoDesde: number = 0;
  selLineasT: string = "S";
  selMaquinasT: string = "S";
  selAreasT: string = "S";
  selTecnicosT: string = "S";
  selTurnosT: string = "S";
  selPartesT: string = "S";
  selLotesT: string = "S";
  selFallasT: string = "S";
  selProcesosT: string = "S";
  textoBuscar: string = "";
  miGrafica: any = [];
  tecnicos: any = [];
  partes: any = [];
  turnos: any = [];
  lotes: any = [];
  procesos: any = [];
  arreTiempos: any = [];
  consultas: any = [];
  maquinas: any = [];
  parGrafica: any = [];
  sentenciaR: string = "";
  reporteActual: string = "";
  reporteSel: number = 4;
  consultaTemp: string = "0";
  consultaBuscada: boolean = false;
  
  ultimaActualizacion = new Date();
  errorTitulo: string = "[" + this.servicio.rTraduccion()[6] + "]";
  errorMensaje: string = "";
  pantalla: number = 2;  
  miSeleccion: number = 1;
  iconoGeneral: string = "i_alarmas";
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
  nombreReporte: string = "";
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
  faltaMensaje: string = "";
  responsableSel: boolean = false;
  fallaSel: boolean = false;
  rAlarmado: string = "N";
  horaReporte;
  mensajePadre: string = "";
  filtroOEE: string = "";
  URL_BASE = "/robot/api/upload.php"
  URL_IMAGENES = "/robot/assets/imagenes/";
  mostrarDetalle: boolean = false;
  grActual: number = +this.servicio.rUsuario().preferencias_andon.substr(41, 1);

  ayuda01 = ""

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

  maxmin: {startValue: "0", endValue: 20};

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
  rConfiguracion()
  {
    this.configuracion = [];
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.rListado01();
        this.configuracion = resp[0]; 
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  rListado01()
  {
    let sentencia = "SELECT listado01, listado01_f FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        if (resp[0].listado01 == "S")
        {
          this.procesoReporte = this.servicio.rTraduccion()[3508] + " " + this.servicio.fecha(2, resp[0].listado01_f, this.servicio.rIdioma().fecha_02);  
        }
        else if (resp[0].listado01 == "F")
        {
          this.procesoReporte = this.servicio.rTraduccion()[3509] + " " + this.servicio.fecha(2, resp[0].listado01_f, this.servicio.rIdioma().fecha_02);  
        }
        else
        {
          this.procesoReporte = this.servicio.rTraduccion()[449];
        }
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  descargarInfo()
  {
    this.nombreReporte = this.servicio.rTraduccion()[2228]
    this.reporteActual = this.servicio.rTraduccion()[3798]
    let sentencia = "SELECT COUNT(i.id) AS cuenta FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.id >= 0 " + this.filtroOEE + ";";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length == 0)
      {
        this.miGrafica = [];
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[2010]
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      else if (resp[0].cuenta == 0)
      {
        this.miGrafica = [];
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[2010]
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
      this.sentenciaR = "SELECT '" + this.servicio.rTraduccion()[2490] + "', '" + this.servicio.rTraduccion()[2098] + "', '" + this.servicio.rTraduccion()[2099] + "', '" + this.servicio.rTraduccion()[572] + "', '" + this.servicio.rTraduccion()[1351] + "', '" + this.servicio.rTraduccion()[2049] + "', '" + this.servicio.rTraduccion()[2050] + "', '" + this.servicio.rTraduccion()[728] + "', '" + this.servicio.rTraduccion()[2100] + "', '" + this.servicio.rTraduccion()[2101] + "', '" + this.servicio.rTraduccion()[3748] + "', '" + this.servicio.rTraduccion()[3749] + "', '" + this.servicio.rTraduccion()[3750] + "', '" + this.servicio.rTraduccion()[3794] + "', '" + this.servicio.rTraduccion()[3797] + "', '" + this.servicio.rTraduccion()[1039] + "', '" + this.servicio.rTraduccion()[2120] + "', '" + this.servicio.rTraduccion()[2121] + "' UNION (SELECT i.id, i.dia, a.numero, IFNULL(b.nombre, '" + this.servicio.rTraduccion()[8] + "'), i.turno, IFNULL(c.nombre, '" + this.servicio.rTraduccion()[8] + "'), i.equipo, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "'), d.referencia, i.parte, i.produccion, i.sacos, i.tarimas, i.tiempo_disponible, i.paro, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "'), i.bloque_inicia, i.bloque_finaliza FROM " + this.servicio.rBD() + ".lecturas_cortes i LEFT JOIN " + this.servicio.rBD() + ".lotes a ON i.orden = a.id LEFT JOIN " + this.servicio.rBD() + ".cat_turnos b ON i.turno = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas c ON i.equipo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_partes d ON i.parte = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios e ON i.operador = e.id WHERE i.id > 0 " + this.filtroOEE + ") ";
      this.exportar()
    })
  }

  
  selectionChange(event){
    console.log('selection changed using keyboard arrow');
  }

  
  exportar()
  {
    
    let campos = {accion: 100, sentencia: this.sentenciaR};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp. length > 0)
      {
        this.servicio.generarReporte(resp, this.nombreReporte, this.reporteActual + ".csv")
      }
    })
  }

  
  //Desde aqui
  

filtrar()
{
  this.listarConsultas()
  this.filtrando = true;
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
  this.listarMaquinas();
  this.listarTecnicos();
  this.listarPartes();
  this.listarTurnos();
  this.listarLotes();
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
      this.detalle = resp[0]; 
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
      this.detalle.filtrotur = "S";
      this.detalle.filtronpar = "S";
      this.detalle.filtroord = "S";
      this.detalle.filtrooper = "S";
      
    }
    this.consultaBuscada = false;
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
  this.modelo = 11;
  this.graficando = true;
  this.filtrando = false;
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
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[2032], mensaje: this.servicio.rTraduccion()[2034], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[1981], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_eliminar" }
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
            this.detalle.filtrotur = "S";
            this.detalle.filtronpar = "S";
            this.detalle.filtroord = "S";
            this.detalle.filtrooper = "S";
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

  listarProcesos()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 90 AND b.consulta = " + this.consultaTemp + " ORDER BY seleccionado DESC, a.nombre;"
    this.procesos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.procesos = resp;
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

 
  

  listarTecnicos()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 50 AND b.consulta = " + this.consultaTemp + " WHERE (a.rol = 'T' OR a.rol = 'A') ORDER BY seleccionado DESC, a.nombre;"
    this.tecnicos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.tecnicos = resp;
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
          this.areas[i].seleccionado = event.value;
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
        for (var i = 0; i < this.procesos.length; i++) 
        {
          this.procesos[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrooper = "N";   
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
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[2172]
    }
    else if ((!this.detalle.nombre || this.detalle.nombre=="") && id == 1)
    {
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[2172]
    }
    if (this.detalle.periodo == "8")
    {
      if (!this.detalle.desde) 
      {
        errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1480]
      }

      if (!this.detalle.hasta) 
      {
        errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[1479]
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
        else if (this.error04)
        {
          this.txtHasta.nativeElement.focus();
        }
      }, 300);
      return;
    }
    if (id== 1 && !this.consultaBuscada)
      {
        this.consultaBuscada = true;
        this.buscarConsultaID();
        return;
      }
      this.consultaBuscada = false;
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
    let sentencia = previa + previa2 + "INSERT INTO " + this.servicio.rBD() + ".consultas_cab (usuario, " + (id == 1 ? "nombre, " : "") + "publico, periodo, defecto, filtrolin, filtroori, filtromaq, filtroare, filtrofal, filtrotec, filtronpar, filtrotur, filtroord, filtropar, filtrooper, filtrocla" + (this.detalle.periodo != 8 ? ")" : ", desde, hasta, actualizacion)") + " VALUES (" + this.servicio.rUsuario().id + ", '" + (id == 1 ? this.detalle.nombre + "', '" : "") + this.detalle.publico + "', '" + this.detalle.periodo + "', '" + this.detalle.defecto + "', '" + this.detalle.filtrolin + "', '" + this.detalle.filtroori + "', '" + this.detalle.filtromaq + "', '" + this.detalle.filtroare + "', '" + this.detalle.filtrofal + "', '" + this.detalle.filtrotec + "', '" + this.detalle.filtronpar + "', '" + this.detalle.filtrotur + "', '" + this.detalle.filtroord + "', '" + this.detalle.filtropar + "', '" + this.detalle.filtrooper + "', '" + this.detalle.filtrocla + "'" + (this.detalle.periodo != 8 ? ");" : ", '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "', '" +  this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "', NOW());")
    if (+this.detalle.id > 0)
    {
      nuevo = false;
      sentencia = previa2 + "UPDATE " + this.servicio.rBD() + ".consultas_cab SET " + (id == 1 ? "nombre = '" + this.detalle.nombre + "', " : "") + "actualizacion = NOW(), publico = '" + this.detalle.publico + "', periodo = '" + this.detalle.periodo + "', defecto = '" + this.detalle.defecto + "', filtrolin = '" + this.detalle.filtrolin + "', filtroori = '" + this.detalle.filtroori + "', filtromaq = '" + this.detalle.filtromaq + "', filtroare = '" + this.detalle.filtroare + "', filtrofal = '" + this.detalle.filtrofal + "', filtrotec = '" + this.detalle.filtrotec + "', filtronpar = '" + this.detalle.filtronpar + "', filtrotur = '" + this.detalle.filtrotur + "', filtroord = '" + this.detalle.filtroord + "', filtropar = '" + this.detalle.filtropar + "', filtrooper = '" + this.detalle.filtrooper + "', filtrocla = '" + this.detalle.filtrocla + "'" + (this.detalle.periodo != 8 ? "" : ", desde = '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "', hasta = '" +  this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "' ") + " WHERE id = " + +this.detalle.id + ";";
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
          this.servicio.aConsulta(this.detalle.id);
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
          cadTablas = cadTablas +  "(" + this.detalle.id + ", 10,  " + +this.listaLineas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaMaquinas)
      {
        for (var i = 0; i < this.listaMaquinas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 20,  " + +this.listaMaquinas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaAreas)
      {
        for (var i = 0; i < this.listaAreas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 30,  " + +this.listaAreas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaFallas)
      {
        for (var i = 0; i < this.listaFallas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 40,  " + +this.listaFallas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaTecnicos)
      {
        for (var i = 0; i < this.listaTecnicos.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 50,  " + +this.listaTecnicos.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaPartes)
      {
        for (var i = 0; i < this.listaPartes.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 60,  " + +this.listaPartes.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaTurnos)
      {
        for (var i = 0; i < this.listaTurnos.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 70,  " + +this.listaTurnos.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaLotes)
      {
        for (var i = 0; i < this.listaLotes.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 80,  " + +this.listaLotes.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaProcesos)
      {
        for (var i = 0; i < this.listaProcesos.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 90,  " + +this.listaProcesos.selectedOptions.selected[i].value + "),";
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
            this.aplicarConsulta(this.servicio.rConsulta());
            
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
            this.aplicarConsulta(this.servicio.rConsulta());
            
          }
      }
      
    })
    this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[3469]);
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = this.servicio.rTraduccion()[2009]
    mensajeCompleto.tiempo = 2000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
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

  aplicarConsulta(id: number)
  {
    this.filtroOEE = "";
    
    
    
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".consultas_cab WHERE id = " + id
    if (id == 0)
    {
      sentencia = "SELECT * FROM " + this.servicio.rBD() + ".consultas_cab WHERE usuario = " + this.servicio.rUsuario().id + " AND (defecto = 'S' OR ISNULL(nombre) OR nombre = '') ORDER BY defecto DESC, actualizacion DESC LIMIT 1"
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      
      let desde = new Date();
      let hasta = new Date();
      this.hayFiltro = false;
      if (resp.length > 0)
      { 
        this.ayuda01 = this.servicio.rTraduccion()[2174] + (resp[0].nombre ? resp[0].nombre : this.servicio.rTraduccion()[2175]);
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
        this.filtroOEE = " AND i.dia >= '" + this.datepipe.transform(desde, "yyyy/MM/dd") + "' AND i.dia <= '" + this.datepipe.transform(hasta, "yyyy/MM/dd") + "' ";
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
               
      } 
      else
      {
        this.ayuda01 = this.servicio.rTraduccion()[3458];
        let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";         
        desde = new Date(nuevaFecha);
        this.filtroOEE = " AND i.dia >= '" + this.datepipe.transform(desde, "yyyy/MM/dd") + "' AND i.dia <= '" + this.datepipe.transform(hasta, "yyyy/MM/dd") + "' ";
      }
    })
  }   
  
  revisarTiempo()
  {
    if (this.modelo == 13 || this.modelo == 3)
    {
      this.contarTiempo = false;
      for (var i = 0; i < this.registros.length; i++)
      {
        let segundos =  this.servicio.tiempoTranscurrido(this.registros[i].inicio, "").split(";");
        this.arreTiempos[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
      }
      this.contarTiempo = true;
    }
    else
    {
      this.cada5Seg = this.cada5Seg + 1;
      if (this.cada5Seg > 5)
      {
        this.rListado01();
        this.cada5Seg = 0;
      }
    }
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

  leerBD()
  {
    if ((this.modelo != 13 && this.modelo != 3) || this.router.url.substr(0, 9) != "/exportar")
    {
      return;
    }
    let sentencia = "";
    
    sentencia = "SELECT * FROM (SELECT a.*, b.evento, 0 AS indicador, c.estatus AS restatus, NOW() AS hasta, b.nombre, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "') AS narea, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nsolicitante, '' AS n1, '' AS n2 FROM " + this.servicio.rBD() + ".alarmas a LEFT JOIN " + this.servicio.rBD() + ".cat_alertas b ON a.alerta = b.id LEFT JOIN " + this.servicio.rBD() + ".reportes c ON a.proceso = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_areas d ON c.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios e ON c.solicitante = e.id WHERE ISNULL(fin) AND b.evento < 200 UNION ALL SELECT a.*, b.evento, IF(b.evento < 203, c.rate, c.oee) AS indicador, c.estatus AS restatus, NOW() AS hasta, b.nombre, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "') AS narea, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nsolicitante, '' AS n1, '' AS n2 FROM " + this.servicio.rBD() + ".alarmas a LEFT JOIN " + this.servicio.rBD() + ".cat_alertas b ON a.alerta = b.id LEFT JOIN " + this.servicio.rBD() + ".relacion_maquinas_lecturas c ON a.proceso = c.equipo LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas d ON c.equipo = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_lineas e ON d.linea = e.id WHERE ISNULL(fin) AND b.evento > 200 AND b.evento < 300 UNION ALL SELECT a.*, b.evento, 0 AS indicador, 0 AS restatus, c.hasta, IFNULL(e.nombre, '" + this.servicio.rTraduccion()[8] + "') AS producto, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nproceso, IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nequipo, c.numero, e.referencia FROM " + this.servicio.rBD() + ".alarmas a LEFT JOIN " + this.servicio.rBD() + ".cat_alertas b ON a.alerta = b.id LEFT JOIN " + this.servicio.rBD() + ".lotes c ON a.proceso = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_procesos d ON c.proceso = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_partes e ON c.parte = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas f ON c.equipo = f.id WHERE ISNULL(fin) AND b.evento > 301 AND b.evento < 304 UNION ALL SELECT a.*, b.evento, 0 AS indicador, 0 AS restatus, c.fecha, b.nombre, IFNULL(d.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nproceso, IFNULL(f.nombre, '" + this.servicio.rTraduccion()[8] + "') AS nequipo, c.carga, '' FROM " + this.servicio.rBD() + ".alarmas a LEFT JOIN " + this.servicio.rBD() + ".cat_alertas b ON a.alerta = b.id LEFT JOIN " + this.servicio.rBD() + ".cargas c ON a.proceso = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_procesos d ON c.proceso = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_maquinas f ON c.equipo = f.id WHERE ISNULL(fin) AND b.evento = 304) AS qry01 ORDER BY inicio;";
    
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let actualizar = JSON.stringify(this.registros) != JSON.stringify(resp);
      if (actualizar)
      {
        if (resp.length == 0)
        {
          this.registros = [];
        }
        if (this.registros.length == 0 && resp.length > 0)
        {
          this.registros = resp;
        }
        else 
        {
          for (i = this.registros.length - 1; i >= 0; i--)
          {
            let hallado = false;
            for (var j = 0; j < resp.length; j++)
            {

              if (this.registros[i].id ==  resp[j].id)
              {
                if (this.registros[i].indicador !=  resp[j].indicador || this.registros[i].restatus !=  resp[j].restatus || this.registros[i].hasta !=  resp[j].hasta || this.registros[i].fase != resp[j].fase)
                {
                  this.registros[i].indicador = resp[j].indicador;
                  this.registros[i].hasta = resp[j].hasta;
                  this.registros[i].restatus = resp[j].restatus;
                  this.registros[i].fase = resp[j].fase;
                }
                hallado = true;
                break;
              }
            }
            if (!hallado)
            {
              this.registros.splice(i, 1);
              this.arreTiempos.length = resp.length;
              this.arreHover.length = resp.length;
            }
          }
          for (var i = 0; i < resp.length; i++)
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
              this.arreTiempos.length = resp.length;
              this.arreHover.length = resp.length;
            }
          }
          
        }
        this.contarRegs()
      }
      clearTimeout(this.leeBD);
      if (this.router.url.substr(0, 9) == "/exportar")
      {
        this.leeBD = setTimeout(() => {
          this.leerBD()
        }, +this.elTiempo);
      }
    });
  }

  contarRegs()
  {
    if (this.router.url.substr(0, 9) != "/exportar")
    {
      return;
    }
    if (this.modelo == 1)
    {
      this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[2015]);   
      return;
    }
    let mensaje = "";
    if (this.registros.length > 0)
    {
      mensaje = this.servicio.rTraduccion()[66] + (this.registros.length == 1 ? this.servicio.rTraduccion()[2176] : this.registros.length + this.servicio.rTraduccion()[2177]) 
    }
    else
    {
      mensaje = this.servicio.rTraduccion()[2178];
    }
    let cadAlarmas: string = "";
    this.alarmados = 0;
    for (var i = 0; i < this.registros.length; i++)
    {
      if (this.registros[i].fase >10)
      {
        this.alarmados = this.alarmados + 1
      }
    }
    if (this.alarmados > 0)
    {
      cadAlarmas = "<span class='resaltar'>" + (this.alarmados == 1 ? this.servicio.rTraduccion()[2179] : this.alarmados + this.servicio.rTraduccion()[2180]) + "</span>";
    }
    mensaje = mensaje + ' ' + cadAlarmas

    this.servicio.mensajeInferior.emit(mensaje);          
  }


  cancelarAlarmas()
  {
    let sentencia = "SELECT a.*, c.informar_resolucion, c.evento FROM " + this.servicio.rBD() + ".alarmas a INNER JOIN " + this.servicio.rBD() + ".cat_alertas c ON a.alerta = c.id WHERE ISNULL(a.fin)"
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        sentencia = "";
        for (var i = 0; i < resp.length; i++) 
        {
            sentencia =  sentencia + ";UPDATE " + this.servicio.rBD() + ".reportes SET alarmado_atender = 'Y' WHERE id = " + resp[i].proceso;
            if (+resp[i].evento == 102) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".reportes SET alarmado_atendido = 'Y' WHERE id = " + resp[i].proceso;
            }
            else if (+resp[i].evento == 103) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".reportes SET alarmado = 'Y' WHERE id = " + resp[i].proceso;
            } 
            else if (+resp[i].evento == 302) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".lotes SET alarma_tse_paso = 'N', alarma_tse = 'N', alarma_tse_p = 'N' WHERE id id = " + resp[i].proceso;
            }
            else if (+resp[i].evento == 303) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".lotes SET alarma_tpe_paso = 'N', alarma_tpe = 'N', alarma_tpe_p = 'N' WHERE id = " + resp[i].proceso;
            } 
            else if (+resp[i].evento == 201) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET alarmado_bajo = 'N' WHERE equipo = " + resp[i].proceso;
            } 
            else if (+resp[i].evento == 202) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET alarmado_alto = 'N' WHERE AND equipo = " + resp[i].proceso;
            } 
            else if (+resp[0].evento == 204) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET alarmado_ftq = 'N' WHERE equipo = " + resp[0].proceso;
            }  
            else if (+resp[0].evento == 205) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET alarmado_dis = 'N' WHERE equipo = " + resp[0].proceso;
            }  
            else if (+resp[0].evento == 206) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET alarmado_efi = 'N' WHERE equipo = " + resp[0].proceso;
            }  
            else if (+resp[0].evento == 207) 
            {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".relacion_maquinas_lecturas SET alarmado_oee = 'N' WHERE equipo = " + resp[0].proceso;
            }  
            sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".alarmas SET estatus = 9, fin = NOW(), tiempo = TIME_TO_SEC(TIMEDIFF(NOW(), inicio))" + (resp[i].informar_resolucion == "S" ? ", informado = 'S'" : "") + ", termino = " + this.servicio.rUsuario().id + " WHERE id = " + resp[i].id + ";UPDATE " + this.servicio.rBD() + ".mensajes SET estatus = 'Z' where alarma = " + resp[i].id;
            if (resp[0].informar_resolucion == "S")
            {
              sentencia = sentencia + ";INSERT INTO " + this.servicio.rBD() + ".mensajes (alerta, canal, tipo, proceso, alarma, lista) SELECT a.alerta, b.canal, 7, a.proceso, a.id, b.lista FROM " + this.servicio.rBD() + ".alarmas a INNER JOIN " + this.servicio.rBD() + ".mensajes b ON a.id = b.alarma WHERE a.id = " + resp[i].id + " AND a.estatus = 9  GROUP BY a.alerta, b.canal, a.proceso, a.id, b.lista";
            }
          }
          sentencia = sentencia.substr(1);
          campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[2014]
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            this.leerBD();
            this.contarRegs(); 
            this.noLeer = false;   
          })
        }
      });
                    
  }
  siguienteCancelar()
  {

    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[2181], mensaje: this.servicio.rTraduccion()[2182], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[2183], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_alerta" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        
        if (result.accion == 1) 
        {
          if (this.yaConfirmado)
          {
            this.cancelarAlarmas();
          }
          else
          {

            const respuesta = this.dialogo.open(SesionComponent, 
            {
              width: "400px", panelClass: 'dialogo_atencion', data: { tiempo: 10, sesion: 1, rolBuscar: "A", opcionSel: 0, idUsuario: 0, usuario: "", clave: "", titulo: this.servicio.rTraduccion()[2184], mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_sesion" }
            });
            respuesta.afterClosed().subscribe(result => 
            {
              if (result)
              {
                if (result.accion == 1) 
                {
                  this.cancelarAlarmas();  
                }
                else
                {
                  let mensajeCompleto: any = [];
                  mensajeCompleto.clase = "snack-error";
                  mensajeCompleto.mensaje = this.servicio.rTraduccion()[2011]
                  mensajeCompleto.tiempo = 2000;
                  this.servicio.mensajeToast.emit(mensajeCompleto);
                }
              }
              else
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[2012]
                mensajeCompleto.tiempo = 2000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
            })
            }
          }        
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[2011]
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[2011]
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }
}