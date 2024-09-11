const joi = require('joi');
//joi is used for schema validation
module.exports.productSchema = joi.object({
    product: joi.object({
        Product_name: joi.string().required(),
        sku: joi.string().pattern(/^[0-9]+$/).required(),
        
        price: joi.number().required().min(0),
        category: joi.string().valid('Electronics', 'Clothing', 'Home', 'Books', 'Toys'),
        quantity: joi.number().required().min(0),
        image: joi.object({
            filename: joi.string().optional().allow(''),
            url: joi.string().optional().allow('')
        }).optional()
    }).required()
});

 
