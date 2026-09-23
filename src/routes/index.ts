import { Router } from 'express';
import multer from 'multer';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { getMenuItems, getPublicMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller';
import { getWines, getPublicWines, createWine, updateWine, deleteWine } from '../controllers/wine.controller';
import { uploadMenuImage, uploadWineImage } from '../controllers/upload.controller';
import { createMediaAsset, createMediaTag, deleteMediaAsset, downloadMediaAsset, getMediaAssetUsage, getMediaAssets, getMediaTags, updateMediaAsset } from '../controllers/media.controller';
import { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller';
import { getDashboardOverview } from '../controllers/dashboard.controller';
import { getReservations, createReservation, updateReservationStatus, deleteReservation } from '../controllers/reservation.controller';
import { getCateringEvents, createCateringEvent, updateCateringEvent, deleteCateringEvent } from '../controllers/catering.controller';
import { getSchoolPrograms, getPublicSchoolPrograms, createSchoolProgram, updateSchoolProgram, deleteSchoolProgram } from '../controllers/school.controller';
import { getExpenses, getReports, addExpense, dailyClose } from '../controllers/finance.controller';
import { getSettings, updateSettings, getLogs } from '../controllers/settings.controller';
import { createInventoryItem, deleteInventoryItem, getInventoryItems, updateInventoryItem } from '../controllers/inventory.controller';
import { createTeamMember, deleteTeamMember, getPublicTeamMembers, getTeamMembers, updateTeamMember } from '../controllers/team.controller';
import { verifyToken, requireRole } from '../middleware/auth.middleware';
import { publicWriteRateLimiter } from '../middlewares/security.middleware';

const router = Router();

// Multer config: keep image uploads in memory before sending them to Supabase Storage.
// The Supabase bucket applies the same 5 MB / image MIME restrictions as a second layer.
const storage = multer.memoryStorage();
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG and WebP images are allowed'));
    }
    cb(null, true);
  }
});

// Dashboard
router.get('/dashboard/overview', verifyToken, requireRole(['ADMIN']), getDashboardOverview);

// Reservations
router.get('/reservations', verifyToken, requireRole(['ADMIN']), getReservations);
router.post('/reservations', publicWriteRateLimiter, createReservation); // Public
router.put('/reservations/:id/status', verifyToken, requireRole(['ADMIN']), updateReservationStatus);
router.delete('/reservations/:id', verifyToken, requireRole(['ADMIN']), deleteReservation);

// Catering
router.get('/catering', verifyToken, requireRole(['ADMIN']), getCateringEvents);
router.post('/catering', publicWriteRateLimiter, createCateringEvent); // Public
router.put('/catering/:id', verifyToken, requireRole(['ADMIN']), updateCateringEvent);
router.delete('/catering/:id', verifyToken, requireRole(['ADMIN']), deleteCateringEvent);

// School. Public catalogue exposes only active programs; admin keeps drafts editable.
router.get('/school', getPublicSchoolPrograms);
router.get('/admin/school', verifyToken, requireRole(['ADMIN']), getSchoolPrograms);
router.post('/school', verifyToken, requireRole(['ADMIN']), createSchoolProgram);
router.put('/school/:id', verifyToken, requireRole(['ADMIN']), updateSchoolProgram);
router.delete('/school/:id', verifyToken, requireRole(['ADMIN']), deleteSchoolProgram);

// Finance
router.get('/finance/expenses', verifyToken, requireRole(['ADMIN']), getExpenses);
router.get('/finance/reports', verifyToken, requireRole(['ADMIN']), getReports);
router.post('/finance/expenses', verifyToken, requireRole(['ADMIN']), addExpense);
router.post('/finance/close', verifyToken, requireRole(['ADMIN']), dailyClose);

