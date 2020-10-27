/**
 * Este middleware introduce el objeto author en el response de la API
 */
module.exports = (req, res, next) => {
    // Almacena el formato original de la función res.send()
    let oldSend = res.send;

    // Redefine la función res.send()
    res.send = (data) => {
        data = JSON.parse(data);

        // Declara el objeto author para ser inyectado en el response
        const SIGN = {
            author: {
                name:'Gonzalo',
                lastname:'Vanni'
            }
        }

        let newDataObject = {};
        
        // Se crea un objeto response definiendo si es un ítem de búsqueda o un ítem de detalle dado el formato indicado
        let newData = Object.assign(
            newDataObject,
            SIGN,
            Object.keys(data).includes("categories") && { categories: data.categories, items: data.items },
            Object.keys(data).includes("id") && { item: data },
        );
 
        data = JSON.stringify(newData);

        // Vuelve al formato original res.send() para evitar la recursividad
        res.send = oldSend;

        return res.send(data);
    }
    
    next();
}
