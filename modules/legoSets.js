/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Manav Alpeshbhai Zadafiya     Student ID: 144095221     Date: 2024-02-05
*
********************************************************************************/
const setData = require("../data/setData");
const themeData = require("../data/themeData");
let sets = [];

function initialize() {
    return new Promise((resolve, reject) => {
      try {
        setData.forEach(set => {
          const themeObject = themeData.find(theme => theme.id === set.theme_id);
  
          if (themeObject) {
            const setWithTheme = {
              ...set,
              theme: themeObject.name
            };
            sets.push(setWithTheme);
          }
        });
  
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function getAllSets() {
    return new Promise((resolve, reject) => {
      try {
        resolve(sets);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      try {
        const foundSet = sets.find(set => set.set_num === setNum);
  
        if (foundSet) {
          resolve(foundSet);
        } else {
          reject(`Unable to find set with set_num: ${setNum}`);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      try {
        const themeLowerCase = theme.toLowerCase();
        const matchingSets = sets.filter(set => set.theme.toLowerCase().includes(themeLowerCase));
  
        if (matchingSets.length > 0) {
          resolve(matchingSets);
        } else {
          reject(`Unable to find sets with theme: ${theme}`);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };
const legoSets = require('./legoSets');


