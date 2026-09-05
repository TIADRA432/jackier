import { Router } from 'express';
import multer from 'multer';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller';
import { getWines, createWine, updateWine, deleteWine } from '../controllers/wine.controller';
import { uploadMenuImage, uploadWineImage } from '../controllers/upload.controller';
import { getGalleryImages, createGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller';
import { setupAdmin } from '../controllers/auth.controller';
import { getDashboardOverview } from '../controllers/dashboard.controller';
import { getReservations, createReservation, updateReservationStatus, deleteReservation } from '../controllers/reservation.controller';
import { getCateringEvents, createCateringEvent, updateCateringEvent, deleteCateringEvent } from '../controllers/catering.controller';
import { getSchoolPrograms, createSchoolProgram, updateSchoolProgram, deleteSchoolProgram } from '../controllers/school.controller';
import { getExpenses, getReports, addExpense, dailyClose } from '../controllers/finance.controller';
import { getSettings, updateSettings, getLogs } from '../controllers/settings.controller';
import { verifyToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
const adminOnly = [verifyToken, requireRole(['ADMIN'])];

// Setup Admin (must be disabled or restricted after initial account setup)
router.post('/setup-admin', setupAdmin);

// Dashboard
router.get('/dashboard/overview', ...adminOnly, getDashboardOverview);

// Reservations
router.get('/reservations', ...adminOnly, getReservations);
router.post('/reservations', createReservation); // Public
router.put('/reservations/:id/status', ...adminOnly, updateReservationStatus);
router.delete('/reservations/:id', ...adminOnly, deleteReservation);

// Catering
router.get('/catering', ...adminOnly, getCateringEvents);
router.post('/catering', createCateringEvent); // Public
router.put('/catering/:id', ...adminOnly, updateCateringEvent);
router.delete('/catering/:id', ...adminOnly, deleteCateringEvent);

// School
router.get('/school', getSchoolPrograms); // Public
router.post('/school', ...adminOnly, createSchoolProgram);
router.put('/school/:id', ...adminOnly, updateSchoolProgram);
router.delete('/school/:id', ...adminOnly, deleteSchoolProgram);

// Finance
router.get('/finance/expenses', ...adminOnly, getExpenses);
router.get('/finance/reports', ...adminOnly, getReports);
router.post('/finance/expenses', ...adminOnly, addExpense);
router.post('/finance/close', ...adminOnly, dailyClose);

// Settings & Logs
router.get('/settings', getSettings);
router.put('/settings', ...adminOnly, updateSettings);
router.get('/logs', ...adminOnly, getLogs);

// Gallery
router.get('/gallery', getGalleryImages); // Public
router.post('/gallery', ...adminOnly, upload.single('image'), createGalleryImage);
router.delete('/gallery/:id', ...adminOnly, deleteGalleryImage);

// Categories
router.get('/categories', getCategories); // Public
router.post('/categories', ...adminOnly, createCategory);
router.put('/categories/:id', ...adminOnly, updateCategory);
router.delete('/categories/:id', ...adminOnly, deleteCategory);

// Menu Items
router.get('/menu', getMenuItems); // Public
router.post('/menu', ...adminOnly, createMenuItem);
router.put('/menu/:id', ...adminOnly, updateMenuItem);
router.delete('/menu/:id', ...adminOnly, deleteMenuItem);

// Wines
router.get('/wines', getWines); // Public
router.post('/wines', ...adminOnly, createWine);
router.put('/wines/:id', ...adminOnly, updateWine);
router.delete('/wines/:id', ...adminOnly, deleteWine);

// Uploads
router.post('/upload/menu', ...adminOnly, upload.single('image'), uploadMenuImage);
router.post('/upload/wine', ...adminOnly, upload.single('image'), uploadWineImage);

export default router;
