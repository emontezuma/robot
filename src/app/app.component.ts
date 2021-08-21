import { Component, ViewChild, AfterContentInit, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconRegistry } from '@angular/material/icon';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ServicioService } from './servicio/servicio.service';
import { SesionComponent } from './sesion/sesion.component';
import { DialogoComponent } from './dialogo/dialogo.component';
import { LicenciaComponent } from './licencia/licencia.component';
import { SnackComponent } from './snack/snack.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [trigger('efecto', [
    state('in', style({ opacity: 1, transform: 'translateY(0px)'})),
    state('out', style({ opacity: 0, transform: 'translateY(10px)'})),
    transition('* <=> *', [
      animate(200)
    ])
  ]), 
  [trigger('iconoMenu', [
    state('cerrado', style({ transform: 'rotate(-180deg)'})),
    state('abierto', style({ transform: 'rotate(0deg)'})),
    transition('* <=> *', [
      animate(200)
    ])
  ])],
  [trigger('iconoPin', [
    state('in', style({ opacity: 1, transform: 'translateY(0px)'})),
    state('out', style({ opacity: 0, transform: 'translateY(10px)'})),
    transition('in <=> out', [
      animate(200)
    ])
  ])],
  ]
})

export class AppComponent implements AfterContentInit {
    
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    
    this.calcularPantalla()    
  }


  
//elvis wip
cadenaEscaneada: string = "";
cadenaEscaneadaPrint:string = "";
conEscaner: boolean = false;
poner: boolean = false;

//

logo_alto: string = "250";
logo_ancho: string = "250";
logo_arriba: string = "8";
logo_izquierda: string = "10";
opcionSeleccionada: any;

sinConexion: boolean = false;
pinEfecto: string = "in";
verPin: boolean = false;
autenticado: boolean = false;
licenciado: boolean = false;
preguntando: boolean = false;
cadenaVcto: string = "";
mostrarANDON: boolean = false;
mostrarANDONlbl: string = "hidden";

iconoPin: string = "place";
abiertoSN: boolean = false;
abiertoSND: boolean = true;

literalSingular: string = this.servicio.rTraduccion()[37];
literalPlural: string = this.servicio.rTraduccion()[38];
literalSingularArticulo: string = this.servicio.rTraduccion()[39];
mensajePadre: string = "";

verLogo: boolean = true;
urlCronos: string = "";
colorSN: string = "";
logo_ruta: string = "./assets/logo.png";
logoAplicacion: string = "./assets/icons/sigma.png";
seleccion: number = 0;
tEnviados: number = 0;
noLicenciados: number = 0;
clareador;
sufijoEscaner: string = "";
prefijoEscaner: string = "";
largoEscaner: number = 3;
anchoDerecha = 0;

ayuda02: string = "";
ayuda03: string = "";
ayuda04: string = "";
ayuda05: string = "";
ayuda06: string = "";
ayuda07: string = "";
ayuda08: string = "";
ayuda09: string = "";
mBienvenido: string = "";
linea: number = 0;
maquina: number = 0;
area: number = 0;
iconoGeneral: string = "";
registros: any = [];
laSeleccion: any = [];
miSeleccion: number = 1;
afecta_oee: boolean = false;
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
  emit110: Subscription;
  emit120: Subscription;
  emit130: Subscription;
  emit140: Subscription;
  emit150: Subscription;
  emit160: Subscription;
  emit170: Subscription;
  emit180: Subscription;
  emit190: Subscription;
  emit200: Subscription;
  emit210: Subscription;
  emit220: Subscription;
  emit230: Subscription;

direccion: string = "cerrado";
pinDireccion: string = "normal";

mUsuario: boolean = false;
cambiarTema: boolean = true;
cambiarTurno: boolean = true;
turnoActual: string = "";
temaPrincipal: number = 0;
opcionOriginal: number = 0;
hover: boolean = false;
procesando: boolean = false;
hoverp: any = [];

alto_opciones: number = 0;
alto_resto: number = 0;

ayudaInferior: string = "";    
irArribaTT: string = ""
cambioClave: string = ""
cerrarSesion: string = "";
configTT: string  = "";
clave: string  = "";
banderaActual: string  = "";  
posMenu: string = "cerrado";  
botonMenu: boolean = false;  
configuracion: any = [];

miVista: number = 0;
pantalla: number = 0;
verProceso: boolean = false;
modoSN: string = "side";
verIrArriba: boolean = false;
verCronos: boolean = false;
preguntandoInactivacion: boolean = false;
offSet: number;
contadorSeg: number = 59;
cerrar_al_ejecutar: boolean = false;
temaActual: number = 0;
idiomaActual: number = 0;
local: string = "";
  clavePublica: string = "";
  claveInterna: string = "";
  tipo: string = "";
  

actividad;

iconoCronos: string = "./assets/icons/cronos.png";
hora: any =  new Date();
isHandset: boolean = false;
ayudaSuperior: string = "";
ayudaTurno: string = "";

perfilActual: any = [];
temasUsuario: any = [];
idiomas: any = [];
primerNombre: string = "";

estado: string = "";  
version: string = "ROBOT v1.00 23-Ago-2021"
verBarra: boolean = false;
verPie: boolean = true;
iconoHamburguesa: string = "i_menu";
menuHamburguesaTT: string  = "";
cronometro: any;
tiempoLectura: number = 1000;
iniAplicacion: boolean = false;


