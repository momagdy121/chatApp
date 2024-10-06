const eventTypes = {
  messageUpdate: "message:update",
  messageDelete: "message:delete",
  messageNew: "message:new",
  chatRead: "chat:read",
  messageDelivered: "message:delivered",
  messageSent: "message:sent",
  groupUpdate: "group:update",
  newMember: "group:newMember",
  memberLeft: "group:memberLeft",
  memberRemoved: "group:memberRemoved",
  storyNew: "story:new",
  storyDelete: "story:delete",
  storyView: "story:view",
  requestAccept: "request:accept",
  requestReceive: "request:receive",
  typingStart: "typing:start",
  typingStop: "typing:stop",
  userOnline: "user:online",
  userOffline: "user:offline",
};

export default eventTypes;
