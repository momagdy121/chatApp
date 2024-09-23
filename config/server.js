import server from "../socket.io/socket.js"; // Ensure correct path to socket.js

const ListenToServer = () => {
  const port = process.env.PORT || 4000;

  // Start the HTTP server instead of just the Express app
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

export default ListenToServer;
