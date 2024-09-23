export function deleteHandler(model, name) {
  return (req, res, next) => {
    model
      .findByIdAndDelete(req.params.id, { new: true })
      .then((doc) => {
        res.status(204).json({ status: "success", [name]: doc });
      })
      .catch((error) => {
        next(new apiError(`cant't find Id ${req.params.id}`, 404));
      });
  };
}
export function updateHandler(model, name) {
  return (req, res, next) => {
    model
      .findByIdAndUpdate(req.params.id, request.body, {
        runValidators: true,
        new: true,
      })
      .then((updatedDoc) => {
        res.status(201).json({
          status: "success",
          [name]: updatedDoc,
        });
      })
      .catch((error) => {
        next(new apiError(`cant't find Id ${req.params.id}`, 404));
      });
  };
}
export function createHandler(model, name) {
  return (req, res, next) => {
    model
      .create(req.body)
      .then((doc) => {
        res.json({ status: "success", [name]: doc });
      })
      .catch((error) => {
        return next(error);
      });
  };
}
export function findAllHandler(model, name) {}
