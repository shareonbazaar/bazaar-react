import Category from '../models/Category';
import Skill from '../models/Skill';

/**
 * GET /categories
 * Fetch all categories and sills
 */
exports.apiGetCategories = (req, res) => {
  Category.find({}).populate('_skills').exec()
    .then(results => res.json(results))
    .catch(err => res.status(500).json(err));
};

/**
 * POST /skills
 * Add new skill
 */
exports.addSkill = (req, res) => {
  const { en, de, ar } = req.body.skill;
  const { category } = req.body;
  const skill = new Skill({
    label: {
      en,
      de,
      ar,
    }
  });
  skill.save()
    .then(s =>
      Category.findOneAndUpdate({ _id: category },
        {
          $push: { _skills: s._id }
        })
        .then(c => res.json(c))
    )
    .catch(err => res.status(500).json({ error: err.message }));
};

/**
 * DELETE /skills
 * Add new skill
 */
exports.deleteSkill = (req, res) => {
  Skill.remove({ _id: req.params.id })
    .then(() => res.json({ error: null }))
    .catch(err => res.status(500).json({ error: err.message }));
};
