'use strict';
// DO NOT CHANGE THIS FILE
const mongoose = require('mongoose');

// DO NOT CHANGE THIS FILE
mongoose.connect('mongodb+srv://mongo:food@cluster0.roupt.mongodb.net/test?retryWrites=true&w=majority' || process.env.MONGODB_URI /*|| 'mongodb://localhost:27017/RestaurantAPI'*/, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

// DO NOT CHANGE THIS FILE
module.exports = { mongoose }