import Router from 'koa-router';
import TestController from '../controllers/TestController.js';
import FileController from '../controllers/FileController.js';
import MegaController from '../controllers/MegaController.js';
import GoogleController from '../controllers/GoogleController.js';


const router = new Router();

router.use(async (ctx, next) => {
    return next();
});

// Test
router.get('/welcome', TestController.welcome);

// File
router.get('/file/info', FileController.fileInfo);
router.get('/file/contents', FileController.fileContents);

// Mega
router.get('/mega/file-info', MegaController.fileInfo);
router.get('/mega/file-contents', MegaController.fileContents);

// Google
router.get('/google/file-info', GoogleController.fileInfo);
router.get('/google/file-contents', GoogleController.fileContents);

export default router;