colorBaseOrigen: string = "B";
colorFondoCbecera = "";
colorBase: string = "#FFFFFF";
colorBarraSuperior: string = "";
colorBotonMenu: string = ""
colorPie: string = "";
colorCuerpo: string = "";
colorLetrasTitulo: string = "";
colorLetrasPanel: string = "";
colorLetrasBox: string = "";
colorFondoCabecera = "";
colorPanelImportante: string = "";
colorLetrasPie: string = "";
colorIconoNormal: string = "";
colorIconoInhabilitado: string = "";
colorFondoLogo: string = "";
colorFondo: string = "";
colorPanel: string = "";
colorTransparente: string = "transparent";
colorFondoMenu: string = "";

  constructor
  (  
    public snackBar: MatSnackBar, 
    public scroll: ScrollDispatcher,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer, 
    private router: Router, 
    private breakpointObserver: BreakpointObserver,
    public servicio: ServicioService,
    public dialog: MatDialog, 
    ) 
    {
    //Iconos propios  
    this.emit00 = this.breakpointObserver.observe(['(min-width: 600px)']).subscribe((estado: BreakpointState)=> {
        this.isHandset = !estado.matches;
        this.servicio.esMovil.emit(this.isHandset);
        if (this.isHandset && this.sidenav.opened)
        {
          this.menuIzquierdo();
        }
      })

      this.emit10 = this.servicio.activarSpinner.subscribe((data: any)=>
      {
        this.verProceso = data
      });

      this.emit20 = this.servicio.activarSpinnerSmall.subscribe((data: any)=>
      {
        this.procesando = data
      });

      this.emit30 = this.servicio.refrescarLogo.subscribe((data: any)=>
      {
        this.mostrarLogo();
      });

      this.emit40 = this.servicio.cambioUsuario.subscribe((data: boolean)=>
      {
        let cadena = this.servicio.rUsuario().nombre.split(' ');
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[3480].replace("campo_0", this.primerNombre).replace("campo_1", cadena[0]);
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        this.primerNombre = cadena[0]
        this.mBienvenido = this.servicio.rTraduccion()[240] + ", " + this.primerNombre;
        this.seleccion = 10;
      });

      this.emit50 = this.servicio.cambioOpcion.subscribe((data: number)=>
      {
        this.seleccion = data;
      });

      this.emit60 = this.servicio.mostrarBmenu.subscribe((accion: number)=>
      {
        this.botonMenu = accion > 0 ;
        if (this.botonMenu)
          {
            this.posMenu = accion == 1 ? "cerrado" : "abierto";
            this.posMenu = (this.posMenu == "cerrado" ? "abierto" : "cerrado");
            this.ayuda07  = (this.posMenu == "abierto" ? this.servicio.rTraduccion()[248] : this.servicio.rTraduccion()[263]);
          }
      });

      this.emit70 = this.servicio.cierreSnack.subscribe((accion: boolean)=>
      {
        if (!accion && this.snackBar)
        {
          this.snackBar.dismiss();
        }
        
      });

      //elvis wip

      this.emit80 = this.servicio.listoEscanear.subscribe((val) => {
        this.conEscaner = val;
    })

    this.emit90 = this.router.events.subscribe((val) => {
      //Se valida que exista el usuario
      if (this.router.url.substr(0, 12) != "/operaciones")
      {
        this.servicio.aEscanear(false);
        this.cadenaEscaneada = "";
        this.cadenaEscaneadaPrint = "";
        if (this.cronometro)
        {
          clearTimeout(this.cronometro); 
        }
      }
      
    })
    this.emit100 = this.servicio.rSesion.subscribe((data: any)=>
      {
        this.recuperarSesion()
      });

      this.emit100 = this.servicio.cSesion.subscribe((data: any)=>
      {
        this.cierreSesion()
      });

      iconRegistry.addSvgIcon('i_enus', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/usa.svg'));
      iconRegistry.addSvgIcon('i_esmx', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mexico.svg'));
      
      iconRegistry.addSvgIcon("pin", sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/pin.svg'));
      iconRegistry.addSvgIcon("desconexion", sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/desconexion.svg'));
      iconRegistry.addSvgIcon("i_variables", sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_variables.svg'));
      iconRegistry.addSvgIcon("i_valores", sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_valores.svg'));
      iconRegistry.addSvgIcon("i_checklist", sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_checklist.svg'));
      iconRegistry.addSvgIcon("i_plan", sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_plan.svg'));
      
      iconRegistry.addSvgIcon('i_menu', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_menu.svg'));
      iconRegistry.addSvgIcon('i_planta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_planta.svg'));
      iconRegistry.addSvgIcon('i_lotes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_lotes.svg'));
      iconRegistry.addSvgIcon('i_procesos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_procesos.svg'));
      iconRegistry.addSvgIcon('i_changes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_changes.svg'));
      iconRegistry.addSvgIcon('i_sensor', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_sensor.svg'));
      iconRegistry.addSvgIcon('i_subir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_subir.svg'));
      iconRegistry.addSvgIcon('i_alertas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_alertas.svg'));
      iconRegistry.addSvgIcon('i_alarmas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_alarmas.svg'));
      iconRegistry.addSvgIcon('i_cerrar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_cerrar.svg'));
      iconRegistry.addSvgIcon('i_user', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_user.svg'));
      iconRegistry.addSvgIcon('i_sesion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_sesion.svg'));
      iconRegistry.addSvgIcon('i_pin', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_pin.svg'));
      iconRegistry.addSvgIcon('i_info', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_info.svg'));
      iconRegistry.addSvgIcon('i_carrusel', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_carrusel.svg'));
      iconRegistry.addSvgIcon('i_mapa', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_mapa.svg'));
      iconRegistry.addSvgIcon('i_produccion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_produccion.svg'));
      iconRegistry.addSvgIcon('i_correos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_correos.svg'));
      iconRegistry.addSvgIcon('i_reloj', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_reloj.svg'));
      iconRegistry.addSvgIcon('i_reloj2', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_reloj2.svg'));
      iconRegistry.addSvgIcon('i_recipiente', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_recipiente.svg'));
      iconRegistry.addSvgIcon('i_mantenimiento', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_mantenimiento.svg'));
      iconRegistry.addSvgIcon('i_nuevo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_nuevo.svg'));
      iconRegistry.addSvgIcon('i_operacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_operacion.svg'));
      iconRegistry.addSvgIcon('i_falla', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_falla.svg'));
      iconRegistry.addSvgIcon('i_lineas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_lineas.svg'));
      iconRegistry.addSvgIcon('i_responsable', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_responsable.svg'));
      iconRegistry.addSvgIcon('i_maquina', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_maquina.svg'));
      iconRegistry.addSvgIcon('i_mmcall', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_mmcall.svg'));
      iconRegistry.addSvgIcon('i_llamada', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_llamada.svg'));
      iconRegistry.addSvgIcon('i_ti', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_ti.svg'));
      iconRegistry.addSvgIcon('i_calidad', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_calidad.svg'));
      iconRegistry.addSvgIcon('i_ingenieria', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_ingenieria.svg'));
      iconRegistry.addSvgIcon('in_cerrar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_cerrar.svg'));
      iconRegistry.addSvgIcon('in_arriba', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_arriba.svg'));
      iconRegistry.addSvgIcon('in_seleccionado', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_seleccionado.svg'));
      iconRegistry.addSvgIcon('in_seleccionado_vacio', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_seleccionado_vacio.svg'));
      iconRegistry.addSvgIcon('in_detener', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_detener.svg'));
      iconRegistry.addSvgIcon('in_pregunta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_pregunta.svg'));
      iconRegistry.addSvgIcon('in_cancelar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_cancelar.svg'));
      iconRegistry.addSvgIcon('in_mensaje', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_mensaje.svg'));
      iconRegistry.addSvgIcon('i_tecnicos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_tecnicos.svg'));
      iconRegistry.addSvgIcon('i_revisando', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_revisando.svg'));
      iconRegistry.addSvgIcon('i_guardar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_guardar.svg'));
      iconRegistry.addSvgIcon('i_ok', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_ok.svg'));
      iconRegistry.addSvgIcon('i_alerta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_alerta.svg'));
      iconRegistry.addSvgIcon('i_password', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_password.svg'));
      iconRegistry.addSvgIcon('i_seleccion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_seleccion.svg'));
      iconRegistry.addSvgIcon('i_ver', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_ver.svg'));
      iconRegistry.addSvgIcon('i_vdetalle', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_vdetalle.svg'));
      iconRegistry.addSvgIcon('i_vcuadro', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_vcuadro.svg'));
      iconRegistry.addSvgIcon('i_horarios', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_horarios.svg'));
      iconRegistry.addSvgIcon('i_grafica', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_grafica.svg'));
      iconRegistry.addSvgIcon('i_salir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_salir.svg'));
      iconRegistry.addSvgIcon('i_andon', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_andon.svg'));
      iconRegistry.addSvgIcon('i_excel', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_excel.svg'));
      iconRegistry.addSvgIcon('i_catalogo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_catalogos.svg'));
      iconRegistry.addSvgIcon('i_operaciones', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_operaciones.svg'));
      iconRegistry.addSvgIcon('i_reportes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_reportes.svg'));
      iconRegistry.addSvgIcon('i_partes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_partes.svg'));
      iconRegistry.addSvgIcon('i_configuracion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_configuracion.svg'));
      iconRegistry.addSvgIcon('i_paleta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_paleta.svg'));
      iconRegistry.addSvgIcon('i_refrescar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_refrescar.svg'));
      iconRegistry.addSvgIcon('i_descargar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_descargar.svg'));
      iconRegistry.addSvgIcon('i_agregar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_add.svg'));
      iconRegistry.addSvgIcon('i_regresar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_regresar.svg'));
      iconRegistry.addSvgIcon('i_inactivar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_inactivar.svg'));
      iconRegistry.addSvgIcon('i_abrir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_abrir.svg'));
      iconRegistry.addSvgIcon('i_editar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_editar.svg'));
      iconRegistry.addSvgIcon('i_editar2', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_editar2.svg'));
      
      iconRegistry.addSvgIcon('i_copiar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_copiar.svg'));
      iconRegistry.addSvgIcon('i_init', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_init.svg'));
      iconRegistry.addSvgIcon('i_eliminar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_eliminar.svg'));
      iconRegistry.addSvgIcon('i_cancelar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_cancelar.svg'));
      iconRegistry.addSvgIcon('i_edicion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_edicion.svg'));
      iconRegistry.addSvgIcon('i_verMenu', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_verMenu.svg'));
      iconRegistry.addSvgIcon('i_cambio', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_cambio.svg'));
      iconRegistry.addSvgIcon('i_cerrarsesion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_cerrarsesion.svg'));
      iconRegistry.addSvgIcon('i_tiempofallas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_tiempofallas.svg'));
      iconRegistry.addSvgIcon('i_tiemporeparacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_tiemporeparacion.svg'));
      iconRegistry.addSvgIcon('i_pareto', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_pareto.svg'));
      iconRegistry.addSvgIcon('i_filtro', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_filtro.svg'));
      iconRegistry.addSvgIcon('i_formato', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_formato.svg'));
      iconRegistry.addSvgIcon('i_izquierda', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_izquierda.svg'));
      iconRegistry.addSvgIcon('i_derecha', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_derecha.svg'));
      iconRegistry.addSvgIcon('i_bajar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_bajar.svg'));
      iconRegistry.addSvgIcon('i_general', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_general.svg'));
      iconRegistry.addSvgIcon('i_parametros', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_parametros.svg'));
      iconRegistry.addSvgIcon('i_grupos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_grupos.svg'));
      iconRegistry.addSvgIcon('i_evento', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_evento.svg'));
      iconRegistry.addSvgIcon('i_traductor', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_traductor.svg'));
      iconRegistry.addSvgIcon('i_turnos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_turnos.svg'));
      iconRegistry.addSvgIcon('i_recuperar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_recuperar.svg'));
      iconRegistry.addSvgIcon('i_politicas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_politicas.svg'));
      iconRegistry.addSvgIcon('i_licencia', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_licencia.svg'));
      iconRegistry.addSvgIcon('i_oee', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_oee.svg'));
      iconRegistry.addSvgIcon('i_hxh', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_hxh.svg'));
      iconRegistry.addSvgIcon('i_inicializar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_inicializar.svg'));
      iconRegistry.addSvgIcon('i_proseguir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_proseguir.svg'));
      iconRegistry.addSvgIcon('i_paro', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_paro.svg'));
      iconRegistry.addSvgIcon('i_fijar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_fijar.svg'));
      iconRegistry.addSvgIcon('i_documento', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_documento.svg'));
      iconRegistry.addSvgIcon('i_rates', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_rates.svg'));
      iconRegistry.addSvgIcon('i_estimados', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_estimados.svg'));
      iconRegistry.addSvgIcon('i_objetivos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_objetivos.svg'));
      iconRegistry.addSvgIcon('i_masivo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_masivo.svg'));
      iconRegistry.addSvgIcon('i_rutas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_rutas.svg'));
      iconRegistry.addSvgIcon('i_situaciones', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_situaciones.svg'));
      iconRegistry.addSvgIcon('i_prioridades', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_prioridades.svg'));
      iconRegistry.addSvgIcon('i_inventario', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_inventario.svg'));
      iconRegistry.addSvgIcon('i_flujo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_flujo.svg'));
      iconRegistry.addSvgIcon('i_programacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_programacion.svg'));
      iconRegistry.addSvgIcon('i_rechazo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_rechazo.svg'));
      iconRegistry.addSvgIcon('i_inspeccion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_inspeccion.svg'));
      this.emit110 = this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
      });
      
      this.emit120 = this.servicio.mensajeSuperior.subscribe((mensaje: any)=>
      {
        this.ayudaSuperior = mensaje
      });
      this.emit130 = this.servicio.mensajeTurno.subscribe((mensaje: any)=>
      {
        this.ayudaTurno = mensaje
      });
      this.emit140 = this.servicio.salir.subscribe((val) => 
      {
        const respuesta = this.dialog.open(DialogoComponent, {
          width: "500px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[284], mensaje: val, id: 0, accion: 0, tiempo: 9, botones: 2, boton1STR:this.servicio.rTraduccion()[285], icono1: "i_licencia", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_salir" }
        });
        respuesta.afterClosed().subscribe(result => 
        {
          if (result)
          {
            if (result.accion == 1)
            {
              const respuesta = this.dialog.open(LicenciaComponent, {
                width: "520px", panelClass: 'dialogo_atencion', data: {  }
              });
              respuesta.afterClosed().subscribe(result => 
              {
                if (result)
                {
                  if (result.accion==2)
                  {
                    this.salida(val);
                    return;
                  }  
                }
                else
                {
                  this.salida(val);
                  return;
                }
              })
            }
            else
            {
              this.salida(val)  
              return;
            }
          }
          else
          {
            this.salida(val)
            return;
          }
        })
        return;
      });
      this.emit150 = this.servicio.vencimiento.subscribe((val: string) => 
      {
        this.licenciado = this.servicio.rLicenciado();
        const respuesta = this.dialog.open(DialogoComponent, {
          width: "500px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[282], mensaje: val.substr(1), id: 0, accion: 0, tiempo: 9, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", icono0: "i_licencia" }
        });
        if (this.servicio.rEsDemo() == 1)
        {
          this.version = "SIGMA D(" + this.servicio.rVctoDemo() + ")"; 
          this.cadenaVcto =  this.servicio.rTraduccion()[283] + this.servicio.rVctoDemo()
        }
        else
        {
          this.cadenaVcto =  "";
        }
      });

      this.emit160 = this.servicio.valida.subscribe((val) => 
      {
        this.licenciado = this.servicio.rLicenciado();
        if (this.servicio.rEsDemo() == 1)
        {
          this.version = "SIGMA D(" + this.servicio.rVctoDemo() + ")";  
          this.cadenaVcto =  this.servicio.rTraduccion()[283] + this.servicio.rVctoDemo()
        }
        else
        {
          this.cadenaVcto =  "";
        }
      });

      this.emit170 = this.router.events.subscribe((val) => {
        //Se valida que exista el usuario
          
        this.servicio.mensajeSuperior.emit("");
          if (this.cronometro)
          {
            clearTimeout(this.cronometro); 
          }
      })

      this.emit180 = this.servicio.sinConexion.subscribe((dato: boolean)=>
      {
        this.sinConexion = dato;
      });

      this.emit190 = this.servicio.mensajeInferior.subscribe((mensaje: any)=>
      {
        var re = new RegExp(String.fromCharCode(160), "g");
        this.ayudaInferior = mensaje.replace(re, " ")
      });
      this.emit200 = this.servicio.configurando.subscribe((mensaje: any)=>
      {
        this.rConfiguracion();
      });
      this.emit210 = this.servicio.mensajeToast.subscribe((mensaje)=>{
        this.toast(mensaje.clase, mensaje.mensaje, mensaje.tiempo)
      });
      this.emit220 = this.servicio.verANDON.subscribe((data: boolean)=>
      {
        this.mostrarANDON = data
      });
      this.emit230 = this.servicio.cambioLM.subscribe((datos)=>
      {
        if ((this.linea != datos.linea || this.maquina != datos.maquina) && this.configuracion.pantalla_mix == 'S')
        {
          this.linea = datos.linea;
          this.maquina = datos.maquina;
          let sentencia = "SELECT a.id, a.nombre, IFNULL(a.url_mmcall, '" + this.servicio.rTraduccion()[8] + "') AS url_mmcall FROM " + this.servicio.rBD() + ".cat_lineas a WHERE a.id = " + this.linea;
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            this.laSeleccion[0] = resp[0].id;
            this.laSeleccion[4] = resp[0].nombre;
            this.laSeleccion[8] = resp[0].url_mmcall;
          });
          sentencia = "SELECT a.id, a.nombre, IFNULL(a.url_mmcall, '" + this.servicio.rTraduccion()[8] + "') AS url_mmcall FROM " + this.servicio.rBD() + ".cat_maquinas a WHERE a.id = " + this.maquina;
          campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            this.laSeleccion[1] = resp[0].id;
            this.laSeleccion[5] = resp[0].nombre;
            this.laSeleccion[9] = resp[0].url_mmcall;
          });
          this.rRegistros(3);
        }         
      });
      this.reloj();
      this.esperar();
      this.calcularPantalla();
      this.accion(0)
    }
  

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.actividad);
    this.esperar();
  }

  esperar() {
    if (!this.configuracion.finalizar_sesion || !this.autenticado || this.configuracion.finalizar_sesion == 0 || this.preguntandoInactivacion)
    {
      return;
    }
    this.actividad = setTimeout(() => this.inactividad(), (this.configuracion.finalizar_sesion < 60 ? 60000 : this.configuracion.finalizar_sesion * 1000) - 10000);
  }

  inactividad()
  {
    this.preguntandoInactivacion = true;
    let adicional: string = "";
    const respuesta = this.dialog.open(DialogoComponent, {
      width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[280], mensaje: this.servicio.rTraduccion()[281].replace("campo_0", this.configuracion.finalizar_sesion), id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[261], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_salir", boton_cancelar: 1 }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      this.preguntandoInactivacion = false;
      if (result)
      {
        if (result.accion == 1) 
        {
          this.cierreSesion()        
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[126].replace("campo_0", this.servicio.rUsuario().nombre);
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[126].replace("campo_0", this.servicio.rUsuario().nombre);
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }


    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) 
  {
    clearTimeout(this.actividad);
    this.esperar();
    if (event.keyCode == 27)
    {
      this.cadenaEscaneada = "" ;
      setTimeout(() => {
        this.cadenaEscaneadaPrint = "" ;
      }, 1000);
      if (this.cronometro)
      {
        clearTimeout(this.cronometro); 
      }
      
      this.servicio.teclaEscape.emit(true);
      this.servicio.aEscapado(false);
    }
    else if (!event.ctrlKey && !event.altKey)
    {
      if (this.servicio.rEscanear() && event.keyCode > 20) 
      {
        if (this.clareador)
        {
          clearTimeout(this.clareador);  
        }
        if (this.cadenaEscaneada.length==0)
        {
          this.cronometro = setTimeout(() => {
          if (this.cadenaEscaneada.length>0)
          {
            let completo: boolean = true;
            if (this.prefijoEscaner)
            {
              completo = this.cadenaEscaneada.substr(0, this.prefijoEscaner.length) == this.prefijoEscaner;
            }
            if (this.sufijoEscaner && completo)
            {
              completo = (this.cadenaEscaneada.length > this.prefijoEscaner.length) && (this.cadenaEscaneada.substr(this.cadenaEscaneada.length - this.sufijoEscaner.length, this.sufijoEscaner.length) == this.sufijoEscaner);
            }
            if (completo)
            {
              completo = this.cadenaEscaneada.length > this.prefijoEscaner.length + this.sufijoEscaner.length
            }
            if (completo)
            {
              completo = this.largoEscaner > 0 && this.cadenaEscaneada.length >= this.largoEscaner || this.largoEscaner == 0   
            }
            if (completo)
            {
              this.servicio.escaneado.emit(this.cadenaEscaneada.substr(this.prefijoEscaner.length, this.cadenaEscaneada.length - this.prefijoEscaner.length - this.sufijoEscaner.length));
            }
            else
            {
              this.cadenaEscaneadaPrint=this.servicio.rTraduccion()[279]
            }
            this.cadenaEscaneada = "";
            this.iniciarImpreso();
          }
          }, this.tiempoLectura);
        }
        this.cadenaEscaneada = this.cadenaEscaneada + String.fromCharCode(event.keyCode);
        this.cadenaEscaneadaPrint = this.cadenaEscaneada;
      }
    }
//



    if (event.ctrlKey  && (event.keyCode == 66 || event.keyCode == 98))
    {
      this.buscar()
    }

    else if (event.shiftKey  && event.keyCode == 117)
    {
      this.servicio.teclaProceso.emit(true);
    }

    else if (event.shiftKey  && event.keyCode == 113)
    {
      this.servicio.teclaResumen.emit(true);
    }

    else if (event.ctrlKey  && event.keyCode == 123)
    {
      this.servicio.verProgramador.emit(true);
    }


    else if (event.keyCode == 119)
    {
      this.verMenu();
    }

    else if (event.keyCode == 118)
    {
      this.cambiarVista()
    }

    else if (event.ctrlKey  && (event.keyCode == 123 || event.keyCode == 123))
    {

    }

    else if (event.keyCode == 113)
    {
      this.menuIzquierdo();
    }
  }
  
  @ViewChild('barraIzquierda', { static: true }) sidenav: MatSidenav;
  @ViewChild('barraDerecha', { static: true }) sidenavD: MatSidenav;
  
  scrollingSubscription: Subscription;
  verMenuSuperior: boolean = true;

  ngAfterContentInit() {
    this.servicio.validarLicencia(1)
    this.estado="in";
    this.router.navigateByUrl('/vacio');
    //this.recuperar(1, 21);
    this.temas(0);    
    this.iniciarAyudas()
    setTimeout(() => {
      this.mostrarANDONlbl = "hidden";
    }, 300);
  }

  iniciarImpreso()
  {
    if (this.cronometro)
    {
      clearTimeout(this.cronometro);  
    }
    this.clareador = setTimeout(() => {
      this.cadenaEscaneadaPrint = "" ;  
      
    }, 2000);
  }


  calcularPantalla()
  {
    this.servicio.aPantalla({ alto: window.innerHeight, ancho: window.innerWidth });
    this.alto_opciones = window.innerHeight - 165;
    if (window.innerWidth <= 600)
    {
      this.isHandset = true;
      this.servicio.esMovil.emit(this.isHandset);
      if (this.sidenav)
      {
        if (this.isHandset && this.sidenav.opened)
        {
          this.menuIzquierdo();
        }
        
      }
    } 
    this.alto_resto = window.innerHeight - (window.innerHeight < 250 ? 94 : 93);
    this.servicio.cambioPantalla.emit(false);
  }

  buscar()
  {
    this.servicio.teclaBuscar.emit(true);
  }

  cambiarVista()
  {     
    this.servicio.teclaCambiar.emit(true);
  }


escapar()
{
  this.buscar()
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
      if (!this.iniAplicacion) {
        this.bTraductor(resp[0].idioma_defecto);
      }
      this.verLogo = resp[0].ver_logo_cronos == "S";     
      this.urlCronos = resp[0].url_cronos;     
      this.logo_ruta = resp[0].logo_ruta; 
      this.tiempoLectura = +resp[0].tiempo_escaner; 
      this.largoEscaner = +resp[0].largo_escaner; 
      this.tiempoLectura = +resp[0].tiempo_escaner; 
      this.sufijoEscaner = resp[0].escaner_sufijo;
      this.prefijoEscaner = resp[0].escaner_prefijo;
      if (!this.logo_ruta)
      {
        this.logo_ruta = "./assets/logo_general.png"
        this.logo_alto  = resp[0].logo_alto;
        this.logo_ancho = resp[0].logo_ancho;
        this.logo_arriba  = resp[0].logo_arriba;
        this.logo_izquierda = resp[0].logo_izquierda;
      }
      else
      {
        this.logo_alto  = resp[0].logo_alto;
        this.logo_ancho = resp[0].logo_ancho;
        this.logo_arriba  = resp[0].logo_arriba;
        this.logo_izquierda = resp[0].logo_izquierda;
      }
      

      this.servicio.aConfig(resp[0]);
      resp[0].check_list = "S";
      this.configuracion = resp[0];
      //this.accion(0);
      this.cambiarTema = resp[0].tema_permitir_cambio == "S"
      this.cambiarTurno = resp[0].turno_modo == 0 && this.servicio.rUsuario().turno == 0
      this.llenarIdiomas()
      if (resp[0].tema_permitir_cambio == "S")
      {
        this.llenarTemas();
      }
      if (+resp[0].tema_principal > 0)
      {
        this.temaPrincipal = resp[0].tema_principal
      }
    }
    
  }, 
  error => 
    {
      console.log(error)
    })
  }


  mostrarLogo()
  {
    
    let sentencia = "SELECT logo_ruta, logo_arriba, logo_ancho, logo_alto, logo_izquierda FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
            
        this.logo_ruta = resp[0].logo_ruta; 
        if (!this.logo_ruta)
        {
          this.logo_ruta = "./assets/logo_general.png"
        }
        this.logo_alto  = resp[0].logo_alto;
        this.logo_ancho = resp[0].logo_ancho;
        this.logo_arriba  = resp[0].logo_arriba;
        this.logo_izquierda = resp[0].logo_izquierda;
      }
      
    }, 
    error => 
      {
        console.log(error)
      })
  }
  
  irArriba() {
    window.requestAnimationFrame(this.irArriba);
    document.querySelector('[cdkScrollable]').scrollTop = 0;    
  }

  miScroll(data: CdkScrollable) {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
     if (scrollTop < 5) {
      this.verIrArriba = false
    }
     else {
      this.verIrArriba = true
    }

    this.offSet = scrollTop;
  }

  getState(outlet){
    return outlet.activatedRouteData.state;
  }
  
  toast(clase: string, mensaje: string, duracion: number) {

    this.snackBar.openFromComponent(SnackComponent, {
      data: {mensaje: mensaje},
      panelClass: [clase],
      duration: duracion
    });

  }

  menuIzquierdo() 
  {
    
    this.sidenav.toggle();
    
    if (!this.sidenav.opened)
    {
      this.servicio.aAnchoSN(0 + this.anchoDerecha);
      this.iconoHamburguesa="i_menu";
      this.menuHamburguesaTT  = this.servicio.rTraduccion()[241];
      this.direccion = "abierto"
      this.pinEfecto = "out";
      setTimeout(() => {
        this.verPin = false;
      }, 200);
    }
    else 
    {
      if (this.modoSN=="side")
      {
        this.servicio.aAnchoSN(300 + this.anchoDerecha);  
      }
      else
      {
        this.servicio.aAnchoSN(0 + this.anchoDerecha);
      }
      this.iconoHamburguesa="i_cerrar";
      this.menuHamburguesaTT  = this.servicio.rTraduccion()[250];
      this.direccion = "cerrado"
      this.verPin = true;
      this.pinEfecto = "in";
    }
    this.servicio.cambioPantalla.emit(!this.sidenav.opened);
  }

    reloj()
    {
      setInterval(() => {
        this.hora = new Date();
        this.servicio.cadaSegundo.emit(true);
        if (this.router.url.substr(0, 11) == "/produccion" && this.configuracion.pantalla_mix=='S' && this.miSeleccion == 3)
        {
          this.revisarANDON()
        }
        this.moverTurno();
      }, 1000);
    }

    revisarANDON()
    {
      let sentencia = "SELECT area, COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".reportes WHERE estatus <= 10 AND maquina = " + +this.maquina + " AND linea = " + +this.linea + " GROUP BY area";
      let campos={accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe(resp =>
      {
        if (resp.length > 0)
        {
          for (var i = 0; i < this.registros.length; i++) 
          {
            let encontrado = false;
            for (var j = 0; j < resp.length; j++) 
            {
              if (this.registros[i].id == resp[j].area)
              {
                encontrado = true
                break;
              }
            }
            if (encontrado && this.registros[i].conFalla == "N")
            {
              this.registros[i].conFalla = "S";
              this.registros[i].nombre = this.registros[i].nombre + " (" + resp[j].cuenta + ")"; 
            }
            else if (!encontrado && this.registros[i].conFalla == "S")
            {
              this.registros[i].conFalla = "N";
              this.registros[i].nombre = this.registros[i].nombreOriginal
            }
          }
        }
        else
        {
          for (var i = 0; i < this.registros.length; i++) 
          {
            this.registros[i].conFalla = "N";
            this.registros[i].nombre = this.registros[i].nombreOriginal
          }
        }
      })
    }

    sugerirTurno(turno: number)
    {
      let titulo = this.servicio.rTraduccion()[276];
      if (this.servicio.rConfig().turno_modo == 1)
      {
        titulo = titulo + this.servicio.rTraduccion()[277];
      }
      else if (this.servicio.rConfig().turno_modo == 2)
      {
        titulo = titulo + this.servicio.rTraduccion()[278];
      }
      const respuesta = this.dialog.open(DialogoComponent, 
      {
        width: "480px", panelClass: 'dialogo', data: { turno: true, mensaje: "", sesion: 1, titulo: titulo, alto: "90", id: turno, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[122], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_turnos" }
      });
      respuesta.afterClosed().subscribe(result => 
      {
        if (result)
        {
          this.preguntando = false;
          if (result.accion == 1) 
          {
            let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_turnos WHERE id = " + result.idTurno;
            let campos={accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe(resp =>
            {
                let miTurno={id: resp[0].id, inicia: resp[0].inicia, termina: resp[0].termina, mover: resp[0].mover, nombre: resp[0].nombre, secuencia: resp[0].secuencia };
                this.servicio.aTurno(miTurno);
                this.turnoActual = resp[0].nombre;
                this.toast('snack-normal', this.servicio.rTraduccion()[274].replace("campo_0", resp[0].nombre), 2000 );
                this.servicio.cambioTurno.emit(true);
            })
          }
          else
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[275];
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
        }
        else
        {
          this.preguntando = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[275];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      });
    }
    
    moverTurno() {
      if (!this.autenticado || this.servicio.rUsuario().rol=="V")
      {
        return;
      }
      if (this.servicio.rUsuario().turno > 0 && this.servicio.rUsuario().turno != this.servicio.rTurno().id)
      {
        let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_turnos WHERE id = " + this.servicio.rUsuario().turno;
        let campos={accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          if (resp.length > 0)
          {
            let miTurno={id: resp[0].id, inicia: resp[0].inicia, termina: resp[0].termina, mover: resp[0].mover, nombre: resp[0].nombre, secuencia: resp[0].secuencia };
            this.servicio.aTurno(miTurno);
            this.turnoActual = resp[0].nombre;
            this.toast('snack-normal', this.servicio.rTraduccion()[274].replace("campo_0", resp[0].nombre), 2000 );
            this.servicio.cambioTurno.emit(true);
          }
        })
        return;
      }
      else if (this.servicio.rUsuario().turno > 0)
      {
        return;
      }
      if (this.servicio.rConfig().turno_modo == 0 && this.servicio.rTurno().id == 0 && this.preguntando) 
      {
        this.preguntando = true;
        this.sugerirTurno(0);
        return;
      }
      if (this.contadorSeg < 5)
      {
        this.contadorSeg = this.contadorSeg + 1;
        return;
      }
      this.contadorSeg = 0;
      //Cada 30 segundos se evaluan algunas cosas
      let hora = this.servicio.fecha(1, "", "HH:mm:ss");
      let tBuscar = this.servicio.rTurno().id;
      let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_turnos WHERE estatus = 'A' AND (inicia <= '" + hora + "' OR termina >= '" + hora + "') AND id <> " + tBuscar + " ORDER BY inicia, termina";
      let campos={accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe((data2: any []) =>
      {
        if (data2) 
        {
          let hayUno = false;
          for (var i = 0; i < data2.length; i++) 
          {
            if (hora >= data2[i].inicia && hora <= data2[i].termina)
            {
              if (this.servicio.rConfig().turno_modo == 3)
              {
                hayUno= true;
                let miTurno={id: data2[i].id, inicia: data2[i].inicia, termina: data2[i].termina, mover: data2[i].mover, nombre: data2[i].nombre, secuencia: data2[i].secuencia };
                this.servicio.aTurno(miTurno);
                this.turnoActual = data2[i].nombre;
                this.toast('snack-normal', this.servicio.rTraduccion()[3529].replace("campo_0", data2[i].nombre), 2000 );
                this.servicio.cambioTurno.emit(true);
              }
              else
              {
                this.sugerirTurno(data2[i].id);
              }
            }
          }
          if (!hayUno)
          {
            for (var i = 0; i < data2.length; i++) 
            {
            if ((hora >= data2[i].inicia || hora <= data2[i].termina) && data2[i].termina < data2[i].inicia)
            {
              if (this.servicio.rConfig().turno_modo == 3)
              {
                hayUno= true;
                let miTurno={id: data2[i].id, inicia: data2[i].inicia, termina: data2[i].termina, mover: data2[i].mover, nombre: data2[i].nombre, secuencia: data2[i].secuencia };
                this.servicio.aTurno(miTurno);
                this.turnoActual = data2[i].nombre;
                this.toast('snack-normal', this.servicio.rTraduccion()[274].replace("campo_0", data2[i].nombre), 2000 );
                this.servicio.cambioTurno.emit(true);
              }
              else
              {
                this.sugerirTurno(data2[i].id);
              }
            }
          }
        }
  }
    });
  }
  
    
cerrarSalir()
{
  if (this.cerrar_al_ejecutar)
    {
      setTimeout(() => {
        this.sidenav.close()
        this.iconoHamburguesa="i_menu";
        this.menuHamburguesaTT  = this.servicio.rTraduccion()[241];
      }, 400);
      
    }
    if (this.pantalla>0)
    {
      let consulta = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET ultima_pantalla = " + this.pantalla + " WHERE id = " + this.servicio.rUsuario().id;
      let campos = {accion: 2000, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      })
    }
}

  irCronos() {
    window.open("http://www.mmcallmexico.mx/  ", "_blank");
  }

recuperar(id: number)
{
  let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id = " + id
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( registro =>
  {
    if (registro && registro.length>0)
      {
        if (registro[0].idioma == 0 || !registro[0].idioma)
        {
          registro[0].idioma = 1;
          if (registro[0].planta_defecto > 0)
          {

            let sentencia = "SELECT idioma FROM " + this.servicio.rBD() + ".cat_plantas WHERE id = " + registro[0].planta_defecto
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( idioma =>
            {
              if (idioma.length > 0)
              {
                this.servicio.aUsuarioIdioma(idioma[0].idioma)
              }
            })
  
          }
        }
        else if (registro[0].idioma != this.idiomaActual)
        {
          this.bTraductor(registro[0].idioma);
        }
      this.servicio.aUsuario(registro[0])
      if (this.servicio.rUsuario().rol=="V")
      {
        let cadena = this.servicio.rUsuario().nombre.split(' ');
        this.primerNombre = cadena[0];
        this.mBienvenido = this.servicio.rTraduccion()[240] + ", " + this.primerNombre;
        

        this.autenticado = true;
        this.continuarOpcion(this.opcionSeleccionada);
    
      }

      else if (registro[0].politica > 0)
        {
          let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".politicas WHERE id = " + registro[0].politica;
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (resp.length > 0)
            {
              this.cambiarTurno = this.configuracion.turno_modo == 0 && this.servicio.rUsuario().turno == 0
              if (resp[0].deunsolouso == "S")
              {
                let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET estatus = 'Y' WHERE id = " + id;
                let campos = {accion: 200, sentencia: sentencia};  
                this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
                  let mensajeCompleto: any = [];
                  mensajeCompleto.clase = "snack-error";
                  mensajeCompleto.mensaje = this.servicio.rTraduccion()[273];
                  mensajeCompleto.tiempo = 2000;
                  this.servicio.mensajeToast.emit(mensajeCompleto);
                })
                this.autenticado = true;
              }
              else if (resp[0].vence == "S")
              {
                let diferencia = ((new Date().getTime() - new Date(registro[0].ucambio).getTime()) / (1000 * 24 * 60 * 60) - 1).toFixed(0) ;
                if ((+diferencia >= +resp[0].diasvencimiento && +resp[0].diasvencimiento > 0) || !registro[0].ucambio)
                {
                  const respuesta = this.dialog.open(DialogoComponent, {
                    width: "460px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[270], mensaje: this.servicio.rTraduccion()[271], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[272], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[261], icono2: "i_salir", icono0: "i_cambio" }
                  });
                  respuesta.afterClosed().subscribe(result => 
                  {
                    if (result)
                    {
                      if (result.accion == 1) 
                      {
                        this.cambiarClave(1);
                      }
                      else
                      {
                        this.cierreSesion();
                      }
                    }
                    else
                    {
                      this.cierreSesion();
                    }
                  })
                }
                else if (((+resp[0].diasvencimiento - (+diferencia)) <= +resp[0].aviso && +resp[0].aviso > 0 && +resp[0].diasvencimiento > 0))
                {
                  const respuesta = this.dialog.open(DialogoComponent, {
                    width: "460px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[267], mensaje: this.servicio.rTraduccion()[268].replace("campo_0", (+resp[0].diasvencimiento - (+diferencia))), id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[269], icono1: "in_seleccionado", boton2STR: "La cambiaré luego", icono2: "i_cancelar", icono0: "i_cambio" }
                  });
                  respuesta.afterClosed().subscribe(result => 
                  {
                    if (result)
                    {
                      if (result.accion == 1) 
                      {
                        this.cambiarClave(1);
                      }
                      else
                      {
                        this.continuarSesion()
                      }
                      
                    }
                    else
                    {
                      this.continuarSesion()
                    }
                    
                  })
                }
                else
                {
                  this.continuarSesion()
                }
                
              }
              else
              {
                this.continuarSesion()
              }
            }
            else
            {
              this.continuarSesion()
            }
          });
        }
        else
        {
          this.continuarSesion()
        }
      }
    })
  }

  continuarSesion()
  {
    this.autenticado = true;
    if (this.servicio.rUsuario().tema && this.servicio.rConfig().tema_permitir_cambio == "S")
    {
      if (this.servicio.rUsuario().tema)
      {
        this.temaPrincipal = this.servicio.rUsuario().tema;
      }
    }

    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET entrada = NOW() WHERE id = " + this.servicio.rUsuario().id;
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{});
      
    
    //this.cTurno = this.cambiarTurno && this.servicio.rUsuario().cerrar_al_ejecutar 
    if (this.servicio.rUsuario().tema && this.cambiarTema)
    {
      this.temas(this.servicio.rUsuario().tema);
    }
    else
    {
      this.temas(0);
    }
    
    let cadena = this.servicio.rUsuario().nombre.split(' ');
    this.primerNombre = cadena[0];
    this.mBienvenido = this.servicio.rTraduccion()[240] + ", " + this.primerNombre;
    this.cerrar_al_ejecutar = this.servicio.rUsuario().cerrar_al_ejecutar == "S";
    //this.verPin = this.cerrar_al_ejecutar;
    this.abiertoSN = !this.cerrar_al_ejecutar;
    this.pinDireccion = (this.cerrar_al_ejecutar ? "normal" : "aplicado");
    this.ayuda03 = (this.pinDireccion == "normal" ? this.servicio.rTraduccion()[252] : this.servicio.rTraduccion()[251]);
    this.modoSN = (this.pinDireccion == "normal" ? "over" : "side");
    this.sidenav.mode = (this.cerrar_al_ejecutar ? "over" : "side");
    this.iconoPin = (this.pinDireccion == "normal" ? "place" : "pin_drop");
    if (this.cerrar_al_ejecutar){
      this.iconoHamburguesa="i_menu";
      this.menuHamburguesaTT  = this.servicio.rTraduccion()[241];
      this.servicio.aAnchoSN(0 + this.anchoDerecha);
      
    }
    else 
    {
      if (this.modoSN=="side")
      {
        this.servicio.aAnchoSN(300 + this.anchoDerecha);  
      }
      else
      {
        this.servicio.aAnchoSN(0 + this.anchoDerecha);
      }
      
      this.iconoHamburguesa="i_cerrar";
      this.menuHamburguesaTT  = this.servicio.rTraduccion()[250];
    }
    this.continuarOpcion(this.opcionSeleccionada);
    this.servicio.cambioPantalla.emit(!this.sidenav.opened);
    this.cerrarSalir();
    if (this.cerrar_al_ejecutar)
    {
      this.sidenav.close();
    }
  }

