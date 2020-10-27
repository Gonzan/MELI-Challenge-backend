const axios = require("axios");

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
            "amount": product.price,
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
            "amount": data.price,
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
    search: async (req, res) => {
        const searchParam = req.query.search;

        try {
            const SEARCH_URL = `https://api.mercadolibre.com/sites/MLA/search?q=${searchParam}&limit=4`;
            const fetchData = await axios.get(SEARCH_URL);
            
            const searchItems = {
                categories: generateCategories(fetchData.data.filters),
                items: fetchData.data.results.map(product => generateSearchItem(product))
            };
            
            res.json(searchItems);
        } catch (error) {
            res.status(404).json(error.message);
        }
    },
    items: async (req, res) => {
        const idParam = req.params.id;

        try {
            const fetchItem = await axios.get(`https://api.mercadolibre.com/items/${idParam}`);
            const fetchDescription = await axios.get(`https://api.mercadolibre.com/items/${idParam}/description`);
            const { plain_text } = fetchDescription.data;
        
            res.json(generateDetailItem(fetchItem.data, plain_text));
        } catch (error) {
            res.status(404).json(error.message);
        }
    }
}