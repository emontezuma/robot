
<?php
    /*
 *   Proyecto: SIGMA - WIP
 *   Autor: Elvis Montezuma
 *   Fecha: Julio-Agosto de 2019
*/
  ini_set('memory_limit', '-1');
  header("Access-Control-Allow-Origin: *");
  header('Content-type: text/html; charset=utf-8');

    class Funciones{

    private $username;
    private $password;
    private $nombre;
    private $perfil;
    private $estatus;
    private $preguntaSecreta;
    private $respuestaSecreta;
    private $userModifies;
    private $conexionFM;
    private $userCreate;
    private $userModify;
    private $divisiones;

    public function __construct(){
      require_once('ConexionFM.php');
      require_once('Conexion.php');
      $this->conexionFM = new ConexionFM();
      $this->conexion = new Conexion();
      date_default_timezone_set ("America/Mexico_City");
    }

    public function set($atributo, $contenido){
      $this->$atributo = $contenido;
    }

    public function get($atributo){
      return $this->$atributo;
    }

    public function consultar($datos)
    {
      $sentencia = $datos['sentencia'];
      try
      {
        $datos = $this->conexionFM->BDCConsultaM($sentencia);
        $envio = array();
        
        while ($row = mysqli_fetch_assoc($datos))
        {
          $envio[] = $row;
        }
        echo json_encode($envio);

      }
      catch (\Exception $e)
      {
        echo json_encode($envio);
      }
    }

    public function indice_unico()
    {
    function UniqueMachineID($salt = "") 
    {
      if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
          $temp = sys_get_temp_dir().DIRECTORY_SEPARATOR."diskpartscript.txt";
          if(!file_exists($temp) && !is_file($temp)) file_put_contents($temp, "select disk 0\ndetail disk");
          $output = shell_exec("diskpart /s ".$temp);
          $lines = explode("\n",$output);
          $result = array_filter($lines,function($line) {
              return stripos($line,"ID:")!==false;
          });
          if(count($result)>0) {
              $result = array_shift(array_values($result));
              $result = explode(":",$result);
              $result = trim(end($result));       
          } else $result = $output;       
      } else {
          $result = shell_exec("blkid -o value -s UUID");  
          if(stripos($result,"blkid")!==false) {
              $result = $_SERVER['HTTP_HOST'];
          }
      }   
      return md5($salt.md5($result));
    }
    echo json_encode(UniqueMachineID());
    }

    
    public function consultar_archivo($datos)
    {
      $sentencia = $datos['sentencia'];
      $archivo = $datos['archivo'];
      if(file_exists($_SERVER['DOCUMENT_ROOT']."/sigma/assets/datos/".$archivo.".csv"))
      {
        unlink($_SERVER['DOCUMENT_ROOT']."/sigma/assets/datos/".$archivo.".csv");
      }
      $sentencia = "USE sigma;".$sentencia." INTO OUTFILE '{$_SERVER['DOCUMENT_ROOT']}/sigma/assets/datos/".$archivo.".csv' FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '".chr(34)."' LINES TERMINATED BY '\n';";
      try
      {
        $resultado = $this->conexionFM->BDCActualiza($sentencia);
        echo json_encode($resultado);

      }
      catch (\Exception $e)
      {
        echo json_encode("error".$e);
      }
    }

    public function actualizar($datos)
    {
      $sentencia = $datos['sentencia'];
      try
      {
        $resultado = $this->conexionFM->BDCActualiza($sentencia);
        echo json_encode($resultado);
      }
      catch (\Exception $e)
      {
        echo json_encode($envio);
      }
    }

    public function actualizarMMCall($datos)
    {
      $sentencia = $datos['sentencia'];
      try
      {
        $resultado = $this->conexion->MMCALLActualiza($sentencia);
        echo json_encode($resultado);
      }
      catch (\Exception $e)
      {
        echo json_encode($envio);
      }
    }

    public function agregar($datos)
    {
      $sentencia = $datos['sentencia'];
      try
      {
        $accion = "A";
        $resultado = $this->conexionFM->BDCAgrega($sentencia);
        echo json_encode($accion. $resultado);
      }
      catch (\Exception $e)
      {
        echo json_encode($envio);
      }
    }

    public function actualizar_planta($datos){
      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $notas = "'".$datos['notas']."'";
      $imagen = "'".$datos['imagen']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";
      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_plantas
          (nombre, referencia, imagen, notas, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $referencia, $imagen, $notas, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }
      else
      {

        $sql =
        "UPDATE sigma.cat_plantas
          SET referencia = $referencia, nombre = $nombre, notas = $notas, imagen = $imagen, estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }
      $accion="A";
      try
      {
        if ($id == 0)
        {

          $resultado = $this->conexionFM->BDCAgrega($sql);
        }
        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_proceso($datos)
    {
      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $notas = "'".$datos['notas']."'";
      $capacidad_stock = $datos['capacidad_stock'];
      $imagen = "'".$datos['imagen']."'";
      $usuario = $datos['usuario'];
      $reduccion_setup ="'".$datos['reduccion_setup']."'";
      $estatus ="'".$datos['estatus']."'";
      $copiandoDesde = $datos['copiandoDesde'];
      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_procesos
          (nombre, reduccion_setup, referencia, imagen, notas, capacidad_stock, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $reduccion_setup, $referencia, $imagen, $notas, $capacidad_stock, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }
      else
      {

        $sql =
        "UPDATE sigma.cat_procesos
          SET referencia = $referencia, reduccion_setup = $reduccion_setup, nombre = $nombre, notas = $notas, imagen = $imagen,
          capacidad_stock = $capacidad_stock,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }
      $accion="A";
      try
      {
        if ($id == 0)
        {

          $resultado = $this->conexionFM->BDCAgrega($sql);
        }
        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }
        if ($copiandoDesde > 0 && $id == 0)
        {
          $sql =
          "INSERT INTO sigma.det_procesos
            (proceso, referencia, programar, nombre, prefijo, notas, capacidad,
            estatus, creacion, modificacion, creado, modificado)

            SELECT $resultado, referencia, programar,nombre, prefijo, notas, capacidad,
            estatus, NOW(), NOW(), $usuario, $usuario
            FROM sigma.det_rutas WHERE proceso = $copiandoDesde;";
            $agregarLineas = $this->conexionFM->BDCAgrega($sql);


        }
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_ruta_cabecera($datos)
    {
      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $notas = "'".$datos['notas']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";
      $copiandoDesde = $datos['copiandoDesde'];
      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_rutas
          (nombre, referencia, notas, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $referencia, $notas, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }

      else
      {
        $sql =
        "UPDATE sigma.cat_rutas a
          SET referencia = $referencia, nombre = $nombre, notas = $notas,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario,
          inicia = (SELECT MIN(secuencia) FROM det_rutas WHERE ruta = a.id AND estatus = 'A'),
          finaliza = (SELECT MAX(secuencia) FROM det_rutas WHERE ruta = a.id AND estatus = 'A')
          WHERE id = $id;";

      }

      $accion="A";

      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }

        if ($copiandoDesde > 0 && $id == 0)
        {
          $sql =
          "INSERT INTO sigma.det_rutas
            (ruta, secuencia, referencia, nombre, prefijo, notas, proceso,
            estatus, creacion, modificacion, creado, modificado)

            SELECT $resultado, secuencia, referencia, nombre, prefijo, notas, proceso,
            estatus, NOW(), NOW(), $usuario, $usuario
            FROM sigma.det_rutas WHERE ruta = $copiandoDesde;";
            $agregarLineas = $this->conexionFM->BDCAgrega($sql);

        }
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }


    public function actualizar_parte($datos)
    {

      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $notas = "'".$datos['notas']."'";
      $tipo = "'".$datos['tipo']."'";
      $imagen = "'".$datos['imagen']."'";
      $usuario = $datos['usuario'];
      $ruta = $datos['ruta'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_partes
          (nombre, referencia, ruta, notas, tipo, imagen, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $referencia, $ruta, $notas, $tipo, $imagen, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }

      else
      {
        $sql =
        "UPDATE sigma.cat_partes
          SET referencia = $referencia, imagen = $imagen, ruta = $ruta, nombre = $nombre, tipo = $tipo, notas = $notas,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_usuario($datos)
    {

      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $notas = "'".$datos['notas']."'";
      $rol = "'".$datos['rol']."'";
      $programacion = "'".$datos['programacion']."'";
      $inventario = "'".$datos['inventario']."'";
      $reversos = "'".$datos['reversos']."'";
      $operacion = "'".$datos['operacion']."'";
      $calidad = "'".$datos['calidad']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_usuarios
          (nombre, inventario, programacion, inicializada, referencia, operacion, rol, reversos, calidad, notas, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $inventario, $programacion, 'S', $referencia, $operacion, $rol, $reversos, $calidad, $notas, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }

      else
      {
        $sql =
        "UPDATE sigma.cat_usuarios
          SET inventario = $inventario, programacion = $programacion, operacion = $operacion, reversos = $reversos, calidad = $calidad, referencia = $referencia, rol = $rol, nombre = $nombre, notas = $notas,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }
      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_situaciones($datos)
    {

      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $tipo = $datos['tipo'];
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_situaciones
          (nombre, tipo, referencia, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $tipo, $referencia, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }

      else
      {
        $sql =
        "UPDATE sigma.cat_situaciones
          SET referencia = $referencia, tipo = $tipo, nombre = $nombre,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }


    public function actualizar_horarios($datos)
    {

      $id = $datos['id'];
      $dia = $datos['dia'];
      $proceso = $datos['proceso'];
      $fecha = "'".$datos['fecha']."'";
      $desde ="'".$datos['desde']."'";
      $hasta ="'".$datos['hasta']."'";
      $tipo ="'".$datos['tipo']."'";
      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.horarios
          (dia, tipo, proceso, fecha, desde, hasta)
          VALUES
            ($dia, $tipo, $proceso, $fecha, $desde, $hasta);";
      }

      else
      {
        $sql =
        "UPDATE sigma.horarios
          SET dia = $dia, tipo = $tipo, proceso = $proceso, fecha = $fecha, desde =  $desde, hasta = $hasta
          WHERE id = $id;";
      }

      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_programacion($datos)
    {

      $id = $datos['id'];
      $cantidad = $datos['cantidad'];
      $parte = $datos['parte'];
      $carga = "'".$datos['carga']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.programacion
          (parte, carga, cantidad, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($parte, $carga, $cantidad, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }

      else
      {
        $sql =
        "UPDATE sigma.programacion
          SET parte = $parte, carga = $carga, cantidad = $cantidad,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_carga($datos)
    {

      $id = $datos['id'];
      $fecha = "'".$datos['fecha']."'";
      $equipo = $datos['equipo'];
      $notas = "'".$datos['notas']."'";
      $carga = "'".$datos['carga']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";
      $permitir_reprogramacion ="'".$datos['permitir_reprogramacion']."'";
      $alarma ="'".$datos['alarma']."'";
      $copiandoDesde = $datos['copiandoDesde'];
      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cargas
          (carga, alarma, permitir_reprogramacion, equipo, fecha, fecha_original, notas, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($carga, $alarma, $permitir_reprogramacion, $equipo, $fecha, $fecha, $notas, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }

      else
      {
        $sql =
        "UPDATE sigma.cargas
          SET carga = $carga, alarma = $alarma, permitir_reprogramacion = $permitir_reprogramacion, equipo = $equipo, fecha = $fecha, notas =  $notas,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }

        if ($copiandoDesde > 0 && $id == 0)
        {
          $sql =
          "INSERT INTO sigma.programacion
            (carga, parte, cantidad,
            estatus, creacion, modificacion, creado, modificado)

            SELECT $resultado, parte, cantidad,
            estatus, NOW(), NOW(), $usuario, $usuario
            FROM sigma.programacion WHERE carga = $copiandoDesde;";
            $agregarLineas = $this->conexionFM->BDCAgrega($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_prioridad($datos)
    {

      $id = $datos['id'];
      $fecha = "'".$datos['fecha']."'";
      $parte = $datos['parte'];
      $proceso = $datos['proceso'];
      $orden = $datos['orden'];
      $notas = "'".$datos['notas']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.prioridades
          (parte, fecha, orden, proceso, notas, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($parte, $fecha, $orden, $proceso, $notas, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }

      else
      {
        $sql =
        "UPDATE sigma.prioridades
          SET parte = $parte, proceso = $proceso, orden = $orden, fecha = $fecha, notas =  $notas,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_recipiente($datos)
    {

      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $mmcall = "'".$datos['mmcall']."'";
      $correos = "'".$datos['correos']."'";
      $telefonos = "'".$datos['telefonos']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_distribucion
          (nombre, telefonos, correos, mmcall, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $telefonos, $correos, $mmcall, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }

      else
      {
        $sql =
        "UPDATE sigma.cat_distribucion
          SET telefonos = $telefonos, correos = $correos, mmcall = $mmcall, nombre = $nombre,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_alertas($datos)
    {

      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $tipo = $datos['tipo'];
      $referencia = "'".$datos['referencia']."'";
      $notas = "'".$datos['notas']."'";
      $escalar1 = "'".$datos['escalar1']."'";
      $escalar2 = "'".$datos['escalar2']."'";
      $escalar3 = "'".$datos['escalar3']."'";
      $acumular = "'".$datos['acumular']."'";
      $acumular_veces = $datos['acumular_veces'];
      $proceso = $datos['proceso'];
      $acumular_tiempo = $datos['acumular_tiempo'];
      $tiempo1 = $datos['tiempo1'];
      $tiempo2 = $datos['tiempo2'];
      $tiempo3 = $datos['tiempo3'];
      $tiempo0 = $datos['tiempo0'];


      $acumular_inicializar = "'".$datos['acumular_inicializar']."'";
      $acumular_tipo_mensaje = "'".$datos['acumular_tipo_mensaje']."'";
      $acumular_mensaje ="'".$datos['acumular_mensaje']."'";

      $sms = "'".$datos['sms']."'";
      $correo = "'".$datos['correo']."'";
      $llamada = "'".$datos['llamada']."'";
      $mmcall = "'".$datos['mmcall']."'";
      $lista = $datos['lista'];
      $sms1 = "'".$datos['sms1']."'";
      $correo1 = "'".$datos['correo1']."'";
      $llamada1 = "'".$datos['llamada1']."'";
      $mmcall1 = "'".$datos['mmcall1']."'";
      $lista1 = $datos['lista1'];
      $repetir1 = "'".$datos['repetir1']."'";
      $sms2 = "'".$datos['sms2']."'";
      $correo2 = "'".$datos['correo2']."'";
      $llamada2 = "'".$datos['llamada2']."'";
      $mmcall2 = "'".$datos['mmcall2']."'";
      $lista2 = $datos['lista2'];
      $repetir2 = "'".$datos['repetir2']."'";
      $sms3 = "'".$datos['sms3']."'";
      $correo3 = "'".$datos['correo3']."'";
      $llamada3 = "'".$datos['llamada3']."'";
      $mmcall3 = "'".$datos['mmcall3']."'";
      $lista3 = $datos['lista3'];
      $repetir3 = "'".$datos['repetir3']."'";
      $repetir = "'".$datos['repetir']."'";
      $repetir_tiempo = $datos['repetir_tiempo'];
      $informar_resolucion = "'".$datos['informar_resolucion']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_alertas
          (nombre, proceso, tipo, acumular_mensaje, referencia, notas, acumular, acumular_veces, acumular_tiempo,
          acumular_inicializar, acumular_tipo_mensaje, sms, correo, llamada, mmcall, lista,
          sms1, correo1, llamada1, mmcall1, lista1, repetir1, sms2, correo2, llamada2, mmcall2, lista2, repetir2,
          sms3, correo3, llamada3, mmcall3, lista3, repetir3, repetir, repetir_tiempo, informar_resolucion,
          escalar1, escalar2, escalar3, tiempo1, tiempo2, tiempo3, tiempo0,
          estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $proceso, $tipo, $acumular_mensaje, $referencia, $notas, $acumular, $acumular_veces, $acumular_tiempo,
          $acumular_inicializar, $acumular_tipo_mensaje, $sms, $correo, $llamada, $mmcall, $lista,
          $sms1, $correo1, $llamada1, $mmcall1, $lista1, $repetir1, $sms2, $correo2, $llamada2, $mmcall2, $lista2, $repetir2,
          $sms3, $correo3, $llamada3, $mmcall3, $lista3, $repetir3, $repetir, $repetir_tiempo, $informar_resolucion,
          $escalar1, $escalar2, $escalar3, $tiempo1, $tiempo2, $tiempo3, $tiempo0,
          $estatus, $usuario,  $usuario, NOW(), NOW());";
    }


      else
      {
        $sql =
        "UPDATE sigma.cat_alertas
          SET nombre = $nombre, proceso = $proceso, tipo = $tipo, acumular_mensaje = $acumular_mensaje, referencia = $referencia, notas =$notas, acumular = $acumular,
          acumular_veces = $acumular_veces, acumular_tiempo = $acumular_tiempo, acumular_inicializar = $acumular_inicializar,
          acumular_inicializar = $acumular_inicializar, acumular_tipo_mensaje = $acumular_tipo_mensaje, sms = $sms,
          correo = $correo, llamada = $llamada, mmcall = $mmcall, lista = $lista,
          sms1 = $sms1, correo1 = $correo1, llamada1 = $llamada1, mmcall1 = $mmcall1, lista1 = $lista1,
          repetir1 = $repetir1, sms2 = $sms2, correo2 = $correo2, llamada2 = $llamada2, mmcall2 = $mmcall2, lista2 = $lista2,
          repetir2 = $repetir2, sms3 = $sms3, correo3 = $correo3, llamada3 = $llamada3, mmcall3 = $mmcall3, lista3 = $lista3,
          repetir3 = $repetir3, escalar1 = $escalar1, escalar2 = $escalar2, escalar3 = $escalar3, repetir = $repetir, repetir_tiempo = $repetir_tiempo, informar_resolucion = $informar_resolucion,
          tiempo1 = $tiempo1, tiempo2 = $tiempo2, tiempo3 = $tiempo3, tiempo0 = $tiempo0,
          estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";
      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }


      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_ruta_detalle($datos)
    {

      $id = $datos['id'];
      $ruta = $datos['ruta'];
      $tiempo_stock = $datos['tiempo_stock'];
      $tiempo_proceso = $datos['tiempo_proceso'];
      $tiempo_setup = $datos['tiempo_setup'];
      $tiempo_setup_idem = $datos['tiempo_setup_idem'];
      $piezas_finalizar_paro = $datos['piezas_finalizar_paro'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $notas = "'".$datos['notas']."'";
      $proceso = $datos['proceso'];
      $secuencia = $datos['secuencia'];
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.det_rutas
          (ruta, secuencia, nombre, tiempo_setup, tiempo_setup_idem, piezas_finalizar_paro, tiempo_stock, tiempo_proceso, referencia, proceso, notas, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($ruta, $secuencia, $nombre, $tiempo_setup, $tiempo_setup_idem, $piezas_finalizar_paro, $tiempo_stock, $tiempo_proceso, $referencia, $proceso, $notas, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }
      else
      {

        $sql =
        "UPDATE sigma.det_rutas
          SET secuencia = $secuencia, ruta = $ruta, referencia = $referencia, proceso = $proceso, nombre = $nombre, notas = $notas,
          tiempo_stock = $tiempo_stock, tiempo_proceso = $tiempo_proceso, tiempo_setup = $tiempo_setup, tiempo_setup_idem = $tiempo_setup_idem, piezas_finalizar_paro = $piezas_finalizar_paro, estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";

      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }

      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_proceso_detalle($datos)
    {

      $id = $datos['id'];
      $proceso = $datos['proceso'];
      $capacidad = $datos['capacidad'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $notas = "'".$datos['notas']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";
      $programar ="'".$datos['programar']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_maquinas
          (nombre, capacidad, programar, referencia, proceso, notas, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($nombre, $capacidad, $programar, $referencia, $proceso, $notas, $estatus, $usuario,  $usuario, NOW(), NOW());";
      }
      else
      {

        $sql =
        "UPDATE sigma.cat_maquinas
          SET referencia = $referencia, proceso = $proceso, programar = $programar, nombre = $nombre, notas = $notas,
          capacidad = $capacidad, estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }

      $accion="A";

      try
      {
        if ($id == 0)
        {
          $resultado = $this->conexionFM->BDCAgrega($sql);
        }

        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }

      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_secuencia_ruta($datos)
    {

      $id = $datos['id'];
      $accion="U";
      $sql =
      "UPDATE sigma.cat_rutas a
        SET inicia = (SELECT MIN(secuencia) FROM det_rutas WHERE ruta = a.id AND estatus = 'A'),
        finaliza = (SELECT MAX(secuencia) FROM det_rutas WHERE ruta = a.id AND estatus = 'A')
        WHERE id = $id;";
      try
      {
        $resultado = $this->conexionFM->BDCActualiza($sql);
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_secuencia_ruta2($datos)
    {

      $id = $datos['id'];
      $accion="U";
      $miSQL = "SELECT id FROM sigma.det_rutas WHERE ruta = $id ORDER BY secuencia";
      $datos = $this->conexionFM->BDCConsultaM($miSQL);
      $numero = 0;
      $sentencia = "";
      try
      {
        while ($row = mysqli_fetch_assoc($datos))
        {
          $numero = $numero + 1;
          $sentencia = $sentencia."UPDATE sigma.det_rutas
          SET secuencia = $numero
          WHERE id = $row[id];";
        }
        $sentencia = $sentencia."UPDATE sigma.cat_rutas a
        SET inicia = (SELECT MIN(secuencia) FROM det_rutas WHERE ruta = a.id AND estatus = 'A'),
        finaliza = (SELECT MAX(secuencia) FROM det_rutas WHERE ruta = a.id AND estatus = 'A')
        WHERE id = $id;";
        $resultado = $this->conexionFM->BDCActualiza($sentencia);
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    //Nuevas funciones SIGMA v2

    public function actualizar_v2($datos)
    {
      $id = $datos['sentencia'];
      $miSQL = "SELECT sentencia FROM consultas_be WHERE id = $id AND estatus = 'A' AND version = 2 ORDER BY orden";
      $recs = $this->conexionFM->BDCConsultaM($miSQL);
      try
      {
        $cadenaSQL = "";
        while ($row = mysqli_fetch_assoc($recs))
        {
          $cadenaSQL = $cadenaSQL.$row['sentencia'];
        } 
        
        if (strlen($cadenaSQL) > 0) 
        {
          foreach($datos['campos'] as $key => $value)
          {
            $cadenaSQL = str_replace('campo_'.$key, $value, $cadenaSQL);
          }
          //Se ejecuta la sentencia
          $sentencia = $cadenaSQL;
          try
          {
            $resultado = $this->conexionFM->BDCActualiza($sentencia);
            echo json_encode($resultado);
          }
          catch (\Exception $e)
          {
            echo json_encode($envio);
          }

        }
        else
        {
          echo json_encode("[{'Error': 'Consulta no hallada'}]");
        }
      }
      catch (\Exception $e)
      {
        echo json_encode("[{'Error: 'Error en la sentencia'}]");
      }
      
    }

    public function consultar_v2($datos)
    {
      $id = $datos['sentencia'];
      $miSQL = "SELECT sentencia FROM consultas_be WHERE id = $id AND estatus = 'A' AND version = 2 ORDER BY orden";
      $recs = $this->conexionFM->BDCConsultaM($miSQL);
      try
      {
        $cadenaSQL = "";
        while ($row = mysqli_fetch_assoc($recs))
        {
          $cadenaSQL = $cadenaSQL.$row['sentencia'];
        }
        if (strlen($cadenaSQL) > 0) 
        {
          foreach($datos['campos'] as $key => $value)
          {
            $cadenaSQL = str_replace('campo_'.$key, $value, $cadenaSQL);
          }
          //Se ejecuta la sentencia
          $sentencia = $cadenaSQL;
          try
          {
            $filas = $this->conexionFM->BDCConsultaM($sentencia);
            if ($filas)
            {
              $envio = array();
              while ($row = mysqli_fetch_assoc($filas))
              {
                $envio[] = $row;
              }
              echo json_encode($envio);
            }
            else
            {
              echo json_encode("[{'Error': 'Consulta no ejecutada'}]");  
            }
    
          }
          catch (\Exception $e)
          {
            echo json_encode($envio);
          }

        }
        else
        {
          echo json_encode("[{'Error': 'Consulta no hallada'}]");
        }
      }
      catch (\Exception $e)
      {
        echo "error";
        echo json_encode("[{'Error: 'Error en la sentencia'}]");
      }
      
    }
  }
?>
