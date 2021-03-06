const connection = require("../configs/db")
module.exports = {
  getCategory: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.id FROM categories a WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  total: categoryId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS total FROM recipes WHERE category_id = '${categoryId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  all: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.* FROM recipes a`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  steps: recipeId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT a.uuid, a.body, 
      GROUP_CONCAT(b.uuid SEPARATOR ',') steps_images_id, 
      GROUP_CONCAT(b.image SEPARATOR ',') steps_images_body
      FROM steps a LEFT JOIN stepsimages b ON a.uuid = b.step_id 
      WHERE a.recipe_id = '${recipeId}'
      GROUP BY a.id`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  searchSuggestions: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.title, a.imageUrl
      FROM recipes a
      INNER JOIN search_suggestions b ON a.uuid  = b.recipe_id
      WHERE b.views > 0
      ORDER BY views DESC LIMIT 3`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  ingredients: recipeId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.body FROM ingredients a WHERE recipe_id = '${recipeId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  detail: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.title, a.imageUrl, a.isfavourite FROM recipes a WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  favourite: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.id, a.title, a.imageUrl, a.duration, a.isfavourite, b.type as affordability , c.type as complexity
      FROM recipes a
      LEFT JOIN affordabilities b ON b.id = a.affordability
      LEFT JOIN complexities c ON c.id = a.complexity
      WHERE isfavourite = 1`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error())
        } else {
          resolve(result)
        }
      })
    })
  },
  show: (offset, limit, search, categoryId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT a.uuid, a.title, a.duration, a.imageurl, b.type as affordabilities, c.type as complexities, d.title as category_title
      FROM recipes a
      LEFT JOIN affordabilities b ON a.affordability = b.uuid
      LEFT JOIN complexities c ON a.complexity = c.uuid
      LEFT JOIN categories d ON a.category_id = d.uuid
      WHERE a.category_id = '${categoryId}' AND LOWER(a.title) LIKE '%${search}%'
      LIMIT ${offset}, ${limit}`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  edit: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.uuid, a.title, a.imageUrl, a.category_id FROM recipes a WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  store: data => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO recipes SET ?`
      connection.query(query, data, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeSearchSuggestions: (uuid, mealId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO search_suggestions (uuid, views, meal_id) VALUES('${uuid}', 1, '${mealId}')`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeSteps: (uuid, body, recipeId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO steps (uuid, body, recipe_id) VALUES ('${uuid}', '${body}', '${recipeId}') ON DUPLICATE KEY UPDATE body = '${body}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeStepsImage: (uuid, image, recipeId, stepsId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO stepsimages (uuid, image, recipe_id, step_id) VALUES ('${uuid}', '${image}', '${recipeId}', '${stepsId}') ON DUPLICATE KEY UPDATE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  storeIngredients: (uuid, body, recipeId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ingredients (uuid, body, recipe_id) VALUES ('${uuid}', '${body}', '${recipeId}') ON DUPLICATE KEY UPDATE body = '${body}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  updateTitleRecipe: (uuid, title) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE recipes SET title = '${title}' WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  updateStepsImages: (uuid, image) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE stepsimages a SET a.image = '${image}' WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  updateFavourite: (uuid, isFavourite) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE recipes SET isfavourite = '${isFavourite}' WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  updateSearchSuggestions: (views, recipeId) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE search_suggestions SET views = ${views} + 1 WHERE recipe_id = '${recipeId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  getCountViews: recipeId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.views FROM search_suggestions a WHERE a.recipe_id = '${recipeId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  checkReservedSearchSuggestions: recipeId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.meal_id FROM search_suggestions a WHERE a.recipe_id = '${recipeId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  checkStepsImages: uuid => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM stepsimages a WHERE a.uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  checkStepsIdOnStepsImages: stepsId => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM stepsimages WHERE step_id = '${stepsId}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteIngredients: uuid => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM ingredients WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteSteps: uuid => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM steps WHERE uuid = '${uuid}'`
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(result)
        }
      })
    })
  }
}
