import express from "express";
import User from '../model/userModel.js'
import auth from '../middleware/userAuth.js'

const router = new express.Router()


//----GET All USER
router.get('/user', async (req, res) => {
  try {
    const user = await User.find({})
    if (!user) {
      res.status(400).send('NO USERS FOUND')
    }
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

//----ADD NEW USER
router.post('/user', async (req, res) => {
  try {
    const user = await new User(req.body)
    if (!user) {
      res.status(400).send('NO USERS FOUND')
    } const token = await user.generateAuthToken()
    await user.save()
    res.status(200).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

//------GET USER BY ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id })
    if (!user) {
      res.status(400).send('NO USERS FOUND')
    }
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

// ------USER UPLOAD IMAGE
router.post('/upload', auth, async (req, res) => {
  try {
    const user = req.user

    user.images = user.images.concat(req.body)

    await user.save()
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

// ------USER SEARCH IMAGE
router.post('/search', auth, async (req, res) => {
  try {
    const user = req.user
    const result = user.images.find(({ name }) => name === req.body.name);

    if (!result) {
      res.status(200).send('No Images Found !')
    }

    res.status(200).send(result)
  } catch (error) {
    res.status(400).send(error)
  }
})

//----User self login
router.post('/user/self', auth, async (req, res) => {
  res.send(req.user)
})

//----User login by email
router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    if (!user) {
      throw Error("Invalid creds");
    }
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

//----User logout
router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.status(200).send('Logged out')
  } catch (error) {
    res.status(500).send(error)
  }
})

//----User logout from all devices
router.post('/user/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})




export default router