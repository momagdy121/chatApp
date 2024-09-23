export const joinGroupRooms = (socket) => {
  const { groups } = socket.user;
  groups.forEach((group) => {
    socket.join(group._id.toString()); //this automatically create or join the room
  });
};
