const Joi = require('joi')

module.exports = {

  validateParam: (schema, name) => {
    return (req,  res, next) => {
      console.log('req.params', req.params)
      const result = Joi.validate({ param: req['params'][name]},schema)
      if (result.error) {
        //error happened
        return res.status(400).json(result.error)
      } else {
        if (!req.value)
          req.value = {}

        if(!req.value['params'])
          req.value['params'] = {}

        req.value['params'][name] = result.value.param
        next()
      }
    }
  },

  /**
   * req.params
   * req['params'][name]
   * name = userId
   * req['params'][name] => req.params.userId
   *
  req: {
    params: {
      userId: .....
    }
  }
  **/


  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema)
      if (result.error) {
        return res.status(400).json(result.error)
      } else {
        if (!req.value)
          req.value = {}

        if (!req.value['body'])
          req.value['body'] = {}

        req.value['body'] = result.value
        next()
      }
    }
  },

  schemas: {
    //Schema for post and put methods
    userSchema: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required()
    }),

    //Schema for patch method
    userOptionalSchema: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email()
    }),

    carSchema: Joi.object().keys({
      make: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.number().required(),
    }),


    idSchema: Joi.object().keys({
      // userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
      param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })

  }
}



