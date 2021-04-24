import { Component, OnInit, Inject } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogowip',
  templateUrl: './dialogowip.component.html',
  styleUrls: ['./dialogowip.component.css']
})
export class DialogowipComponent implements OnInit {

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
  esteUsuario;
  
  visibilidad: string = "password";
  causas = [];  

  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  cadBoton1: string = this.datos.boton1STR;
  tiempoFalta: number = 0;
  mostrarTiempo: boolean = false;
  turnoViene: number = -1;
  mostrarCancelar: boolean = true;


  constructor(
    public servicio: ServicioService,
    public dialogRef: MatDialogRef<DialogowipComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
    
  ) 
  {
    this.datos.claves = "";
    this.datos.causa = -1;
    this.listarCausas();
  }

  ngOnInit() {
  }


  listarCausas()
  {
    if (this.datos.revision > -1)
    {
      let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_situaciones WHERE tipo = " + this.datos.revision + " ORDER BY nombre;"
      this.causas = [];
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        this.causas = resp;
      });
    }
  }

validarCalidad()
{
  if (this.esteUsuario.esAdmin)
  {
    this.datos.usuarioCalidad = this.servicio.rUsuario().id;
    this.datos.accion = 1;
    if (this.datos.causa>-1)
    {
      this.datos.causaC = this.causas[this.datos.causa].id;
      this.datos.causaD = this.causas[this.datos.causa].nombre;
    }
    this.dialogRef.close(this.datos);
    return;
  }
  else
  {
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + this.esteUsuario.id + " AND opcion = " + this.datos.accion;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.datos.usuarioCalidad = this.servicio.rUsuario().id;
        this.datos.accion = 1;
        if (this.datos.causa>-1)
        {
          this.datos.causaC = this.causas[this.datos.causa].id;
          this.datos.causaD = this.causas[this.datos.causa].nombre;
        }
        this.dialogRef.close(this.datos);
        return;
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[192].replace("campo_0", this.datos.usuario);
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }
  
}
  
  validar(id: number)
  {
    if (id==1 && this.datos.clave >= 1)
    {
      let sentencia = "SELECT id, estatus, admin FROM " + this.servicio.rBD() + ".cat_usuarios WHERE referencia = '" + this.datos.usuario + "' AND clave = AES_ENCRYPT('" + this.datos.claves + "', '" + this.servicio.alterarPalabraClave() + "');";
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length == 0)
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[193];
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
        else if (resp[0].estatus != "A")
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[194].replace("campo_0", this.datos.usuario)
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
        else
        {
          this.esteUsuario = {id: resp[0].id, esAdmin: resp[0].admin=="S"};
          this.validarCalidad();
        }
      })
    }
    else
    {
      this.datos.accion = id;
      this.dialogRef.close(this.datos);
    }
    
  }

}
