/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Manav Alpeshbhai Zadafiya     Student ID: 144095221     Date: 2024-02-20
* 
* 
*
********************************************************************************/
const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets');


const app = express();
const port = process.env.PORT || 8080;

// Set the public folder as static
app.use(express.static(path.join(__dirname, 'public')));

legoData.initialize()
.then(() => {
  // GET "/"
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views/home.html'));
  });

  // GET "/about"
  app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, './public/views/about.html'));
  });

  app.get('/lego/sets', (req, res) => {
    const theme = req.query.theme;
    if (theme) {
      legoData.getSetsByTheme(theme)
        .then(sets => res.json(sets))
        .catch(error => res.status(404).send(`Error: ${error}`));
    } else {
      legoData.getAllSets()
        .then(allSets => res.json(allSets))
        .catch(error => res.status(404).send(`Error: ${error}`));
    }
  });

  // GET "/lego/sets/:id"
  app.get('/lego/sets/:id', (req, res) => {
    const setId = req.params.id;
    legoData.getSetByNum(setId)
      .then(set => {
        if (set) {
          res.json(set);
        } else {
          res.status(404).send('Lego set not found');
        }
      })
      .catch(error => res.status(404).send(`Error: ${error}`));
  });
    // Custom 404 error handler
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, './public/views/404.html'));
    });
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error(`Initialization error: ${error}`);
  });
