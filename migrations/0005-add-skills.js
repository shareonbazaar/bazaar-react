const fs = require('fs');

exports.up = (db, next) => {
  const activities = JSON.parse(fs.readFileSync('config/activities.json', 'utf8'));

  Object.keys(activities).reduce((previous_cat_promise, category_name) => {
    const new_category = { label: { en: category_name }, _skills: [] };
    return previous_cat_promise.then(() =>
      activities[category_name].reduce((previous_skill_promise, skill_label) =>
        previous_skill_promise.then(() =>
          db.collection('skills').insertOne({ label: { en: skill_label } })
            .then((result) => {
              new_category._skills.push(result.insertedId);
            }))
        ,
      Promise.resolve()).then(() => db.collection('categories').insertOne(new_category))
    );
  }, Promise.resolve()).then(() => next());
};

exports.down = (db, next) => {
  const activities = JSON.parse(fs.readFileSync('config/activities.json', 'utf8'));
  let promises = [];
  Object.keys(activities).forEach((category_name) => {
    const skills = activities[category_name];

    promises = promises.concat(skills.map(skill_label => db.collection('skills').remove({ 'label.en': skill_label })));

    promises.push(db.collection('categories').remove({ 'label.en': category_name }));
  });
  Promise.all(promises).then(() => next());
};
