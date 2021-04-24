<?php

define("MYSQL_CONN_ERROR", "No hay conexión con la base de datos.");
mysqli_report(MYSQLI_REPORT_STRICT);

/*
 *   Proyecto: SIGMA - WIP
 *   Autor: Elvis Montezuma
 *   Fecha: Julio-Agosto de 2019
*/


class Conexion{

    private $datos = array(
        "host" => "127.0.0.1",
        "user" => "root",
        "pass" => "usbw",
        "db" => "robot"

    );


    private $connection;
    private $validateConnection;

    public function __construct(){
      try {
        $this->abrirBD();
      }catch (Exception $e) {
        echo('error en  conexion');
      }
    }

      public function abrirBD() {
      try {
          $this->connection = new \mysqli($this->datos['host'],
              $this->datos['user'],
              $this->datos['pass'],
              $this->datos['db']
          );
          $this->connection->set_charset("utf8");
        } catch (mysqli_sql_exception $e) {
           throw $e;
        }
      }

    public function MMCALLConsultaS($sql){
        $this->connection->query($sql);
    }

    public function MMCALLConsultaM($sql){
        $datos = $this->connection->query($sql);
        return $datos;
    }

    public function MMCALLActualiza($sql){
        $datos = $this->connection->query($sql);
        $id = mysqli_insert_id($this->connection);
        return $id;
    }

    public function validar(){
        if($this->connection){
            $this->validadeConnection = true;
        }
        return $this->validateConnection;
    }

    function __destruct(){
      try {
        mysqli_close($this->connection);
      }catch (Exception $e) {
        return;
      }
    }


}