cambioSN()
{
  this.verBarra = !this.verBarra;
  if (!this.sidenav.opened)
  {
    this.iconoHamburguesa="i_menu";
    this.menuHamburguesaTT  = this.servicio.rTraduccion()[241];
    this.direccion = "abierto"
    this.pinEfecto = "out";
    setTimeout(() => {
      this.verPin = false;
    }, 200);
  }
  else 
  {
    this.iconoHamburguesa="i_cerrar";
    this.menuHamburguesaTT  = this.servicio.rTraduccion()[250];
    this.direccion = "cerrado"
    this.verPin = true;
    this.pinEfecto = "in";
  }
  this.servicio.cambioPantalla.emit(!this.sidenav.opened);
}

cambioSND()
{
  this.verBarra = !this.verBarra;
  if (!this.sidenav.opened)
  {
    this.iconoHamburguesa="i_menu";
    this.menuHamburguesaTT  = this.servicio.rTraduccion()[241];
    this.direccion = "abierto"
    this.pinEfecto = "out";
    setTimeout(() => {
      this.verPin = false;
    }, 200);
  }
  else 
  {
    this.iconoHamburguesa="i_cerrar";
    this.menuHamburguesaTT  = this.servicio.rTraduccion()[250];
    this.direccion = "cerrado"
    this.verPin = true;
    this.pinEfecto = "in";
  }
  this.servicio.cambioPantalla.emit(!this.sidenav.opened);
}

