const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the select list options on the add inventory form
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classification_id" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ************************
 * Constructs the management page view
 ************************** */
Util.getManagementView = async function (req, res, next) {
  let list = '<div id="managementView">'
  list += '<li><a href="/inv/addClass" title="Click here to add a new Vehicle Classification">Add New Classification</a></li>'
  list += '<li><a href="/inv/addInv" title="Click here to add a new Vehicle Inventory item">Add New Vehicle</a></li>'
  list += '</div>'
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Inventory Item view HTML
* ************************************ */
Util.buildInventoryItem = async function(data){
  let itemView
  if(data.length > 0){
    itemView = '<div id="inv-item">'
    data.forEach(vehicle => { 
      itemView += '<div id="inv-item-image">'
      itemView +=  '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" />'
      itemView += '</div>'
      itemView += '<div id="inv-item-details">'
      itemView += '<h2 class="itemName"><b>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</b>' + '</h2>'
      itemView += '<p><b>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</b></p>'
      itemView += '<p><b>Description: </b>' + vehicle.inv_description + '</p>'
      itemView += '<p><b>Color: </b>' + vehicle.inv_color + '</p>'
      itemView += '<p><b>Miles: </b>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
      itemView += '</div>'
    })
    itemView += '</div>'
  } else { 
    itemView += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return itemView
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

// Middleware to check JWT and account type
Util.checkAccountType = async (req, res, next) => {
  const token = req.cookies.jwt || req.headers["authorization"];

  if (!token) {
    req.flash("notice", "You must be logged in to access this page.");
    return res.redirect("/account/login");
  }

  try {
    let tokenToVerify = token;
    // Verify the JWT token and decode it
    const decoded = jwt.verify(tokenToVerify, process.env.ACCESS_TOKEN_SECRET);
    // console.log("Decoded token:", decoded);
    const accountData = await accountModel.getAccountByEmail(decoded.account_email);

    if (accountData && (accountData.account_type === "Employee" || accountData.account_type === "Admin")) {
      req.user = accountData;  
      return next();
    } else {
      req.flash("notice", "You do not have the necessary permissions to access this page.");
      return res.redirect("/account/login");
    }
  } catch (error) {
    console.error("Error in token verification:", error);
    req.flash("notice", "Invalid or expired token.");
    return res.redirect("/account/login");
  }
};

module.exports = Util