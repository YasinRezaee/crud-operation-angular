import { ChangeDetectionStrategy, Component, inject, OnInit, Pipe, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProductDialogComponent } from './Dialogs/add-product-dialog/add-product-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from './Service/api.service';
import { NgFor } from '@angular/common';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatPaginator,
    MatPaginatorModule,
    MatSort,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    NgFor,
    CurrencyPipe,
    DatePipe,


  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'id', 'productName', 'productCategory', 'date', 'freshness', 'price', 'comment', 'edit', 'delete'];
  dataSource!: MatTableDataSource<any>;

  constructor(private dialog: MatDialog, private api: ApiService) { }
  ngOnInit(): void {
    this.getAllProducts()
  }

  onOpenAddDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '40%',
      maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        this.getAllProducts()
        console.log(`Dialog result: ${result}`);
      });
  }
  getAllProducts() {
    this.api.getProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort;

      }, error(err) {
        console.log(err);

      },
    })
  }
  onEditProduct(row: any) {
    console.log('edit', row);
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '40%',
      maxHeight: '80vh',
      data: row
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        this.getAllProducts()
        console.log(`Dialog result: ${result}`);
      });

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  removeProduct(row: any) {
    this.api.removeProduct(row.id).subscribe({
      next: (res) => {
        alert('product removed successfully!')
        this.getAllProducts()
      }, error: (err) => {
        console.log(err);

      }
    })
  }
}