aplicarSN() 
{
  this.iconoPin = (this.pinDireccion == "normal" ? "pin_drop" : "place");
  this.pinDireccion = (this.pinDireccion == "normal" ? "aplicado" : "normal");
  this.ayuda03 = (this.iconoPin == "pin_drop" ? this.servicio.rTraduccion()[251] : this.servicio.rTraduccion()[252]);
  this.modoSN = (this.iconoPin == "pin_drop" ? "side" : "over");
  this.sidenav.mode = (this.iconoPin == "pin_drop" ? "side" : "over");
  if (this.modoSN=="side")
  {
    this.servicio.aAnchoSN(300 + this.anchoDerecha);  
  }
  else
  {
    this.servicio.aAnchoSN(0  + this.anchoDerecha);
  }
  
  
  if (this.autenticado)
  {
    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET cerrar_al_ejecutar = '" + (this.iconoPin == "pin_drop" ? "N" : "S") + "' WHERE id = " + this.servicio.rUsuario().id;
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp => {
      this.cerrar_al_ejecutar = this.iconoPin == "place";
    })
  }
  this.servicio.cambioPantalla.emit(this.sidenav.opened);
}

validarOpcion(opcion: any)
{
  if (this.servicio.rUsuario().id == 0)
  {
    this.validarSesion(opcion)
  }
  else if (opcion.opcion_app == 11 && this.configuracion.atencion_llamada == "S") //Opción de 
  {
    this.validarSesion(opcion)
  }
  else
  {
    if (this.servicio.rUsuario().rol== "A")
    {
      this.continuarOpcion(opcion);
    }
    else
    {
      let optBuscar = opcion.id;
      if (this.opcionOriginal >= 1000 && this.opcionOriginal <= 2000)
      {
        optBuscar = 200;
      }
      let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + this.servicio.rUsuario().id + " AND opcion = " + optBuscar;
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          this.continuarOpcion(opcion);
        }
        else
        {
          this.validarSesion(opcion)
        }
      })
    }
  }
}

