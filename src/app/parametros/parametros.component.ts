import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, GuardsCheckStart } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { HttpClient  } from '@angular/common/http';
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { LicenciaComponent } from '../licencia/licencia.component';
import { SesionComponent } from '../sesion/sesion.component';
import { ProgramadorComponent } from '../programador/programador.component';
import { TemasComponent } from '../temas/temas.component';
import { DatePipe } from '@angular/common'


import { Router } from '@angular/router';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css'],
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

export class ParametrosComponent implements OnInit {

  
  @ViewChild("txtT1", { static: false }) txtT1: ElementRef;
  @ViewChild("txtT2", { static: false }) txtT2: ElementRef;
  @ViewChild("txtT3", { static: false }) txtT3: ElementRef;
  @ViewChild("listaListad", { static: false }) listaListad: MatSelectionList;
  
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

    this.emit00 = this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      this.altoPantalla = this.servicio.rPantalla().alto - 92;
      this.anchoPantalla = this.servicio.rPantalla().ancho - 2;// - (pantalla ? 0 : this.servicio.rAnchoSN());// : 0);
    });

    this.emit10 = this.servicio.verProgramador.subscribe((data: any)=>
      {
        if (!this.eProgramador)
        {
          const respuesta = this.dialogo.open(ProgramadorComponent, 
          {
            width: "400px", panelClass: 'dialogo_atencion', data: { tiempo: 10, sesion: 1, rolBuscar: "A", opcionSel: 0, idUsuario: 0, usuario: "", clave: "", titulo: this.servicio.rTraduccion()[3193], mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[122], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_sesion" }
          });
          respuesta.afterClosed().subscribe(result => 
          {
            if (result)
            {
              if (result.accion == 1)
              {
                this.eProgramador = true;
                if (this.emit10) {this.emit10.unsubscribe()}
              } 
            }
          })  
        }
      });

    this.emit20 = this.servicio.teclaEscape.subscribe((accion: boolean)=>
    {
      this.cancelar();
    });
    this.emit30 = this.servicio.cambioIdioma.subscribe((data: boolean)=>
    {
      if (this.router.url.substr(0, 11) == "/parametros")
      {
        this.llenarEventos();        
      }
      
    })
    this.emit40 = this.servicio.vista.subscribe((accion: number)=>
    {
      if (this.router.url.substr(0, 11) == "/parametros")
      {
        this.eProgramador = false;
        if (this.emit10) {this.emit10.unsubscribe()}
        
        if (accion == 42 || accion == 44)
        {
          if (accion == 42)
          {
            this.modelo = 11;
            this.verCambioMapa = true;
            this.servicio.mensajeInferior.emit("<span class='resaltar'>" + this.servicio.rTraduccion()[3194] + "</span>");
            this.rConfiguracion();
          }
          else if (accion == 44)
          {
            this.llenarLicencias();
            this.modelo = 12;
            this.verCambioMapa = false;
            
            }
        }
      }
    })
    this.emit50 = this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
    });

    this.emit60 = this.servicio.valida.subscribe((val) => 
    {
        this.licenciado = this.servicio.rLicenciado();
    });
    

    this.emit70 = this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    if (this.servicio.rVista() == 42)
    {
      this.modelo = 1;
      this.verCambioMapa = true;
      this.servicio.mensajeInferior.emit("<span class='resaltar'>" + this.servicio.rTraduccion()[3194] + "</span>");
    }
    else
    {
      this.modelo = 2;
      this.llenarLicencias();
      this.verCambioMapa = false;
      
    }
    this.rConfiguracion();
    
    
  }

  ngOnInit() {
    
    this.servicio.validarLicencia(1)
    
    this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", "");
    this.servicio.mostrarBmenu.emit(0);
    let sentencia = "SELECT CONCAT(key_number, serial) AS mmcall FROM mmcall.locations"
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.clave = resp[0].mmcall;
      }
      else
      {

      }
    })
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
  mensajeMacro: string = this.servicio.rTraduccion()[3195] + ":\n[0] " + this.servicio.rTraduccion()[3196] + ".\n[1] " + this.servicio.rTraduccion()[3197] + ".\n[2] " + this.servicio.rTraduccion()[1502] + ".\n[3] " + this.servicio.rTraduccion()[1507] + ".\n[4] " + this.servicio.rTraduccion()[1533] + ".\n[5] " + this.servicio.rTraduccion()[1680] + ".\n[11] " + this.servicio.rTraduccion()[3198] + ".\n[20] " + this.servicio.rTraduccion()[3199] + ".\n[30] " + this.servicio.rTraduccion()[3200] + ".\n"
  tipoLic: string = this.servicio.rPerpetua() ? this.servicio.rTraduccion()[3201] : this.servicio.rTraduccion()[3202];
  imagenSel: boolean = false;
  eProgramador: boolean = false;
  lineaSel: boolean = false;
  mapaSel: boolean = false;
  licSel: boolean = false;
  licTem: boolean = false;
  licRei: boolean = false;
  licenciaSel: boolean = false;
  
  verIrArriba: boolean = false;
  licenciado: boolean = this.servicio.rLicenciado();
  movil: boolean = false;
  verBarra: string = "";
  textoBuscar: string = "";
  clavePublica: string = "";
  verSR: boolean = false;
  editando: boolean = false;
  faltaMensaje: string = "";
  mensajeImagen: string = this.servicio.rTraduccion()[358];
  mostrarImagenRegistro: string = "N";
  existeRegistro: boolean = false;
  palabraClave: string = "CronosIntegracion2019";
  tipo: string = "B";
  verCambioMapa: boolean = true;
  idiomas: any = [];

  cancelarEdicion: boolean = false;

  modelo: number = 0;
  respuesta_mail: string = "";
  veces_mail: number  = 20;
  ultimaActualizacion = new Date();
  altoPantalla: number = this.servicio.rPantalla().alto - 92;
  anchoPantalla: number = this.servicio.rPantalla().ancho - 10 + this.servicio.rAnchoSN();
  errorTitulo: string = "[" + this.servicio.rTraduccion()[6] + "]";
  errorMensaje: string = "";
  pantalla: number = 2;
  iconoGeneral = "i_licencia";
  iconoVista: string = "";
  visualizarImagen: boolean = false;
  detalle: any = [];
  listas: any = [];
  areas = [];
  tipos = [];
  opcionBorrar: number = 0;
  
  temas: any = [];
  eventos: any = [];
  licencias: any = [];
  URL_BASE = "/robot/api/upload.php";
  //URL_BASE = "http://localhost:8081/sigma/api/upload.php"
  URL_IMAGENES = "/robot/assets/imagenes/";
  
  ayuda01 = this.servicio.rTraduccion()[1196]
  disponibilidad: any = [];

  boton01: boolean = false;
  boton02: boolean = false;

  bot4Sel: boolean = false;
  bot5Sel: boolean = false;

  error01: boolean = false;
  error02: boolean = false;
  error03: boolean = false;
  error04: boolean = false;
  error35: boolean = false;
  clave: string = "";
  local: string = "";
  licencia: string = "";

  cronometro: any;

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

  imagenError()
  {
    this.mostrarImagenRegistro = "N";
    this.detalle.mostrarImagen = "N"
  }


  rConfiguracion()
  {
    this.eProgramador = false;
    this.llenarIdiomas();
    this.existeRegistro = false; 
    this.detalle = [];
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.existeRegistro = true
      if (resp.length > 0)
      {
        this.faltaMensaje = "";
        resp[0].mapa_fondo = "#" + resp[0].mapa_fondo;
        if (resp[0].mapa_alineacion == "none")
        {
          resp[0].mapa_alineacion = "S";
        }
        else
        {
          resp[0].mapa_alineacion = "L";
        }
        if (resp[0].ruta_archivos_enviar)
        {
          resp[0].ruta_archivos_enviar = resp[0].ruta_archivos_enviar.replace(/\//g, '\\');  
        }
        
        if (resp[0].ruta_audios)
        {
          resp[0].ruta_audios = resp[0].ruta_audios.replace(/\//g, '\\');
        }
        if (resp[0].ruta_sms)
        {
          resp[0].ruta_sms = resp[0].ruta_sms.replace(/\//g, '\\');
        }
        
        if (resp[0].ruta_programa_mapa)
        {
          resp[0].ruta_programa_mapa = resp[0].ruta_programa_mapa.replace(/\//g, '\\');
        }
        
        if (resp[0].audios_ruta)
        {
          resp[0].audios_ruta = resp[0].audios_ruta.replace(/\//g, '\\');
        }
        
        if (resp[0].audios_externos_carpeta)
        {
          resp[0].audios_externos_carpeta = resp[0].audios_externos_carpeta.replace(/\//g, '\\');
        }

        if (resp[0].audios_prefijo)
        {
          resp[0].audios_prefijo = resp[0].audios_prefijo.replace(/\//g, '\\');
        }

        resp[0].bajo_color = resp[0].bajo_color ? ("#" + resp[0].bajo_color) : "";
        resp[0].medio_color = resp[0].medio_color ? ("#" + resp[0].medio_color) : "";
        resp[0].alto_color = resp[0].alto_color ? ("#" + resp[0].alto_color) : "";
        
        this.detalle = resp[0];
        this.detalle.cien = "100";
        this.boton01 = false;
        this.boton02 = false;
        
        
        this.llenarTemas();
        this.llenarEventos()
        sentencia = "SELECT * FROM " + this.servicio.rBD() + ".disponibilidad WHERE maquina = 0 AND linea = 0 LIMIT 1;"
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
        sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_areas WHERE estatus = 'A' ORDER BY nombre;"
        campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length > 0)
          {
            this.areas = resp;
          }
          this.areas.splice(0, 0, {id: -1, nombre: this.servicio.rTraduccion()[299]})
        })
        sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_generales WHERE estatus = 'A' AND tabla = 45 ORDER BY nombre;"
        campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length > 0)
          {
            this.tipos = resp;
          }
          this.tipos.splice(0, 0, {id: -1, nombre: this.servicio.rTraduccion()[299]})
        })

      }
      this.editando = false;
    },
    error =>
      {
        console.log(error)
      })
  }

  
    guardar()
  {
    let errores = 0;
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.error04 = false;
    if (this.verCambioMapa)
    {
      this.faltaMensaje = this.servicio.rTraduccion()[127];
      if (!this.detalle.planta)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3244];
      }
      if (!this.detalle.rfc)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3243];
      }
      if (!this.detalle.licencia)
      {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3242];
      }
    }
    else
    {
      this.faltaMensaje = "<strong>" + this.servicio.rTraduccion()[3241] + ":</strong> ";
      if (!this.local)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3240];
      }
      else if (this.local.length == 0)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3240];
      }
      if (!this.licencia)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3239];
      }
      else if (this.licencia.length == 0)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3239];
      }
      if (errores == 0)
      {
        let validada = true;
        let cadComparar = "";
        let claveInterna = this.alterarPalabraClave();
        for (var i = 0; i < this.licencia.length; i++) 
        {
          let numero = (this.clavePublica[i].charCodeAt(0) ^ claveInterna[i].charCodeAt(0)).toString();
          if (numero.length == 1)
          {
            cadComparar = numero;
          }
          else if (numero.length == 2)
          {
            cadComparar = numero.substr(1);
          }
          else if (numero.length == 3)
          {
            cadComparar = numero.substr(1, 1);
          }
          if (cadComparar != this.licencia[i])
          {
            validada = false;
            break;
          }
        }
        if (!validada)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + this.servicio.rTraduccion()[3238];
  
        }
      }

    }
    if (errores > 0)
    {
      setTimeout(() => {
        if (this.verCambioMapa)
        {
          if (this.error01)
          {
            this.txtT1.nativeElement.focus();
          }
          else if (this.error02)
          {
            this.txtT2.nativeElement.focus();
          }
          else if (this.error03)
          {
            this.txtT3.nativeElement.focus();
          }
        }
        else
        {
          if (this.error01)
          {
            this.txtT1.nativeElement.focus();
          }
          else if (this.error02)
          {
            this.txtT2.nativeElement.focus();
          }
          else if (this.error03)
          {
            this.txtT2.nativeElement.focus();
          }
        }
      }, 300);
      return;
    }
    this.servicio.refrescarLogo.emit(true);
    this.editando = false;
    this.faltaMensaje = "";
    if (this.verCambioMapa)
    {
      let sentencia = "INSERT INTO " + this.servicio.rBD() + ".configuracion (tiempo) VALUES (0);";
      if (this.existeRegistro)
      {
        sentencia = "";
      }
      let mapa_fondo = "FFFFFF";
      if (this.detalle.mapa_fondo)
      {
        if (this.detalle.mapa_fondo.substr(0, 1)=="#")
        {
          mapa_fondo = this.detalle.mapa_fondo.substr(1);
        }
      }
      if (!this.detalle.escape_lista)
      {
        this.detalle.escape_lista = 0
      }
      if (!this.detalle.tiempo_reporte)
      {
        this.detalle.tiempo_reporte = 0
      }
      if (!this.detalle.mapa_delay)
      {
        this.detalle.mapa_delay = 30;
      }
      else if (this.detalle.mapa_delay > 3600)
      {
        this.detalle.mapa_delay = 3600;
      }
      let mapa_alineacion = "none";
      if (this.detalle.mapa_alineacion == "L")
      {
        mapa_alineacion = "xMidYMid meet";
      }
      if (!this.detalle.timeout_llamadas)
      {
        this.detalle.timeout_llamadas = 0
      }
      if (!this.detalle.timeout_sms)
      {
        this.detalle.timeout_sms = 0
      }
      if (!this.detalle.veces_reproducir)
      {
        this.detalle.veces_reproducir = 0
      }
      this.detalle.be_alarmas_correos = "N";
      this.detalle.be_alarmas_llamadas = "N";
      this.detalle.be_alarmas_mmcall = "N";
      this.detalle.be_alarmas_sms = "N";

     
      
      let ruta_archivos_enviar = ""
      if (this.detalle.ruta_archivos_enviar)
      {
        ruta_archivos_enviar = this.detalle.ruta_archivos_enviar.replace(/\\/g, '/')
      }
      let ruta_audios = ""
      if (this.detalle.ruta_audios)
      {
        ruta_audios = this.detalle.ruta_audios.replace(/\\/g, '/')
      }
      let ruta_programa_mapa = ""
      if (this.detalle.ruta_programa_mapa)
      {
        ruta_programa_mapa = this.detalle.ruta_programa_mapa.replace(/\\/g, '/')
      }
      let ruta_sms = ""
      if (this.detalle.ruta_sms)
      {
        ruta_sms = this.detalle.ruta_sms.replace(/\\/g, '/')
      }
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
      let audios_extenos = ""
      if (this.detalle.audios_externos_carpeta)
      {
        audios_extenos = this.detalle.audios_externos_carpeta.replace(/\\/g, '/')
      }
      if (!this.detalle.audios_escalamiento)
      {
        this.detalle.audios_escalamiento = 0;
      }
      
      if (!this.detalle.finalizar_sesion)
      {
        this.detalle.finalizar_sesion = 0;
      }
      else if (this.detalle.finalizar_sesion > 9999)
      {
        this.detalle.finalizar_sesion = 9999;
      }

      if (!this.detalle.tiempo_andon)
      {
        this.detalle.tiempo_andon = 0;
      }
      else if (this.detalle.tiempo_andon > 86400)
      {
        this.detalle.tiempo_andon = 86400;
      }
      else if (this.detalle.tiempo_andon < 0)
      {
        this.detalle.tiempo_andon = 0;
      }

      if (!this.detalle.audios_externos_pausa)
      {
        this.detalle.audios_externos_pausa = 0;
      }
      else if (this.detalle.audios_externos_pausa > 9999)
      {
        this.detalle.audios_externos_pausa = 9999;
      }
      else if (this.detalle.audios_externos_pausa < 0)
      {
        this.detalle.audios_externos_pausa = 0;
      }


      


      if (!this.detalle.tiempo_audios)
      {
        this.detalle.tiempo_audios = 0;
      }
      else if (this.detalle.tiempo_audios > 9999)
      {
        this.detalle.tiempo_audios = 9999;
      }

      if (!this.detalle.audio_rate)
      {
        this.detalle.audio_rate = 0;
      }
      else if (this.detalle.audio_rate > 10)
      {
        this.detalle.audio_rate = 10;
      }
      else if (this.detalle.audio_rate < -10)
      {
        this.detalle.audio_rate = -10;
      }
      if (!this.detalle.carrusel_tiempo)
      {
        this.detalle.carrusel_tiempo = 0;
      }
      else if (this.detalle.carrusel_tiempo > 999999)
      {
        this.detalle.carrusel_tiempo = 999999;
      }
      else if (this.detalle.carrusel_tiempo < 10)
      {
        this.detalle.carrusel_tiempo = 10;
      }

      this.detalle.tiempo_escaner = this.detalle.tiempo_escaner <= 10 || this.detalle.tiempo_escaner > 9999 ? 10 : this.detalle.tiempo_escaner;
      this.detalle.tiempo_entre_lecturas = this.detalle.tiempo_entre_lecturas <= 0 || this.detalle.tiempo_entre_lecturas > 99999 ? 10 : this.detalle.tiempo_entre_lecturas;

      this.detalle.audios_repeticiones = !this.detalle.audios_repeticiones ? 1 : this.detalle.audios_repeticiones;

      this.detalle.holgura_reprogramar = this.detalle.holgura_reprogramar <= 0 || this.detalle.holgura_reprogramar > 99999 ? 10 : this.detalle.holgura_reprogramar;
      this.detalle.avisar_segundos = this.detalle.avisar_segundos <= 0 || this.detalle.avisar_segundos > 9999 ? 10 : this.detalle.avisar_segundos;
      this.detalle.estimado_productividad = this.detalle.estimado_productividad <= 0 || this.detalle.estimado_productividad > 9999 ? 0 : this.detalle.estimado_productividad;
      this.detalle.area_change = !this.detalle.area_change ? 0 : this.detalle.area_change;
      this.detalle.tipo_change = !this.detalle.tipo_change ? 0 : this.detalle.tipo_change;
      this.detalle.bajo_hasta = this.detalle.bajo_hasta>100 ? 100 : this.detalle.bajo_hasta;
      this.detalle.bajo_hasta = this.detalle.bajo_hasta<0 ? 0 : this.detalle.bajo_hasta;

      this.detalle.medio_hasta = this.detalle.medio_hasta>100 ? 100 : this.detalle.medio_hasta;
      this.detalle.medio_hasta = this.detalle.medio_hasta<0 ? 0 : this.detalle.medio_hasta;

      let bajo_color = this.detalle.bajo_color ? this.detalle.bajo_color.substr(1) : "";
      let medio_color = this.detalle.medio_color ? this.detalle.medio_color.substr(1) : "";
      let alto_color = this.detalle.alto_color ? this.detalle.alto_color.substr(1) : "";

      this.detalle.idioma_defecto = this.detalle.idioma_defecto ? this.detalle.idioma_defecto : 1; 

      this.eProgramador = false;

      this.detalle.pantalla_mix = "N"//!this.detalle.pantalla_mix ? "N" : this.detalle.pantalla_mix;
      this.detalle.verhoraxhoraenoee = !this.detalle.verhoraxhoraenoee || this.servicio.rVersion().modulos[10] == 0 ? "N" : this.detalle.verhoraxhoraenoee;
      sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".configuracion SET avisar_segundos = " + +this.detalle.avisar_segundos + ", idioma_defecto = " + this.detalle.idioma_defecto + ", estimado_productividad = " + +this.detalle.estimado_productividad + ", holgura_reprogramar = " + +this.detalle.holgura_reprogramar + ", audios_repeticiones = " + +this.detalle.audios_repeticiones + ", verhoraxhoraenoee = '" + this.detalle.verhoraxhoraenoee + "', tiempo_entre_lecturas = " + +this.detalle.tiempo_entre_lecturas + ", tiempo_escaner = " + +this.detalle.tiempo_escaner + ", tipo_flujo = '" + this.detalle.tipo_flujo + "', pantalla_mix = '" + this.detalle.pantalla_mix + "', wip_salto_adelante = '" + (!this.detalle.wip_salto_adelante ? "N" : this.detalle.wip_salto_adelante) + "', wip_salto_detras = '" + (!this.detalle.wip_salto_detras ? "N" : this.detalle.wip_salto_detras) + "', reverso_referencia = '" + this.detalle.reverso_referencia + "', lote_inspeccion_clave = '" + this.detalle.lote_inspeccion_clave + "', reverso_permitir = '" + this.detalle.reverso_permitir + "', andon_prorrateado = '" + this.detalle.andon_prorrateado + "', carrusel_oee = " + this.detalle.carrusel_oee + ", carrusel_tiempo = " + +this.detalle.carrusel_tiempo + ", mostrar_numero = '" + this.detalle.mostrar_numero + "', confirmar_mensaje_mantto = '" + this.detalle.confirmar_mensaje_mantto + "', usar_clave_falla = '" + this.detalle.usar_clave_falla + "', audios_resolucion = '" + this.detalle.audios_resolucion + "', audios_escalamiento = " + this.detalle.audios_escalamiento + ", accion_mmcall = '" + this.detalle.accion_mmcall + "', be_alarmas_correos = '" + this.detalle.be_alarmas_correos + "', be_alarmas_llamadas = '" + this.detalle.be_alarmas_llamadas + "', be_alarmas_mmcall = '" + this.detalle.be_alarmas_mmcall + "', be_alarmas_sms = '" + this.detalle.be_alarmas_sms + "', be_envio_reportes = '" + this.detalle.be_envio_reportes + "', be_revision_arduino = '" + this.detalle.be_revision_arduino + "', be_revision_correos = '" + this.detalle.be_revision_correos + "', be_revision_mmcall = '" + this.detalle.be_revision_mmcall + "', confirmar_reparacion = '" + this.detalle.confirmar_reparacion + "', correo_clave = '" + this.detalle.correo_clave + "', correo_cuenta = '" + this.detalle.correo_cuenta + "', correo_host = '" + this.detalle.correo_host + "', correo_puerto = '" + this.detalle.correo_puerto + "', correo_ssl = '" + this.detalle.correo_ssl + "', escape_accion = '" + this.detalle.escape_accion + "', escape_lista = " + this.detalle.escape_lista + ", escape_llamadas = '" + this.detalle.escape_llamadas + "', escape_mensaje = '" + this.detalle.escape_mensaje + "', escape_mensaje_propio = '" + this.detalle.escape_mensaje_propio + "', gestion_meses = " + this.detalle.gestion_meses + ", licencia = '" + this.detalle.licencia + "', limitar_inicio = " + this.detalle.limitar_inicio + ", limitar_respuestas = " + this.detalle.limitar_respuestas + ", logo_alto = " + this.detalle.logo_alto + ", logo_ancho = " + this.detalle.logo_ancho + ", logo_arriba = " + this.detalle.logo_arriba + ", logo_izquierda = " + this.detalle.logo_izquierda + ", logo_ruta = '" + this.detalle.logo_ruta + "', mantener_prioridad = '" + this.detalle.mantener_prioridad + "', mapa_alineacion = '" + mapa_alineacion + "', mapa_fondo = '" + mapa_fondo + "', optimizar_correo = '" + this.detalle.optimizar_correo + "', optimizar_llamada = '" + this.detalle.optimizar_llamada + "', optimizar_mmcall = '" + this.detalle.optimizar_mmcall + "', optimizar_sms = '" + this.detalle.optimizar_sms + "', planta = '" + this.detalle.planta + "', puerto_comm1 = '" + this.detalle.puerto_comm1 + "', puerto_comm1_par = '" + this.detalle.puerto_comm1_par + "', puerto_comm2 = '" + this.detalle.puerto_comm2 + "', puerto_comm2_par = '" + this.detalle.puerto_comm2_par + "', recuperar_sesion = '" + this.detalle.recuperar_sesion + "', ver_reportes_final = '" + this.detalle.ver_reportes_final + "', permitir_multiples_reportes = '" + this.detalle.permitir_multiples_reportes + "', permitir_afectacion = '" + (!this.detalle.permitir_afectacion ? "N" : this.detalle.permitir_afectacion) + "', atencion_llamada = '" + (!this.detalle.atencion_llamada ? "N" : this.detalle.atencion_llamada) + "', rfc = '" + this.detalle.rfc + "', ruta_archivos_enviar = '" + ruta_archivos_enviar + "', ruta_audios = '" + ruta_audios + "', ruta_programa_mapa = '" + ruta_programa_mapa + "', ip_localhost = '" + this.detalle.ip_localhost + "', ruta_sms = '" + ruta_sms + "', tiempo_reporte = " + this.detalle.tiempo_reporte + ", timeout_llamadas = " + this.detalle.timeout_llamadas + ", timeout_sms = " + this.detalle.timeout_sms + ", mapa_delay = " + this.detalle.mapa_delay + ", ver_nombre_planta = '" + this.detalle.ver_nombre_planta + "', mapa_rotacion = " + this.detalle.mapa_rotacion + ", traducir = '" + this.detalle.traducir + "', url_mmcall = '" + this.detalle.url_mmcall + "', utilizar_arduino = '" + this.detalle.utilizar_arduino + "', veces_reproducir = " + +this.detalle.veces_reproducir + ", voz_predeterminada = '" + this.detalle.voz_predeterminada + "', tema_principal = " + +this.detalle.tema_principal + ", tema_permitir_crear = '" + this.detalle.tema_permitir_crear + "', tema_permitir_cambio = '" + this.detalle.tema_permitir_cambio + "', turno_modo = '" + this.detalle.turno_modo + "', audios_activar = '" + this.detalle.audios_activar + "', audios_ruta = '" + audios_ruta + "', audios_prefijo = '" + audios_prefijo + "', ver_ayuda = '" + this.detalle.ver_ayuda + "', audios_externos = '" + this.detalle.audios_externos + "', audios_externos_carpeta = '" + audios_extenos + "', audios_externos_modo = " + +this.detalle.audios_externos_modo + ", mensaje = '" + this.detalle.mensaje + "', finalizar_sesion = " + +this.detalle.finalizar_sesion + ", tiempo_andon = " + +this.detalle.tiempo_andon  + ", audios_externos_pausa = " + this.detalle.audios_externos_pausa  + ", tiempo_audios = " + this.detalle.tiempo_audios  + ", audio_rate = " + this.detalle.audio_rate  + ", bajo_hasta = " + this.detalle.bajo_hasta  + ", medio_hasta = " + this.detalle.medio_hasta  + ", bajo_etiqueta = '" + this.detalle.bajo_etiqueta + "', medio_etiqueta = '" + this.detalle.medio_etiqueta + "', alto_etiqueta = '" + this.detalle.alto_etiqueta + "', bajo_color = '" + bajo_color + "', medio_color = '" + medio_color + "', alto_color = '" + alto_color + "', ver_logo_cronos = '" + this.detalle.ver_logo_cronos + "', url_cronos = '" + this.detalle.url_cronos + "', fallas_plc = '" + this.detalle.fallas_plc + "', pagers_val = '" + this.detalle.pagers_val + "', hibrido_mostrar_reparacion = '" + this.detalle.hibrido_mostrar_reparacion + "', hibrido_alarmar_ubicacion = '" + this.detalle.hibrido_alarmar_ubicacion + "', hibrido_alarmar_reparacion = '" + this.detalle.hibrido_alarmar_reparacion + "', area_change = " + this.detalle.area_change + ", tipo_change = " + this.detalle.tipo_change + ";";
      let campos = {accion: 200, sentencia: sentencia};
      this.servicio.consultasBD(campos).subscribe( resp =>
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

        sentencia = sentencia + ";DELETE FROM " + this.servicio.rBD() + ".disponibilidad WHERE maquina = 0 AND linea = 0;INSERT INTO " + this.servicio.rBD() + ".disponibilidad (linea, maquina, lunes, martes, miercoles, jueves, viernes, sabado, domingo) VALUES(0, 0, " + +this.disponibilidad.lunes + ", " + +this.disponibilidad.martes + ", " + +this.disponibilidad.miercoles + ", " + +this.disponibilidad.jueves + ", " + +this.disponibilidad.viernes + ", " + +this.disponibilidad.sabado + ", " + +this.disponibilidad.domingo + ");";
        if (this.detalle.tema_principal > 0)
        {
          sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".pu_colores SET obligatorio = 'N';UPDATE " + this.servicio.rBD() + ".pu_colores SET obligatorio = 'S' WHERE id = " + +this.detalle.tema_principal;
        }
        let campos = {accion: 200, sentencia: sentencia};
        this.servicio.consultasBD(campos).subscribe( resp =>
        {})
        this.boton01 = false;
        this.boton02 = false;
        this.bot4Sel = false;
        this.lineaSel = false;
        this.servicio.refrescarLogo.emit(true);
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[3203];
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        this.servicio.configurando.emit(true);
      })
    }
  else
    {
      let sentencia = "INSERT INTO " + this.servicio.rBD() + ".licencias (tipo, mmcall, cronos, inicio, licenciado) VALUES ('" + this.tipo + "', '" + this.local + "', '" + this.licencia + "', NOW(), NOW());";
      let campos = {accion: 200, sentencia: sentencia};
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        this.licencia = "";
        this.local = "";
        this.clavePublica = "";
        setTimeout(() => {
          this.txtT1.nativeElement.focus();  
        }, 100);
        
        this.llenarLicencias()
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[3204];
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        this.servicio.configurando.emit(true);
      })
    }
  }

  selectionChange(event){
    console.log('selection changed using keyboard arrow');
  }

  
  onFileSelected(event)
  {
    this.boton01 = true;
    this.boton02 = true;
    this.editando = true;
    const fd = new FormData();
    fd.append('imagen', event.target.files[0], event.target.files[0].name);
    this.editando = true;
    this.faltaMensaje = this.servicio.rTraduccion()[134]
    this.cancelarEdicion = false;
    this.mensajeImagen = this.servicio.rTraduccion()[358]
    this.detalle.logo_ruta = this.URL_IMAGENES + event.target.files[0].name;
    this.faltaMensaje = this.servicio.rTraduccion()[134]
    this.detalle.modificacion = null;
    this.detalle.modificado = "";
    this.cancelarEdicion = false;
        

    /** In Angular 5, including the header Content-Type can invalidate your request */
    this.http.post(this.URL_BASE, fd)
    .subscribe(res => {
      console.log(this.URL_BASE);
      console.log(res);
      
        this.faltaMensaje = this.servicio.rTraduccion()[134]
        this.detalle.modificacion = null;
        this.detalle.modificado = "";
        this.cancelarEdicion = false;
        this.mostrarImagenRegistro = "S";
        this.mensajeImagen = this.servicio.rTraduccion()[358]

        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[3205];
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      })
  }

