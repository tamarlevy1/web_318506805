//import modules
const express = require("express");
const crudFunctions = require("./db/CRUD_functions");
const router = express.Router();

//routs
router.route("/api/login").post(crudFunctions.login);
router.route("/api/register").post(crudFunctions.createNewUser);

router
    .route("/api/users")
    .get(crudFunctions.searchUsers)

router
    .route("/api/hikes")
    .get(crudFunctions.searchHikes)
    .post(crudFunctions.createNewHike);

router
    .route("/api/hikes/:id")
    .get(crudFunctions.getHike)
    .delete(crudFunctions.deleteHike)
    .put(crudFunctions.updateHike);

module.exports = router;