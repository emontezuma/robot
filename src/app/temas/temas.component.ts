import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from '../dialogo/dialogo.component';

;

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.css']
})
export class TemasComponent implements OnInit {

  @ViewChild("txtT1", { static: false }) txtT1: ElementRef;

  clave: string = "";
  licencia: string = "";
  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  validar04: boolean = false;
  encontrado: boolean = false;
  detalle: any = [];
  bot1: boolean = false;
  reporte: string = "";
  temaActual: string = "";

  constructor(
    public servicio: ServicioService,
    public dialogo: MatDialog, 
    public dialogRef: MatDialogRef<TemasComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) 
  {
    
  }

  ngOnInit() {
  }

  validar(id: number)
  {
    if (id == 0)
    {
      let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".pu_colores WHERE nombre = '" + this.reporte + "'" ;
      let campos = {accion: 100, sentencia: sentencia};
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length == 0)
        {
          this.detalle.id = 0;
        }
        else
        {
          this.detalle.id = resp[0].id;
        }
        
      })      
      return;
    }

    if (id == 1)
    {
      this.validar(0);
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[430], mensaje: this.servicio.rTraduccion()[431].replace("campo_0", this.reporte), id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[27], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_eliminar" }
      });

      respuesta.afterClosed().subscribe(result => 
      {
        if (result)
        {
          if (result.accion == 1) 
          {
            let tmp = JSON.parse(JSON.stringify(this.detalle));

            tmp.fondo_total = this.detalle.fondo_total ? this.detalle.fondo_total.substr(1) : "";
            tmp.fondo_barra_superior = this.detalle.fondo_barra_superior ? this.detalle.fondo_barra_superior.substr(1) : "";
            tmp.fondo_barra_inferior = this.detalle.fondo_barra_inferior ? this.detalle.fondo_barra_inferior.substr(1) : "";
            tmp.fondo_aplicacion = this.detalle.fondo_aplicacion ? this.detalle.fondo_aplicacion.substr(1) : "";
            tmp.fondo_seleccion = this.detalle.fondo_seleccion ? this.detalle.fondo_seleccion.substr(1) : "";
            tmp.fondo_boton = this.detalle.fondo_boton ? this.detalle.fondo_boton.substr(1) : "";
            tmp.fondo_slider = this.detalle.fondo_slider ? this.detalle.fondo_slider.substr(1) : "";
            tmp.fondo_tarjeta = this.detalle.fondo_tarjeta ? this.detalle.fondo_tarjeta.substr(1) : "";
            tmp.fondo_boton_inactivo = this.detalle.fondo_boton_inactivo ? this.detalle.fondo_boton_inactivo.substr(1) : "";
            tmp.fondo_boton_positivo = this.detalle.fondo_boton_positivo ? this.detalle.fondo_boton_positivo.substr(1) : "";
            tmp.fondo_boton_negativo = this.detalle.fondo_boton_negativo ? this.detalle.fondo_boton_negativo.substr(1) : "";
            tmp.fondo_boton_barra = this.detalle.fondo_boton_barra ? this.detalle.fondo_boton_barra.substr(1) : "";
            tmp.fondo_tiptool = this.detalle.fondo_tiptool ? this.detalle.fondo_tiptool.substr(1) : "";
            tmp.fondo_logo = this.detalle.fondo_logo ? this.detalle.fondo_logo.substr(1) : "";
            tmp.fondo_snack_normal = this.detalle.fondo_snack_normal ? this.detalle.fondo_snack_normal.substr(1) : "";
            tmp.fondo_snack_error = this.detalle.fondo_snack_error ? this.detalle.fondo_snack_error.substr(1) : "";
            tmp.borde_total = this.detalle.borde_total ? this.detalle.borde_total.substr(1) : "";
            tmp.borde_seleccion = this.detalle.borde_seleccion ? this.detalle.borde_seleccion.substr(1) : "";
            tmp.borde_hover = this.detalle.borde_hover ? this.detalle.borde_hover.substr(1) : "";
            tmp.borde_boton = this.detalle.borde_boton ? this.detalle.borde_boton.substr(1) : "";
            tmp.borde_boton_inactivo = this.detalle.borde_boton_inactivo ? this.detalle.borde_boton_inactivo.substr(1) : "";
            tmp.borde_tarjeta = this.detalle.borde_tarjeta ? this.detalle.borde_tarjeta.substr(1) : "";
            tmp.borde_tiptool = this.detalle.borde_tiptool ? this.detalle.borde_tiptool.substr(1) : "";
            tmp.color_impar = this.detalle.color_impar ? this.detalle.color_impar.substr(1) : "";
            tmp.color_par = this.detalle.color_par ? this.detalle.color_par.substr(1) : "";
            tmp.texto_tarjeta = this.detalle.texto_tarjeta ? this.detalle.texto_tarjeta.substr(1) : "";
            tmp.texto_tarjeta_resalte = this.detalle.texto_tarjeta_resalte ? this.detalle.texto_tarjeta_resalte.substr(1) : "";
            tmp.texto_barra_superior = this.detalle.texto_barra_superior ? this.detalle.texto_barra_superior.substr(1) : "";
            tmp.texto_barra_inferior = this.detalle.texto_barra_inferior ? this.detalle.texto_barra_inferior.substr(1) : "";
            tmp.texto_boton = this.detalle.texto_boton ? this.detalle.texto_boton.substr(1) : "";
            tmp.texto_boton_inactivo = this.detalle.texto_boton_inactivo ? this.detalle.texto_boton_inactivo.substr(1) : "";
            tmp.texto_boton_positivo = this.detalle.texto_boton_positivo ? this.detalle.texto_boton_positivo.substr(1) : "";
            tmp.texto_boton_negativo = this.detalle.texto_boton_negativo ? this.detalle.texto_boton_negativo.substr(1) : "";
            tmp.texto_boton_barra = this.detalle.texto_boton_barra ? this.detalle.texto_boton_barra.substr(1) : "";
            tmp.texto_seleccion = this.detalle.texto_seleccion ? this.detalle.texto_seleccion.substr(1) : "";
            tmp.texto_tiptool = this.detalle.texto_tiptool ? this.detalle.texto_tiptool.substr(1) : "";
            tmp.texto_snack_normal = this.detalle.texto_snack_normal ? this.detalle.texto_snack_normal.substr(1) : "";
            tmp.texto_snack_error = this.detalle.texto_snack_error ? this.detalle.texto_snack_error.substr(1) : "";
            tmp.texto_solo_texto = this.detalle.texto_solo_texto ? this.detalle.texto_solo_texto.substr(1) : "";
            tmp.estatus = this.detalle.estatus;
            let sentencia = "";
            if (this.detalle.id == 0 || !this.detalle.id)
            {
              sentencia = "INSERT INTO " + this.servicio.rBD() + ".pu_colores (nombre) VALUES('" + this.reporte + "');" ;
            }
            
            sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".pu_colores SET fondo_total = '" + tmp.fondo_total + "', fondo_barra_superior = '" + tmp.fondo_barra_superior + "', fondo_barra_inferior = '" + tmp.fondo_barra_inferior + "', fondo_aplicacion = '" + tmp.fondo_aplicacion + "', fondo_seleccion = '" + tmp.fondo_seleccion + "', fondo_slider = '" + tmp.fondo_slider + "', fondo_tarjeta = '" + tmp.fondo_tarjeta + "', fondo_boton_inactivo = '" + tmp.fondo_boton_inactivo + "', fondo_boton = '" + tmp.fondo_boton + "', fondo_boton_positivo = '" + tmp.fondo_boton_positivo + "', fondo_boton_negativo = '" + tmp.fondo_boton_negativo + "', fondo_boton_barra = '" + tmp.fondo_boton_barra + "', fondo_tiptool = '" + tmp.fondo_tiptool + "', fondo_logo = '" + tmp.fondo_logo + "', fondo_snack_normal = '" + tmp.fondo_snack_normal + "', fondo_snack_error = '" + tmp.fondo_snack_error + "', borde_total = '" + tmp.borde_total + "', borde_seleccion = '" + tmp.borde_seleccion + "', borde_hover = '" + tmp.borde_hover + "', borde_boton = '" + tmp.borde_boton + "', borde_boton_inactivo = '" + tmp.borde_boton_inactivo + "', borde_boton_inactivo = '" + tmp.borde_boton_inactivo + "', borde_tarjeta = '" + tmp.borde_tarjeta + "', borde_tarjeta = '" + tmp.borde_tarjeta + "', borde_tiptool = '" + tmp.borde_tiptool + "', color_impar = '" + tmp.color_impar + "', color_par = '" + tmp.color_par + "', texto_tarjeta = '" + tmp.texto_tarjeta + "', texto_tarjeta_resalte = '" + tmp.texto_tarjeta_resalte + "', texto_barra_superior = '" + tmp.texto_barra_superior + "', texto_barra_inferior = '" + tmp.texto_barra_inferior + "', texto_boton = '" + tmp.texto_boton + "', texto_boton_inactivo = '" + tmp.texto_boton_inactivo + "', texto_boton_positivo = '" + tmp.texto_boton_positivo + "', texto_boton_negativo = '" + tmp.texto_boton_negativo + "', texto_boton_barra = '" + tmp.texto_boton_barra + "', texto_seleccion = '" + tmp.texto_seleccion + "', texto_tiptool = '" + tmp.texto_tiptool + "', texto_snack_normal = '" + tmp.texto_snack_normal + "', texto_snack_error = '" + tmp.texto_snack_error + "', texto_solo_texto = '" + tmp.texto_solo_texto + "', estatus = '" + tmp.estatus + "' WHERE nombre = '" + this.reporte + "'" ;
            let campos = {accion: 200, sentencia: sentencia};
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let nuevo: boolean = false;
              if (this.detalle.id == 0)
              {
                nuevo = true;
                sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".pu_colores;";
                let campos = {accion: 100, sentencia: sentencia};  
                this.servicio.consultasBD(campos).subscribe(resp =>
                {
                  
                  this.detalle.id = resp[0].nuevoid;
                })
              }
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal"
              this.validar01 = false;
              this.validar02 = false;
              this.validar03 = false;
              this.validar04 = false;
              this.bot1 = false;
              if (nuevo)
              {
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[432].replace("campo_0", this.reporte);
              }
              else
              {
                mensajeCompleto.mensaje = this.servicio.rTraduccion()[433].replace("campo_0", this.reporte);
              
              }
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
              setTimeout(() => {
                this.txtT1.nativeElement.focus();  
              }, 100);
              
            });
          }      
        }
      })

      
    }
    else if (id == 2)
    {
      this.datos.accion = id;
      this.dialogRef.close(this.datos);
    }
    else
    {
      this.buscarColores();
    }
  }


