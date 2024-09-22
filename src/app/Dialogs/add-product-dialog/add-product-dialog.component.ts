import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../Service/api.service';


@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,


  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss'
})
export class AddProductDialogComponent implements OnInit {
  freshnessList = ['Brand New', 'Second Hand', 'Renovated'];
  productForm!: FormGroup;
  data = inject(MAT_DIALOG_DATA);
  btnAction: string = "Save"
  constructor(private fb: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,

  ) { }
  ngOnInit(): void {
    this.createProductsForm()
    console.log(this.data);
    this.editPatchValues(this.data)

  }

  createProductsForm() {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productCategory: [null, Validators.required],
      date: ['', Validators.required],
      freshness: ["", Validators.required],
      price: [0, Validators.required],
      comment: ['', Validators.required],

    })
  }
  editPatchValues(recievedData: any) {
    if (this.data) {
       this.btnAction = "Update"
      this.productForm.patchValue({
        productName: recievedData?.productName,
        productCategory: recievedData.productCategory,
        date: recievedData.date,
        freshness: recievedData.freshness,
        price: recievedData.price,
        comment: recievedData.comment,
      })
    }
   
  }

  onAddProcuct(dataForm: any) {
    console.log(dataForm);
    if (!this.data) {
      if (dataForm) {
        this.api.postProduct(dataForm).subscribe(
          {
            next: (res) => {
              alert("product added successfully")
              this.productForm.reset();
              this.dialogRef.close('saved')
             
            },
            error: () => {
              alert("the adding process faced an error!")
            }
          },)
      } 
    }else {
      this.updateProduct(dataForm)
    }
  }
  updateProduct(dataForm: any) {

    this.api.updateProduct(dataForm, this.data.id).subscribe({
      next: (res) => {
        alert("product updated successfully")
        this.productForm.reset();
        this.dialogRef.close('update')
      }
    })
  }
}
