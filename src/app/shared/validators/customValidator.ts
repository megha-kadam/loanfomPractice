import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";



export class CustomValidators{
    static phoneNumValidator() : ValidatorFn {
        return (control : AbstractControl) : ValidationErrors | null =>{
            let val = control.value;
            if(!val){
                return null
            }

            let regex = /^[6-9]\d{9}$/;

            let isValid = regex.test(val);

            if(isValid){
                return null
            }else{
                return {
                    invalidPhoneNumber : `Phone include only 10 digit and number must be start with 6-9`
                }
            }
        }
    }


    static dobValidator() : ValidatorFn{
        return (control : AbstractControl) : ValidationErrors | null => {
            let val = control.value;

            if(!val){
                return null
            }

            let today = moment();
            let dob = moment(val, 'DD-MM-YYYY')

            let diff = today.diff(dob);

            if(diff >= 21){
                return null
            }else{
                return {
                    InvalidDOB : 'You must be 21 year old.'
                }
            }

            return null
        }
    }

    static aharValidator(): ValidatorFn{
        return (control : AbstractControl) : ValidationErrors | null => {
            let val = control.value;
            if(!val){
                return null
            }

            let regex = /^[0-9]{12}$/;

            let isInvalid = regex.test(val);

            if(isInvalid){
                return null
            }else{
                return {
                    InvalidAdharNum : `Adhar number must includes 12 digit`
                }
            }
            
        }
    }

    static panValidator() : ValidatorFn{
        return (control : AbstractControl) : ValidationErrors | null => {
            let val = control.value;
            if(!val){
                return null
            }

            let regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

            let isInvalid = regex.test(val);

            if(isInvalid){
                return null
            }else{
                return {
                    InvalidPanNum : `Invalid Pan card number (MMMMMM22222K)`
                }
            }
        }
    }
}


