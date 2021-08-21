<?php

/*
 *   Proyecto: SIGMA - WIP
 *   Autor: Elvis Montezuma
 *   Fecha: Julio-Agosto de 2019
*/
  ini_set('memory_limit', '-1');
  require('excel/excel_reader2.php');
  require('excel/SpreadsheetReader.php');
  header("Access-Control-Allow-Origin: *");
  header('Content-type: text/html; charset=utf-8');

  $accion = $_GET['accion'];
  require_once('Funciones.php');

  $funciones = new Funciones();

  
  if ($accion=='consultar') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->consultar($data);
  }
  else if ($accion=='consultar_v2') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->consultar_v2($data);
  }
  else if ($accion=='consultar_archivo') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->consultar_archivo($data);
  }
  else if ($accion=='actualizar') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar($data);
  }
  else if ($accion=='actualizar_v2') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_v2($data);
  }
  else if ($accion=='actualizarMMCall') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizarMMCall($data);
  }
  

  
  else if ($accion=='agregar') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->agregar($data);
  }
  else if ($accion=='actualizar_planta') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_planta($data);
  }

  else if ($accion=='actualizar_proceso') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_proceso($data);
  }

  else if ($accion=='actualizar_usuario') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_usuario($data);
  }

  else if ($accion=='actualizar_ruta_cabecera') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_ruta_cabecera($data);
  }
  else if ($accion=='actualizar_parte') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_parte($data);
  }
  else if ($accion=='actualizar_recipiente') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_recipiente($data);
  }
  else if ($accion=='actualizar_situaciones') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_situaciones($data);
  }
  else if ($accion=='actualizar_alertas') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_alertas($data);
  }
  else if ($accion=='actualizar_ruta_detalle') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_ruta_detalle($data);
  }
  else if ($accion=='actualizar_horarios') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_horarios($data);
  }
  else if ($accion=='actualizar_programacion') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_programacion($data);
  }
  else if ($accion=='actualizar_carga') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_carga($data);
  }
  else if ($accion=='actualizar_prioridad') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_prioridad($data);
  }
  else if ($accion=='actualizar_proceso_detalle') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_proceso_detalle($data);
  }
  else if ($accion=='actualizar_secuencia_ruta') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_secuencia_ruta($data);
  }
  else if ($accion=='actualizar_secuencia_ruta2') 
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_secuencia_ruta2($data);
  }

  else if ($accion=='indice_unico') 
  {
    $datos=$funciones->indice_unico();
  }

  
  else if ($accion=='recuperar_imagenes') 
  {
    $dir = "../../soporte/src/assets/imagenes/carrusel/";
    $return_array = array();
    if(is_dir($dir)){
        if($dh = opendir($dir)){
            while(($file = readdir($dh)) != false){
                if($file == "." or $file == ".."){
                } else {
                    $return_array[] = $file;
                }
            }
        }
        echo json_encode($return_array);
      }
    else
    {
      $respuesta = ["vacio"];
      echo json_encode($respuesta);
    }
  }
  else if ($accion=='recuperar_mapa') 
  {
    $id = $_GET['id'];
    $datos=$funciones->recuperar_mapa($id);
  }
  else if ($accion=='recuperar_excel') 
  {
      

      $Reader = new SpreadsheetReader('Finales OEE.xlsx');
      $envio = array();
      foreach ($Reader as $Row)
      {
        $envio[] = $Row;
      }  
      
      echo json_encode($envio);
  }

  
  ?>
