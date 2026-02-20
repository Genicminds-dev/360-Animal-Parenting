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
import { getCommissionAgents, getCommissionAgentByUid, getCommissionAgentList, createCommissionAgent, updateCommissionAgent, deleteCommissionAgent } from '../controllers/admin/commissionAgentController';
import { getSellers, getSellerByUid, getSellerList, createSeller, updateSeller, deleteSeller } from '../controllers/admin/sellerController';
import { getAnimals, getAnimalByUid, createAnimal, updateAnimal, deleteAnimal } from '../controllers/admin/animalController';
import { getProcuredAnimals, getProcuredAnimalbyUid, getProcurementOfficers, createProcurement, updateProcurement, deleteProcuredAnimal } from '../controllers/admin/procuredAnimalController';

// Validation Schema
import { createUserSchema, updateUserProfileSchema, updateUserSchema, changePasswordSchema, editPasswordSchema } from '../validations/userValidation';
import { CreateCommissionAgentSchema, UpdateCommissionAgentSchema } from '../validations/commissionAgentValidation';
import { CreateSellerSchema, UpdateSellerSchema } from '../validations/sellerValidation';
import { CreateProcuredAnimalSchema, UpdateProcuredAnimalSchema } from '../validations/procuredAnimalValidation';

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

// Commissioner Agent Routes
router.get('/commission-agent', verifyToken, checkRole([1, 2, 3]), getCommissionAgents);
router.get('/commission-agent/:uid', verifyToken, checkRole([1, 2, 3]), getCommissionAgentByUid);
router.get("/commission-agent-list", verifyToken, checkRole([1, 2, 3]), getCommissionAgentList);
router.post("/commission-agent", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "profileImg", maxCount: 1 }, { name: "aadhaarFile", maxCount: 1 }]), handleMulterError, validate(CreateCommissionAgentSchema), sanitizeInput, setAudit, createCommissionAgent);
router.put("/commission-agent/:uid", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "profileImg", maxCount: 1 }, { name: "aadhaarFile", maxCount: 1 }]), handleMulterError, validate(UpdateCommissionAgentSchema), sanitizeInput, setAudit, updateCommissionAgent);
router.delete("/commission-agent/:uid", verifyToken, checkRole([1, 2, 3]), deleteCommissionAgent);

// Seller Routes
router.get('/seller', verifyToken, checkRole([1, 2, 3]), getSellers);
router.get('/seller/:uid', verifyToken, checkRole([1, 2, 3]), getSellerByUid);
router.get("/seller-list", verifyToken, checkRole([1, 2, 3]), getSellerList);
router.post("/seller", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "profileImg", maxCount: 1 }]), handleMulterError, validate(CreateSellerSchema), sanitizeInput, setAudit, createSeller);
router.put("/seller/:uid", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "profileImg", maxCount: 1 }]), handleMulterError, validate(UpdateSellerSchema), sanitizeInput, setAudit, updateSeller);
router.delete("/seller/:uid", verifyToken, checkRole([1, 2, 3]), deleteSeller);

// Animal Routes
router.get("/animal", verifyToken, checkRole([1, 2, 3]), getAnimals);
router.get("/animal/:uid", verifyToken, checkRole([1, 2, 3]), getAnimalByUid);
router.post("/animal", verifyToken, checkRole([1, 2, 3]), upload.any(), handleMulterError, sanitizeInput, createAnimal);
router.put("/animal/:uid", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "frontPhoto", maxCount: 1 }, { name: "sidePhoto", maxCount: 1 }, { name: "backPhoto", maxCount: 1 }, { name: "animalVideo", maxCount: 1 }, { name: "calfPhoto", maxCount: 1 }, { name: "calfVideo", maxCount: 1 }]), handleMulterError, sanitizeInput, setAudit, updateAnimal);
router.delete("/animal/:uid", verifyToken, checkRole([1, 2, 3]), deleteAnimal);

// Animal Procurement Routes
router.get("/procured-animal", verifyToken, checkRole([1, 2, 3]), getProcuredAnimals);
router.get("/procured-animal/:uid", verifyToken, checkRole([1, 2, 3]), getProcuredAnimalbyUid);
router.get("/procurement-officers", verifyToken, checkRole([1, 2, 3]), getProcurementOfficers);
router.post("/procured-animal", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "animalPhotoFront", maxCount: 1 }, { name: "animalPhotoSide", maxCount: 1 }, { name: "animalPhotoRear", maxCount: 1 }, { name: "healthRecord", maxCount: 1 }, { name: "licenseCertificate", maxCount: 1 }, { name: "quarantineCenterPhoto", maxCount: 1 }, { name: "quarantineHealthRecord", maxCount: 1 }, { name: "finalHealthClearance", maxCount: 1 }, { name: "handoverPhoto", maxCount: 1 }, { name: "handoverDocument", maxCount: 1 }]), handleMulterError, validate(CreateProcuredAnimalSchema), sanitizeInput, setAudit, createProcurement);
router.put("/procured-animal/:uid", verifyToken, checkRole([1, 2, 3]), upload.fields([{ name: "animalPhotoFront", maxCount: 1 }, { name: "animalPhotoSide", maxCount: 1 }, { name: "animalPhotoRear", maxCount: 1 }, { name: "healthRecord", maxCount: 1 }, { name: "licenseCertificate", maxCount: 1 }, { name: "quarantineCenterPhoto", maxCount: 1 }, { name: "quarantineHealthRecord", maxCount: 1 }, { name: "finalHealthClearance", maxCount: 1 }, { name: "handoverPhoto", maxCount: 1 }, { name: "handoverDocument", maxCount: 1 }]), handleMulterError, validate(UpdateProcuredAnimalSchema), sanitizeInput, setAudit, updateProcurement);
router.delete("/procured-animal/:uid", verifyToken, checkRole([1, 2, 3]), deleteProcuredAnimal);

export default router;