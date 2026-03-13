import { Router } from 'express';
import multer from 'multer';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller';
import { getWines, createWine, updateWine, deleteWine } from '../controllers/wine.controller';
import { uploadMenuImage, uploadWineImage } from '../controllers/upload.controller';
import { setupAdmin } from '../controllers/auth.controller';
import { getDashboardOverview } from '../controllers/dashboard.controller';
import { getReservations, createReservation, updateReservationStatus, deleteReservation } from '../controllers/reservation.controller';
import { getCateringEvents, createCateringEvent, updateCateringEvent, deleteCateringEvent } from '../controllers/catering.controller';
import { getSchoolPrograms, createSchoolProgram, updateSchoolProgram, deleteSchoolProgram } from '../controllers/school.controller';
import { getExpenses, getReports, addExpense, dailyClose } from '../controllers/finance.controller';
import { getSettings, updateSettings, getLogs } from '../controllers/settings.controller';
import { verifyToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Multer config (store in memory for sharp processing)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Setup Admin (Development only or protected in production)
router.post('/setup-admin', setupAdmin);

// Dashboard
router.get('/dashboard/overview', verifyToken, requireRole(['ADMIN']), getDashboardOverview);

// Reservations
router.get('/reservations', verifyToken, requireRole(['ADMIN']), getReservations);
router.post('/reservations', createReservation); // Public
router.put('/reservations/:id/status', verifyToken, requireRole(['ADMIN']), updateReservationStatus);
router.delete('/reservations/:id', verifyToken, requireRole(['ADMIN']), deleteReservation);

// Catering
router.get('/catering', verifyToken, requireRole(['ADMIN']), getCateringEvents);
router.post('/catering', createCateringEvent); // Public
router.put('/catering/:id', verifyToken, requireRole(['ADMIN']), updateCateringEvent);
router.delete('/catering/:id', verifyToken, requireRole(['ADMIN']), deleteCateringEvent);

// School
router.get('/school', getSchoolPrograms); // Public
router.post('/school', verifyToken, requireRole(['ADMIN']), createSchoolProgram);
router.put('/school/:id', verifyToken, requireRole(['ADMIN']), updateSchoolProgram);
router.delete('/school/:id', verifyToken, requireRole(['ADMIN']), deleteSchoolProgram);

// Finance
router.get('/finance/expenses', verifyToken, requireRole(['ADMIN']), getExpenses);
router.get('/finance/reports', verifyToken, requireRole(['ADMIN']), getReports);
router.post('/finance/expenses', verifyToken, requireRole(['ADMIN']), addExpense);
router.post('/finance/close', verifyToken, requireRole(['ADMIN']), dailyClose);

// Settings & Logs
router.get('/settings', getSettings); // Public for some parts, maybe protect later
router.put('/settings', verifyToken, requireRole(['ADMIN']), updateSettings);
router.get('/logs', verifyToken, requireRole(['ADMIN']), getLogs);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Menu Items
router.get('/menu', getMenuItems);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Wines
router.get('/wines', getWines);
router.post('/wines', createWine);
router.put('/wines/:id', updateWine);
router.delete('/wines/:id', deleteWine);

// Uploads
router.post('/upload/menu', upload.single('image'), uploadMenuImage);
router.post('/upload/wine', upload.single('image'), uploadWineImage);

export default router;
