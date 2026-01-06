// const express = require("express");
// const router = express.Router();
// const {
//   createUser,
//   getAllUsers,
//   updateUser,
//   deleteUser,
//   userLogin,
//   userRegister,
// } = require("../controllers/userAuthController");

// // CRUD Routes
// router.post("/", createUser);
// router.get("/", getAllUsers);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);

// // Auth routes
// router.post("/login", userLogin);
// router.post("/register", userRegister);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  userLogin,
  userRegister,
} = require("../controllers/userAuthController");

// CRUD Routes
router.post("/", createUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Auth routes
router.post("/login", userLogin);
router.post("/register", userRegister);

module.exports = router;
