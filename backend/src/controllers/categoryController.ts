// src/controllers/categoryController.ts

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category';

// ────────────────────────────────────────────────
//                  CATEGORIES
// ────────────────────────────────────────────────

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Optional: check if name already exists (even among inactive ones)
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      if (existing.isActive) {
        return res
          .status(409)
          .json({ message: 'Category name already exists' });
      }
      // If inactive → you could reactivate or force error - decide your policy
      return res.status(409).json({
        message: 'Category name already exists (previously deactivated)',
      });
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim(),
    });

    await category.save();

    res.status(201).json(category);
  } catch (err: any) {
    console.error('Create category error:', err);
    res
      .status(400)
      .json({ message: err.message || 'Failed to create category' });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { activeOnly = 'true' } = req.query;

    const filter = activeOnly === 'true' ? { isActive: true } : {};

    const categories = await Category.find(filter)
      .select('name description isActive createdAt')
      .sort({ name: 1 })
      .lean();

    res.json(categories);
  } catch (err: any) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getCategoryById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await Category.findById(id).lean();

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (!category.isActive) {
      return res.status(410).json({ message: 'Category is deactivated' });
    }

    res.json(category);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Optional: prevent changing name to existing one
    if (req.body.name?.trim() && req.body.name.trim() !== category.name) {
      const nameConflict = await Category.findOne({
        name: req.body.name.trim(),
        _id: { $ne: id },
      });
      if (nameConflict) {
        return res
          .status(409)
          .json({ message: 'Category name already in use' });
      }
    }

    // Apply updates
    if (req.body.name) category.name = req.body.name.trim();
    if (req.body.description !== undefined) {
      category.description = req.body.description?.trim() ?? undefined;
    }

    await category.save();

    res.json(category);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: err.message || 'Failed to update category' });
  }
};

export const deactivateCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (!category.isActive) {
      return res
        .status(400)
        .json({ message: 'Category is already deactivated' });
    }

    category.isActive = false;
    await category.save();

    res.json({ message: 'Category deactivated successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Optional - permanent delete (use carefully!)
export const deleteCategoryPermanently = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category permanently deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
