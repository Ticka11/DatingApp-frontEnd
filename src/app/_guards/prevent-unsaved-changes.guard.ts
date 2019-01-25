import { Injectable } from "@angular/core";
import { MemberEditComponent } from "../members/member-edit/member-edit.component";
import { CanDeactivate } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {
    //oznacavamo na koju komponentu se odnosi
    canDeactivate(component: MemberEditComponent) {
        if (component.editForm.dirty) {
            return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
        }
        return true;
        //mozemo promijeniti rutu, ako forma nije dirty
    }


}