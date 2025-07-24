import promoCodes from '@/api/promoCodes.json'

export const usePromoCode = (promoCode) =>{
    let  promoMessage = ""
    let promoValid = false
    let discount = 0
    let freeDelivery = false

    if (promoCode === '') {
            promoMessage = 'لطفا کد تخفیف را وارد کنید';
            promoValid = false;
    }else{
        const promo = promoCodes[0][promoCode.toUpperCase()];
        if (promo) {
            promoValid = true;
            promoMessage = promo.message;
    
            discount = promo.discount;
            freeDelivery = promo.freeShipping;
    
        } else {
            promoValid = false;
            promoMessage = "کد وارد شده اشتباه است";
            discount = 0;
        }
    }
          

    return {
        promoMessage,
        promoValid,
        discount,
        freeDelivery
    }
}