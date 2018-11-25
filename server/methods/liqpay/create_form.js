import {liqpay} from '../../liqpay'

Meteor.methods({
  create_form(params){
    return liqpay.cnb_form(params)
  }
});