validarSesion(opcion: any)
{
  const respuesta = this.dialog.open(SesionComponent, 
    {
      width: "400px", panelClass: 'dialogo', data: { tiempo: 10, directoAlVisor: false, sesion: 1, rolBuscar: "", opcionSel: opcion.id, idUsuario: 0, usuario: "", clave: "", titulo: this.servicio.rTraduccion()[266], mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[122], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_sesion" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        if (result.accion == 1) 
        {
          this.opcionSeleccionada = opcion; 
             
          if (result.directoAlVisor)
          {
            this.opcionSeleccionada = {opcion_app: 20, url: "/visor"};
          }     
          this.recuperar(result.idUsuario);
          
        }
        else 
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[253];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[253];
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    });
  }

accion(opcion: number)
{
  if (+localStorage.getItem("ultimoUsuario") > 0 && this.servicio.rUsuario().id==0)
  {
    this.rConfiguracion();
    this.opcionSeleccionada = {opcion_app: 20, url: "/visor"};
    this.recuperar(+localStorage.getItem("ultimoUsuario"));
    
      return;
  }
  this.opcionOriginal = opcion
  if (opcion == 0) {
    this.rConfiguracion()        
  }
  else
  {
    if (opcion >= 1000 && opcion <= 2000)
    {
      opcion = 21;
    }
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".int_opciones WHERE opcion_app = " + opcion + " AND idioma = " + this.servicio.rIdioma().id;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.validarOpcion(resp[0]);
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[265];
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
      
    });
  }
    
}

