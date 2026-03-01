import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  size: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: Types.ObjectId; // ← this is the foreign key
  // category: ICategory['_id'];      // alternative typing style
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category', // ← important: tells Mongoose which model to populate
      required: true,
      index: true, // good for performance
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);
