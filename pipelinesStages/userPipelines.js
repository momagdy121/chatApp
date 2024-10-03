function withContactCheck(currentUserId) {
  return [
    {
      $addFields: {
        isContact: { $in: [currentUserId, "$contacts"] },
      },
    },
  ];
}

function addFieldsWithBasicInfo(additionFields = {}) {
  return [
    {
      $project: {
        _id: 1,
        username: 1,
        name: 1,
        avatar: 1,
        online: 1,
        ...additionFields,
      },
    },
  ];
}

const userPipelines = {
  withContactCheck,
  addFieldsWithBasicInfo,
};

export default userPipelines;