continuarOpcion(opcion: any)
{
  if (this.opcionOriginal >= 1000 && this.opcionOriginal <= 2000)
  {
    this.mostrarANDON = false;
    this.mostrarANDONlbl = "hidden";
    this.anchoDerecha = 0; 
  
    this.servicio.aVista(this.opcionOriginal);
    this.seleccion = this.opcionOriginal;
    if (this.router.url != "/graficas")
    {
      this.router.navigateByUrl("/graficas");
    }
    else
    {
      this.servicio.vista.emit(this.opcionOriginal);
    }
    if (this.pinDireccion=="normal")
    {
      setTimeout(() => {
        this.sidenav.close()
        this.iconoHamburguesa="i_menu";
        this.menuHamburguesaTT  = this.servicio.rTraduccion()[241];
      }, 300);
    }
  }
  else
  {
    this.mostrarANDON = opcion.opcion_app == 13 && this.configuracion.pantalla_mix == "S";
    if (opcion.opcion_app == 13)
    {
      this.servicio.aOperador(this.servicio.rUsuario().id)
    }
    
    this.anchoDerecha = (this.mostrarANDON ? 300 : 0)
    this.mostrarANDONlbl = (this.mostrarANDON ? "visible" : "hidden");
    if (this.modoSN=="side")
    {
      this.servicio.aAnchoSN(300 + this.anchoDerecha);  
    }
    else
    {
      this.servicio.aAnchoSN(0 + this.anchoDerecha);
    } 
    this.servicio.cambioPantalla.emit(true);
    this.servicio.aVista(opcion.opcion_app);
    this.seleccion = opcion.opcion_app;
    if (this.router.url != opcion.url)
    {
      this.router.navigateByUrl(opcion.url);
    }
    else
    {
      this.servicio.vista.emit(opcion.opcion_app);
    }
    if (this.pinDireccion=="normal")
    {
      setTimeout(() => {
        this.sidenav.close()
        this.iconoHamburguesa="i_menu";
        this.menuHamburguesaTT  = this.servicio.rTraduccion()[241];
      }, 300);
    }
  }
  
}

 temas(id: number)
{
  let respuesta: any = [];
  let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_colores ORDER BY obligatorio DESC, id LIMIT 1";
  if (id != 0)
  {
    sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_colores WHERE id = " + id;
    
  }
  
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length > 0)
    {
      respuesta = resp[0];
      this.servicio.aTemaActual(resp[0].id);
      this.temaActual = resp[0].id;
      let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET tema = " + id + " WHERE id = " + this.servicio.rUsuario().id;
      let campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      });
      
    }
    else
    {
      respuesta = [];
    }
    this.servicio.aColores(respuesta);
    document.documentElement.style.setProperty("--fondo_total", "#" + this.servicio.rColores().fondo_total);
    document.documentElement.style.setProperty("--fondo_barra_superior", "#" + this.servicio.rColores().fondo_barra_superior);
    document.documentElement.style.setProperty("--fondo_barra_inferior", "#" + this.servicio.rColores().fondo_barra_inferior);
    document.documentElement.style.setProperty("--fondo_aplicacion", "#" + this.servicio.rColores().fondo_aplicacion);
    document.documentElement.style.setProperty("--fondo_seleccion", "#" + this.servicio.rColores().fondo_seleccion);
    document.documentElement.style.setProperty("--fondo_boton", "#" + this.servicio.rColores().fondo_boton);
    document.documentElement.style.setProperty("--fondo_slider", "#" + this.servicio.rColores().fondo_slider);
    document.documentElement.style.setProperty("--fondo_tarjeta", "#" + this.servicio.rColores().fondo_tarjeta);
    document.documentElement.style.setProperty("--fondo_boton_inactivo", "#" + this.servicio.rColores().fondo_boton_inactivo);
    document.documentElement.style.setProperty("--fondo_boton_positivo", "#" + this.servicio.rColores().fondo_boton_positivo);
    document.documentElement.style.setProperty("--fondo_boton_negativo", "#" + this.servicio.rColores().fondo_boton_negativo);
    document.documentElement.style.setProperty("--borde_total", "#" + this.servicio.rColores().borde_total);
    document.documentElement.style.setProperty("--borde_seleccion", "#" + this.servicio.rColores().borde_seleccion);
    document.documentElement.style.setProperty("--borde_hover", "#" + this.servicio.rColores().borde_hover);
    document.documentElement.style.setProperty("--borde_boton", "#" + this.servicio.rColores().borde_boton);
    document.documentElement.style.setProperty("--borde_boton_inactivo", "#" + this.servicio.rColores().borde_boton_inactivo);
    document.documentElement.style.setProperty("--borde_tarjeta", "#" + this.servicio.rColores().borde_tarjeta);
    document.documentElement.style.setProperty("--color_impar", "#" + this.servicio.rColores().color_impar);
    document.documentElement.style.setProperty("--color_par", "#" + this.servicio.rColores().color_par);
    document.documentElement.style.setProperty("--texto_tarjeta", "#" + this.servicio.rColores().texto_tarjeta);
    document.documentElement.style.setProperty("--texto_tarjeta_resalte", "#" + this.servicio.rColores().texto_tarjeta_resalte);
    document.documentElement.style.setProperty("--texto_barra_superior", "#" + this.servicio.rColores().texto_barra_superior);
    document.documentElement.style.setProperty("--texto_barra_inferior", "#" + this.servicio.rColores().texto_barra_inferior);
    document.documentElement.style.setProperty("--texto_boton", "#" + this.servicio.rColores().texto_boton);
    document.documentElement.style.setProperty("--texto_boton_inactivo", "#" + this.servicio.rColores().texto_boton_inactivo);
    document.documentElement.style.setProperty("--texto_boton_positivo", "#" + this.servicio.rColores().texto_boton_positivo);
    document.documentElement.style.setProperty("--texto_boton_negativo", "#" + this.servicio.rColores().texto_boton_negativo);
    document.documentElement.style.setProperty("--texto_seleccion", "#" + this.servicio.rColores().texto_seleccion);
    document.documentElement.style.setProperty("--texto_tiptool", "#" + this.servicio.rColores().texto_tiptool);
    document.documentElement.style.setProperty("--fondo_tiptool", "#" + this.servicio.rColores().fondo_tiptool);
    document.documentElement.style.setProperty("--borde_tiptool", "#" + this.servicio.rColores().borde_tiptool);
    document.documentElement.style.setProperty("--texto_boton_barra", "#" + this.servicio.rColores().texto_boton_barra);
    document.documentElement.style.setProperty("--fondo_boton_barra", "#" + this.servicio.rColores().fondo_boton_barra);
    document.documentElement.style.setProperty("--fondo_logo", "#" + this.servicio.rColores().fondo_logo);
    document.documentElement.style.setProperty("--fondo_snack_normal", "#" + this.servicio.rColores().fondo_snack_normal);
    document.documentElement.style.setProperty("--fondo_snack_error", "#" + this.servicio.rColores().fondo_snack_error);
    document.documentElement.style.setProperty("--texto_snack_normal", "#" + this.servicio.rColores().texto_snack_normal);
    document.documentElement.style.setProperty("--texto_snack_error", "#" + this.servicio.rColores().texto_snack_error);
    document.documentElement.style.setProperty("--texto_solo_texto", "#" + this.servicio.rColores().texto_solo_texto);
    
    
    this.servicio.cambioColor.emit(true);
  }, 
  error => 
    {
      console.log(error)
    })
  
}

recuperarSesion()
{
  if (this.servicio.rConfig().recuperar_sesion=="S" && this.servicio.rUsuarioAnterior()>0)
  {
    this.seleccion = 10;
    this.opcionSeleccionada = {opcion_app: 10, url: "/andon"}; 
    this.recuperar(this.servicio.rUsuarioAnterior())    
  }
  else
  {
    this.primerNombre = "";
    this.mBienvenido = ""; 
    this.ayudaInferior = this.servicio.rTraduccion()[264]
    this.servicio.aUsuario({id: 0, nombre: ''});
    this.estado="in";
    this.router.navigateByUrl('/vacio');
    this.accion(10);   
  }
}

imagenError()
  {
    this.logo_ruta = "./assets/sabic.png"
    this.logo_alto  = "38";
    this.logo_ancho = "76";
    this.logo_arriba  = "10";
    this.logo_izquierda = "2";
  }

verMenu()
{
    this.servicio.mostrarBarra.emit(this.posMenu == "cerrado");
    this.posMenu = (this.posMenu == "cerrado" ? "abierto" : "cerrado");
    this.ayuda07  = (this.posMenu == "abierto" ? this.servicio.rTraduccion()[248] : this.servicio.rTraduccion()[263]);
}

