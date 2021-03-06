import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpRestServiceService} from '../http-rest-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DataSource } from '@angular/cdk/collections';
import {ToastrService} from 'ngx-toastr';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {DialogBoxComponent, employee} from '../dialog-box/dialog-box.component';
import { rowsAnimation } from '../animations/template.animations';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  animations: [rowsAnimation]
})

export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['Employee #','First Name','Last Name','Address','Email','Active','Action'];
  dataSource:any = [];
  empNewRec:employee | undefined;

  constructor(public HttpRestService: HttpRestServiceService,
    private SpinnerService: NgxSpinnerService, public dialog: MatDialog, private toastr:ToastrService) { }

    @ViewChild(MatTable,{static:true}) table: MatTable<any> | undefined;

    openDialog(action: any,obj: any) {
      if (obj !== undefined) {
        obj.action = action;
      }
      this.empNewRec=obj;
      const dialogRef = this.dialog.open(DialogBoxComponent, {
        width: '225px',
        data: this.empNewRec
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Add'){
          this.createemployee(result.data);
        }else if(result.event == 'Update'){
          this.updateemployee(result.data);
        }else if(result.event == 'Delete'){
          this.deleteemployee(result.data);
        }
      });

    }

  ngOnInit(): void {
    this.fetchEmployees();
    }


  fetchEmployees(){
    this.SpinnerService.show();
    return this.HttpRestService.getemployees().subscribe((data: {}) => {
      this.dataSource=data;
      this.SpinnerService.hide();
    },(error)=>{
      this.SpinnerService.hide();
      console.log(error);
      this.toastr.error(error);

    })
  }
  deleteemployee(result: any){
    this.SpinnerService.show();
    return this.HttpRestService.deleteemployee(result).subscribe((res)=>{
      this.SpinnerService.hide();
      this.toastr.success("Delete Successful");
      this.fetchEmployees();
    },(error)=>{
      this.SpinnerService.hide();
      console.log(error);
      this.toastr.error(error);

    })
  }
  updateemployee(result: any){
    this.SpinnerService.show();
    return this.HttpRestService.updateemployee(result).subscribe((res)=>{
      this.SpinnerService.hide();
      this.toastr.success("Update Successful");
      this.fetchEmployees();
    },(error)=>{
      this.SpinnerService.hide();
      console.log(error);
      this.toastr.error(error);

    })
  }
  createemployee(result: any){
    this.SpinnerService.show();
    return this.HttpRestService.createemployee(result).subscribe((res)=>{

      this.SpinnerService.hide();
      this.toastr.success("Create Successful");
      this.fetchEmployees();
    },(error)=>{
      this.SpinnerService.hide();
      console.log(error);
      this.toastr.error(error);

    })
  }

}