buscarColores()
{
  let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_colores WHERE nombre = '" + this.reporte + "'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length > 0)
    {
      this.encontrado = true;
      this.temaActual = this.reporte;
      resp[0].fondo_total = resp[0].fondo_total ? ("#" + resp[0].fondo_total) : "";
      resp[0].fondo_barra_superior = resp[0].fondo_barra_superior ? ("#" + resp[0].fondo_barra_superior) : "";
      resp[0].fondo_barra_inferior = resp[0].fondo_barra_inferior ? ("#" + resp[0].fondo_barra_inferior) : "";
      resp[0].fondo_aplicacion = resp[0].fondo_aplicacion ? ("#" + resp[0].fondo_aplicacion) : "";
      resp[0].fondo_seleccion = resp[0].fondo_seleccion ? ("#" + resp[0].fondo_seleccion) : "";
      resp[0].fondo_boton = resp[0].fondo_boton ? ("#" + resp[0].fondo_boton) : "";
      resp[0].fondo_slider = resp[0].fondo_slider ? ("#" + resp[0].fondo_slider) : "";
      resp[0].fondo_tarjeta = resp[0].fondo_tarjeta ? ("#" + resp[0].fondo_tarjeta) : "";
      resp[0].fondo_boton_inactivo = resp[0].fondo_boton_inactivo ? ("#" + resp[0].fondo_boton_inactivo) : "";
      resp[0].fondo_boton_positivo = resp[0].fondo_boton_positivo ? ("#" + resp[0].fondo_boton_positivo) : "";
      resp[0].fondo_boton_negativo = resp[0].fondo_boton_negativo ? ("#" + resp[0].fondo_boton_negativo) : "";

      resp[0].fondo_boton_barra = resp[0].fondo_boton_barra ? ("#" + resp[0].fondo_boton_barra) : "";
      resp[0].fondo_tiptool = resp[0].fondo_tiptool ? ("#" + resp[0].fondo_tiptool) : "";
      resp[0].fondo_logo = resp[0].fondo_logo ? ("#" + resp[0].fondo_logo) : "";
      resp[0].fondo_snack_normal = resp[0].fondo_snack_normal ? ("#" + resp[0].fondo_snack_normal) : "";
      resp[0].fondo_snack_error = resp[0].fondo_snack_error ? ("#" + resp[0].fondo_snack_error) : "";

      resp[0].borde_total = resp[0].borde_total ? ("#" + resp[0].borde_total) : "";
      resp[0].borde_seleccion = resp[0].borde_seleccion ? ("#" + resp[0].borde_seleccion) : "";
      resp[0].borde_hover = resp[0].borde_hover ? ("#" + resp[0].borde_hover) : "";
      resp[0].borde_boton = resp[0].borde_boton ? ("#" + resp[0].borde_boton) : "";
      resp[0].borde_boton_inactivo = resp[0].borde_boton_inactivo ? ("#" + resp[0].borde_boton_inactivo) : "";

      resp[0].borde_tarjeta = resp[0].borde_tarjeta ? ("#" + resp[0].borde_tarjeta) : "";
      resp[0].borde_tiptool = resp[0].borde_tiptool ? ("#" + resp[0].borde_tiptool) : "";
      resp[0].color_impar = resp[0].color_impar ? ("#" + resp[0].color_impar) : "";
      resp[0].color_par = resp[0].color_par ? ("#" + resp[0].color_par) : "";
      resp[0].texto_tarjeta = resp[0].texto_tarjeta ? ("#" + resp[0].texto_tarjeta) : "";

      resp[0].texto_tarjeta_resalte = resp[0].texto_tarjeta_resalte ? ("#" + resp[0].texto_tarjeta_resalte) : "";
      resp[0].texto_barra_superior = resp[0].texto_barra_superior ? ("#" + resp[0].texto_barra_superior) : "";
      resp[0].texto_barra_inferior = resp[0].texto_barra_inferior ? ("#" + resp[0].texto_barra_inferior) : "";
      resp[0].texto_boton = resp[0].texto_boton ? ("#" + resp[0].texto_boton) : "";
      resp[0].texto_boton_inactivo = resp[0].texto_boton_inactivo ? ("#" + resp[0].texto_boton_inactivo) : "";
      resp[0].texto_boton_positivo = resp[0].texto_boton_positivo ? ("#" + resp[0].texto_boton_positivo) : "";
      resp[0].texto_boton_negativo = resp[0].texto_boton_negativo ? ("#" + resp[0].texto_boton_negativo) : "";
      resp[0].texto_boton_barra = resp[0].texto_boton_barra ? ("#" + resp[0].texto_boton_barra) : "";
      resp[0].texto_seleccion = resp[0].texto_seleccion ? ("#" + resp[0].texto_seleccion) : "";

      resp[0].texto_tiptool = resp[0].texto_tiptool ? ("#" + resp[0].texto_tiptool) : "";
      resp[0].texto_snack_normal = resp[0].texto_snack_normal ? ("#" + resp[0].texto_snack_normal) : "";
      resp[0].texto_snack_error = resp[0].texto_snack_error ? ("#" + resp[0].texto_snack_error) : "";
      resp[0].texto_solo_texto = resp[0].texto_solo_texto ? ("#" + resp[0].texto_solo_texto) : "";

      this.detalle = resp[0];
      
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[2187];
      mensajeCompleto.tiempo = 3000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
    }
    else
    {
      this.detalle = [];
      this.detalle.id = 0;
      this.encontrado = false;
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[2188];
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
    }
    this.bot1 = false;
  })
}

