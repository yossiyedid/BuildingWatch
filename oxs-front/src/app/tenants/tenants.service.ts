import { Injectable } from "@angular/core";
import { Tenant } from "./tenant.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TenantsService {
  tenants: Tenant[] = [];
  private tenantsUpdated = new Subject<Tenant[]>();

  getTenants() {
    //return a copy of tenants array
    this.http
      .get<{ msg: string; tenants: any }>("http://localhost:3000/api/tenants")
      .pipe(
        //using pipe to map the res from server
        map(tenantData => {
          return {
            tenants: tenantData.tenants.map(tenant => {
              return {
                name: tenant.name,
                phone: tenant.phone,
                id: tenant._id,
                address: tenant.address,
                financialDebt: tenant.financialDebt,
                creator: tenant.creator
              };
            })
          };
        })
      )
      .subscribe(afterPipeData => {
        console.log("after tenantData");

        this.tenants = afterPipeData.tenants;
        console.log(this.tenants);
        this.tenantsUpdated.next([...this.tenants]);
      });
  }

  getTenantUpdateListener() {
    return this.tenantsUpdated.asObservable();
  }
  addTenant(tenant: Tenant) {
    this.http
      .post<{ msg: string; tenantId: string }>(
        "http://localhost:3000/api/tenants",
        tenant
      )
      .subscribe(responseData => {
        tenant.id = responseData.tenantId;
        this.tenants.push(tenant); //gets here only if post successful. send to backend,db and store it locally too
        this.tenantsUpdated.next([...this.tenants]); //send updated array(clone)
      });
  }

  deleteTenant(tenantId: string) {
    this.http
      .delete("http://localhost:3000/api/tenants/" + tenantId)
      .subscribe(() => {
        this.tenants = this.tenants.filter(tenant => tenant.id != tenantId); //fast remove from tenants table (UI)
        this.tenantsUpdated.next([...this.tenants]);
      });
  }

  getTenant(id: string) {
    return this.http.get<{//type of object that we get from the server(not a tenant obj - this is with _id)
      _id: string;
      name: string;
      address: string;
      phone: string;
      financialDebt: number;
      creator: string
    }>("http://localhost:3000/api/tenants/" + id);
  }

  updateTenant(
    id: string,
    name: string,
    address: string,
    phone: string,
    financialDebt: number
  ) {
    const tenant: Tenant = {
      id: id,
      name: name,
      address: address,
      phone: phone,
      financialDebt: financialDebt,
    };
    this.http
      .put("http://localhost:3000/api/tenants/" + id, tenant)
      .subscribe(response => {
        //response from the server
        console.log(response);
        const updatedTenants = [...this.tenants]; //clone tenants arr
        const oldTenantIndex = updatedTenants.findIndex(t => t.id == id); //get the edited tenant index
        updatedTenants[oldTenantIndex] = tenant; //replace with the edited tenant fpr instance change view
        this.tenants = updatedTenants;
        this.tenantsUpdated.next([...this.tenants]); //notify the listeners that tenants are updated
      });
  }

  constructor(private http: HttpClient) {}
}
