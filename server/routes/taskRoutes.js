import express from 'express';
import { body, validationResult } from 'express-validator';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const validateTask = [
  body('taskName').notEmpty().withMessage('Task name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('dueDate').isISO8601().toDate().withMessage('Valid due date is required'),
  body('status').optional().isIn(['Pending', 'Completed']).withMessage('Status must be Pending or Completed'),
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/', authMiddleware, validateTask, checkValidation, createTask);
router.get('/', authMiddleware, getTasks);
router.put('/:id', authMiddleware, validateTask, checkValidation, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;
