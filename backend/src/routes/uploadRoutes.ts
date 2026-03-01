import { Router, Request, Response } from 'express';
import { upload } from '../config/upload';

const router = Router();

router.post('/', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Construct URL - assuming server serves 'uploads' statically at root or /uploads
  // For simplicity, we return the relative path that the frontend can prepend with base URL
  // or return the full URL if we know the host.
  // Here we'll return the path relative to the server root that is served statically.

  const filePath = `/uploads/${req.file.filename}`;

  res.json({
    message: 'File uploaded successfully',
    filePath: filePath,
  });
});

export default router;
