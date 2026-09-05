import { Router } from 'express';
import multer from 'multer';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller';
import { getWines, createWine, updateWine, deleteWine } from '../controllers/wine.controller';
import { uploadMenuImage, uploadWineImage } from '../controllers/upload.controller';
import { getGalleryImages, createGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller';
import { getDashboardOverview } from '../controllers/dashboard.controller';
import { getReservations, createReservation, updateReservationStatus, deleteReservation } from '../controllers/reservation.controller';
import { getCateringEvents, createCateringEvent, updateCateringEvent, deleteCateringEvent } from '../controllers/catering.controller';
import { getSchoolPrograms, createSchoolProgram, updateSchoolProgram, deleteSchoolProgram } from '../controllers/school.controller';
import { getExpenses, getReports, addExpense, dailyClose } from '../controllers/finance.controller';
import { getSettings, updateSettings, getLogs } from '../controllers/settings.controller';
import { verifyToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Multer config (store uploads in memory before sending them to Supabase Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Gallery
router.get('/gallery', getGalleryImages); // Public
router.post('/gallery', verifyToken, requireRole(['ADMIN']), upload.single('image'), createGalleryImage);
router.delete('/gallery/:id', verifyToken, requireRole(['ADMIN']), deleteGalleryImage);

// Categories
router.get('/categories', getCategories);
router.post('/categories', verifyToken, requireRole(['ADMIN']), createCategory);
router.put('/categories/:id', verifyToken, requireRole(['ADMIN']), updateCategory);
router.delete('/categories/:id', verifyToken, requireRole(['ADMIN']), deleteCategory);

// Menu Items
router.get('/menu', getMenuItems);
router.post('/menu', verifyToken, requireRole(['ADMIN']), createMenuItem);
router.put('/menu/:id', verifyToken, requireRole(['ADMIN']), updateMenuItem);
router.delete('/menu/:id', verifyToken, requireRole(['ADMIN']), deleteMenuItem);

// Wines
router.get('/wines', getWines);
router.post('/wines', verifyToken, requireRole(['ADMIN']), createWine);
router.put('/wines/:id', verifyToken, requireRole(['ADMIN']), updateWine);
router.delete('/wines/:id', verifyToken, requireRole(['ADMIN']), deleteWine);

// Uploads
router.post('/upload/menu', verifyToken, requireRole(['ADMIN']), upload.single('image'), uploadMenuImage);
router.post('/upload/wine', verifyToken, requireRole(['ADMIN']), upload.single('image'), uploadWineImage);

export default router;