iniReporte()
{
  if (this.reporte == "" || !this.reporte)
  {
    this.detalle = [];
    this.encontrado = false;
  }
  else if (this.reporte != this.temaActual)
  {
    this.cambiando();
  }
  
}

cambiando()
  {
    this.bot1 = this.reporte != "";
  }

eliminar()
{
  const respuesta = this.dialogo.open(DialogoComponent, {
    width: "420px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[1625], mensaje: "Esta acción ELIMINARÁ PERMANENTEMENTE el tema: <strong>" + this.reporte + "</strong> y no estará disponible<br><br><strong>¿Desea continuar con la operación?</strong>", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: this.servicio.rTraduccion()[388], icono1: "in_seleccionado", boton2STR: this.servicio.rTraduccion()[77], icono2: "i_cancelar", icono0: "i_eliminar" }
  });
  respuesta.afterClosed().subscribe(result => 
  {
    if (result)
    {
      if (result.accion == 1) 
      {
        let sentencia = "DELETE FROM " + this.servicio.rBD() + ".pu_colores WHERE nombre = '" + this.reporte + "'";
        let campos = {accion: 200, sentencia: sentencia};
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          this.detalle = [];
          this.reporte = "";
          this.encontrado = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal"
          this.validar01 = false;
          this.validar02 = false;
          this.validar03 = false;
          this.validar04 = false;
          mensajeCompleto.mensaje = this.servicio.rTraduccion()[2189];
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          setTimeout(() => {
            this.txtT1.nativeElement.focus();  
          }, 100);
        })
      }
    }
  })
}

}


