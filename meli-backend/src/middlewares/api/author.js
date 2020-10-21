module.exports = (req, res, next) => {
    let oldSend = res.send
    res.send = (data) => {
        let itemName = data.includes("categories") ? "items" : "item"
        data =JSON.parse(data)
        let author = {
            author:{
                name:'Gozalo',
                lastname:'Vanni'
            }
        }
        let newDataObject = {}
        let newData = Object.assign(newDataObject,
            author,
            Object.keys(data).includes("categories") && {categories:data.categories,items:data.items},
            Object.keys(data).includes("id") && {item:data},
            ) 
        data = JSON.stringify(newData);
        res.send = oldSend;
        return res.send(data)
    }
    
    next();
}
