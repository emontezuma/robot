import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTooltipModule, 
    MatSidenavModule, 
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatDatepickerModule,
    MatListModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatMenuModule,
    MatProgressBarModule,
    MatDividerModule,
    MatNativeDateModule,
    TextFieldModule,
    MatFormFieldModule
  ],
  exports: [MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTooltipModule, 
    MatSidenavModule, 
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule, 
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatDatepickerModule,
    MatListModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatMenuModule,
    MatProgressBarModule,
    MatDividerModule,
    MatNativeDateModule,
    TextFieldModule,
    MatFormFieldModule
  ],
})
export class MaterialModule { }

