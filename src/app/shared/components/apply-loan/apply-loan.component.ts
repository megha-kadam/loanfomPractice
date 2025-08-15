import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomRegex } from '../../const/validator';
import { CustomValidators } from '../../validators/customValidator';
import { countries } from '../../const/country';
import { CountryService } from '../../services/country.service';
import { Istate } from '../../models/state.interface';

@Component({
  selector: 'app-apply-loan',
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.scss']
})
export class ApplyLoanComponent implements OnInit {
 base63File !: string

 selectedFile : {
    [key : string] : {name : string, base64 : string}
  } = {};

  permanentStateArr : Array<Istate> = [];
  currentStateArr : Array<Istate> = [];

  personalDetailsForm !: FormGroup;
  documentUploadForm !: FormGroup;
  addressDetailForm !: FormGroup;
  employmentDetailForm !: FormGroup;
  loanDetailsForm !: FormGroup;

  employmentType : Array<string> = ['Salaried', 'Self employed']
  relationship : Array<string> = ['Spouse', 'Child', 'Parent'];
  loanpurpose : Array<string> = ['Home Loan', 'Car Loan', 'Education Loan']


  countriesData = countries;

  constructor( private _fb : FormBuilder,
    private countryService : CountryService
  ) { 
    this.personalDetailsForm = this._fb.group({
      userName : [null, [Validators.required, Validators.pattern(CustomRegex.username)]],
      email : [null, [Validators.required, Validators.pattern(CustomRegex.email)]],
      phone : [null, [Validators.required, CustomValidators.phoneNumValidator()]],
      dob : [null, [Validators.required, CustomValidators.dobValidator()]],
      gender : [null, [Validators.required]],
      marritalStatus : [null, [Validators.required]]
    })

    this.documentUploadForm = this._fb.group({
      adhar : [null, [Validators.required, CustomValidators.aharValidator()]],
      panFile : [null, [Validators.required]],
      pan : [null, [Validators.required, CustomValidators.panValidator()]],
      adharFile : [null, [Validators.required]],
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
        state : [{value : null, disabled : true}, [Validators.required]],
        country : [null, [Validators.required]],
        pincode : [null, [Validators.required, CustomValidators.pincodeValidator]],
      }),
      permanentAddress : this._fb.group({
        addressLine1 : [null, [Validators.required]],
        addressLine2 : [null, [Validators.required]],
        city : [null, [Validators.required]],
        state : [{value : null, disabled : true}, [Validators.required]],
        country : [null, [Validators.required]],
        pincode : [null, [Validators.required, CustomValidators.pincodeValidator]],
      }),
      isAddsame : [{value : false, disabled : true}, Validators.required]
    })

    this.employmentDetailForm = this._fb.group({
      employmentType : [null, [Validators.required]],
      currentAmount : [null, [Validators.required, Validators.min(0)]],
      companyName : [null, [Validators.required]],
      designation : [null, [Validators.required]],
    })

    this.loanDetailsForm = this._fb.group({
      loanAmount : [null, [Validators.required, CustomValidators.loanAmountValidators(10000, 10000000)]],
      loanTenure : [null, [Validators.required, CustomValidators.loanTenureValidator(6, 60)]],
      loanPurpose : [null, [Validators.required]],
      nomineeName : [null, [Validators.required]],
      nomineeRelationship : [null, [Validators.required]],
    })
  }

  onPanUpload(eve : Event, controlName : string){
    let input = eve.target as HTMLInputElement;

   
    if(input.files && input.files.length > 0){
      let file = input.files[0];
      console.log(file);
      
      const blob = new Blob([file], {
        type : file.type
      });
      console.log(blob);
      
      let reader = new FileReader();

      reader.onload = () => {
        let base64 = reader.result as string;
        console.log(base64);

        let fileObj = {
          fileSize : file.size,
          fileName : file.name,
          fileType : file.type,
          blob : base64
        }

        console.log(fileObj);
        
        this.documentUploadForm.get(controlName)?.patchValue(fileObj);

        this.base63File = base64

        this.selectedFile[controlName] = {
          name : file.name,
          base64 : base64
        }

        console.log(this.selectedFile);
        
      }

      reader.readAsDataURL(blob)

    }
  }

  onSubmitForm(){
  
    console.log(this.personalDetailsForm);
    
  }

  getCurrentState(){
      this.addressDetailForm.get('currentAddress.country')?.valueChanges
    .subscribe(res => {
      console.log(res);
      
      this.countryService.fetchStateByCountry(res)
      .subscribe({
        next : res => {
          console.log(res.data);
          this.currentStateArr = res.data.states;
          //this.permanentStateArr = res.data.states;
          console.log(this.currentStateArr);
          
          this.addressDetailForm.get('currentAddress.state')?.enable();

          this.addressDetailForm.get('currentAddress.state')?.patchValue(this.currentStateArr[0].name)
        },
        error : err => console.log(err.error.msg)
        
      })
    })
  }

  addressHandler(){
     this.addressDetailForm.get('currentAddress')?.valueChanges
  .subscribe(res => {
    console.log(this.addressDetailForm.get('currentAddress')?.valid);
    
    if(this.addressDetailForm.get('currentAddress')?.valid){
        this.addressDetailForm.get('isAddsame')?.enable();
    }else{
      this.addressDetailForm.get('isAddsame')?.reset();
      this.addressDetailForm.get('isAddsame')?.disable();
    }
  })
  }

  sameAddress(){
    this.addressDetailForm.get('isAddsame')?.valueChanges
    .subscribe(res => {
      if(res){
        let currentAdd = this.addressDetailForm.get('currentAddress')?.value;

        this.currentStateArr = this.permanentStateArr;

        this.addressDetailForm.get('permanentAddress')?.patchValue(currentAdd);
        this.addressDetailForm.get('permanentAddress')?.disable();
      }else{
        this.addressDetailForm.get('permanentAddress')?.reset();
        this.addressDetailForm.get('permanentAddress')?.enable();
        this.permanentStateArr = [];
        this.addressDetailForm.get('permanentAddress.state')?.disable()
      }
    })
  }

  ngOnInit(): void {
  this.getCurrentState();
  this.addressHandler()
  this.sameAddress()
 
  }

}