finalizar()
  {
    let adicional: string = "";
    const respuesta = this.dialog.open(DialogoComponent, {
      width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[261], mensaje: this.servicio.rTraduccion()[262], id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[261], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_salir" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        if (result.accion == 1) 
        {
          this.cierreSesion()        
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[126].replace("campo_0", this.servicio.rUsuario().nombre);
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[126].replace("campo_0", this.servicio.rUsuario().nombre);
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  cierreSesion()
  {
    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET salida = NOW(), tema = " + this.servicio.rTemaActual() + ", idioma = " + this.servicio.rIdioma().id + " WHERE id = " + this.servicio.rUsuario().id;
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      let mensajeCompleto: any = [];
      this.servicio.aUsuarioAnterior(0);
      this.servicio.aConsulta(0);
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[125].replace("campo_0", this.servicio.rUsuario().nombre);
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      this.servicio.aUsuario({id: 0, nombre: ''});
      this.primerNombre = "";
      this.mBienvenido = "";
      this.servicio.mensajeError.emit("");
      this.servicio.mensajeInferior.emit("");
      this.servicio.mensajeSuperior.emit("");
      this.router.navigateByUrl('/vacio');
      this.autenticado=false;
      localStorage.setItem("ultimoUsuario", "0");
      this.accion(0);
    });
  }
  
  llenarTemas()
  {
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".pu_colores WHERE (personalizada = 'N' OR (personalizada = 'S' AND usuario = " + this.servicio.rUsuario().id +")) AND estatus = 'A' ORDER BY personalizada DESC, nombre";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.temasUsuario = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
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

  iraCronos()
  {
    if (this.urlCronos)
    {
      window.open(this.urlCronos, "_blank");
    }
    else
    {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[260];
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
    }
  }

  cambiarClave(posterior: number)
  {
    const respuesta = this.dialog.open(SesionComponent, 
      {
        width: "400px", panelClass: 'dialogo', data: { sesion: 3, opcionSel: 0, idUsuario: this.servicio.rUsuario().id, usuario: "", clave: "", titulo: this.servicio.rTraduccion()[258], mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[259], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_cambio" }
      });
      respuesta.afterClosed().subscribe(result => 
      {

        if (result)
        {
        if (posterior==1 && result.accion==1)
         {
          this.continuarSesion();
         }
         else if (posterior==1)
         {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[257];
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
         } 
        }
        else 
        {
          this.continuarSesion();
        }
      })
  }

  salida(mensaje: string)
  {
    this.router.navigateByUrl('/vacio');
    this.version = "SIGMA N/A"; 
    this.cadenaVcto =  "";
    this.licenciado = this.servicio.rLicenciado();
    this.servicio.mensajeInferior.emit("<span class='resaltar'>" + mensaje + "</span>");
  }

  bTraductor(idioma: number) {
    this.procesando = true;
    this.idiomaActual = idioma;
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_idiomas a INNER JOIN  " + this.servicio.rBD() + ".det_idiomas b ON a.id = b.idioma WHERE id = " + idioma + " ORDER BY linea";
  
    let campos = { accion: 100, sentencia: sentencia  };
    this.servicio.consultasBD(campos).subscribe(resp => {
      if (resp.length > 0) {
        
        let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET idioma = " + idioma + " WHERE id = " + this.servicio.rUsuario().id;
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
        })
        this.ayuda09 = resp[0].nombre;
        let miCadena: string = "";
        this.banderaActual = resp[0].icono;
        this.servicio.aIdioma({ id: resp[0].id, fecha_01: resp[0].fecha_01, fecha_02: resp[0].fecha_02, fecha_03: resp[0].fecha_03, fecha_04: resp[0].fecha_04, fecha_05: resp[0].fecha_05, fecha_06: resp[0].fecha_06, fecha_07: resp[0].fecha_07, fecha_08: resp[0].fecha_08, enteros: resp[0].enteros, decimales: resp[0].decimales, }); 
        for (var i = 0; i < resp.length; i++) {
          miCadena = miCadena + resp[i].cadena;
        }
        this.servicio.aTraduccion(miCadena.split(";")); 
        this.servicio.cambioIdioma.emit(true);
        if (!this.iniAplicacion) {
          this.iniAplicacion = true
          if (this.servicio.rUsuario().rol !="V")
          {
            this.validarSesion({ id: 0 });
          }
          else
          {
            let cadena = this.servicio.rUsuario().nombre.split(' ');
            this.primerNombre = cadena[0];
            this.cambiarTurno = false;
            this.mBienvenido = this.servicio.rTraduccion()[240] + ", " + this.primerNombre;
          }
          
        }

        
        this.iniciarAyudas();
        setTimeout(() => {
          this.procesando = false;  
        }, 300);
        
      }
      else
      {
        setTimeout(() => {
          this.procesando = false;  
        }, 300);
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[102];
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  iniciarAyudas()
  {
    this.menuHamburguesaTT  = this.servicio.rTraduccion()[241];
    this.ayuda03 = this.servicio.rTraduccion()[252];
    this.ayuda02 = this.servicio.rTraduccion()[256];
    this.ayuda04 = this.servicio.rTraduccion()[255];
    this.ayuda05 = this.servicio.rTraduccion()[254];
    this.ayuda06 = this.servicio.rTraduccion()[249];
    this.ayuda07 = this.servicio.rTraduccion()[248];
    this.ayuda08 = this.servicio.rTraduccion()[247];
    this.ayudaInferior = this.servicio.rTraduccion()[246];    
    this.irArribaTT = this.servicio.rTraduccion()[245];
    this.cambioClave = this.servicio.rTraduccion()[244];
    this.cerrarSesion = this.servicio.rTraduccion()[243];
    this.configTT  = this.servicio.rTraduccion()[242];
    this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[286]);
    this.mBienvenido = this.servicio.rTraduccion()[240] + ", " + this.primerNombre;
    
  }

   rRegistros(tabla: number)
  {
    this.miSeleccion = 3;
    let cadAdic = "AND (a.id IN (SELECT b.proceso FROM " + this.servicio.rBD() + ".cat_fallas a INNER JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones b ON a.id = b.falla AND b.tipo = 3 WHERE (a.linea = 'S' OR " + +this.linea + " IN (SELECT proceso FROM " + this.servicio.rBD() + ".relacion_fallas_operaciones WHERE falla = a.id AND tipo = 1)) AND (a.linea = 'S' OR a.maquina = 'S' OR " + +this.maquina + " IN (SELECT proceso FROM " + this.servicio.rBD() + ".relacion_fallas_operaciones WHERE falla = a.id AND tipo = 2))) OR (SELECT COUNT(*) FROM " + this.servicio.rBD() + ".cat_fallas a WHERE a.area = 'S' AND (a.linea = 'S' OR " + +this.linea + " IN (SELECT proceso FROM " + this.servicio.rBD() + ".relacion_fallas_operaciones WHERE falla = a.id AND tipo = 1)) AND (a.linea = 'S' OR a.maquina = 'S' OR " + +this.maquina + " IN (SELECT proceso FROM " + this.servicio.rBD() + ".relacion_fallas_operaciones WHERE falla = a.id AND tipo = 2))) > 0) "

    let sentencia = "SELECT a.id, a.nombre, a.nombre AS nombreOriginal, 'N' AS conFalla, IFNULL(a.url_mmcall, '" + this.servicio.rTraduccion()[8] + "') AS url_mmcall, a.imagen, 'S'  AS mostrarImagen FROM " + this.servicio.rBD() + ".cat_areas a INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 3 AND b.usuario = " + this.servicio.rUsuario().id + " WHERE a.estatus = 'A' " + cadAdic + " ORDER BY a.nombre;"
    if (this.servicio.rUsuario().area=="S")
    {
      sentencia = "SELECT a.id, a.nombre, a.nombre AS nombreOriginal, 'N' AS conFalla, IFNULL(a.url_mmcall, '" + this.servicio.rTraduccion()[8] + "') AS url_mmcall, a.imagen, 'S'  AS mostrarImagen FROM " + this.servicio.rBD() + ".cat_areas a WHERE a.estatus = 'A' " + cadAdic + " ORDER BY a.nombre;"
    }
    this.literalSingular = this.servicio.rTraduccion()[37];
    this.literalPlural = this.servicio.rTraduccion()[38];
    this.literalSingularArticulo = this.servicio.rTraduccion()[39];
    this.mensajePadre = "";
    if (tabla == 4)
    {
      this.miSeleccion = 4;
      sentencia = "SELECT a.id, a.nombre, IFNULL(a.url_mmcall, '" + this.servicio.rTraduccion()[8] + "') AS url_mmcall, a.afecta_oee, a.imagen, 'S' AS mostrarImagen, IFNULL(a.ultima_incidencia, '') AS ultima_incidencia FROM " + this.servicio.rBD() + ".cat_fallas a WHERE (a.linea = 'S' OR " + +this.linea + " IN (SELECT proceso FROM " + this.servicio.rBD() + ".relacion_fallas_operaciones WHERE falla = a.id AND tipo = 1)) AND (a.linea = 'S' OR a.maquina = 'S' OR " + +this.maquina + " IN (SELECT proceso FROM " + this.servicio.rBD() + ".relacion_fallas_operaciones WHERE falla = a.id AND tipo = 2)) AND (a.area = 'S' OR " + +this.area + " IN (SELECT proceso FROM " + this.servicio.rBD() + ".relacion_fallas_operaciones WHERE falla = a.id AND tipo = 3));";
      this.literalSingular = this.servicio.rTraduccion()[40];
      this.literalPlural = this.servicio.rTraduccion()[41];
      this.literalSingularArticulo = this.servicio.rTraduccion()[42];
      this.mensajePadre = "";
    }
    
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (tabla == 3)
      {
        this.iconoGeneral = "i_responsable";
        this.revisarANDON();

      }
      else if (tabla == 4)
      {
        this.iconoGeneral = "i_falla";
      } 
      if (resp.length == 0)
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        if (tabla == 3)
        {
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[58];
        }
        else if (tabla == 4)
        {
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[59];
        }
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
      this.registros = resp; 
    }, 
    error => 
    {
      //console.log(error)
    })
  }  

  seleccionar(id: number)
  {
    if (id < 0) 
    {
      id = 0;
    }
    if (this.miSeleccion == 3)
    {
      this.area = this.registros[id].id;
      this.laSeleccion[3] = 0;
      this.laSeleccion[7] = "[" + this.servicio.rTraduccion()[5] + "]";
      this.laSeleccion[11] = "";
      
      
    }
    this.laSeleccion[this.miSeleccion - 1] = this.registros[id].id;
    this.laSeleccion[this.miSeleccion + 3] = this.registros[id].nombre;
    this.laSeleccion[this.miSeleccion + 7] = this.registros[id].url_mmcall;
    if (this.miSeleccion == 4)
    {
      this.afecta_oee = this.registros[id].afecta_oee;
    }

    if (this.laSeleccion[2] != "" && this.laSeleccion[3] != "")
    {
      this.llamar(1);
    }
    else
    {
      this.rRegistros(4);
    }
  }

  llamar(id: number)
  {
    {
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
      if (this.laSeleccion[0] == 0 ||  this.laSeleccion[1] == 0 || this.laSeleccion[2] == 0 || this.laSeleccion[3] == 0)
      {
        let faltante = "";
        faltante = faltante + (this.laSeleccion[0] == 0 ? this.servicio.rTraduccion()[78] : "");
        faltante = faltante + (this.laSeleccion[1] == 0 ? this.servicio.rTraduccion()[79] : "");
        faltante = faltante + (this.laSeleccion[2] == 0 ? this.servicio.rTraduccion()[80] : "");
        faltante = faltante + (this.laSeleccion[3] == 0 ? this.servicio.rTraduccion()[81] : "");

        const respuesta = this.dialog.open(DialogoComponent, {
          width: "400px", panelClass: 'dialogo', data: { titulo: this.servicio.rTraduccion()[82], mensaje: this.servicio.rTraduccion()[83] + faltante, alto: "40", id: 0, accion: 0, tiempo: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "in_detener" }
        });
        respuesta.afterClosed().subscribe(result => 
        {
          if (result)
          {
            if (result.accion == 1) 
            {

            }
          }
          if (this.laSeleccion[2]==0)
          {
            this.miSeleccion = 3;
          }
          else
          {
            this.miSeleccion = 4;
          }
        }) 
        
      }
      else
      {
        this.miSeleccion = 4;
        if (this.configuracion.confirmar_mensaje_mantto=="S")
        {
          this.laSeleccion[8] = !this.laSeleccion[8] ? this.servicio.rTraduccion()[8] : this.laSeleccion[8];
          this.laSeleccion[9] = !this.laSeleccion[9] ? this.servicio.rTraduccion()[8] : this.laSeleccion[9];
          this.laSeleccion[10] = !this.laSeleccion[10] ? this.servicio.rTraduccion()[8] : this.laSeleccion[10];
          this.laSeleccion[11] = !this.laSeleccion[11] ? this.servicio.rTraduccion()[8] : this.laSeleccion[11];
          let urlFinal = this.configuracion.url_mmcall;
          if (this.configuracion.accion_mmcall == "S")
          {
            urlFinal = urlFinal + (this.laSeleccion[8] != this.servicio.rTraduccion()[8] ? ";" + this.laSeleccion[8] : "");
            urlFinal = urlFinal + (this.laSeleccion[9] != this.servicio.rTraduccion()[8] ? ";" + this.laSeleccion[9] : "");
            urlFinal = urlFinal + (this.laSeleccion[10] != this.servicio.rTraduccion()[8] ? ";" + this.laSeleccion[10] : "");
            urlFinal = urlFinal + (this.laSeleccion[11] != this.servicio.rTraduccion()[8] ? ";" + this.laSeleccion[11] : "");
            
          }
          else
          {
            urlFinal = (this.laSeleccion[8] != this.servicio.rTraduccion()[8] ? this.laSeleccion[8] : urlFinal);
            urlFinal = (this.laSeleccion[9] != this.servicio.rTraduccion()[8] ? this.laSeleccion[9] : urlFinal);
            urlFinal = (this.laSeleccion[10] != this.servicio.rTraduccion()[8] ? this.laSeleccion[10] : urlFinal);
            urlFinal = (this.laSeleccion[11] != this.servicio.rTraduccion()[8] ? this.laSeleccion[11] : urlFinal);
          }
          if (this.configuracion.ip_localhost)
          {
            urlFinal = urlFinal.replace(/localhost:8081/gi, this.configuracion.ip_localhost);
          }
          let faltante = "";
          faltante = faltante + this.servicio.rTraduccion()[84] + this.laSeleccion[4] + "</strong>";
          faltante = faltante + this.servicio.rTraduccion()[85] + this.laSeleccion[5] + "</strong>";
          faltante = faltante + this.servicio.rTraduccion()[86] + this.laSeleccion[6] + "</strong>";
          faltante = faltante + this.servicio.rTraduccion()[87] + this.laSeleccion[7] + "</strong>";
          faltante = faltante + this.servicio.rTraduccion()[88] + (this.configuracion.accion_mmcall == "S" ? this.servicio.rTraduccion()[89] : this.servicio.rTraduccion()[90]) + "</strong>";
          
          const respuesta = this.dialog.open(DialogoComponent, {
            width: "500px", panelClass:  'dialogo', data: { titulo: this.servicio.rTraduccion()[92], mensaje: this.servicio.rTraduccion()[93] + faltante, id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_falla" }
          });
          respuesta.afterClosed().subscribe(result => 
          {
            if (result)
            {
              if (result.accion == 1) 
              {
                this.hacerLlamada();
              }
              else
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[94];
                mensajeCompleto.tiempo = 2000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
            }
            else
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = this.servicio.rTraduccion()[94];
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
          })
        }
        else
        {
          this.hacerLlamada();
        }
      }
    }
    
  }
 
  hacerLlamada()
  {
    let urlFinal = this.configuracion.url_mmcall;
    if (this.configuracion.accion_mmcall == "S")
    {
      urlFinal = urlFinal + (this.laSeleccion[8] != this.servicio.rTraduccion()[8] ? ";" + this.laSeleccion[8] : "");
      urlFinal = urlFinal + (this.laSeleccion[9] != this.servicio.rTraduccion()[8] ? ";" + this.laSeleccion[9] : "");
      urlFinal = urlFinal + (this.laSeleccion[10] != this.servicio.rTraduccion()[8] ? ";" + this.laSeleccion[10] : "");
      urlFinal = urlFinal + (this.laSeleccion[11] != this.servicio.rTraduccion()[8] ? ";" + this.laSeleccion[11] : "");
      
    }
    else
    {
      urlFinal = (this.laSeleccion[8] != this.servicio.rTraduccion()[8] ? this.laSeleccion[8] : urlFinal);
      urlFinal = (this.laSeleccion[9] != this.servicio.rTraduccion()[8] ? this.laSeleccion[9] : urlFinal);
      urlFinal = (this.laSeleccion[10] != this.servicio.rTraduccion()[8] ? this.laSeleccion[10] : urlFinal);
      urlFinal = (this.laSeleccion[11] != this.servicio.rTraduccion()[8] ? this.laSeleccion[11] : urlFinal);
    }
    if (this.configuracion.ip_localhost)
    {
      urlFinal = urlFinal.replace(/localhost:8081/gi, this.configuracion.ip_localhost);
    }
    
    let str = this.laSeleccion[5] + " " + this.laSeleccion[7];
    if (urlFinal==this.servicio.rTraduccion()[8])
    {
      const respuesta = this.dialog.open(DialogoComponent, {
        width: "400px", panelClass:  'dialogo', data: { titulo: this.servicio.rTraduccion()[82], mensaje: this.servicio.rTraduccion()[95], alto: "40", id: 0, accion: 0, tiempo: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "in_detener" }
      });
    }
    else
    {
      str = this.servicio.tildes(str, "M").substr(0, 40);
      str = str.replace(/[&\/\\()$~%.'":*#?<>{}]/g, " ");
      let destinos =  urlFinal.split(";");
      this.tEnviados = 0;
      let buenos: number = 0;
      this.grabar();
      this.noLicenciados = 0;
      setTimeout(() => {
        this.finalizaLlamada()
      }, 1500);
      for (var i = 0; i < destinos.length; i++)
      {
        
        if (destinos[i].length > 0)
        {
          let directo: boolean = true;
          let numeroRadio = "";
          let posRadio = destinos[i].indexOf("number=");
          if (posRadio == -1)
          {
            posRadio = destinos[i].indexOf("division=");
            if (posRadio == -1)
            {
              numeroRadio = destinos[i]
            }
            else
            {
              numeroRadio = "D" + destinos[i].substr(posRadio + 9);
            }
          }
          else
          {
            numeroRadio = destinos[i].substr(posRadio + 7);
          }
          if (numeroRadio.length > 0)
          {
            let sentencia = "SELECT " + i + " AS numero, tipo, mmcall, cronos FROM " + this.servicio.rBD() + ".licencias WHERE tipo = 'R' AND mmcall = '" + numeroRadio + "'";
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              if (resp.length > 0)
              {
                this.local = resp[0].mmcall;
                this.tipo = resp[0].tipo;
                this.generarClave()
                let validada = true;
                let cadComparar = "";
                for (var jj = 0; jj < this.clavePublica.length; jj++) 
                {
                  let numero = (this.clavePublica[jj].charCodeAt(0) ^ this.claveInterna[jj].charCodeAt(0)).toString();
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
                  if (cadComparar != resp[0].cronos[jj])
                  {
                    validada = false;
                    break;
                  }
                }
                if (validada || this.configuracion.pagers_val=='N')
                {
                  let campos = {accion: 300, url: destinos[+resp[0].numero], mensaje: str, pager: numeroRadio};  
                  this.servicio.llamadaMMCall(campos).subscribe( resp =>
                  {
                    this.tEnviados =  this.tEnviados + 1;
                    if (resp == "success")
                    {
                      buenos = buenos + 1;            
                    }
                    
                  })
                } 
                else
                {
                  this.tEnviados =  this.tEnviados + 1;
                  this.noLicenciados = this.noLicenciados + 1;
                }
                
              }
              else
              {
                if (this.configuracion.pagers_val=='N')
                {
                  let campos = {accion: 300, url: destinos[i], mensaje: str, pager: numeroRadio};  
                  this.servicio.llamadaMMCall(campos).subscribe( resp =>
                  {
                    this.tEnviados =  this.tEnviados + 1;
                    if (resp == "success")
                    {
                      buenos = buenos + 1;            
                    }
                    
                  })
                } 
                else
                {
                  this.tEnviados =  this.tEnviados + 1;
                }
              }
            })
          }         
        }
      }
      
    }  
  }

  grabar()
  {
    let estaFecha = this.servicio.fecha(1, '', 'yyyy-MM-dd')
    let estaHora = this.servicio.fecha(1, '', 'HH:mm:ss')
    if (this.servicio.rTurno().cambidia =="S")
    {
      if (this.servicio.rTurno().mover =="2" && estaHora >= this.servicio.rTurno().inicia && estaHora <= "23:59:59")
      {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        estaFecha = this.servicio.fecha(2, '' + new Date(date) , 'yyyy-MM-dd')
      }
      else if (this.servicio.rTurno().mover =="1"  && estaHora >= "00:00:00" && estaHora <= this.servicio.rTurno().termina)
      {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        estaFecha = this.servicio.fecha(2, '' + new Date(date) , 'yyyy-MM-dd')
      }
    }
    let sentencia = "INSERT INTO " + this.servicio.rBD() + ".reportes (linea, maquina, area, falla, falla_ajustada, solicitante, turno, fecha_reporte, mmcall, afecta_oee) VALUES(" + this.laSeleccion[0] + ", " + this.laSeleccion[1] + ", "  + this.laSeleccion[2] + ", "  + this.laSeleccion[3] + ", " + this.laSeleccion[3] + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rTurno().id + ", '" + estaFecha + "', NOW(), '" + (this.afecta_oee ? this.afecta_oee : "S") + "')";
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {

      sentencia = "UPDATE " + this.servicio.rBD() + ".cat_fallas SET ultima_incidencia = NOW() WHERE id = " + this.laSeleccion[3]
      campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
      })
          
      sentencia = "SELECT id, fecha FROM " + this.servicio.rBD() + ".reportes ORDER BY id DESC LIMIT 1";
      campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (this.configuracion.mostrar_numero=="S")
        {
          const respuesta = this.dialog.open(DialogoComponent, {
            width: "400px", panelClass:  'dialogo', data: { titulo: this.servicio.rTraduccion()[96], mensaje: this.servicio.rTraduccion()[97] + "<strong>" + +resp[0].id + "</strong>", alto: "40", id: 0, tiempo: 5, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_alerta" }
          });
  
        }
        else
        {
          this.servicio.activarSpinner.emit(true);
          setTimeout(() => {
            this.servicio.activarSpinner.emit(false);  
          }, 200);  
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[97] + " " + resp[0].id
          mensajeCompleto.tiempo = 4000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
        this.servicio.mensajeInferior.emit("");
        this.laSeleccion[2] = 0;
        this.laSeleccion[3] = 0;
        this.laSeleccion[6] = "[" + this.servicio.rTraduccion()[4] + "]";
        this.laSeleccion[7] = "[" + this.servicio.rTraduccion()[5] + "]";
        this.laSeleccion[10] = "";
        this.laSeleccion[11] = "";
        this.rRegistros(3);
      })
    })    
  }

  finalizaLlamada()
  {
    if (this.noLicenciados > 0)
    {
      const respuesta = this.dialog.open(DialogoComponent, {
        width: "450px", panelClass:  'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[136], mensaje: this.servicio.rTraduccion()[137].replace("campo_0", this.tEnviados).replace("campo_1", this.noLicenciados), alto: "40", id: 0, accion: 0, tiempo: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "in_detener" }
      });
      respuesta.afterClosed().subscribe(result => 
      {
      }) 
    }
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
    this.claveInterna = this.servicio.alterarPalabraClave();
    let temporal = "";
    let temporal2 = "";
    let numero = "";
    let numero2 = 0;
    let buscarEn = 0;
    let posicion = 0;
    let numeroActual = 0;
    let recorrido = 0;
    if (this.claveInterna.length > this.local.length)
    
    {
      temporal = "";
      temporal2 = this.claveInterna;
      
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
      while (temporal.length < this.claveInterna.length)
      temporal = temporal.substr(0, this.claveInterna.length);
    }
    else if (this.claveInterna.length == this.local.length)
    {
      temporal = this.local;
      temporal2 = this.claveInterna;
    }
    
    else if (this.local.length > this.claveInterna.length)
    {
      temporal = this.local;
      temporal2 = this.claveInterna;
      do
      {
        temporal2 = temporal2 + this.claveInterna;  
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

  
}