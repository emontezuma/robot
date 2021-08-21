import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {

  claveInicializada: boolean = false;
  claveIncorrecta: boolean = false;
  
  politicas: string = "";
  politica: number = 0;
  error01: boolean = false;
  politicaIncompleta: boolean = false;
  politicasLargo: number = 0;
  politicasReq: boolean = false;
  claveUsada: number = -1;
  politicasUsadas: number = 0;
  politicasEspeciales: boolean = false;
  politicasNumeros: boolean = false;
  politicasMayusculas: boolean = false;
  visibilidad: string = "password";
  visibilidad2: string = "password";
  visibilidad3: string = "password";
  visibilidad1: string = "password";
  tiempoFalta: number = 0;
  uCambio;

  validar01: boolean = false;
  validar02: boolean = false;
  causas = [];  
  fase: number = 1;
  mostrarTiempo: boolean = false;
  cadBoton1: string = this.datos.boton1STR;

  constructor(
    public servicio: ServicioService,
    public dialogRef: MatDialogRef<SesionComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
    
  ) 
  {
    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      this.cadaSegundo();
    });
    this.tiempoFalta =  +this.servicio.rConfig().limitar_inicio
    if (this.tiempoFalta > 0)
    {
      this.mostrarTiempo = true;
      setTimeout(() => {
        this.datos.accion = 3;
        this.dialogRef.close(this.datos);
        
      }, this.tiempoFalta * 1000);
    }
    this.datos.clave = "";
    this.datos.nuevaClave = "";
    this.datos.nuevaClaveCon = "";
    this.mostrarInit();
    this.buscarPolitica();
  }

  @ViewChild("txtNvaClave", { static: false }) txtNvaClave: ElementRef;
  @ViewChild("txtUsuario", { static: false }) txtUsuario: ElementRef;
  @ViewChild("txtclaveActual", { static: false }) txtclaveActual: ElementRef;

  ngOnInit() {
  }

  mostrarInit()
  {
    this.claveInicializada = false;
    let sentencia = "SELECT id, ucambio, inicializada FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id = " + this.datos.idUsuario;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.claveInicializada = resp[0].inicializada == "S";
        this.uCambio = resp[0].ucambio;
        if (this.claveInicializada)
        {
          this.datos.claveActual = "abcdefghijk";
        }
      }
    });
  }

  validar(id: number)
  {
    if (this.datos.sesion == 1)
    {
      this.datos.directoAlVisor = false;
      if (id==1)
      {
        let sentencia = "SELECT a.*, b.obligatoria FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".politicas b ON a.politica = b.id WHERE a.referencia = '" + this.datos.usuario + "' AND (b.obligatoria = 'N' OR AES_DECRYPT(a.clave, '" + this.servicio.alterarPalabraClave() + "') = '" + this.datos.clave + "' OR a.inicializada = 'S');";
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
          else if (resp[0].estatus == "Y")
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[459].replace("campo_0", this.datos.usuario)
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
          else if (resp[0].inicializada == 'S' && (resp[0].obligatoria=='S' || !resp[0].obligatoria))
          {
            this.datos.idUsuario = resp[0].id;
            this.datos.titulo = this.servicio.rTraduccion()[460]
            this.politica = resp[0].politica;
            this.mostrarInit();
            this.buscarPolitica();
            this.datos.sesion = 2;
            setTimeout(() => {
            this.txtNvaClave.nativeElement.focus();  
            }, 300);
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[461];
            mensajeCompleto.tiempo = 3000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            
          }
          else if (this.datos.sesion == 2) 
          {
            this.datos.sesion = 1;
            setTimeout(() => {
              this.txtUsuario.nativeElement.focus();  
            }, 300);
          }
          else if (resp[0].admin != "S" && resp[0].rol != "V")
          {
            let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + resp[0].id;
            if (this.datos.opcionSel > 0)
            {
              sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + resp[0].id + " AND opcion = " + this.datos.opcionSel;
            }
            
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( opcion =>
            {
              if (opcion.length > 0)
              {
                this.datos.idUsuario = resp[0].id;
              this.datos.accion = id;
              this.dialogRef.close(this.datos);
              this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[286]);
              }
              else
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                if (this.datos.opcionSel > 0)
                {
                  mensajeCompleto.mensaje = this.servicio.rTraduccion()[462].replace("campo_0", resp[0].nombre);
                }
                else
                {
                  mensajeCompleto.mensaje = this.servicio.rTraduccion()[463].replace("campo_0", resp[0].nombre);
                }
                
                mensajeCompleto.tiempo = 3000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
            })
          }
          else
          {
            if (resp[0].rol == "V")
            {
              this.datos.directoAlVisor = true;  
              localStorage.setItem("ultimoUsuario", resp[0].id);
            }
            else
            {
              localStorage.setItem("ultimoUsuario", "0");
            }
            this.datos.idUsuario = resp[0].id;
            this.datos.accion = id;
            this.dialogRef.close(this.datos);
            this.servicio.mensajeInferior.emit(this.servicio.rTraduccion()[286]);
          }
        })
      }
      else if (id == 2)
      {
        this.datos.accion = id;
        this.dialogRef.close(this.datos);        
      }
    }
    else if (this.datos.sesion==2)
    {
      
      if (id == 1)
      {
        this.valNuevaClave()
        this.error01= false;
        if (this.datos.nuevaClaveCon != this.datos.nuevaClave)
        {
          this.error01= true;
          setTimeout(() => {
            this.txtNvaClave.nativeElement.focus();  
            }, 200);
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = this.servicio.rTraduccion()[464];
            mensajeCompleto.tiempo = 3000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          return;
        }
        
        else if (this.politicasReq || (this.datos.nuevaClave.length > 0))
        {
          if (this.politicaIncompleta)
          {
            
            this.error01 = true;
            setTimeout(() => {
            this.txtNvaClave.nativeElement.focus();  
            }, 200);
            
            
            return;
          }
        }
        if (!this.claveInicializada)
        {
          let sentencia = "SELECT AES_DECRYPT(clave, '" + this.servicio.alterarPalabraClave() + "') AS clave, AES_DECRYPT(claveant1, '" + this.servicio.alterarPalabraClave() + "') AS claveant1, AES_DECRYPT(claveant2, '" + this.servicio.alterarPalabraClave() + "') AS claveant2, AES_DECRYPT(claveant3, '" + this.servicio.alterarPalabraClave() + "') AS claveant3, AES_DECRYPT(claveant4, '" + this.servicio.alterarPalabraClave() + "') AS claveant4, AES_DECRYPT(claveant5, '" + this.servicio.alterarPalabraClave() + "') AS claveant5 FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id = " + this.datos.idUsuario;
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (this.datos.claveActual)
            {
              this.claveUsada = -1;
              if (resp[0].clave != this.datos.claveActual)
              {
                this.claveIncorrecta = true;
                setTimeout(() => {
                  this.txtclaveActual.nativeElement.focus();
                  }, 200);
                
              }
              else if (this.politicasUsadas > 0 && this.datos.nuevaClave.length > 0 && (resp[0].clave==this.datos.nuevaClave))
              {
                this.claveUsada = 0;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 0 && this.datos.nuevaClave.length > 0 && (resp[0].claveant1==this.datos.nuevaClave))
              {
                this.claveUsada = 1;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 1 && this.datos.nuevaClave.length > 0 && (resp[0].claveant2==this.datos.nuevaClave))
              {
                this.claveUsada = 2;
                    setTimeout(() => {
                    this.txtNvaClave.nativeElement.focus();  
                    }, 200);
                return;
              }
              else if (this.politicasUsadas > 2 && this.datos.nuevaClave.length > 0 && (resp[0].claveant3==this.datos.nuevaClave))
              {
                this.claveUsada = 3;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 3 && this.datos.nuevaClave.length > 0 && (resp[0].claveant4==this.datos.nuevaClave))
              {
                this.claveUsada = 4;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 4 && this.datos.nuevaClave.length > 0 && (resp[0].claveant5==this.datos.nuevaClave))
              {
                this.claveUsada = 5;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else
              {
                this.cambiarClave();
              }
            }
            
            else if (resp[0].clave.length!=0)
            {
              this.claveIncorrecta = true;
              setTimeout(() => {
                  this.txtclaveActual.nativeElement.focus();
                  }, 200);
            }
            else
            {
              this.cambiarClave();
            }
          })  
        }
        else
        {
          this.cambiarClave();
        }
      }
      else if (id == 2)
      {
        if (this.datos.sesion = 2) 
        {
          this.datos.titulo = this.servicio.rTraduccion()[266]
          this.datos.sesion = 1;
          setTimeout(() => {
            this.txtUsuario.nativeElement.focus(); 
            }, 300);
          
        }
      }

    }
    else if (this.datos.sesion==3)
    {
      if (id == 1)
      {
        this.error01= false;
        if (this.datos.nuevaClaveCon != this.datos.nuevaClave)
        {
          setTimeout(() => {
            this.txtNvaClave.nativeElement.focus();  
            }, 200);
          return;
        }
        
        else if (this.politicasReq || (this.datos.nuevaClave.length > 0))
        {
          if (this.politicaIncompleta)
          {
            setTimeout(() => {
            this.txtNvaClave.nativeElement.focus();  
            }, 200);
            this.error01 = this.politicaIncompleta;
            return;
          }
        }
        if (!this.claveInicializada)
        {
          let sentencia = "SELECT AES_DECRYPT(clave, '" + this.servicio.alterarPalabraClave() + "') AS clave, AES_DECRYPT(claveant1, '" + this.servicio.alterarPalabraClave() + "') AS claveant1, AES_DECRYPT(claveant2, '" + this.servicio.alterarPalabraClave() + "') AS claveant2, AES_DECRYPT(claveant3, '" + this.servicio.alterarPalabraClave() + "') AS claveant3, AES_DECRYPT(claveant4, '" + this.servicio.alterarPalabraClave() + "') AS claveant4, AES_DECRYPT(claveant5, '" + this.servicio.alterarPalabraClave() + "') AS claveant5 FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id = " + this.datos.idUsuario;
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (this.datos.claveActual)
            {
              this.claveUsada = -1;
              if (resp[0].clave != this.datos.claveActual)
              {
                this.claveIncorrecta = true;
                setTimeout(() => {
                  this.txtclaveActual.nativeElement.focus();
                  }, 200);
              }
              else if (this.politicasUsadas > 0 && this.datos.nuevaClave.length > 0 && (resp[0].clave==this.datos.nuevaClave))
              {
                this.claveUsada = 0;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 0 && this.datos.nuevaClave.length > 0 && (resp[0].claveant1==this.datos.nuevaClave))
              {
                this.claveUsada = 1;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 1 && this.datos.nuevaClave.length > 0 && (resp[0].claveant2==this.datos.nuevaClave))
              {
                this.claveUsada = 2;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 2 && this.datos.nuevaClave.length > 0 && (resp[0].claveant3==this.datos.nuevaClave))
              {
                this.claveUsada = 3;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 3 && this.datos.nuevaClave.length > 0 && (resp[0].claveant4==this.datos.nuevaClave))
              {
                this.claveUsada = 4;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else if (this.politicasUsadas > 4 && this.datos.nuevaClave.length > 0 && (resp[0].claveant5==this.datos.nuevaClave))
              {
                this.claveUsada = 5;
                setTimeout(() => {
                this.txtNvaClave.nativeElement.focus();  
                }, 200);
                return;
              }
              else
              {
                this.cambiarClave();
              }
            }
            
            else if (resp[0].clave.length!=0)
            {
              this.claveIncorrecta = true;
              setTimeout(() => {
                  this.txtclaveActual.nativeElement.focus();
                  }, 200);
            }
            else
            {
              this.cambiarClave();
            }
          })  
        }
        else
        {
          this.cambiarClave();
        }
      }
      else if (id == 2)
      {
        this.datos.accion = id;
        this.dialogRef.close(this.datos);
      }
    }
  }

  cambiarClave()
  {
    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET inicializada = 'N', claveant5 = claveant4, claveant4 = claveant3, claveant3 = claveant2, claveant2 = claveant1, claveant1 = clave, clave = AES_ENCRYPT('" + this.datos.nuevaClave + "', '" + this.servicio.alterarPalabraClave() + "'), ucambio = NOW() WHERE id = " + this.datos.idUsuario;
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.datos.accion = 1;
      this.dialogRef.close(this.datos);
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = this.servicio.rTraduccion()[465];
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      this.servicio.mensajeInferior.emit("");
    })
  }

  cadaSegundo()
  {
    if (this.tiempoFalta >= 0 && this.mostrarTiempo)
    {      
      this.datos.boton1STR =  this.cadBoton1 + " (" + this.tiempoFalta + ")";
      this.tiempoFalta = this.tiempoFalta - 1;
    }
  }  

  buscarPolitica()
  {
    if (this.politica == 0)
    {
      if (this.servicio.rUsuario().politica)
      {
        if (this.servicio.rUsuario().politica > 0)
        {
          this.politica = this.servicio.rUsuario().politica;
        }
    
      }
    }
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".politicas WHERE id = " + this.politica;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.politicasUsadas = resp[0].usadas;
        this.politicasReq = resp[0].obligatoria == "S";
        
        let mensajes = resp[0].complejidad.split(";");
        if (resp[0].complejidad)
        {
          this.politicasLargo = +mensajes[0];
          this.politicasEspeciales = mensajes[1]=="S";
          this.politicasNumeros = mensajes[2]=="S";
          this.politicasMayusculas = mensajes[3]=="S";
        }
        this.valNuevaClave()
      }
      else
      {
        this.politicas = this.servicio.rTraduccion()[466];
      }
    })
  }

  valNuevaClave()
  {
    this.politicas = "";
    this.error01 = false;
    this.claveUsada = -1;
    this.claveIncorrecta = false;
    this.politicaIncompleta = false;
    if (this.politicasReq)
    {
      this.politicas = this.servicio.rTraduccion()[467];
    }
    else
    {
      this.politicas = this.servicio.rTraduccion()[468];
    }
    this.politicas = this.politicas + (this.politicasLargo > 0 && this.datos.nuevaClave.length < this.politicasLargo ? this.servicio.rTraduccion()[469].replace("campo_0", this.politicasLargo) : "");
    this.politicaIncompleta = this.politicasLargo > 0 && this.datos.nuevaClave.length < this.politicasLargo;
    if (this.politicasEspeciales)
    {
      let  especiales = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (!especiales.test(this.datos.nuevaClave))
      {
        this.politicaIncompleta= true;
        this.politicas = this.politicas + (this.politicasEspeciales ? this.servicio.rTraduccion()[470] : "");
      }
    }
    if (this.politicasNumeros)
    {
      let numeros = /[1234567890]/;
      if (!numeros.test(this.datos.nuevaClave))
      {
        this.politicaIncompleta= true;
        this.politicas = this.politicas + (this.politicasNumeros ? this.servicio.rTraduccion()[471] : "");
      }
    }
    if (this.politicasMayusculas)
    {
      let mayusculas = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
      var minusculas =     /[abcdefghijklmnopqrstuvwxyz]/;
      if (!mayusculas.test(this.datos.nuevaClave) || !minusculas.test(this.datos.nuevaClave))
      {
        this.politicaIncompleta= true;
        this.politicas = this.politicas + (this.politicasMayusculas ? this.servicio.rTraduccion()[472] : "");
      }
    }
  }

  convertTexto(cadena: string, funcion: number)
  {
    if (funcion == 1)
    {
      return (cadena.substr(0, 1).toUpperCase + cadena.substr(1));
    }
    else if (funcion == 2)
    {
      return (cadena.toUpperCase);
    }
  }

