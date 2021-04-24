import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.css']
})
export class SnackComponent implements OnInit {

  constructor
  (
    public snackBarRef: MatSnackBarRef<SnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) 
  { 
    var re = new RegExp(String.fromCharCode(160), "g");
    this.data.mensaje = this.data.mensaje.replace(re, " ")
  }

  ngOnInit() {
  }

}
