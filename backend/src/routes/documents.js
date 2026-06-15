const router = require('express').Router();
const ctrl = require('../controllers/documentController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/storage', auth, ctrl.storageStats);
router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
router.post('/', auth, upload.single('file'), ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
router.get('/:id/download', auth, ctrl.download);

module.exports = router;
