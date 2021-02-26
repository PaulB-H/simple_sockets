module.exports = (io, socket) => {
  const login = (payload) => {
    // ..
  };
  const logout = (payload) => {
    // ..
  };

  socket.on("user:login", login);
  socket.on("user:logout", logout);
};
