import Joi from 'joi'

const User = Joi.object({
    name: Joi.string()
       .min(2)
       .max(30)
       .required()
       .messages({'*': 'O nome é obrigatório (entre 2 e 30 caracteres)'}),

       email: Joi.string()
       .min(2)
       .max(30)
       .required()
       .messages({'*': 'O e-mail é obrigatório (entre 2 e 30 caracteres)'}),
       
       verified_email: Joi.string()
       .min(0)
       .max(30)
       .required()
       .messages({'*': 'O campo E-mail verificado é obrigatório (entre 0 e 30 caracteres)'}),
       
       is_admin: Joi.string()
       .min(0)
       .max(30)
       .required()
       .messages({'*': 'O campo Administrador é obrigatório (entre 0 e 30 caracteres)'}),
       
       phone: Joi.string()
       .min(2)
       .max(30)
       .required()
       .messages({'*': 'O telefone é obrigatório (entre 2 e 30 caracteres)'}),
       
       password: Joi.string()
       .min(2)
       .max(30)
       .required()
       .messages({'*': 'A senha é obrigatória (entre 2 e 30 caracteres)'}),

})

//permite campos não validados, como id, createdAt e updatedAt
.options({allowUnknown: true})

export default User