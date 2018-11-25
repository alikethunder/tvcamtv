import {LiqPay} from './lib/liqpay'
import {Liqpay} from './collections/Liqpay'

let keys = Liqpay.findOne().keys;

export const liqpay = new LiqPay(keys.public, keys.private)