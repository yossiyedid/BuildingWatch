import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Tenant } from "../tenant.model";
import { TenantsService } from "../tenants.service";
import { Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-tenant-list",
  templateUrl: "./tenant-list.component.html",
  styleUrls: ["./tenant-list.component.css"]
})
export class TenantListComponent implements OnInit, OnDestroy {
  public tenants = new MatTableDataSource<Tenant>();
  public tableMode: string = "all";
  public allTenants :Tenant[];

  private tenantsSub: Subscription;

  public displayedColumns = [
    "name",
    "address",
    "phone",
    "financialDebt",
    "update",
    "delete"
  ];

  constructor(private tenantsService: TenantsService) {}

  ngOnInit() {
    this.tenantsService.getTenants(); //trigger the http
    this.tenantsSub = this.tenantsService //listen to changes
      .getTenantUpdateListener()
      .subscribe(tenants => {
        this.tenants.data = tenants;
        this.allTenants = this.tenants.data; //allTenants is temp array. will help me to filter the data
      });
  }

  ngOnDestroy(): void {
    this.tenantsSub.unsubscribe();
  }

  onDelete(tenantId: string) {
    this.tenantsService.deleteTenant(tenantId);
  }


  //filtering the table by value insert in text-box.
  doFilter(value: string) {

      this.tenants.filterPredicate = (data: Tenant, filter: string) => {
        return (data.name.indexOf(value) != -1);
      };
    this.tenants.filter = value.trim().toLocaleLowerCase();
  }

  changeTableMode(){ //when changing the radio button. filtering the table data.
    if(this.tableMode == "all") {
      //all tenants
      this.tenants.data = this.allTenants;
    } else if (this.tableMode == "with") {
      //with debt
      const withTenants:Tenant[] = this.allTenants.filter(t => t.financialDebt > 0);
      this.tenants.data = withTenants;
    } else {
        //tenants with debt == 0
        const withoutTenants:Tenant[] = this.allTenants.filter(t => t.financialDebt == 0);
        this.tenants.data = withoutTenants;
      }
    }



}
