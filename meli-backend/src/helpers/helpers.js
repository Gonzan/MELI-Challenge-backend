module.exports = {
   /**
    * Crea el precio del producto en formato de peso argentino
    * @param {Number} número 
    */
    priceFormater: (price) => {
        const number = new Number(price);
        return number.toLocaleString('es-AR')
    }
}
