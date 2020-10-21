const axios = require("axios");

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

const generateCategories = (categories) => {
   return categories[0].values[0].path_from_root.map(categoria => categoria.name)
}

module.exports = {
    search: async (req, res) => {

        const searchParam = req.query.search;

        try {
            const SEARCH_URL = `https://api.mercadolibre.com/sites/MLA/search?q=${searchParam}`;
            
            const fetchData = await axios.get(SEARCH_URL);
            
            const searchItems ={
                categories: generateCategories(fetchData.data.filters),
                items : fetchData.data.results.map(product => generateSearchItem(product))
            }
            
            res.json(searchItems);

        } catch (error) {

            res.json(error.message);

        }
    },
    items: async (req, res) => {

        const paramId = req.params.id;

        try {
            
            const item = await axios.get(`https://api.mercadolibre.com/items/${paramId}`);

            const descriptionFetch = await axios.get(`https://api.mercadolibre.com/items/${paramId}/description`);
           
            const {plain_text} = descriptionFetch.data;
            
            res.json(generateDetailItem(item.data,plain_text));
           
        } catch (error) {

            res.status(404).json(error.message)

        }
    }
}