const {
    login,
    getAllUsers,
    createUser,
    getUserById,
    updateUserDetail,
    deleteUser,
    getUserSearch,
    updateUserPassword,
    updateUserActive,
    getAllEmployee,
    createEmployee,
    getEmployeeById,
    updateEmployeeDetail,
    deleteEmployee,
    getEmployeeSearch,
    updateEmployeeActive,
    updateEmployeePassword,
    getAllSpare,
    createSpare,
    getSpareById,
    updateSpareDetail,
    deleteSpare,
    getSpareSearch,
    updateSpareActive,
    getUserVehicleSearch,
    createLabour,
    getAllLabour,
    getLabourById,
    updateLabourDetail,
    updateLabourActive,
    deleteLabour,
    getLabourSearch,
    createEstimate,
    getAllEstimate,
} = require("../controllers/serviceproviders.controllers.js");
const router = require("express").Router();
const { checkToken } = require("../middlewares/auth_validation");

/**
 * @swagger
 * tags:
 *   name: Service Provider
 *   description: API to manage your books.
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the book.
 *         title:
 *           type: string
 *           description: The title of your book.
 *         author:
 *           type: string
 *           description: Who wrote the book?
 *         finished:
 *           type: boolean
 *           description: Have you finished reading it?
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date of the record creation.
 *       example:
 *          title: The Pragmatic Programmer
 *          author: Andy Hunt / Dave Thomas
 *          finished: true
 */


/**
 * @swagger
 * /serviceprovider/login:
 *   post:
 *     security: 
 *       - BearerAuth: []
 *     summary: Lists all the books
 *     tags: [Service Provider]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book' 
 *     responses:
 *       "200":
 *         description: The list of books.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */

//common
router.post("/login", login);

//user

/**
 * @swagger
 * /serviceprovider/getAllUsers:
 *   get:
 *     security: 
 *       - BearerAuth: []
 *     summary: Lists all the Users
 *     tags: [Service Provider]
 *     responses:
 *       "200":
 *         description: The list of books.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */

router.get("/getAllUsers", checkToken, getAllUsers);
router.post("/createUser", checkToken, createUser);
router.post("/getUserById", checkToken, getUserById);
router.post("/updateUserDetail", checkToken, updateUserDetail);
router.post("/deleteUser", checkToken, deleteUser);
router.get("/getUserSearch", checkToken, getUserSearch);
router.post("/updateUserActive", checkToken, updateUserActive);
router.post("/updateUserPassword", checkToken, updateUserPassword);

//employee
router.get("/getAllEmployee", checkToken, getAllEmployee);
router.post("/createEmployee", checkToken, createEmployee);
router.post("/getEmployeeById", checkToken, getEmployeeById);
router.post("/updateEmployeeDetail", checkToken, updateEmployeeDetail);
router.post("/deleteEmployee", checkToken, deleteEmployee);
router.get("/getEmployeeSearch", checkToken, getEmployeeSearch);
router.post("/updateEmployeeActive", checkToken, updateEmployeeActive);
router.post("/updateEmployeePassword", checkToken, updateEmployeePassword);

//spares
router.get("/getAllSpare", checkToken, getAllSpare);
router.post("/createSpare", checkToken, createSpare);
router.post("/getSpareById", checkToken, getSpareById);
router.post("/updateSpareDetail", checkToken, updateSpareDetail);
router.post("/deleteSpare", checkToken, deleteSpare);
router.get("/getSpareSearch", checkToken, getSpareSearch);
router.post("/updateSpareActive", checkToken, updateSpareActive);

//estimate
router.get("/getUserVehicleSearch", checkToken, getUserVehicleSearch);
router.post("/createEstimate", checkToken, createEstimate);
router.get("/getAllEstimate", checkToken, getAllEstimate);

//labour
router.post("/createLabour", checkToken, createLabour);
router.get("/getAllLabour", checkToken, getAllLabour);
router.post("/getLabourById", checkToken, getLabourById);
router.post("/updateLabourDetail", checkToken, updateLabourDetail);
router.post("/deleteLabour", checkToken, deleteLabour);
router.get("/getLabourSearch", checkToken, getLabourSearch);
router.post("/updateLabourActive", checkToken, updateLabourActive);

module.exports = router;