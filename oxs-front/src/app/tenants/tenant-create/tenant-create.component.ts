import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Tenant } from "../tenant.model";
import { TenantsService } from "../tenants.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-tenant-create",
  templateUrl: "./tenant-create.component.html",
  styleUrls: ["./tenant-create.component.css"]
})
export class TenantCreateComponent implements OnInit {
  private mode = "create";
  private tenantId: string;
  public tenant: Tenant;


  constructor(
    private tenantsService: TenantsService,
    public route: ActivatedRoute
  ) {}

  onSaveTenant(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode == "create") {
      const tenant: Tenant = {
        name: form.value.name,
        phone: form.value.phone,
        address: form.value.address,
        financialDebt: form.value.financialDebt,
        id: null
      };
      this.tenantsService.addTenant(tenant);
      form.resetForm();
    } else {
      this.tenantsService.updateTenant(
        this.tenantId,
        form.value.name,
        form.value.address,
        form.value.phone,
        form.value.financialDebt
      );
    }
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //listen to url changes
      if (paramMap.has("tenantId")) {
        //checking if we are in edit mode.
        this.mode = "edit";
        this.tenantId = paramMap.get("tenantId"); //get the tenantId from the url
        this.tenantsService.getTenant(this.tenantId).subscribe(tenant => {
          //retrieve the tenant from tenantService to edit him
          this.tenant = {
            id: tenant._id,
            name: tenant.name,
            address: tenant.address,
            phone: tenant.phone,
            financialDebt: tenant.financialDebt
          };
        });
      } else {
        this.mode = "create";
        this.tenantId = null;
      }
    });
  }
}
