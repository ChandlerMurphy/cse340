const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  let user = req.session.user
  let accountType = user.type
  let welcomeMessage = `Welcome ${user.name}`
  let manageInventorySection
  let updateAccountLink = `/account/edit/${user.id}`
  if (accountType === "Employee" || accountType === "Admin") {
    manageInventorySection = `<h3 class="managementHeader">Inventory Management</h3>
    <p><a href="/inv/" title="Manage Inventory">Go to Inventory Management</a></p>`
  }
  res.render("account/management", {
    title: "Account Management",
    nav,
    welcomeMessage,
    manageInventorySection,
    updateAccountLink,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
      // console.log(req.flash("notice")) - This line causes req.flash message not to appear
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      // Store user data in session
      req.session.user = {
        loggedIn: true,
        name: accountData.account_firstname,
        type: accountData.account_type,
        id: accountData.account_id,
      };

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.clearCookie('jwt');
    res.redirect('/');  // Redirect to home page after logout
  });
}

/* ****************************************
 *  Build edit account
 * ************************************ */
async function buildEditAccount(req, res, next) {
  const id = req.session.user.id;
  let nav = await utilities.getNav();
  const user = await accountModel.getAccountById(id);

  if (!user) {
    req.flash("notice", "User not found.");
    return res.redirect("/account");
  }

  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    user,
    errors: null,
  });
}

/* ****************************************
*  Process edit account request
* ************************************ */
async function editAccount(req, res) {
  const id = req.session.user.id;
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body;

  const udpateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (udpateResult) {
    req.flash("notice", "Account updated successfully.");
    res.redirect("/account");
  } else {
    req.flash("notice", "Failed to update account.");
    res.redirect(`/account/update/${id}`);
  }
}

/* ****************************************
*  Process password change request
* ************************************ */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body;

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    // console.log(account_password)
    // console.log(hashedPassword)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    res.status(500).render(`account/edit/${id}`, {
      title: "Edit Account",
      nav,
      user,
      errors: null,
    })
  }

  const changeResult = await accountModel.updateAccountPassword(account_id, hashedPassword);

  if (changeResult) {
    req.flash("notice", "Password changed successfully.");
    res.redirect(`/account/`);
  } else {
    req.flash("notice", "Failed to change password.");
    res.redirect(`/account/edit/${account_id}`);
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout, buildEditAccount, editAccount, changePassword }