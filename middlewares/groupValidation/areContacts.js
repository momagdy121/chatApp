import ApiError from "../../Utils/apiError.js";

const areContacts = async (req, res, next) => {
  // Check if all members are in user's contacts
  const { members } = req.body;
  const { contacts } = req.user;

  const notContacts = members.filter((member) => !contacts.includes(member));

  if (notContacts.length > 0) {
    return next(
      new ApiError(`User(s) ${notContacts.join(", ")} not in contacts`, 400)
    );
  }

  next();
};

export default areContacts;
