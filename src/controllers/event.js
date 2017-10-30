import Event from '../models/Event';

/**
 * GET /events
 * Fetch all events
 */
exports.getEvents = (req, res) => {
  Event.find({})
    .then(results => res.json(results))
    .catch(err => res.status(500).json(err));
};

/**
 * POST /events
 * Add new event
 */
exports.addEvent = (req, res) => {
  const { title, description, happenedAt, link } = req.body;
  const event = new Event({
    title,
    description,
    happenedAt,
    link,
  });
  event.save()
    .then(e => res.json(e))
    .catch(err => res.status(500).json({ error: err.message }));
};

/**
 * DELETE /events/:id
 * Delete event
 */
exports.deleteEvent = (req, res) => {
  Event.remove({ _id: req.params.id })
    .then(() => res.json({ error: null }))
    .catch(err => res.status(500).json({ error: err.message }));
};
