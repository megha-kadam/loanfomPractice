import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomRegex } from '../../const/validator';
import { CustomValidators } from '../../validators/customValidator';
import { countries } from '../../const/country';

@Component({
  selector: 'app-apply-loan',
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.scss']
})
export class ApplyLoanComponent implements OnInit {
  personalDetailsForm !: FormGroup;
  documentUploadForm !: FormGroup;
  addressDetailForm !: FormGroup;

  countriesData = countries;

  constructor( private _fb : FormBuilder) { 
    this.personalDetailsForm = this._fb.group({
      userName : [null, [Validators.required, Validators.pattern(CustomRegex.username)]],
      email : [null, [Validators.required, , Validators.pattern(CustomRegex.email)]],
      phone : [null, [Validators.required, CustomValidators.phoneNumValidator()]],
      dob : [null, [Validators.required, CustomValidators.dobValidator()]],
      gender : [null, [Validators.required]],
      marritalStatus : [null, [Validators.required]]
    })

    this.documentUploadForm = this._fb.group({
      adhar : [null, [Validators.required, CustomValidators.aharValidator()]],
      pan : [null, [Validators.required, CustomValidators.panValidator()]]
    })

    //  this.documentUploadForm = this._fb.group({
    //   adhar : [null, [Validators.required, Validators.pattern(CustomRegex.adharNum)]],
    //   pan : [null, [Validators.required, Validators.pattern(CustomRegex.panNum)]]
    // })

    this.addressDetailForm = this._fb.group({
      currentAddress : this._fb.group({
        addressLine1 : [null, [Validators.required]],
        addressLine2 : [null, [Validators.required]],
        city : [null, [Validators.required]],
        state : [null, [Validators.required]],
        country : [null, [Validators.required]],
        pincode : [null, [Validators.required]],
      }),
      permanentAddress : this._fb.group({
        addressLine1 : [null, [Validators.required]],
        addressLine2 : [null, [Validators.required]],
        city : [null, [Validators.required]],
        state : [null, [Validators.required]],
        country : [null, [Validators.required]],
        pincode : [null, [Validators.required]],
      }),
    })
  }

  onSubmitForm(){
  
    console.log(this.personalDetailsForm);
    
  }

  ngOnInit(): void {
  
  }

}