cambiando(evento: any)
  {

    if (!this.editando)
    {
      this.boton01 = true;
      this.boton02 = true;
      this.editando = true;
      this.faltaMensaje = this.servicio.rTraduccion()[134]
      this.detalle.modificacion = null;
      this.detalle.modificado = "";
      this.cancelarEdicion = false;
    }
    if (evento.target)
    {
      if (evento.target.name)
      {
        if (evento.target.name == "imagen")
        {
          this.detalle.mostrarImagen = "S";
          this.mensajeImagen = this.servicio.rTraduccion()[358]
        }
      }
    }
  }

  

  edicionCancelada()
  {
    this.tipo = "B";
    this.local = "";
    this.licencia = "";
    this.clavePublica = "";
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = this.servicio.rTraduccion()[1388];
    mensajeCompleto.tiempo = 2000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
  }

  cancelar()
  {
    if (this.boton01)
    {
      this.bot4Sel = false;

      this.edicionCancelada();
      this.rConfiguracion()
      }
    }

    llenarListas(arreglo: number, nTabla: string, cadWhere: string)
  {
    let sentencia = "SELECT id, nombre FROM " + nTabla + " " + cadWhere + " ORDER BY nombre";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.listas = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  
  llenarLicencias()
  {
    this.licencias = [];
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".licencias ORDER BY licenciado DESC";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.licencias = resp;
      }
      this.servicio.mensajeInferior.emit(this.licencias.length == 0 ? this.servicio.rTraduccion()[3206] : this.licencias.length + this.servicio.rTraduccion()[3207]); 
    }, 
    error => 
      {
        console.log(error)
      })
  }



  llenarEventos()
  {
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

    let sentencia = "SELECT id, nombre, monitor, alerta, revision FROM " + this.servicio.rBD() + ".int_eventos " + filtroTabla + " ORDER BY alerta";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.eventos = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  llenarTemas()
  {
    this.temas = [];
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".pu_colores WHERE personalizada = 'N' AND estatus = 'A' ORDER BY id";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        
        this.temas = resp
        
      }
    }, 
    error => 
      {
        console.log(error)
      })
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

  actualizarMapa()
  {

    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3208], mensaje: this.servicio.rTraduccion()[3209], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3210], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_mapa" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        
        if (result.accion == 1) 
        {
          const respuesta = this.dialogo.open(SesionComponent, 
          {
            width: "400px", panelClass: 'dialogo_atencion', data: { tiempo: 10, sesion: 1, rolBuscar: "A", opcionSel: 0, idUsuario: 0, usuario: "", clave: "", titulo: this.servicio.rTraduccion()[3193], mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[122], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_sesion" }
          });
          respuesta.afterClosed().subscribe(result => 
          {
            if (result)
            {
              if (result.accion == 1) 
              {
                let sentencia = "UPDATE " + this.servicio.rBD() + ".configuracion SET mapa_solicitud = 'S'";
                let campos = {accion: 200, sentencia: sentencia};
                this.servicio.consultasBD(campos).subscribe( resp =>
                {
                  let mensajeCompleto: any = [];
                  mensajeCompleto.clase = "snack-error";
                  mensajeCompleto.mensaje = this.servicio.rTraduccion()[3211];
                  mensajeCompleto.tiempo = 2000;
                  this.servicio.mensajeToast.emit(mensajeCompleto);
                })
              }
              else
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[3212];
                mensajeCompleto.tiempo = 2000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
            }
            else
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[3212];
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
      
          })
        }        
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[3212];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[3212];
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  reiniciar()
  {

    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3483], mensaje: this.servicio.rTraduccion()[3484], id: 0, accion: 0, tiempo: 0, botones: 3, boton1STR: this.servicio.rTraduccion()[3485], boton2STR: this.servicio.rTraduccion()[3486], icono1: "i_eliminar", boton3STR: this.servicio.rTraduccion()[77], icono2: "i_eliminar", icono3: "i_cancelar", icono0: "i_mapa" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        this.opcionBorrar = result.accion; 
        
        if (result.accion != 3) 
        {
          const respuesta = this.dialogo.open(SesionComponent, 
          {
            width: "400px", panelClass: 'dialogo_atencion', data: { tiempo: 10, sesion: 1, rolBuscar: "A", opcionSel: 0, idUsuario: 0, usuario: "", clave: "", titulo: this.servicio.rTraduccion()[3193], mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[122], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_sesion" }
          });
          respuesta.afterClosed().subscribe(result => 
          {
            if (result)
            {
              if (this.opcionBorrar == 2) 
              {
                let sentencia = "DELETE FROM " + this.servicio.rBD() + ".alarmas;DELETE FROM " + this.servicio.rBD() + ".temporal_mmcall;DELETE FROM " + this.servicio.rBD() + ".temporal_plc;DELETE FROM " + this.servicio.rBD() + ".licencias;ALTER TABLE " + this.servicio.rBD() + ".alarmas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".calidad_historia;ALTER TABLE " + this.servicio.rBD() + ".calidad_historia AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cargas;ALTER TABLE " + this.servicio.rBD() + ".cargas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".causa_raiz;ALTER TABLE " + this.servicio.rBD() + ".causa_raiz AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".consultas_be;ALTER TABLE " + this.servicio.rBD() + ".consultas_be AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".consultas_cab;ALTER TABLE " + this.servicio.rBD() + ".consultas_cab AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".consultas_det;ALTER TABLE " + this.servicio.rBD() + ".consultas_det AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".control;ALTER TABLE " + this.servicio.rBD() + ".control AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".control_listas;ALTER TABLE " + this.servicio.rBD() + ".control_listas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".detalleparos;ALTER TABLE " + this.servicio.rBD() + ".detalleparos AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".detallerechazos;ALTER TABLE " + this.servicio.rBD() + ".detallerechazos AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".equipos_objetivo;ALTER TABLE " + this.servicio.rBD() + ".equipos_objetivo AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".estimados;ALTER TABLE " + this.servicio.rBD() + ".estimados AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".horarios;ALTER TABLE " + this.servicio.rBD() + ".horarios AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lecturas;ALTER TABLE " + this.servicio.rBD() + ".lecturas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lecturas_cortes;ALTER TABLE " + this.servicio.rBD() + ".lecturas_cortes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lecturas_resumen;ALTER TABLE " + this.servicio.rBD() + ".lecturas_resumen AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".log;ALTER TABLE " + this.servicio.rBD() + ".log AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lotes;ALTER TABLE " + this.servicio.rBD() + ".lotes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lotes_cambiados;ALTER TABLE " + this.servicio.rBD() + ".lotes_cambiados AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lotes_historia;ALTER TABLE " + this.servicio.rBD() + ".lotes_historia AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".mensajes;ALTER TABLE " + this.servicio.rBD() + ".mensajes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".mensajes_procesados;ALTER TABLE " + this.servicio.rBD() + ".mensajes_procesados AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".paros;ALTER TABLE " + this.servicio.rBD() + ".paros AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".piezasxminuto;ALTER TABLE " + this.servicio.rBD() + ".piezasxminuto AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".prioridades;ALTER TABLE " + this.servicio.rBD() + ".prioridades AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".programacion;ALTER TABLE " + this.servicio.rBD() + ".programacion AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".reportes;ALTER TABLE " + this.servicio.rBD() + ".reportes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".ruta_congelada;ALTER TABLE " + this.servicio.rBD() + ".ruta_congelada AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".sentencias;ALTER TABLE " + this.servicio.rBD() + ".sentencias AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".temporal_mmcall;ALTER TABLE " + this.servicio.rBD() + ".temporal_mmcall AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".traduccion;ALTER TABLE " + this.servicio.rBD() + ".traduccion AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".traduccion_literales;ALTER TABLE " + this.servicio.rBD() + ".traduccion_literales AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".traduccion_when;ALTER TABLE " + this.servicio.rBD() + ".traduccion_when AUTO_INCREMENT = 1;";
                let campos = {accion: 200, sentencia: sentencia};
                this.servicio.consultasBD(campos).subscribe( resp =>
                {
                  let mensajeCompleto: any = [];
                  mensajeCompleto.clase = "snack-error";
                  mensajeCompleto.mensaje = this.servicio.rTraduccion()[3487];
                  mensajeCompleto.tiempo = 2000;
                  this.servicio.mensajeToast.emit(mensajeCompleto);
                })
              }
              else if (this.opcionBorrar == 1) 
              {
                let sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_lineas;DELETE FROM " + this.servicio.rBD() + ".licencias;ALTER TABLE " + this.servicio.rBD() + ".cat_lineas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_maquinas;ALTER TABLE " + this.servicio.rBD() + ".cat_maquinas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_areas;ALTER TABLE " + this.servicio.rBD() + ".cat_areas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_fallas;ALTER TABLE " + this.servicio.rBD() + ".cat_fallas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id > 5;ALTER TABLE " + this.servicio.rBD() + ".cat_usuarios AUTO_INCREMENT = 6;DELETE FROM " + this.servicio.rBD() + ".cat_alertas;ALTER TABLE " + this.servicio.rBD() + ".cat_alertas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_correos;ALTER TABLE " + this.servicio.rBD() + ".cat_correos AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_generales;ALTER TABLE " + this.servicio.rBD() + ".cat_generales AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_partes;ALTER TABLE " + this.servicio.rBD() + ".cat_partes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_paros;ALTER TABLE " + this.servicio.rBD() + ".cat_paros AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_procesos;ALTER TABLE " + this.servicio.rBD() + ".cat_procesos AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_rutas;ALTER TABLE " + this.servicio.rBD() + ".cat_rutas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_situaciones;ALTER TABLE " + this.servicio.rBD() + ".cat_situaciones AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_tripulacion;ALTER TABLE " + this.servicio.rBD() + ".cat_tripulacion AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_variables;ALTER TABLE " + this.servicio.rBD() + ".cat_variables AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cat_turnos;ALTER TABLE " + this.servicio.rBD() + ".cat_turnos AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".alarmas;ALTER TABLE " + this.servicio.rBD() + ".alarmas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".calidad_historia;ALTER TABLE " + this.servicio.rBD() + ".calidad_historia AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".cargas;ALTER TABLE " + this.servicio.rBD() + ".cargas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".causa_raiz;ALTER TABLE " + this.servicio.rBD() + ".causa_raiz AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".consultas_be;ALTER TABLE " + this.servicio.rBD() + ".consultas_be AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".consultas_cab;ALTER TABLE " + this.servicio.rBD() + ".consultas_cab AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".consultas_det;ALTER TABLE " + this.servicio.rBD() + ".consultas_det AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".control;ALTER TABLE " + this.servicio.rBD() + ".control AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".control_listas;ALTER TABLE " + this.servicio.rBD() + ".control_listas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".detalleparos;ALTER TABLE " + this.servicio.rBD() + ".detalleparos AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".detallerechazos;ALTER TABLE " + this.servicio.rBD() + ".detallerechazos AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".equipos_objetivo;ALTER TABLE " + this.servicio.rBD() + ".equipos_objetivo AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".estimados;ALTER TABLE " + this.servicio.rBD() + ".estimados AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".horarios;ALTER TABLE " + this.servicio.rBD() + ".horarios AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lecturas;ALTER TABLE " + this.servicio.rBD() + ".lecturas AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lecturas_cortes;ALTER TABLE " + this.servicio.rBD() + ".lecturas_cortes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lecturas_resumen;ALTER TABLE " + this.servicio.rBD() + ".lecturas_resumen AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".log;ALTER TABLE " + this.servicio.rBD() + ".log AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lotes;ALTER TABLE " + this.servicio.rBD() + ".lotes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lotes_cambiados;ALTER TABLE " + this.servicio.rBD() + ".lotes_cambiados AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".lotes_historia;ALTER TABLE " + this.servicio.rBD() + ".lotes_historia AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".mensajes;ALTER TABLE " + this.servicio.rBD() + ".mensajes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".mensajes_procesados;ALTER TABLE " + this.servicio.rBD() + ".mensajes_procesados AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".paros;ALTER TABLE " + this.servicio.rBD() + ".paros AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".piezasxminuto;ALTER TABLE " + this.servicio.rBD() + ".piezasxminuto AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".prioridades;ALTER TABLE " + this.servicio.rBD() + ".prioridades AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".programacion;ALTER TABLE " + this.servicio.rBD() + ".programacion AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".reportes;ALTER TABLE " + this.servicio.rBD() + ".reportes AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".ruta_congelada;ALTER TABLE " + this.servicio.rBD() + ".ruta_congelada AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".sentencias;ALTER TABLE " + this.servicio.rBD() + ".sentencias AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".temporal_mmcall;ALTER TABLE " + this.servicio.rBD() + ".temporal_mmcall AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".traduccion;ALTER TABLE " + this.servicio.rBD() + ".traduccion AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".traduccion_literales;ALTER TABLE " + this.servicio.rBD() + ".traduccion_literales AUTO_INCREMENT = 1;DELETE FROM " + this.servicio.rBD() + ".traduccion_when;ALTER TABLE " + this.servicio.rBD() + ".traduccion_when AUTO_INCREMENT = 1;";
                let campos = {accion: 200, sentencia: sentencia};
                this.servicio.consultasBD(campos).subscribe( resp =>
                {
                  let mensajeCompleto: any = [];
                  mensajeCompleto.clase = "snack-error";
                  mensajeCompleto.mensaje = this.servicio.rTraduccion()[3487];
                  mensajeCompleto.tiempo = 2000;
                  this.servicio.mensajeToast.emit(mensajeCompleto);
                })
              }
              else
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381];
                mensajeCompleto.tiempo = 2000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
            }
            else
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381];
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
      
          })
        }        
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381];
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  licenciar()
  {

    const respuesta = this.dialogo.open(LicenciaComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { accion: 0  }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result.accion==1)
      {
        this.licenciado = true;
      }  
    })
  }

  alterarPalabraClave()
  {
    let nvaPalabra = ""
    let palabraNueva = "ElViS"
    let ciclo = 0;
    for (var i = 0; i < this.palabraClave.length; i++) 
    {
      
      if (i > 0 && i % 5 == 0)
      {
        nvaPalabra = nvaPalabra + palabraNueva[ciclo];
        ciclo = ciclo + 1
      }
      else
      {
        nvaPalabra = nvaPalabra + this.palabraClave[i];
      }
    } 
    return nvaPalabra;  
  }

  generarClave()
  {
    if (!this.local)
    {
      this.clavePublica = "";
      return;
    }
    else if (this.local == "")
    {
      this.clavePublica = "";
      return;
    }

    this.clavePublica = "";
    let claveInterna = this.alterarPalabraClave();
    let temporal = "";
    let temporal2 = "";
    let numero = "";
    let numero2 = 0;
    let buscarEn = 0;
    let posicion = 0;
    let numeroActual = 0;
    let recorrido = 0;
    if (claveInterna.length > this.local.length)
    
    {
      temporal = "";
      temporal2 = claveInterna;
      
      do
      {
        if (recorrido >= this.clave.length)
        {
          recorrido = 0;
        }
        numero = this.local[recorrido % this.local.length].charCodeAt(0).toString();
        numero2 = +this.clave[recorrido];

        if (numero.length == 1)
        {
          buscarEn = +numero;
          numeroActual = 0;  
        }
        else if (numero.length == 2)
        {
          let numero1 = +numero.substr(0, 1);
          let numero2 = +numero.substr(1);  
          if (numeroActual == 0)
          {
            buscarEn = numero1;
            numeroActual = 1;  
          }
          else
          {
            buscarEn = numero2;
            numeroActual = 0;  
          }
          posicion = numero1 + numero2 + recorrido;
        }
        else if (numero.length == 3)
        {
          let numero1 = +numero.substr(0, 1);
          let numero2 = +numero.substr(1, 1);  
          let numero3 = +numero.substr(2);  
          if (numeroActual == 0)
          {
            buscarEn = numero1;
            numeroActual = 1;  
          }
          else if (numeroActual == 1)
          {
            buscarEn = numero2;
            numeroActual = 2;  
          }
          else 
          {
            buscarEn = numero3;
            numeroActual = 0;  
          }
          posicion = numero1 + numero2 + numero3 + recorrido;
        }
        posicion = posicion + numero2;
        if (posicion > this.clave.length - 1)
        {
          posicion = posicion % this.clave.length
        }
        temporal = (temporal. length == 0 ? this.tipo : "") + temporal + this.clave[posicion];  
        recorrido = recorrido + 1;
      }
      while (temporal.length < claveInterna.length)
      temporal = temporal.substr(0, claveInterna.length);
    }
    else if (claveInterna.length == this.local.length)
    {
      temporal = this.local;
      temporal2 = claveInterna;
    }
    
    else if (this.local.length > claveInterna.length)
    {
      temporal = this.local;
      temporal2 = claveInterna;
      do
      {
        temporal2 = temporal2 + claveInterna;  
      }
      while (temporal2.length < this.local.length)
      temporal2 = temporal2.substr(0, this.local.length);
    }
    let cadComparar = "";
    for (var i = 0; i < temporal.length; i++) 
      {
        let numero = (temporal[i].charCodeAt(0) ^ temporal2[i].charCodeAt(0)).toString();
        if (numero. length == 1)
        {
          cadComparar = numero;
        }
        else if (numero.length == 2)
        {
          cadComparar = numero.substr(1);
        }
        else if (numero.length == 3)
        {
          cadComparar = numero.substr(1, 1);
        }
        this.clavePublica = this.clavePublica + cadComparar; 
      }
  }

  colores()
  {
    const respuesta = this.dialogo.open(TemasComponent, {
      width: "560px", panelClass: 'dialogo_atencion', data: { titulo: "", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[3207], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_mapa" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        if (result.accion == 1) 
        {

        }
      }
    })
  }

  verLicencia()
  {
    let mensajeTotal = "";
    if (this.servicio.rVersion().vence != "99999999")
    {
      let eFecha = this.servicio.rVersion().vence
      let desde = new Date(eFecha.substr(0, 4) + "/" + eFecha.substr(4, 2) + "/" + eFecha.substr(6, 2));
      if (desde.getTime() === desde.getTime())
      {
        let vctoDemo = this.datepipe.transform(desde, this.servicio.rIdioma().fecha_07) 
        let diferencia = ((desde.getTime() - new Date().getTime()) / (1000 * 24 * 60 * 60)).toFixed(0); 
        
        mensajeTotal =  mensajeTotal + "<strong>" + this.servicio.rTraduccion()[3213] + "</strong><br>"
        if (+diferencia == 0)
        {
          mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3214] + ": <strong>HOY</strong><br><br>"
        }
        else if (+diferencia == 1)
        {
          mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3214] + ": <strong>" + this.servicio.rTraduccion()[3231] + "</strong><br><br>"
        }
        else if (+diferencia > 1 && +diferencia <= 5)
        {
          mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3214] + ": <strong>"+ this.servicio.rTraduccion()[3232].replace("campo_0", vctoDemo).replace("campo_1", diferencia) + "</strong><br><br>";
        }
        else if (+diferencia > 5)
        {
          mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3214] + ": <strong>"+ this.servicio.rTraduccion()[3232].replace("campo_0", vctoDemo).replace("campo_1", diferencia) + "</strong><br><br>";
        }
        else
        {
          mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3214] + ": <strong>" + this.servicio.rTraduccion()[3215] + "</strong><br><br>"
        }
      }
      else
      {
        
        mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3214] + ": <strong>" + this.servicio.rTraduccion()[3215] + "</strong><br><br>"
      }
    }
    else
    {
      mensajeTotal =  mensajeTotal + "<strong>" + this.servicio.rTraduccion()[3216] + "</strong><br><br>"
    }
    mensajeTotal = mensajeTotal + this.servicio.rTraduccion()[3217] + ": <strong>" + (this.servicio.rVersion().tipo == 0 ? this.servicio.rTraduccion()[3233] : this.servicio.rVersion().tipo == 1 ? this.servicio.rTraduccion()[3218] : this.servicio.rTraduccion()[612]) + "</strong><br>" + this.servicio.rTraduccion()[3219] + ": <strong>" + (this.servicio.rVersion().almacenamiento == 0 ? this.servicio.rTraduccion()[3220] : this.servicio.rTraduccion()[3221]) + "</strong><br>" + this.servicio.rTraduccion()[3222] + ": <strong>" + (this.servicio.rVersion().plantas == 0 ? this.servicio.rTraduccion()[1892] : this.servicio.rTraduccion()[352]) + "</strong><br>" + this.servicio.rTraduccion()[3223] + ": <strong>" + (this.servicio.rVersion().usuarios == 0 ? this.servicio.rTraduccion()[3224] : this.servicio.rVersion().usuarios == 1 ? "20" : this.servicio.rVersion().usuarios == 2 ? "50" : this.servicio.rVersion().usuarios == 3 ? "100" : "500") + "</strong><br>" + this.servicio.rTraduccion()[3225] + ": <strong>" + (this.servicio.rVersion().maquinas == 0 ? this.servicio.rTraduccion()[3224] : this.servicio.rVersion().maquinas == 1 ? "20" : this.servicio.rVersion().maquinas == 2 ? "50" : this.servicio.rVersion().maquinas == 3 ? "100" : "500") + "</strong><br>";
    mensajeTotal =  mensajeTotal + "<br><strong>" + this.servicio.rTraduccion()[3226] + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[488] + ": <strong>" + (this.servicio.rVersion().modulos[0] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3227] + ": <strong>" + (this.servicio.rVersion().modulos[1] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3228] + ": <strong>" + (this.servicio.rVersion().modulos[2] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3229] + ": <strong>" + (this.servicio.rVersion().modulos[3] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3230] + ": <strong>" + (this.servicio.rVersion().modulos[4] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[536] + ": <strong>" + (this.servicio.rVersion().modulos[5] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3234] + ": <strong>" + (this.servicio.rVersion().modulos[6] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3235] + ": <strong>" + (this.servicio.rVersion().modulos[7] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3236] + ": <strong>" + (this.servicio.rVersion().modulos[8] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[489] + ": <strong>" + (this.servicio.rVersion().modulos[9] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
    mensajeTotal =  mensajeTotal + this.servicio.rTraduccion()[3631] + ": <strong>" + (this.servicio.rVersion().modulos[10] == 1 ? this.servicio.rTraduccion()[1891] : this.servicio.rTraduccion()[1892]) + "</strong><br>";
        
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "400px", panelClass: 'dialogo', data: { titulo: this.servicio.rTraduccion()[3237], tiempo: -1, mensaje: mensajeTotal, alto: "300", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", boton3STR: this.servicio.rTraduccion()[1431], icono3: "i_edicion", icono0: "i_licencia" }
    });
  }

  llenarIdiomas()
  {
    let sentencia = "SELECT id, nombre, icono FROM " + this.servicio.rBD() + ".cat_idiomas WHERE estatus = 'A' ORDER BY id"
    let campos = { accion: 100, sentencia: sentencia };
    this.servicio.consultasBD(campos).subscribe(resp => 
    {
      if (resp.length > 0)
      {
        this.idiomas = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  testMail()
  {
    this.veces_mail = 0
    this.respuesta_mail = "";
    let sentencia = "UPDATE  " + this.servicio.rBD() + ".configuracion SET correo_prueba = 'S', correo_respuesta = NULL"
    let campos = {accion: 200, sentencia: sentencia};
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.revisarRespuesta();
      let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[3457];
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
    })
  }

  revisarRespuesta()
  {
    if (this.veces_mail > 19)
    {
      this.respuesta_mail = this.servicio.rTraduccion()[3456];
      return;
    }
    let sentencia = "SELECT correo_respuesta FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        if (!resp[0].correo_respuesta)
        {
          setTimeout(() => {
          if (this.router.url.substr(0, 11) == "/parametros")
          {
            this.revisarRespuesta()
            this.veces_mail = this.veces_mail + 1; 
          }
          }, 1000);
        }
        else
        {
          this.respuesta_mail = resp[0].correo_respuesta;
          this.veces_mail = 20;
        }
      }
    })
  }

  inicializar()
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[3503], mensaje: this.servicio.rTraduccion()[3504], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[553], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_licencia" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {      
        if (result.accion == 1) 
          {
            let sentencia = "DELETE FROM " + this.servicio.rBD() + ".licencias";
            let campos = {accion: 200, sentencia: sentencia};
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              this.llenarLicencias();
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[3505];
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            })
          }
          else
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381];
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[1381];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
  
      })
  }

}

