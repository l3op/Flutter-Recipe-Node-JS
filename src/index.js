const express = require('express');
const auth = require('./routes/auth');
const user = require('./routes/user');
const meal = require('./routes/meal');
const recipe = require('./routes/recipe');
const category = require('./routes/category');
const Route = express.Router();
Route
  .use('/api/v1/accounts', auth)
  .use('/api/v1/accounts/users/profile', user)
  .use('/api/v1/meals', meal)
  .use('/api/v1/recipes', recipe)
  .use('/api/v1/categories', category);
module.exports = Route;