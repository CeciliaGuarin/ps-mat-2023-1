import Joi from 'joi'

const OrderStatus = Joi.object({
    sequence: Joi.number()
       .min(2)
       .max(30)
       .required()
       .messages({'*': 'O ID da encomenda é obrigatório (entre 2 e 30 caracteres)'}),

       description: Joi.string()
       .min(2)
       .max(30)
       .required()
       .messages({'*': 'O ID da etiqueta é obrigatório (entre 2 e 30 caracteres)'}),
})
//permite campos não validados, como id, createdAt e updatedAt
.options({allowUnknown: true})

export default OrderStatus