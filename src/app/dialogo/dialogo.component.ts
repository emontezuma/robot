import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common'
    

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent implements OnInit {

  @ViewChild("txtT1", { static: false }) txtT1: ElementRef;
  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  error01: boolean = false;
  error02: boolean = false;
  cadBoton1: string = this.datos.boton1STR;
  tiempoFalta: number = 0;
  mostrarTiempo: boolean = false;
  turnoViene: number = -1;
  ordenValor: any = [];

  constructor(
    public servicio: ServicioService,
    public dialogRef: MatDialogRef<DialogoComponent>, 
    public datepipe: DatePipe,

    @Inject(MAT_DIALOG_DATA) public datos: any
    
  ) 
  {
    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      this.cadaSegundo();
    });
    this.tiempoFalta =  + this.servicio.rConfig().limitar_respuestas;
    if (this.tiempoFalta && this.datos.tiempo != -1 && !datos.agregarValor && !datos.modificarVan)
    {
      this.mostrarTiempo = true;
      this.datos.boton1STR =  this.cadBoton1 + " (" + this.tiempoFalta + ")";      
    }
    var re = new RegExp(String.fromCharCode(160), "g");
    if (this.datos.mensaje)
    {
      this.datos.mensaje = this.datos.mensaje.replace(re, " ")
    }
    
  }

  turnos: any = [];
  mostrarCancelar: boolean = this.servicio.rConfig().turno_modo != 2 || !this.datos.turno ;
  tActual: string = "";
  mensajeTurno: string = "";

  ngOnInit() {

    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") 
      {
        this.servicio.aEscapado(true);
        this.validar(this.datos.botones);
      }
    });
  
    this.dialogRef.backdropClick().subscribe(event => {
      this.validar(this.datos.botones);
    });

    this.listarTurnos();
    if (this.datos.agregarValor > 0)
    {
      this.ordenValor.push(this.servicio.rTraduccion()[186]);
      this.ordenValor.push(this.servicio.rTraduccion()[187]);
      if (this.datos.totalValores > 1)
      {
        let limite = this.datos.totalValores;
        if (this.datos.agregarValor == 1)
        {
          limite = limite + 1;
        }
        for (var i = 2; i < limite ; i++)
        {
          this.ordenValor.push(i)
        }
        
      }
      if (this.datos.orden == -1)
      {
        this.datos.orden = 1;
      }
      else if (this.datos.orden == this.datos.totalValores - 1)
      {
        this.datos.orden = 1;
      }
      else if (this.datos.orden == 0)
      {
        this.datos.orden = 0;
      }
      else
      {
        this.datos.orden = +this.datos.orden + 1;
      }     
    }
    else if (this.datos.modificarVan)
    {
      this.datos.valorVariable = this.datos.valorVariable * 1; 
      this.txtT1.nativeElement.focus();
    }
  }

  listarTurnos()
  {
    this.tActual = this.servicio.rTraduccion()[188];
    let sentencia = "SELECT id, nombre, inicia, termina, secuencia FROM " + this.servicio.rBD() + ".cat_turnos ORDER BY secuencia;"
    this.turnos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.turnos = resp;
      
      if (this.datos.id == 0)
      {
        this.mensajeTurno = this.servicio.rTraduccion()[189]
        if (resp.length > 0)
        {
          for (var i = 0; i < resp.length; i++) 
          {
            if (resp[i].id == this.servicio.rTurno().id)
            {
              this.tActual = this.servicio.rTraduccion()[190] +  resp[i].nombre + " (" + resp[i].inicia + "-" + resp[i].termina + ")";
            }
            if (+resp[i].secuencia > +this.servicio.rTurno().secuencia)
            {
              this.datos.idTurno = resp[i].id;
              this.turnoViene = 1;
            }
          }
          if (this.turnoViene == -1)
          {
            this.datos.idTurno = resp[0].id;
          } 
        }
      }
      else if (this.datos.id != -1)
      {
        this.mensajeTurno = this.servicio.rTraduccion()[189]
        this.datos.idTurno = this.datos.id;
      }
      else
      {
        this.datos.idTurno = this.servicio.rTurno().id;
        this.mensajeTurno = this.servicio.rTraduccion()[191]
        this.tActual = this.servicio.rTraduccion()[190] +  this.servicio.rTurno().nombre + " (" + this.servicio.rTurno().inicia + "-" + this.servicio.rTurno().termina + ")";
      }
    });
  }
  
  validar(id: number)
  {
    if (id == 1 && this.datos.replanear>0)
    {
      let miHora = +this.datos.horaIni < 10 ? "0" +this.datos.horaIni :this.datos.horaIni;
      this.error01 = false;
      this.error02 = false;
      let errores = 0
      if (!this.datos.fechaIni)
      {
        this.error01 = true;
        this.txtT1.nativeElement.focus();
        errores = errores + 1;
      }
      else if (this.datepipe.transform(this.datos.fechaIni, "yyyyMMdd") + miHora <= this.datepipe.transform(new Date(), "yyyyMMddHH")) 
      {
        this.error02 = true;
        this.txtT1.nativeElement.focus();
        errores = errores + 1;
      }
      if (errores > 0)
      {
        return;
      }
    }
    this.datos.accion = id;
    //this.datos.idturno = 
    this.dialogRef.close(this.datos);
  }

  cadaSegundo()
  {
    if (this.tiempoFalta >= 0 && this.mostrarTiempo)
    {      
      this.tiempoFalta = this.tiempoFalta - 1;
      if (this.tiempoFalta == -1)
      {
        if (this.datos.mensaje.length==0 && this.servicio.rConfig().turno_modo == 2)
        {
          this.datos.accion = 1;  
        }
        else if (this.datos.boton_cancelar)
        {
          this.datos.accion = this.datos.boton_cancelar;
        }
        else
        {
          this.datos.accion = 3;
        }
        
        this.dialogRef.close(this.datos);
      }
      else
      {
        this.datos.boton1STR =  this.cadBoton1 + " (" + this.tiempoFalta + ")";
      }
      
      
    }
  }  

}

