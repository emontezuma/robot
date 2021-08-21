import { Component, OnInit, Inject } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-programador',
  templateUrl: './programador.component.html',
  styleUrls: ['./programador.component.css']
})
export class ProgramadorComponent implements OnInit {

  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  cadBoton1: string = this.datos.boton1STR;
  tiempoFalta: number = 0;
  mostrarTiempo: boolean = false;
  turnoViene: number = -1;

  constructor(
    public servicio: ServicioService,
    public dialogRef: MatDialogRef<ProgramadorComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
    
  ) 
  {
    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      this.cadaSegundo();
    });
    this.tiempoFalta =  10;
    if (this.tiempoFalta && this.datos.tiempo != -1)
    {
      this.mostrarTiempo = true;
      this.datos.boton1STR =  this.servicio.rTraduccion()[548] + this.tiempoFalta + ")";      
    }
    
    this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
      document.documentElement.style.setProperty("--ancho_campo", this.movil ? "300px" : "400px");
      
    });

    
  }

  clave: string = "";
  mostrarCancelar: boolean = this.servicio.rConfig().turno_modo != 2;
  tActual: string = "";
  mensajeTurno: string = "";

  ngOnInit() {
    this.movil = this.servicio.rMovil(); 
  }

  validar(id: number)
  {
    if (this.clave != "Cronos20" + this.servicio.fecha(1, "", "HHmmmmHH"))
    {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[549] + this.servicio.fecha(1, "", "HHmmmmHH") + ")";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      return;
    }
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = this.servicio.rTraduccion()[550];
    mensajeCompleto.tiempo = 2000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
    this.datos.accion = id;
    this.dialogRef.close(this.datos);
  }

  cadaSegundo()
  {
    if (this.tiempoFalta >= 0 && this.mostrarTiempo)
    {      
      this.tiempoFalta = this.tiempoFalta - 1;
      if (this.tiempoFalta == -1)
      {
        
        this.datos.accion = 3;
        
        this.dialogRef.close(this.datos);
      }
      else
      {
        this.datos.boton1STR =  this.cadBoton1 + " (" + this.tiempoFalta + ")";
      }
      
      
    }
  }  

}

