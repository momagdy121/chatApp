import { pathToRegexp } from "path-to-regexp";

function allowRoutes(allowedRoutes) {
  return (req, res, next) => {
    const matched = allowedRoutes.some(
      ({ path, methods = ["GET", "POST", "PATCH", "DELETE", "PUT"] }) => {
        const regex = pathToRegexp(path);

        // Check if the route matches and if the method is allowed
        return regex.test(req.path) && methods.includes(req.method);
      }
    );

    if (matched) {
      next();
    } else {
      res.status(404).send("Route not found or method not allowed");
    }
  };
}

export default allowRoutes;
