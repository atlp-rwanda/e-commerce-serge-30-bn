import User from '../models/user.model';
import Vendor from '../models/vendor.model';
import Product from '../models/products.Model';
import Category from '../models/products.Category.Model';
import Notification from '../models/notifications.model';

// Importing one-to-one relationship between User table and Vendor table
User.hasOne(Vendor, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Vendor.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Establishing one-to-Many relationshipt between a Vendor and Products
Vendor.hasMany(Product, {
  foreignKey: 'vendor_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Product.belongsTo(Vendor, {
  foreignKey: 'vendor_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Establishing one-to-Many relationship between Category and Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Notification.belongsTo(User,{
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
