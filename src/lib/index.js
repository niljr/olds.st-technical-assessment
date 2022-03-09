export function formatMoney(amount) {
    const options = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    };

    if (amount % 100 === 0) {
        options.minimumFractionDigits = 0;
    }

    const formatter = Intl.NumberFormat('en-US', options);

    return formatter.format(amount / 100);
}

export function formatDate(value){
    const date = new Date(value)
    const deltaDays = (date.getTime() - Date.now()) / (1000 * 3600 * 24);
    const formatter  = new Intl.RelativeTimeFormat('en')
    if((Math.round(deltaDays)) <= -7) {
        return value
    }
    return formatter.format(Math.round(deltaDays), 'days')
    
}