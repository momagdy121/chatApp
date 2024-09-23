import authErrors from "../../errors/authErrors.js";

function isAuthorized(...rules) {
  return function (req, res, next) {
    if (rules.includes(req.user.rule)) {
      return next();
    }
    return next(authErrors.unauthorized());
  };
}

export default isAuthorized;
