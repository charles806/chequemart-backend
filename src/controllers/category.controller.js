import Category from "../models/Category.model.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const { includeInactive, parentOnly } = req.query;

    const filter = {};
    
    if (!includeInactive) {
      filter.isActive = true;
    }
    
    if (parentOnly === "true") {
      filter.parentCategory = null;
    }

    const categories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .populate("parentCategory", "name");

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate("parentCategory", "name");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, parentCategory, order } = req.body;

    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    const category = await Category.create({
      name,
      description,
      image,
      parentCategory: parentCategory || null,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive, parentCategory, order } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    if (parentCategory) {
      if (parentCategory === id) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be its own parent",
        });
      }
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, image, isActive, parentCategory: parentCategory || null, order },
      { new: true, runValidators: true }
    ).populate("parentCategory", "name");

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const hasChildren = await Category.exists({ parentCategory: id });
    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with subcategories. Please delete subcategories first.",
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};