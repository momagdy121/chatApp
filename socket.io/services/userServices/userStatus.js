import userModel from "../../../models/userModel.js";

// Function to add a user to the online list and notify their contacts
export const addUserToOnline = async (socket, io, userSocketMap) => {
  const { _id: userId, contacts } = socket.user;
  userSocketMap.set(userId.toString(), socket.id);

  // Update the user's online status in the database
  await userModel.findByIdAndUpdate(userId, { online: true });

  // Notify only online contacts
  contacts.forEach((contactId) => {
    const contactSocketId = userSocketMap.get(contactId.toString());
    if (contactSocketId) io.to(contactSocketId).emit("user:online", userId);
  });
};

// Function to remove a user from the online list and notify their contacts
export const removeUserFromOnline = async (socket, io, userSocketMap) => {
  const { _id: userId, contacts } = socket.user;

  userSocketMap.delete(userId.toString());

  // Update the user's online status in the database
  await userModel.findByIdAndUpdate(userId, { online: false });

  // Notify only online contacts
  contacts.forEach((contactId) => {
    const contactSocketId = userSocketMap.get(contactId.toString());

    if (contactSocketId) io.to(contactSocketId).emit("user:offline", userId);
  });
};
