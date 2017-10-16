import Category from '../models/Category';

/**
 * GET /categories
 * Fetch all categories and sills
 */
exports.apiGetCategories = (req, res) => {
  Category.find({}).populate('_skills').exec()
    .then(results => res.json(results))
    .catch(err => res.status(500).json(err));
};
