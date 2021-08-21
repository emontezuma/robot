import { Injectable, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'
import { Observable, throwError, pipe } from 'rxjs';  
import { HttpClient,  HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'  
})
export class ServicioService {

  //URL_BASE = "http://localhost:8081/sigma/api/index.php?";
  //URL_MMCALL = "http://localhost:8081/locations/integration/simulate/";

  URL_BASE = environment.urlAPP;
  URL_MMCALL = environment.urlMMCALL;
  
  private anchoSN: number = 300;
  private palabraClave: string = "CronosIntegracion2019";
  private tr: string = "";
  private usuarioActual: any = {id: 0};
  private filtroParo: any  = {cadena: "", mes: 0, ano: 0, area: 0, clase: 0, concepto: 0};
  private filtroRechazo: any  = {mes: 0, ano: 0, origen: "-1", producto: -1, maquina: -1};
  miVersion: any  = {numero: '', ano: 0, vence: "0", almacenamiento: 0, tipo: 0, plantas: 0, usuarios: 0, maquinas: 0, modulos: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]};
  private usuarioAnterior: any = {id: 0}; 
  private config: any = [];
  private colores: any = [];
  private coloresv1: any = [];
  private pantalla: {alto: 0, ancho: 0};
  private huboError: boolean = false;
  private demoVersion: number = 0;
  private idMaquinaExterna: number = 0;
  private licenciado: boolean = false;
  private perpetua: boolean = false;
  private version: number = 1;
  private vctoDemo: string = "";
  private operacion: any = {id: 0, nombre: "", desde: "", hasta: "", };
  private miVista: number = 0;
  private consulta: number = 0;
  private operador: number = 0;
  private tema: number = 0;
  private respuestaLicencia: string = "";
  
  private turnoActual: any = {id: 0, inicia: "", termina: "", mover: 0, secuencia: 0, nombre : "" };
  mmcall: string = "";
  traduccion: any = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ];
  idioma: any = {id: 1, fecha_01: "dd-MMM-yyyy", fecha_02: "dd MMM yyyy HH:mm:ss", fecha_03: "dd/MM/yyyy HH:mm", fecha_04: "dd-MMM HH:mm", fecha_05: "dd/MM/yyyy HH:mm", fecha_06: "dd/MM/yyyy HH:mm", fecha_07: "EEE, dd-MMM-yyyy", fecha_08: "dd-MM", enteros: "", decimales: "1.1-1" };


  
  ///ELVIS
  private horaDesde: string = "";
  private viendoRate: boolean = false;
  private escapado: boolean = false;
  private iniciarCuenta: boolean = false;
  private piezasAcumuladas: number = 0;
  private escanear: boolean = false;
  private cadenaEscaneada: string = "";
  //
  hayParo = new EventEmitter<boolean>();
  iniciarConteo = new EventEmitter<boolean>();
  verRates = new EventEmitter<boolean>();
  private enMovil: boolean = false;
  
         
  
  aHoraDesde(hora: string) {
    this.horaDesde = hora;
  }

  rHoraDesde() {
    return this.horaDesde ;
  }

  aVerRate(ver: boolean) {
    this.viendoRate = ver;
  }

  rVerRate() {
    return this.viendoRate ;
  }

  aMaquina(ver: number) {
    this.idMaquinaExterna = ver;
  }

  rMaquina() {
    return this.idMaquinaExterna ;
  }

  aInicio(iniciar: boolean) {
    this.iniciarCuenta = iniciar;
  }

  rInicio() {
    return this.iniciarCuenta ;
  }

  aAcumuladas(piezas: number) {
    this.piezasAcumuladas = piezas;
  }

  rAcumuladas() {
    return this.piezasAcumuladas ;
  }

  aTraduccion(valor) {
    this.traduccion = valor ;
  }

  rTraduccion() {
    return this.traduccion ;
  }

  aEscapado(valor: boolean) {
    this.escapado = valor ;
  }

  rEscapado() {
    return this.escapado ;
  }

  aIdioma(valor) {
    this.idioma = valor ;
  }

  rIdioma() {
    return this.idioma ;
  }

  aOperador(valor) {
    this.operador = valor ;
  }

  rOperador() {
    return this.operador ;
  }

  aMovil(enMovil: boolean) {
    this.enMovil = enMovil;
  }

  rMovil() {
    return this.enMovil ;
  }

 
  constructor(public datepipe: DatePipe,
              private http: HttpClient,
            ) 
            {}

  activarSpinner = new EventEmitter<boolean>();
  activarSpinnerSmall = new EventEmitter<boolean>();
  teclaBuscar = new EventEmitter<boolean>();
  configurando = new EventEmitter<boolean>();
  teclaEscape = new EventEmitter<boolean>();
  teclaResumen = new EventEmitter<boolean>();
  refrescarLogo = new EventEmitter<boolean>();
  teclaProceso = new EventEmitter<boolean>();
  cambioColor = new EventEmitter<boolean>();
  sinConexion = new EventEmitter<boolean>();
  mensajeSuperior = new EventEmitter<string>();
  mensajeTurno = new EventEmitter<string>();
  mensajeInferior = new EventEmitter<string>();
  mensajeError = new EventEmitter<string>();
  esMovil = new EventEmitter<boolean>();
  cambioTurno = new EventEmitter<boolean>();
  cambioRouter = new EventEmitter<boolean>();
  rSesion = new EventEmitter<boolean>();
  cSesion = new EventEmitter<boolean>();
  mensajeToast = new EventEmitter<object>();
  cambioLM = new EventEmitter<object>();
  teclaCambiar = new EventEmitter<boolean>();
  refrescarVista = new EventEmitter<boolean>();
  cambioPantalla = new EventEmitter<boolean>();
  quitarBarra = new EventEmitter<boolean>();
  cierreSnack = new EventEmitter<boolean>();
  verANDON = new EventEmitter<boolean>();
  vista = new EventEmitter<number>();
  cadaSegundo = new EventEmitter<boolean>();
  mostrarBmenu = new EventEmitter<number>();
  mostrarBarra = new EventEmitter<boolean>();
  salir = new EventEmitter<string>();
  valida = new EventEmitter<boolean>();
  vencimiento = new EventEmitter<string>();
  escaneado = new EventEmitter<string>();
  listoEscanear = new EventEmitter<boolean>();
  cambioUsuario= new EventEmitter<boolean>();
  cambioOpcion= new EventEmitter<number>();
  verProgramador = new EventEmitter<boolean>();
  cambioIdioma = new EventEmitter<boolean>();
  

  //
  vista_2 = new EventEmitter<number>();
  vista_3 = new EventEmitter<number>();
  vista_4 = new EventEmitter<number>();
  vista_5 = new EventEmitter<number>();
  //
  

  aAnchoSN(ancho: number) {
    this.anchoSN = ancho;
  }
  rAnchoSN() {
    return this.anchoSN ;
  }

  aUsuarioAnterior(valor: number) {
    this.usuarioAnterior = valor;
  }
  rUsuarioAnterior() {
    return this.usuarioAnterior ;
  }

  rEsDemo() {
    return this.demoVersion;
  }

  rLicenciado() {
    return this.licenciado;
  }

  rPerpetua() {
    return this.perpetua;
  }

  rVctoDemo() {
    return this.vctoDemo;
  }

  aTurno(valor: any) {
    this.turnoActual = valor;
  }

  rTurno() {
    return this.turnoActual ;
  }



  aConsulta(numero: number) {
    this.consulta = numero;
  }
  rConsulta() {
    return this.consulta ;
  }


  aHuboError(siError: boolean) {
    this.huboError = siError;
  }
  rHuboError() {
    return this.huboError ;
  }

  aUsuario(valor: any) {
    this.usuarioActual = valor;
  }

  aUsuarioIdioma(idioma: number) {
    this.usuarioActual.idioma = idioma;
  }


  rUsuario() {
    return this.usuarioActual ;
  }

   aVersion(valor: any) {
    this.miVersion = valor;
  }

  rVersion() {
    return this.miVersion ;
  }

  aFParo(valor: any)
  {
    this.filtroParo = valor;
  }
  rFParo()
  {
    return this.filtroParo;
  }

  aFRechazo(valor: any)
  {
    this.filtroRechazo = valor;
  }
  rFRechazo()
  {
    return this.filtroRechazo;
  }


  aTR(valor: string) {
    this.tr = valor;
  }
  rTR() {
    return this.tr ;
  }

  aConfig(valor: any) {
    this.config = valor;
  }
  rConfig() {
    return this.config ;
  }

  rBD() {
    return "robot" ;
  }

  aTemaActual(valor: any) {
    this.tema = valor;
  }
  rTemaActual() {
    return this.tema ;
  }

  rPalabraClave() {
    return this.palabraClave ;
  }
  
  aColores(valor: any) {
    this.colores = valor;
    
  }
  rColores() {
    return this.colores ;
  }

  aColoresv1(valor: any) {
    this.coloresv1 = valor;
    
  }
  rColoresv1() {
    return this.coloresv1 ;
  }


  aUltimoReporte(valor: number) {
    this.usuarioActual.ultimo_reporte = valor;
  }

  aPantalla(valor: any) {
    this.pantalla = valor;
  }
  rPantalla() {
    return this.pantalla ;
  }
  aVista(vista: number) {
    this.miVista = vista;
  }
  rVista() {
    return this.miVista ;
  }
  aOperacion(valor: any) {
    this.operacion = valor;
  }
  rOperacion() {
    return this.operacion ;
  } 

  fecha(tipo: number, miFecha: string, formato: string): string 
  {
    if (tipo == 1) 
    {
      return this.datepipe.transform(new Date(), formato);
    }
    else if (tipo == 2) 
    {
      if (!miFecha)
      {
        return "";  
      }
      else
      {
        return this.datepipe.transform(new Date(miFecha), formato);
      }
    }
  }

  consultasBD(campos: any): Observable<any> 
  {      
    
    if (campos.accion == 100) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=consultar", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    if (campos.accion == 150) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=consultar_archivo", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 200) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=actualizar", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 300) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=agregar", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1000) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=actualizar_planta", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 1100) 
    {

      console.log(campos);
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_proceso", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 1200) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=actualizar_ruta_cabecera", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1300) 
    {
      
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_ruta_detalle", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1400) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_secuencia_ruta", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    
    else if (campos.accion == 1500) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_proceso_detalle", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    
      }
    else if (campos.accion == 1600) 
      {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_secuencia_ruta2", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1700) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_parte", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 1800) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_recipiente", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1900) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_alertas", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 2000) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_situaciones", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 2100) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_horarios", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 2200) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_usuario", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 3000) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_programacion", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 3050) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_carga", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 3100) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_prioridad", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 3200) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=recuperar_excel", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    
  }  

  
  llamadaMMCall(campos: any): Observable<any> 
  {
    if (campos.accion == 100) {
      return this.http.get(this.URL_MMCALL + "action=call&code=" + campos.requester + "&key=1&custom_message=" + campos.mensaje, {responseType: 'text'});
      
    }
    else if (campos.accion == 200) {
      return this.http.get(this.URL_MMCALL + "action=cancel&code=" + campos.requester, {responseType: 'text'});
    }
    else if (campos.accion == 300) {
      let miPager = -1;
      if (campos.pager.substr(0, 1).toUpperCase() == "D")
      {
        if (!isNaN(campos.pager.substr(1, 1)))
        {
          miPager = +campos.pager.substr(1) + 180;
        }
        
      }
      if (campos.pager.substr(0, 1).toUpperCase() == "A")
      {
        miPager = 0;
      }
      else if (!isNaN(campos.pager))
      {
        miPager = +campos.pager + 100
      }
      if (miPager != -1)
      {
        let sentencia = "INSERT INTO mmcall.tasks (location_id, task, message, recipients, status, created) VALUES (1, 'page', '" + campos.mensaje + "', '" + miPager + "', 0, NOW());";
        console.log(sentencia);
        
        let camposMSG = {accion: 400, sentencia: sentencia};  
        this.llamadaMMCall(camposMSG).subscribe( resp =>
        {
          console.log(resp);
        })
      }
      

      //return this.http.get(campos.url + "&message=" + campos.mensaje, {responseType: 'text'});

    }
    else if (campos.accion == 400) {
      return this.http.post<any>(this.URL_BASE + "accion=actualizarMMCall", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    
  }

  /* Suma el porcentaje indicado a un color (RR, GG o BB) hexadecimal para aclararlo */

  colorear(color, porcentaje: number)
  {

    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) 
    {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
        color = "#" + r + g + b;
    }
    
    if (porcentaje > 0)
    {
      //Se oscurece
      
      const subtractLight = function(color, porcentaje){
        let cc = parseInt(color,16) - porcentaje;
        let c = (cc < 0) ? 0 : (cc);
        return (c.toString(16).length > 1 ) ? c.toString(16) : `0${c.toString(16)}`;
      }
  
      /* Oscurece un color hexadecimal de 6 caracteres #RRGGBB segun el porcentaje indicado */
      color = (color.indexOf("#")>=0) ? color.substring(1,color.length) : color;
      porcentaje = parseInt('' + (255 * porcentaje) /100);
      return color = `#${subtractLight(color.substring(0,2), porcentaje)}${subtractLight(color.substring(2,4), porcentaje)}${subtractLight(color.substring(4,6), porcentaje)}`;
    }
    else
    {
      porcentaje = porcentaje * -1;
      const addLight = function(color: string, porcentaje: number)
      {
        let cc = parseInt(color,16) + porcentaje;
        let c: number = (cc > 255) ? 255 : (cc);
        return (c.toString(16).length > 1 ) ? c.toString(16) : `0${c.toString(16)}`;
      }

        color = (color.indexOf("#")>=0) ? color.substring(1,color.length) : color;
        porcentaje = parseInt('' + (255 * porcentaje) / 100);
        return color = `#${addLight(color.substring(0,2), porcentaje)}${addLight(color.substring(2,4), porcentaje)}${addLight(color.substring(4,6), porcentaje)}`;
    }

  /* Resta el porcentaje indicado a un color (RR, GG o BB) hexadecimal para oscurecerlo */
    
  }

  claridad(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 

    else {
        
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    return Math.sqrt(0.241 * (r * r) + 0.691 * (g * g) + 0.068 * (b * b));
  }

  tiempoTranscurrido(fecha: string, formato: string): string
  {
    if (formato == "S")
    {
      return "0;0;0;" + Math.round((new Date().getTime() - new Date(fecha).getTime()) / 1000);
    }
    else if (formato == "FS")
    {
      return "0;0;0;" + Math.round((new Date(fecha).getTime() - new Date().getTime()) / 1000);
    }
    else if (formato == "F" || formato == "FD")
    {
      let segundos = Math.round((new Date(fecha).getTime() - new Date().getTime()) / 1000);
      if (formato == "FD")
      {
        let dias = Math.floor(segundos / 86400);
        let horas = Math.floor((segundos % 86400) / 3600);
        let minutos = Math.floor(((segundos % 86400) % 3600) / 60);
        segundos = segundos % 60 ; 
        return dias + ";" + horas + ";" + minutos + ";" + segundos;
      }
      else
      {
        let horas = Math.floor(segundos / 3600);
        let minutos = Math.floor((segundos % 3600) / 60);
        segundos = segundos % 60 ; 
        return "0;" + horas + ";" + minutos + ";" + segundos;
      }
    }
    else 
    {
      let segundos = Math.round((new Date().getTime() - new Date(fecha).getTime()) / 1000);
      if (formato == "D")
      {
        let dias = Math.floor(segundos / 86400);
        let horas = Math.floor((segundos % 86400) / 3600);
        let minutos = Math.floor(((segundos % 86400) % 3600) / 60);
        segundos = segundos % 60 ; 
        return dias + ";" + horas + ";" + minutos + ";" + segundos;
      }
      else
      {
        let horas = Math.floor(segundos / 3600);
        let minutos = Math.floor((segundos % 3600) / 60);
        segundos = segundos % 60 ; 
        return "0;" + horas + ";" + minutos + ";" + segundos;
      }
      
    }    
  }
  
  tildes(cadena, tipo = "")
  {
      var input = cadena
      var tittles = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
      var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
      for (var i = 0; i < tittles.length; i++) {
          input = input.replace(tittles.charAt(i), original.charAt(i));
      };
      if (tipo=="m")
      {
        input = input.toLowerCase();
      }
      else if (tipo=="M")
      {
        input = input.toUpperCase();
      }
      return input;
   };

   guardarVista(vista: number, valor: number)
   {
      let sentencia = "UPDATE " + this.rBD() + ".cat_usuarios SET preferencias_andon = CONCAT(LEFT(preferencias_andon, " + (vista - 1) + "), " + valor + ", MID(preferencias_andon, " + (vista + 1) + ")) WHERE id = " + this.rUsuario().id
      let campos = {accion: 200, sentencia: sentencia};  
      this.consultasBD(campos).subscribe( resp =>
      {
        this.usuarioActual.preferencias_andon =  this.usuarioActual.preferencias_andon.substring(0, vista - 1) + valor + this.usuarioActual.preferencias_andon.substring(vista);
      })
   }

   generarReporte(arreglo, titulo, archivo)
  {
    let exportCSV = ""; 
    exportCSV = "APLICACION DEL ROBOT\r\n";
    exportCSV = exportCSV + this.config.planta + "\r\n";
    exportCSV = exportCSV + titulo + "\r\n"; 
    exportCSV = exportCSV + this.rTraduccion()[375] + this.fecha(1, '', this.rIdioma().fecha_02) + "\r\n";
    for (var i = 0; i < arreglo.length; i++)
    {
      for (var j in arreglo[i])
      {
        if (arreglo[i][j])
        {
          arreglo[i][j] = '' + arreglo[i][j];
          let cadena = arreglo[i][j].replace(/\n/g,'');
          cadena = cadena.replace(/\r/g,'');
          exportCSV = exportCSV + '"' + cadena + '",'
        }
        else
        {
          exportCSV = exportCSV + '"",'
        }
      }
      exportCSV = exportCSV  + "\r\n"
    }
    exportCSV = exportCSV + this.rTraduccion()[376] + (arreglo.length - 1) + "\r\n"
    var blob = new Blob(["\uFEFF" + exportCSV], {type: 'text/csv;charset=utf-8' }),
    url = window.URL.createObjectURL(blob);
    let link = document.createElement('a')
    archivo = archivo.replace(/\n/g,'');
    archivo = archivo.replace(/\r/g,'');
    link.download = archivo;
    link.href = url
    link.click()
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  validarLicencia(paso: number)
  {
      

    this.valida.emit(true);
    this.perpetua = true;
    return;


      if (paso==1)
      {
        this.licenciado = false;
        let sentencia = "SELECT CONCAT(key_number, serial) AS mmcall FROM mmcall.locations"
        let campos = {accion: 100, sentencia: sentencia};  
        this.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length == 0)
          {
            this.respuestaLicencia = this.rIdioma()[377];
            this.validarLicencia(3);
          }
          else
          {
            this.mmcall = resp[0].mmcall;
            this.validarLicencia(2);
          }
        })
      }
      else if (paso == 2)
      {


        let sentencia = "SELECT licencia FROM " + this.rBD() + ".configuracion"
        let campos = {accion: 100, sentencia: sentencia};  
        this.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length==0)
          {
            this.respuestaLicencia = this.rIdioma()[378];
            this.validarLicencia(3);
          }
          else 
          {
            let mensaje = "";
            
            let partes = resp[0].licencia.split("-");
            partes[0] = '' + parseInt(partes[0], 16);
            partes[1] = '' + parseInt(partes[1], 16);
            partes[2] = '' + parseInt(partes[2], 16);
            partes[3] = '' + parseInt(partes[3], 16);
        
            let largo = +partes[3].substr(partes[3].length - 2, 2);
            let padUltimo = 11 - (40 - largo) 
            let version = String(+partes[0]).padStart(11, "0") + String(+partes[1]).padStart(11, "0") + String(+partes[2]).padStart(11, "0") + String(+partes[3]).padStart(padUltimo, "0");
            let suma = 0;
            for (var i = 1; i < version.length - 5; i++) 
            {
              suma = suma + +version.substr(i, 1);
            }
              
            let multiplicador = +version.substr(0, 1);
            let resultado = +version.substr(+version.length - 5, 3);
            let total = '' + multiplicador * suma;
            if (total.length > 3)
            { 
              total = total.substr(0, 3);
            }
            let verFecha: boolean = true;
            version = version.substr(1, version.length - 6);
            let licencia = "";
            let izquierda = "";
            let derecha = "";
            
            if (+total != resultado)
            {
              mensaje = this.rTraduccion()[365].replace("campo_0", "(SUM_Error)")
              verFecha = false;
            }
            else
            {
              licencia = licencia + version.substr(0, 7);
              licencia = licencia + version.substr(8, 4);
              licencia = licencia + version.substr(13, 3);
              licencia = licencia + version.substr(17, 4);
              licencia = licencia + version.substr(22, 2);
              licencia = licencia + version.substr(25, 3);
              licencia = licencia + version.substr(29, 2);
              licencia = licencia + version.substr(32, 2);
              licencia = licencia + version.substr(35, 5);
              izquierda = licencia.substr(0, 5);
              derecha = licencia.substr(licencia.length - 4, 4);
              licencia = licencia.substr(5, licencia.length - 9)
            }
            let modulos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            
            if (verFecha)
            {
              if (izquierda.length != 5)
              {
                mensaje = this.rTraduccion()[365].replace("campo_0", this.rTraduccion()[3470])
                verFecha = false;
              }
              else
              {
                if (izquierda.substr(0, 1) > "1")
                {
                  mensaje = this.rTraduccion()[365].replace("campo_0", this.rTraduccion()[3471])
                  verFecha = false;
                }
                else
                {
                  if (izquierda.substr(1, 1) > "2")
                  {
                    mensaje = this.rTraduccion()[365].replace("campo_0", this.rTraduccion()[3472])
                    verFecha = false;
                  }
                  else
                  {
                    if (izquierda.substr(2, 1) > "1")
                    {
                      mensaje = this.rTraduccion()[365].replace("campo_0", this.rTraduccion()[3473])
                      verFecha = false;
                    }
                    else
                    {
                      if (izquierda.substr(3, 1) > "4")
                      {
                        mensaje = this.rTraduccion()[365].replace("campo_0", this.rTraduccion()[3474])
                        verFecha = false;
                      }
                      else
                      {
                        if (izquierda.substr(4, 1) > "4")
                        {
                          mensaje = this.rTraduccion()[365].replace("campo_0", this.rTraduccion()[3475])
                          verFecha = false;
                        }
                      }
                    }
                  }
                }
              }
            }
            
            if (verFecha)
            {
              if (derecha.length != 4)
              {
                mensaje = this.rTraduccion()[365].replace("campo_0", this.rTraduccion()[3476])
                verFecha = false;
              }
              else
              {
                if (derecha.substr(0, 1) > "7")
                {
                  mensaje = this.rTraduccion()[365].replace("campo_0", "(Mod1_error)")
                  verFecha = false;
                }
                else
                {
                  if (derecha.substr(1, 1) > "7")
                  {
                    mensaje = this.rTraduccion()[365].replace("campo_0", "(Mod2_error)")
                    verFecha = false;
                  }
                  else
                  {
                    if (derecha.substr(2, 1) > "7")
                  {
                      mensaje = this.rTraduccion()[365].replace("campo_0", "(Mod3_error)")
                      verFecha = false;
                    }
                    else
                    {
                      if (derecha.substr(4, 1) > "7")
                      {
                        mensaje = this.rTraduccion()[365].replace("campo_0", "(Mod4_error)")
                        verFecha = false;
                      }
                    }
                  }
                }
              }
            }
        
            if (verFecha)
            {
              if (derecha.substr(0, 1) == "1")
              {
                modulos[2] = 1; 
              }
              else if (derecha.substr(0, 1) == "2")
              {
                modulos[1] = 1; 
              }
              else if (derecha.substr(0, 1) == "3")
              {
                modulos[1] = 1; 
                modulos[2] = 1; 
              }
              else if (derecha.substr(0, 1) == "4")
              {
                modulos[0] = 1; 
              }
              else if (derecha.substr(0, 1) == "5")
              {
                modulos[0] = 1; 
                modulos[2] = 1; 
              }
              else if (derecha.substr(0, 1) == "6")
              {
                modulos[0] = 1; 
                modulos[1] = 1; 
              }
              else if (derecha.substr(0, 1) == "7")
              {
                modulos[0] = 1; 
                modulos[1] = 1;
                modulos[2] = 1; 
              }
        
              if (derecha.substr(1, 1) == "1")
              {
                modulos[5] = 1; 
              }
              else if (derecha.substr(1, 1) == "2")
              {
                modulos[4] = 1; 
              }
              else if (derecha.substr(1, 1) == "3")
              {
                modulos[4] = 1; 
                modulos[5] = 1; 
              }
              else if (derecha.substr(1, 1) == "4")
              {
                modulos[3] = 1; 
              }
              else if (derecha.substr(1, 1) == "5")
              {
                modulos[3] = 1; 
                modulos[5] = 1; 
              }
              else if (derecha.substr(1, 1) == "6")
              {
                modulos[3] = 1; 
                modulos[4] = 1; 
              }
              else if (derecha.substr(1, 1) == "7")
              {
                modulos[3] = 1; 
                modulos[4] = 1;
                modulos[5] = 1; 
              }
        
              if (derecha.substr(2, 1) == "1")
              {
                modulos[8] = 1; 
              }
              else if (derecha.substr(2, 1) == "2")
              {
                modulos[7] = 1; 
              }
              else if (derecha.substr(2, 1) == "3")
              {
                modulos[7] = 1; 
                modulos[8] = 1; 
              }
              else if (derecha.substr(2, 1) == "4")
              {
                modulos[6] = 1; 
              }
              else if (derecha.substr(2, 1) == "5")
              {
                modulos[6] = 1; 
                modulos[8] = 1; 
              }
              else if (derecha.substr(2, 1) == "6")
              {
                modulos[6] = 1; 
                modulos[7] = 1; 
              }
              else if (derecha.substr(2, 1) == "7")
              {
                modulos[6] = 1; 
                modulos[7] = 1;
                modulos[8] = 1; 
              }
        
              if (derecha.substr(3, 1) == "1")
              {
                modulos[11] = 1; 
              }
              else if (derecha.substr(3, 1) == "2")
              {
                modulos[10] = 1; 
              }
              else if (derecha.substr(3, 1) == "3")
              {
                modulos[10] = 1; 
                modulos[11] = 1; 
              }
              else if (derecha.substr(3, 1) == "4")
              {
                modulos[9] = 1; 
              }
              else if (derecha.substr(3, 1) == "5")
              {
                modulos[9] = 1; 
                modulos[11] = 1; 
              }
              else if (derecha.substr(3, 1) == "6")
              {
                modulos[0] = 1; 
                modulos[10] = 1; 
              }
              else if (derecha.substr(3, 1) == "7")
              {
                modulos[9] = 1; 
                modulos[10] = 1;
                modulos[11] = 1; 
              }
            }
            let sumaModulos = 0;
            for (var i = 0; i < 20; i++) 
            {
              sumaModulos = sumaModulos + +modulos[i];
            }
            
            if (sumaModulos == 0)
            {
              mensaje = this.rTraduccion()[365].replace("campo_0", this.rTraduccion()[3477])
              verFecha = false;
            }
            
            if (verFecha)
            {
              let palabra = this.alterarPalabraClave();
              if (palabra.length > licencia.length)
              {
                licencia = licencia + '0'.repeat(palabra.length - licencia.length);
              }
              else if (licencia.length > palabra.length)
              {
                palabra = palabra + '0'.repeat(licencia.length - palabra.length);
              }
                      //Validar la licencia
                
              let cadComparar = "";
              let validada = true;
              for (var i = 0; i < palabra.length; i++) 
              {
                let numero = (palabra[i].charCodeAt(0) ^ this.mmcall[i].charCodeAt(0)).toString();
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
                if (cadComparar != licencia[i])
                {
                  validada = false;
                  break;
                }
              }
              let anyo = version.substr(7, 1) + version.substr(12, 1) + version.substr(16, 1) + version.substr(21, 1);
              let mes = version.substr(24, 1) + version.substr(28, 1);
              let dia = version.substr(31, 1) + version.substr(34, 1);
              this.aVersion({ vence: anyo + mes + dia, almacenamiento: izquierda.substr(0, 1), tipo: izquierda.substr(1, 1), plantas: izquierda.substr(2, 1), usuarios: izquierda.substr(3, 1), maquinas: izquierda.substr(4, 1), modulos: modulos});
              if (!validada || (verFecha && anyo + mes + dia != "99999999"))
              {
                //Comparar fechas
                let desde= new Date(anyo + "/" + mes + "/" + dia);
                if (desde.getTime() === desde.getTime())
                {
                  this.vctoDemo = this.fecha(2, (anyo + "/" + mes + "/" + dia), "dd-MM-yyyy")
                  let diferencia = ((desde.getTime() - new Date().getTime()) / (1000 * 24 * 60 * 60)).toFixed(0);            
                  if (+diferencia == 0)
                  {
                    this.respuestaLicencia = this.rIdioma()[379]
                  }
                  else if (+diferencia == 1)
                  {
                    this.respuestaLicencia = this.rIdioma()[380];
                  }
                  else if (+diferencia > 1 && +diferencia <= 5)
                  {
                    this.respuestaLicencia = this.rIdioma()[381].replace("campo_1", diferencia);
                  }
                  else if (+diferencia > 5)
                  {
                    this.respuestaLicencia = "" ;
                    this.demoVersion = 2;
                  }
                  else
                  {
                    this.respuestaLicencia = this.rIdioma()[382];
                  }
                  this.validarLicencia(3);
                  
                }
                else
                {
                  
                  this.respuestaLicencia = this.rIdioma()[382];
                  this.validarLicencia(3);
                  return;
                }
              }
              else if (validada)
              {
                this.licenciado = true;
                this.demoVersion = 0;
                this.respuestaLicencia = "";
                this.validarLicencia(3);
              }
            }
            else
            {
              this.respuestaLicencia = this.rTraduccion()[383].replace("campo_0", mensaje);
              this.validarLicencia(3);
            }
          }
        })
      }
      else
      {
        if (this.respuestaLicencia.length== 0)
        {
          //Licencia válida
          this.valida.emit(true);
          this.perpetua = true;
          return;
        }
        else if (this.respuestaLicencia.substr(0,1) != "+")
        {
          this.salir.emit(this.respuestaLicencia);
          this.perpetua = false;
          return;
        }
        else
        {
          this.perpetua = false;
          this.vencimiento.emit(this.respuestaLicencia.substr(0));
          return;
        }
      }
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

  aEscanear(yaEscanear: boolean) {
    if (!this.escanear && yaEscanear)
    {
      this.cadenaEscaneada = "";
    }
    this.escanear = yaEscanear;
    this.listoEscanear.emit(yaEscanear);
    if (!yaEscanear)
    {
      this.cadenaEscaneada = "";
    }
  }

  rEscanear() {
    return this.escanear ;
  }
  
}

