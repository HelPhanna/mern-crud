// src/controllers/productController.ts

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

interface ProductRequestBody {
  name?: string;
  size?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  category?: string; // comes as string from JSON
  [key: string]: any;
}



export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice, sort = 'name' } = req.query;

    const filter: any = { isActive: true };

    if (search && typeof search === 'string' && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    if (category && mongoose.isValidObjectId(category)) {
      filter.category = category; // string → Mongoose converts automatically
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortObj: Record<string, 1 | -1> = { name: 1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === '-name') sortObj = { name: -1 };

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortObj)
      .lean();

    res.json(products);
  } catch (err: any) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createProduct = async (
  req: Request<{}, {}, ProductRequestBody>,
  res: Response
) => {
  try {
    const { category, ...productData } = req.body;

    if (!category || !mongoose.isValidObjectId(category)) {
      return res
        .status(400)
        .json({ message: 'Valid category ObjectId is required' });
    }

    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    }).lean();

    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: 'Category not found or inactive' });
    }

    let imageUrl = productData.imageUrl;
    if (req.file) {
      // Convert buffer to Base64
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${b64}`;
    }

    const product = new Product({
      ...productData,
      imageUrl,
      category: new mongoose.Types.ObjectId(category), // explicit conversion → fixes TS2322
    });

    await product.save();

    const created = await Product.findById(product._id)
      .populate('category', 'name')
      .lean();

    res.status(201).json(created);
  } catch (err: any) {
    console.error('Create product error:', err);
    res
      .status(400)
      .json({ message: err.message || 'Failed to create product' });
  }
};

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(id)
      .populate('category', 'name description')
      .lean();

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    res.json(product);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, ProductRequestBody>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    if (req.body.category !== undefined) {
      if (!mongoose.isValidObjectId(req.body.category)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }

      product.category = new mongoose.Types.ObjectId(req.body.category); // explicit conversion → fixes TS2322
    }

    // Handle image upload
    if (req.file) {
      // Convert buffer to Base64
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      product.imageUrl = `data:${req.file.mimetype};base64,${b64}`;
    }

    // Apply other updates (name, price, stock, etc.)
    Object.assign(product, req.body);

    await product.save();

    const updated = await Product.findById(product._id)
      .populate('category', 'name')
      .lean();

    res.json(updated);
  } catch (err: any) {
    res
      .status(400)
      .json({ message: err.message || 'Failed to update product' });
  }
};

export const deactivateProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ message: 'Product not found or already inactive' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deactivated successfully' });
  } catch (err: any) {
    console.error('Deactivate product error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Optional: permanent delete (use with caution)
export const deleteProductPermanently = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product permanently deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