validarUsuarios()
{
  let sentencia = "SELECT COUNT(*) AS total FROM " + this.servicio.rBD() + ".cat_maquinas WHERE estatus = 'A'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    if (resp.length > 0)
    {
      let tMaquinas = this.servicio.rVersion().maquinas == 1 ? 20 : this.servicio.rVersion().maquinas == 2 ? 50 : this.servicio.rVersion().maquinas == 3 ? 100 :  500;
      if (+resp[0].total > 20 && this.servicio.rVersion().maquinas == 1 || +resp[0].total > 50 && this.servicio.rVersion().maquinas == 2 || +resp[0].total > 100 && this.servicio.rVersion().maquinas == 3 || +resp[0].total > 500)
      {
        //const respuesta = this.dialogo.open(DialogoComponent, {
        //width: "400px", panelClass: 'dialogo_atencion', data: { titulo: this.servicio.rTraduccion()[164], tiempo: 0, mensaje: this.servicio.rTraduccion()[3633].replace("campo_0", tMaquinas), alto: "60", id: 0, accion: 0, botones: 1, boton1STR: this.servicio.rTraduccion()[76], icono1: "in_seleccionado", boton2STR: "", icono2: "", boton3STR: "", icono3: "", icono0: "i_maquina" } })
      }
      else
      {
        //this.valMaquinas = true;
      }
    }
  })
}

}