// Inventory
router.get('/inventory', verifyToken, requireRole(['ADMIN']), getInventoryItems);
router.post('/inventory', verifyToken, requireRole(['ADMIN']), createInventoryItem);
router.put('/inventory/:id', verifyToken, requireRole(['ADMIN']), updateInventoryItem);
router.delete('/inventory/:id', verifyToken, requireRole(['ADMIN']), deleteInventoryItem);

// Team directory. Public route exposes only active members explicitly marked for publication.
router.get('/team/public', getPublicTeamMembers);
router.get('/team', verifyToken, requireRole(['ADMIN']), getTeamMembers);
router.post('/team', verifyToken, requireRole(['ADMIN']), createTeamMember);
router.put('/team/:id', verifyToken, requireRole(['ADMIN']), updateTeamMember);
router.delete('/team/:id', verifyToken, requireRole(['ADMIN']), deleteTeamMember);

// Settings & Logs
router.get('/settings', getSettings); // Public for some parts, maybe protect later
router.put('/settings', verifyToken, requireRole(['ADMIN']), updateSettings);
router.get('/logs', verifyToken, requireRole(['ADMIN']), getLogs);

// Gallery
router.get('/gallery', getGalleryImages); // Public
router.post('/gallery', verifyToken, requireRole(['ADMIN']), upload.single('image'), createGalleryImage);
router.put('/gallery/:id', verifyToken, requireRole(['ADMIN']), updateGalleryImage);
router.delete('/gallery/:id', verifyToken, requireRole(['ADMIN']), deleteGalleryImage);

// Central media library. The browser uploads only through these administrator-only
// endpoints; the Worker keeps the Storage service key outside the client.
router.get('/media', verifyToken, requireRole(['ADMIN']), getMediaAssets);
router.get('/media/tags', verifyToken, requireRole(['ADMIN']), getMediaTags);
router.post('/media/tags', verifyToken, requireRole(['ADMIN']), createMediaTag);
router.get('/media/:id/download', verifyToken, requireRole(['ADMIN']), downloadMediaAsset);
router.get('/media/:id/usage', verifyToken, requireRole(['ADMIN']), getMediaAssetUsage);
router.post('/media', verifyToken, requireRole(['ADMIN']), upload.single('image'), createMediaAsset);
router.put('/media/:id', verifyToken, requireRole(['ADMIN']), updateMediaAsset);
router.delete('/media/:id', verifyToken, requireRole(['ADMIN']), deleteMediaAsset);

// Categories
router.get('/categories', getCategories);
router.post('/categories', verifyToken, requireRole(['ADMIN']), createCategory);
router.put('/categories/:id', verifyToken, requireRole(['ADMIN']), updateCategory);
router.delete('/categories/:id', verifyToken, requireRole(['ADMIN']), deleteCategory);

// Menu Items. The public catalogue never exposes temporarily unavailable dishes.
router.get('/menu', getPublicMenuItems);
router.get('/admin/menu', verifyToken, requireRole(['ADMIN']), getMenuItems);
router.post('/menu', verifyToken, requireRole(['ADMIN']), createMenuItem);
router.put('/menu/:id', verifyToken, requireRole(['ADMIN']), updateMenuItem);
router.delete('/menu/:id', verifyToken, requireRole(['ADMIN']), deleteMenuItem);

// Wines. Public catalogue exposes only active entries; admin keeps inactive wines editable.
router.get('/wines', getPublicWines);
router.get('/admin/wines', verifyToken, requireRole(['ADMIN']), getWines);
router.post('/wines', verifyToken, requireRole(['ADMIN']), createWine);
router.put('/wines/:id', verifyToken, requireRole(['ADMIN']), updateWine);
router.delete('/wines/:id', verifyToken, requireRole(['ADMIN']), deleteWine);

// Uploads
router.post('/upload/menu', verifyToken, requireRole(['ADMIN']), upload.single('image'), uploadMenuImage);
router.post('/upload/wine', verifyToken, requireRole(['ADMIN']), upload.single('image'), uploadWineImage);

export default router;
