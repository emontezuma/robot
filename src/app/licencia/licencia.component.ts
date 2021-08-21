import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-licencia',
  templateUrl: './licencia.component.html',
  styleUrls: ['./licencia.component.css']
})
export class LicenciaComponent implements OnInit {

  clave: string = "";
  licencia: string = "";
  palabraClave: string = "CronosIntegracion2019";
  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  

  constructor(
    public servicio: ServicioService,
    public dialogRef: MatDialogRef<LicenciaComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) 
  {
    
  }

  ngOnInit() {

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

  validar(id: number)
  {
    if (id == 1)
    {
      this.validarLicencia(1);      
    }
    else if (id == 2)
    {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[364];
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      this.datos.accion = 2;
      this.dialogRef.close(this.datos);
    }
  }

  validarLicencia(paso: number)
  {
    let mensaje = "";
    
    let partes = this.licencia.split("-");
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
      mensaje = this.servicio.rTraduccion()[365].replace("campo_0", "(SUM_Error)");
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
        mensaje = this.servicio.rTraduccion()[365].replace("campo_0", this.servicio.rTraduccion()[3470])
        verFecha = false;
      }
      else
      {
        if (izquierda.substr(0, 1) > "1")
        {
          mensaje = this.servicio.rTraduccion()[365].replace("campo_0", this.servicio.rTraduccion()[3471])
          verFecha = false;
        }
        else
        {
          if (izquierda.substr(1, 1) > "2")
          {
            mensaje = this.servicio.rTraduccion()[365].replace("campo_0", this.servicio.rTraduccion()[3472])
            verFecha = false;
          }
          else
          {
            if (izquierda.substr(2, 1) > "1")
            {
              mensaje = this.servicio.rTraduccion()[365].replace("campo_0", this.servicio.rTraduccion()[3473])
              verFecha = false;
            }
            else
            {
              if (izquierda.substr(3, 1) > "4")
              {
                mensaje = this.servicio.rTraduccion()[365].replace("campo_0", this.servicio.rTraduccion()[3474])
                verFecha = false;
              }
              else
              {
                if (izquierda.substr(4, 1) > "4")
                {
                  mensaje = this.servicio.rTraduccion()[365].replace("campo_0", this.servicio.rTraduccion()[3475])
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
        mensaje = this.servicio.rTraduccion()[365].replace("campo_0", this.servicio.rTraduccion()[3476])
        verFecha = false;
      }
      else
      {
        if (derecha.substr(0, 1) > "7")
        {
          mensaje = this.servicio.rTraduccion()[365].replace("campo_0", "(Mod1_error)")
          verFecha = false;
        }
        else
        {
          if (derecha.substr(1, 1) > "7")
          {
            mensaje = this.servicio.rTraduccion()[365].replace("campo_0", "(Mod2_error)")
            verFecha = false;
          }
          else
          {
            if (derecha.substr(2, 1) > "7")
          {
              mensaje = this.servicio.rTraduccion()[365].replace("campo_0", "(Mod3_error)")
              verFecha = false;
            }
            else
            {
              if (derecha.substr(4, 1) > "7")
              {
                mensaje = this.servicio.rTraduccion()[365].replace("campo_0", "(Mod4_error)")
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
      mensaje = this.servicio.rTraduccion()[365].replace("campo_0", this.servicio.rTraduccion()[3477])
      verFecha = false;
    }
    
    if (verFecha)
    {
      let palabra = this.servicio.alterarPalabraClave();
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
        let numero = (palabra[i].charCodeAt(0) ^ this.clave[i].charCodeAt(0)).toString();
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
      if (!validada || (verFecha && anyo + mes + dia != "99999999"))
      {
        //Comparar fechas
        
        let desde = new Date(anyo + "/" + mes + "/" + dia);
        if (desde.getTime() === desde.getTime())
        {
          
          let vctoDemo = this.servicio.fecha(2, (anyo + "/" + mes + "/" + dia), "dd-MM-yyyy")
          let diferencia = ((desde.getTime() - new Date().getTime()) / (1000 * 24 * 60 * 60)).toFixed(0);            
          if (+diferencia <= 0)
          {
            mensaje = this.servicio.rTraduccion()[366]
          }
          else if (+diferencia > 1)
          {
            mensaje = this.servicio.rTraduccion()[367].replace("campo_0", diferencia);
          }
        }
        else
        {
          mensaje = this.servicio.rTraduccion()[368];
        }
      }
      else if (validada)
      {
        mensaje = this.servicio.rTraduccion()[369];
      }
      if (mensaje.substr(0, 1) == "+")
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".configuracion SET licencia = '" + this.licencia + "'";
        let campos = {accion: 200, sentencia: sentencia};
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          
          this.servicio.aVersion({ vence: "99999999", almacenamiento: izquierda.substr(0, 1), tipo: izquierda.substr(1, 1), plantas: izquierda.substr(2, 1), usuarios: izquierda.substr(3, 1), maquinas: izquierda.substr(4, 1), modulos: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]});
        });
                  
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = mensaje.substr(1);
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        this.datos.accion = 1;
        this.dialogRef.close(this.datos);
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = mensaje;
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    }
    else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = mensaje;
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    
      

  }

}
