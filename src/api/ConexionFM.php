<?php

/*
 *   Proyecto: SIGMA - WIP
 *   Autor: Elvis Montezuma
 *   Fecha: Julio-Agosto de 2019
*/

class ConexionFM{
/*
*/
    private $datos = array(
        "host" => "127.0.0.1",
        "user" => "root",
        "pass" => "usbw",
        "db" => "robot"
    );


    private $connectionFM;
    private $validateConnectionFM;

    public function __construct(){
      try {
        $this->abrirBDFM();
      }catch (Exception $e) {
        throw $e;
        return;
      }
    }

      public function abrirBDFM() {
      try {
          $this->connectionFM = new \mysqli($this->datos['host'],
              $this->datos['user'],
              $this->datos['pass'],
              $this->datos['db']
          );
          $this->connectionFM->set_charset("utf8");
        } catch (mysqli_sql_exception $e) {
           throw $e;
        }
      }

    public function BDCConsultaS($sql){
        $this->connectionFM->query($sql);
    }

    public function BDCConsultaM($sql){
      try {

        $datos = $this->connectionFM->query($sql);

        return $datos;
      } catch (\Exception $e) {
        echo "error";
        throw $e;
      }
    }

    public function BDCActualiza($sql){
        $datos = $this->connectionFM->multi_query($sql);
        return $this->connectionFM->affected_rows;
    }

    public function BDCAgrega($sql){
        $datos = $this->connectionFM->query($sql);
        return $this->connectionFM->insert_id;
    }

    function __destruct(){
      try {
        
        mysqli_close($this->connectionFM);
      }catch (Exception $e) {
        return;
      }
    }
}
