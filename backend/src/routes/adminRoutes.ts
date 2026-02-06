import express from 'express';
const router = express.Router();

// Middleware Imports
import { verifyToken } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/authorizeRole';
import { handleMulterError, upload } from '../middlewares/multerMiddleWare';
import { setAudit } from '../middlewares/auditMiddleware';
import { validate } from '../middlewares/validate';
import sanitizeInput from '../middlewares/sanitizeInput';

// Controllers
import { getAllRoles } from '../controllers/admin/roleController';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserProfile, changePassword, editPassword } from '../controllers/admin/userController';
import { getHoldingStation, getHoldingStationById, createHoldingStation, updateHoldingStation, deleteHoldingStation, getHoldingStationDropdown } from '../controllers/admin/holdingStationController';
import { getVendor, getVendorById, createVendor, updateVendor, deleteVendor, getVendorDropdown } from '../controllers/admin/vendorController';
import { createAnimal, deleteAnimal, getAnimal, getAnimalById, updateAnimal, vendorAssignedAnimal } from '../controllers/admin/AnimalController';
import { createPayment, deletePayment, getPayment, getPaymentById, updatePayment } from '../controllers/admin/PaymentController';

// Validation Schema
import { createUserSchema, updateUserProfileSchema, updateUserSchema, changePasswordSchema, editPasswordSchema } from '../validations/userValidation';
import { CreateHoldingStationSchema, UpdateHoldingStationSchema } from '../validations/holdingStationValidation';
import { CreateVendorSchema, UpdateVendorSchema } from '../validations/vendorValidation';
import { CreateAnimalSchema, UpdateAnimalSchema } from '../validations/animalValidation';
import { CreatePaymentSchema, UpdatePaymentSchema } from '../validations/paymentValidation';

// Role Routes
router.get('/roles', verifyToken, checkRole([1, 2]), getAllRoles);

// User Routes
router.get('/users', verifyToken, checkRole([1, 2]), getAllUsers);
router.get('/user/:id', verifyToken, checkRole([1, 2, 3]), getUserById);
router.post('/users', verifyToken, checkRole([1, 2]), validate(createUserSchema), sanitizeInput, createUser);
router.put('/user/:id', verifyToken, checkRole([1, 2]), validate(updateUserSchema), sanitizeInput, updateUser);
router.delete('/user/:id', verifyToken, checkRole([1, 2]), deleteUser);
router.put('/update-user', verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "profileImg", maxCount: 1 }]), validate(updateUserProfileSchema), sanitizeInput, updateUserProfile);
router.put('/change-password', verifyToken, checkRole([1, 2, 3]), validate(changePasswordSchema), sanitizeInput, changePassword);
router.put('/edit-password/:id', verifyToken, checkRole([1]), validate(editPasswordSchema), sanitizeInput, editPassword);

// Vendor Routes
router.get("/vendor", verifyToken, checkRole([1, 2, 3]), getVendor);
router.get("/vendor/:uid", verifyToken, checkRole([1, 2, 3]), getVendorById);
router.get("/vendor-dropdown", verifyToken, checkRole([1, 2, 3]), getVendorDropdown);
router.post("/vendor", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "profileImg", maxCount: 1 }, { name: "aadhaarFile", maxCount: 1 }, { name: "panFile", maxCount: 1 }, { name: "gstFile", maxCount: 1 }, { name: "msmeFile", maxCount: 1 },]), handleMulterError, validate(CreateVendorSchema), sanitizeInput, setAudit, createVendor);
router.put("/vendor/:uid", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "profileImg", maxCount: 1 }, { name: "aadhaarFile", maxCount: 1 }, { name: "panFile", maxCount: 1 }, { name: "gstFile", maxCount: 1 }, { name: "msmeFile", maxCount: 1 },]), handleMulterError, validate(UpdateVendorSchema), sanitizeInput, setAudit, updateVendor);
router.delete("/vendor/:uid", verifyToken, checkRole([1, 2, 3]), deleteVendor);

// Animal Routes
router.get("/animal", verifyToken, checkRole([1, 2, 3]), getAnimal);
router.get("/animal/:uid", verifyToken, checkRole([1, 2, 3]), getAnimalById);
router.get("/vendor-animal/:id", verifyToken, checkRole([1, 2, 3]), vendorAssignedAnimal);
router.post("/animal", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "photoFront", maxCount: 1 }, { name: "photoBack", maxCount: 1 }, { name: "photoSide", maxCount: 1 }, { name: "video", maxCount: 1 }, { name: "calfImage", maxCount: 1 }, { name: "calfVideo", maxCount: 1 } ]), handleMulterError, validate(CreateAnimalSchema), sanitizeInput, setAudit, createAnimal);
router.put("/animal/:uid", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "photoFront", maxCount: 1 }, { name: "photoBack", maxCount: 1 }, { name: "photoSide", maxCount: 1 }, { name: "video", maxCount: 1 }, { name: "calfImage", maxCount: 1 }, { name: "calfVideo", maxCount: 1 } ]), handleMulterError, validate(UpdateAnimalSchema), sanitizeInput, setAudit, updateAnimal);
router.delete("/animal/:uid", verifyToken, checkRole([1, 2, 3]), deleteAnimal);

// Payment Routes
router.get("/payment", verifyToken, checkRole([1, 2, 3]), getPayment);
router.get("/payment/:uid", verifyToken, checkRole([1, 2, 3]), getPaymentById);
router.post("/payment", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "paySlip", maxCount: 1 },]), handleMulterError, validate(CreatePaymentSchema), sanitizeInput, setAudit, createPayment);
// router.put("/payment/:uid", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "paySlip", maxCount: 1 }, ]), handleMulterError, validate(UpdatePaymentSchema), sanitizeInput, setAudit, updatePayment);
router.delete("/payment/:uid", verifyToken, checkRole([1, 2, 3]), deletePayment);

// Holding Station Routes
router.get('/holding-station', verifyToken, checkRole([1, 2, 3]), getHoldingStation);
router.get('/holding-station/:uid', verifyToken, checkRole([1, 2, 3]), getHoldingStationById);
router.get("/holding-station-dropdown", verifyToken, checkRole([1, 2, 3]), getHoldingStationDropdown);
router.post("/holding-station", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "centerImg", maxCount: 1 }, { name: "centerVideo", maxCount: 1 } ]), validate(CreateHoldingStationSchema), sanitizeInput, setAudit, createHoldingStation);
router.put("/holding-station/:uid", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "centerImg", maxCount: 1 }, { name: "centerVideo", maxCount: 1 } ]), validate(UpdateHoldingStationSchema), sanitizeInput, setAudit, updateHoldingStation);
router.delete("/holding-station/:uid", verifyToken, checkRole([1, 2, 3]), deleteHoldingStation);

export default router;