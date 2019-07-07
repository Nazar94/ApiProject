const User = require('../models/user')
const Car = require('../models/car')

// const Joi = require('joi')
// const idSchema = Joi.object().keys({
//   //^-start of string
//   //$ - end of the string
//   // {} - number of characters
//   userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
// })


module.exports = {

  //Validation DONE
  index: async (req, res, next) => {
      const users = await User.find({})
      res.status(200).json(users)
  },

  //Validation DONE
  newUser: async (req, res, next) => {
      console.log(req.value.body)
      const newUser = new User(req.value.body)
      // const newUser = new User(req.body)
      const user = await newUser.save()
      res.status(200).json(user)
  },

  //Validation DONE
  getUser: async (req, res, next) => {
    //new way
    const { userId } = req.value.params
    const user = await User.findById(userId)
    res.status(200).json(user)
    //old way
    // const { userId } = req.params
    // const user = await User.findById(userId)
    // res.status(200).json(user)
  },

  // getUser: async (req, res, next) => {
  //   const result = Joi.validate(req.params, idSchema)
  //   console.log('result', result)
  //   // const userId = req.params.userId
  //   const { userId } = req.params
  //   // const user = await User.findById(userId)
  //   const user = await User.findById(result.value.userId)
  //   res.status(200).json(user)
  // },

  //Validation DONE
  replaceUser: async (req, res, next) => {
    //enforce that req.body must contain all the fields
    // const { userId } = req.params
    // const newUser = req.body
    const { userId } = req.value.params
    const newUser = req.value.body

    console.log('UserId is', userId)
    console.log('newUser', newUser)

    const result = await User.findByIdAndUpdate(userId, newUser)
    console.log('result', result)
    // res.status(200).json(result)
    res.status(200).json({sucess: true})
  },

  //Validation DONE
  updateUser: async (req, res, next) => {
    // req.body may contain any number of fields
    const { userId } = req.params
    const newUser = req.body
    const result = await User.findByIdAndUpdate(userId, newUser)
    console.log('result', result)
    // res.status(200).json(result)
    res.status(200).json({sucess: true})
  },

  deleteUser: async (req, res, next) => {
    const { userId } = req.params
    const newUser = req.body
    const result = await User.findByIdAndDelete(userId, newUser)
    console.log('result', result)
    res.status(200).json({sucess: true})
  },

  //Validation DONE
  getUserCars: async (req, res, next) => {
    const { userId } = req.value.params
    // const { userId } = req.params
    // const user = await User.findById(userId)
    //replace carsId's with car objects - populate()
    const user = await User.findById(userId).populate('cars')
    // console.log('user', user)
    console.log('uses\'s cars', user.cars)
    res.status(200).json(user.cars)
  },

  //Validation DONE
  newUserCar: async (req, res, next) => {
    const { userId } = req.value.params
    // const { userId } = req.params
    // Create new car
    const newCar = new Car(req.value.body)
    // const newCar = new Car(req.body)
    // const car = await newCar.save() can't do because are relations
    //Get user
    const user= await User.findById(userId)
    // can't retrieve list of user's cars User.findById(userId).populate('cars') error Maximum call stack size exceeded
    //Assign user as car seller
    newCar.seller = user
    //Save car
    await newCar.save()
    //Add car to user's selling array 'cars'
    user.cars.push(newCar)
    //Save the user
    await user.save()
    res.status(201).json(newCar)
  }
}


/**
 * We can interact with mongoose in 3 different ways:
 * 1) Callbacks
 * module.exports = {
    index: (req, res, next) => {
        User.find({}, (err, users) => {
            if (err) {
                next(err)
            }
            res.status(200).json(users)
        })
    },

    newUser: (req, res, next) => {
        console.log('req body contents', req.body)
        const newUser = new User(req.body)
        console.log('new User', newUser)
        newUser.save((err, user) => {
                    if (err) {
                next(err)
            }
            console.log('err', err);
            console.log('user', user)
            res.status(201).json(user)
        })
    }
}
 * 2) Promises
 * module.exports = {
    index: (req, res, next) => {
        User.find({})
         .then(users => {
            res.status(200).json(users)
               })
         .catch(err => {
            next(err)
        })
    },

    newUser: (req, res, next) => {
        const newUser = new User(req.body)
        newUser.save()
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                next(err)
            })
    }
}
 * 3) [X] Async/Await (Promises)
 * module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find({})
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }


  },

  newUser: async (req, res, next) => {
    try {
      const newUser = new User(req.body)
      const user = await newUser.save()
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }

  }
}
 *
 **/