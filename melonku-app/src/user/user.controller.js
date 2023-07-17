require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const User = require("./user.model"); // import user model
const path = require('path');
const walletPath = path.join(__dirname, 'wallet');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCCPOrg1, buildWallet } = require('../../utils/AppUtil');
const { buildCAClient, registerAndEnrollUser, enrollAdmin, getAllUsers, getSingleUser } = require('../../utils/CAUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';

const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';
const mspOrg1 = 'Org1MSP';

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;

// Signup route to create a new user
router.post("/signup", async (req, res) => {
  try {
    const userId = req.body.username;

    const ccp = await buildCCPOrg1();

    const caClient = await buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

    const wallet = await buildWallet(Wallets, walletPath);

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get(adminUserId);
    if (!adminIdentity) {
      console.log('An identity for the admin user does not exist in the wallet');
      console.log('Enroll the admin user before retrying');
      await enrollAdmin(caClient, wallet, mspOrg1);
    }

    // Check to see if we've already enrolled the user
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(`An identity for the user ${userId} already exists in the wallet`);
    } else if (!userIdentity) {
      console.log(`An identity for the user ${userId} not exists in the wallet`);
      await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');
      // return res.status(400).send({ message: `no wallet for user ` });
    }

    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const user = await User.create(req.body);
    // send new user as response
    res.json(user);
  } catch (error) {
    console.log(error.code)
    if (error.code === 11000) {
      res.status(409).json({
        Message: 'User already exist',
        Error: error
      });
    } else {
      res.status(400).json({ error });
    }
  }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  try {

    const wallet = await buildWallet(Wallets, walletPath);
    const userId = req.body.username;
    let userWallet = false;

    // check if wallet exist
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(`An identity for the user ${userId} already exists in the wallet`);
      userWallet =  true
    } else if (!userIdentity) {
      console.log(`An identity for the user ${userId} not exists in the wallet`);
      // await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');
    }

    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user && userIdentity) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);

      // check if wallet == username
      if (result) {
        // sign token and send it in response
        const token = await jwt.sign({ username: user.username }, SECRET);
        res.json({ wallet: userWallet, token });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;