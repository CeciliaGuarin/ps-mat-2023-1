import Joi from 'joi'

const Carrier = Joi.object({
    name: Joi.string()
       .min(2)
       .max(30)
       .required()
       .messages({'*': 'O nome é obrigatória (entre 2 e 30 caracteres)'}),

})

//permite campos não validados, como id, createdAt e updatedAt
.options({allowUnknown: true})

export default Carrier