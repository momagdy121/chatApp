import groupErrors from "../../errors/groupErrors.js";

const areContacts = async (req, res, next) => {
  // Check if all members are in user's contacts
  const { members } = req.body;
  const { contacts } = req.user;

  const notContacts = members.filter((member) => !contacts.includes(member));

  if (notContacts.length > 0) {
    return next(
      groupErrors.usersNotInContacts(notContacts)
    );
  }

  next();
};

export default areContacts;
