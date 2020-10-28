const axios = require("axios");
const {priceFormater} = require('../../helpers/helpers');

/**
 * Crea un ítem de búsqueda con el formato indicado
 * @param {Object} product - ítem de búsqueda
 */
const generateSearchItem = (product) => {
    return {
        "id": product.id,
        "title": product.title,
        "price": {
            "currency": product.currency_id,
            "amount": priceFormater(product.price),
            "decimals": 2
        },
        "picture": product.thumbnail,
        "condition": product.condition,
        "free_shipping": product.shipping.free_shipping
    }
}

/**
 * Crea un ítem de detalle con el formato indicado
 * @param {Object} data - información del ítem de detalle
 * @param {Object} description - descripción del ítem de detalle
 */
const generateDetailItem = (data, description) => {
    return {
        "id": data.id,
        "title": data.title,
        "price": {
            "currency": data.currency_id,
            "amount": priceFormater(data.price),
            "decimals": 2
        },
        "picture": data.thumbnail,
        "condition": data.condition,
        "free_shipping": data.shipping.free_shipping,
        "sold_quantity":data.sold_quantity,
        "description": description
    }
}

/**
 * Crea un array de las categorías del producto buscado
 * @param {Object} categories - árbol de categorías correspondiente al producto
 */
const generateCategories = (categories) => {
    let filters = null;

    if (categories.length > 0) {
        filters = categories[0].values[0].path_from_root.map(categoria => categoria.name);
    }

    return filters;
}

/**
 * Controller de la API
 */
module.exports = {
   /**
    * Genera un llamado a la api de serch de Mercado libre con el parámetro indicado
    * @return {Array} Retorna un array de items del tipo producto con el formato indicado.
    */
    search: (req, res) => {
        const searchParam = req.query.search;

            const SEARCH_URL = `https://api.mercadolibre.com/sites/MLA/search?q=${searchParam}&limit=4`;
            axios.get(SEARCH_URL).then(
                fetchData => {
                    const searchItems = {
                        categories: generateCategories(fetchData.data.filters),
                        items: fetchData.data.results.length !== 0 ? fetchData.data.results.map(product => generateSearchItem(product)) : null
                    };
                    res.json(searchItems);
                }
            ).catch ((error) => {
                res.status(404).json(error.message);
            })
    },
   /**
    * Genera dos llamados a la api de Mercado libre con el parámetro indicado
    * @return {Object} Retorna un objeto del tipo producto con el formato indicado.
    */
    items: (req, res) => {
        const idParam = req.params.id;

      
            const fetchItem = axios.get(`https://api.mercadolibre.com/items/${idParam}`)
            const fetchDescription = axios.get(`https://api.mercadolibre.com/items/${idParam}/description`);
            Promise.all([fetchItem,fetchDescription]).then(
                data => {
                    let description = data[1];
                    let item = data[0];
                    const  { plain_text }  = description.data;

                    res.json(generateDetailItem(item.data, plain_text));
                } 
            ).catch( (error)=> {
            res.status(404).json(error.message);
            })
        }
}