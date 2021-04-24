import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-fijarequi',
  templateUrl: './fijarequi.component.html',
  styleUrls: ['./fijarequi.component.css']
})
export class FijarequiComponent implements OnInit {

  @ViewChild("txtT1", { static: false }) txtT1: ElementRef;

  maquinas = [];
  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  tipoResumen: string = "";

  constructor(
    public servicio: ServicioService,
    public dialogRef: MatDialogRef<FijarequiComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) 
  {
    
  }

  ngOnInit() {
    this.carrusel();
  }

  carrusel()
 {
  this.maquinas = [];
  let sentencia = "SELECT * FROM (SELECT 0 AS orden, 'i_planta' AS icono, 'T0' AS id, '" + this.servicio.rTraduccion()[291] + "' AS nombre, '' AS nlinea UNION ALL SELECT 1 AS orden, 'i_lineas' AS icono, CONCAT('L', a.linea) AS id, c.nombre AS nombre, '' AS nlinea FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id AND c.estatus = 'A' WHERE a.estatus = 'A' AND a.oee = 'S' GROUP BY orden, a.linea, icono, nombre, nlinea UNION ALL SELECT 2 AS orden, 'i_maquina' AS icono, CONCAT('M', a.id) AS id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, c.nombre AS nlinea FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id AND c.estatus = 'A' WHERE a.estatus = 'A' AND a.oee = 'S') AS a ORDER BY a.orden, a.nombre;"
  if (this.servicio.rUsuario().maquina=="N")
  {
    sentencia = "SELECT * FROM (SELECT 0 AS orden, 'i_planta' AS icono, 'T0' AS id, '" + this.servicio.rTraduccion()[292] + "' AS nombre, '' AS nlinea UNION ALL SELECT 1 AS orden, 'i_lineas' AS icono, CONCAT('L', a.linea) AS id, c.nombre AS nombre, '' AS nlinea FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.usuario = " + this.servicio.rUsuario().id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' AND a.oee = 'S' GROUP BY orden, a.linea, icono, nombre, nlinea UNION ALL SELECT 2 AS orden, 'i_maquina' AS icono, CONCAT('M', a.id) AS id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, c.nombre AS nlinea FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.usuario = " + this.servicio.rUsuario().id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id AND c.estatus = 'A' WHERE a.estatus = 'A' AND a.oee = 'S') AS a ORDER BY a.orden, a.nombre;"
  }
  else if (this.servicio.rUsuario().linea=="N")
  {
    sentencia = "SELECT * FROM (SELECT 0 AS orden, 'i_planta' AS icono, 'T0' AS id, '" + this.servicio.rTraduccion()[292] + "' AS nombre, '' AS nlinea UNION ALL SELECT 1 AS orden, 'i_lineas' AS icono, CONCAT('L', a.linea) AS id, c.nombre AS nombre, '' AS nlinea FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.linea = b.proceso AND b.tipo = 1 AND b.usuario = " + this.servicio.rUsuario().id + " INNER JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id WHERE a.estatus = 'A' AND a.oee = 'S' GROUP BY orden, a.linea, icono, nombre, nlinea UNION ALL SELECT 2 AS orden, 'i_maquina' AS icono, CONCAT('M', a.id) AS id, IF(ISNULL(c.nombre), a.nombre, CONCAT(a.nombre, ' / ',  c.nombre)) AS nombre, c.nombre AS nlinea FROM " + this.servicio.rBD() + ".cat_maquinas a INNER JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.linea = b.proceso AND b.tipo = 1 AND b.usuario = " + this.servicio.rUsuario().id + " LEFT JOIN " + this.servicio.rBD() + ".cat_lineas c ON a.linea = c.id AND c.estatus = 'A' WHERE a.estatus = 'A' AND a.oee = 'S') AS a ORDER BY a.orden, a.nombre;"
  }
  let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.maquinas = resp;
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = this.servicio.rTraduccion()[293];
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  validar(id: number)
  {
    this.datos.accion = id;
    this.dialogRef.close(this.datos);
  }

  seleccion(event: any) 
  {
    let cadena: string = event.value; 
    if (cadena.substr(0, 1) == "0") 
    {
      this.tipoResumen = this.servicio.rTraduccion()[294];
    }
    else if (cadena.substr(0, 1) == "L") 
    {
      this.tipoResumen = this.servicio.rTraduccion()[295];
    }
    else
    {
      this.tipoResumen = this.servicio.rTraduccion()[2185];
    }
  }


}

