function paginate(arrayName, limit, skip) {
  return [
    {
      $group: {
        _id: null,
        total: { $sum: 1 }, // Count the total contacts
        [arrayName]: { $push: "$$ROOT" }, // Collect the contacts in an array
      },
    },

    {
      $project: {
        _id: 0, // Exclude _id from the final output
        total: 1,
        [arrayName]: { $slice: [`$${arrayName}`, skip, limit] },
        // Paginate the contacts
      },
    },
  ];
}

const generalPipelines = {
  paginate,
};

export default generalPipelines;
