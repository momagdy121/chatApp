# Overview

#### This chat application is built with MongoDB, Node.js, and Socket.IO. It provides a feature-rich platform for real-time communication, supporting individual and group chats, stories, and more. The application also includes robust authentication, contact management, and notification features, making it a complete messaging solution.

# Features

### 1. Real-Time Messaging
* Users can send, update, and delete messages in real time.
* Read receipts and message delivery notifications are supported.
* Typing Indicators to notify when someone is typing.
### 2. Group Chats
* Users can create and manage groups, add or remove members, and send group messages.
* Group updates such as adding/removing members and leaving groups are tracked.
### 3. Stories
* Users can post and view stories similar to other social media platforms.
* Stories can be marked as viewed, and they can also be deleted.
### 4. User Authentication
* Full-featured authentication system with login, signup, Google OAuth, email verification, password reset, and logout functionality.
### 5. Contact Requests
* Users can send, accept, and reject contact requests.
* Contact request notifications are available in real time and when offline.
### 6. Notifications
* Notifications for events like new messages, contact requests, and story updates are saved for offline users.
  
# API Routes
### 1. Auth Router
*  POST ```/signup```:  Register a new user with optional avatar upload.
*  POST ```/resend-otp```: Resend OTP to verify email.
*  POST ```/refresh```: Refresh the access token.
*  PATCH ```/verify```: Verify the user's account via OTP.
*  POST ```/login```: Log in with email and password.
*  POST ```/forgot-password/code```: Send forgot password code.
*  POST ```/forgot-password/verify```: Verify the forgot password code.
*  PATCH ```/forgot-password/reset```: Reset the password using the verification code.
*  POST``` /logout```: Log out and invalidate the current session.
### 2. Group Router
*  GET ```/```: Get all groups.
*  GET ```/:groupId```: Get a group by ID.
*  PATCH ```/:groupId```: Update a group's description.
*  DELETE ```/:groupId```: Delete a group.
*  POST ```/:groupId/members```: Add members to a group.
*  DELETE ```/:groupId/members```: Remove a member from a group.
*  GET ```/:groupId/messages```: Get all messages for a group.
### 3. Message Router
*  GET ```/chats```: Get all chats for the user.
*  GET ```/chats/:chatId```: Get all messages from a specific chat.
*  PATCH ```/:messageId```: Update a message.
*  DELETE ```/:messageId```: Delete a message.
### 4. Story Router
*  GET ```/```: Get stories of the current user.
*  POST ```/```: Upload and post a new story.
*  DELETE ```/:storyId```: Delete a story by ID.
*  POST ```/:storyId/view```: Mark a story as viewed.
*  GET ```/all```: Get all stories from contacts.
### 5. User Router
*  GET ```/profile```: Get the user's profile.
*  PATCH ```/profile```: Update the user's profile.
*  GET ```/contacts```: Get all contacts.
*  GET ```/online```: Get only online contacts
*  GET ```/search```: search for users by name or username
*  GET ```/:userId```: get user by id
*  PATCH ```/password/change```: change the current password
*  GET ```/```: multi users by ids
*  GET ```/notifications```: get offline notifications
*  GET ```/pending-requests```: Get all pending contact requests.
*  POST ```/:userId/request```: Send a contact request.
*  PATCH ```/:userId/request/accept```: Accept a contact request.
*  PATCH ```/:userId/request/reject```: Reject a contact request.
  
# Socket.IO Events
### The following events are handled via Socket.IO for real-time communication:

#### Message Events
*  ```message:new```: Notify when a new message is sent.
*  ```message:update```: Notify when a message is updated.
*  ```message:delete```: Notify when a message is deleted.
*  ```message:delivered```: Notify that a message has been delivered.
*  ```message:sent```: Notify that a message has been sent to the server.

#### Chat Events
*  ```chat:read```: Notify when a chat is marked as read.

#### Group Events
*  ```group:update```: Notify about group updates.
*  ```group:newMember```: Notify when a new member joins a group.
*  ```group:memberLeft```: Notify when a member leaves the group.
*  ```group:memberRemoved```: Notify when a member is removed from the group.

#### Story Events
*  ```story:new```: Notify about new story uploads.
*  ```story:delete```: Notify when a story is deleted.
*  ```story:view```: Notify when a story is viewed.

#### Contact Request Events
*  ```request:accept```: Notify when a contact request is accepted.
*  ```request:receive```: Notify when a contact request is received.

#### Typing Indicators
*  ```typing:start```: Notify when a user starts typing.
*  ```typing:stop```: Notify when a user stops typing.

#### User Status
*  ```user:online```: Notify when a user comes online.
*  ```user:offline```: Notify when a user goes offline.

# Technologies
### Backend: Node.js, Express.js
### Database: MongoDB
### Real-Time Communication: Socket.IO
### Authentication: JWT, Passport.js (Google OAuth)
### File Uploads: Multer, Cloudinary
### Image Processing: Multer, Cloudinary

# project structure
```
chatApp
├─ .gitignore
├─ config
│  ├─ cloudinary.js
│  ├─ DB.js
│  └─ server.js
├─ configExample.env
├─ controllers
│  ├─ authController.js
│  ├─ groupController.js
│  ├─ messageController.js
│  ├─ storyController.js
│  └─ userController.js
├─ errors
│  ├─ authErrors.js
│  ├─ globalErrors.js
│  ├─ groupErrors.js
│  ├─ messageErrors.js
│  ├─ storyErrors.js
│  └─ userErrors.js
├─ index.js
├─ middlewares
│  ├─ allowRoutes.js
│  ├─ authValidation
│  │  ├─ index.js
│  │  ├─ isAuthorized.js
│  │  ├─ isUserExists.js
│  │  ├─ isVerified.js
│  │  ├─ validateEmail.js
│  │  ├─ validateLogin.js
│  │  ├─ validateOTP.js
│  │  ├─ verifyAccessToken.js
│  │  ├─ verifyPassword.js
│  │  └─ verifyRefreshToken.js
│  ├─ globalErrorhandler.js
│  ├─ globalValidation
│  │  ├─ checkBodyFieldsExistence.js
│  │  ├─ fieldEnums.js
│  │  ├─ isDocumentExists.js
│  │  ├─ isDocumentYours.js
│  │  └─ validateObjectID.js
│  ├─ groupValidation
│  │  ├─ alreadyMembers.js
│  │  ├─ areContacts.js
│  │  ├─ isAdmin.js
│  │  └─ isGroupMember.js
│  ├─ multer.js
│  ├─ storyValidation
│  └─ uploadImage.js
├─ models
│  ├─ chatModel.js
│  ├─ groupModel.js
│  ├─ messageModel.js
│  ├─ notificationModel.js
│  ├─ storyModel.js
│  └─ userModel.js
├─ package-lock.json
├─ package.json
├─ pipelinesStages
│  ├─ generalPiplines.js
│  └─ userPipelines.js
├─ README.md
├─ routes
│  ├─ authRouter.js
│  ├─ groupRouter.js
│  ├─ messageRouter.js
│  ├─ storyRouter.js
│  └─ userRouter.js
├─ services
│  ├─ authStrategies
│  │  └─ google.js
│  ├─ mail
│  │  ├─ generateOTP.js
│  │  ├─ mailForm.js
│  │  ├─ resetPassMail.js
│  │  └─ verificationMail.js
│  ├─ offlineNotification
│  │  ├─ eventTypes.js
│  │  ├─ offlineManyNotifier.js
│  │  └─ offlineOneNotifier.js
│  └─ token_management
│     ├─ checkTokenDate.js
│     ├─ createToken.js
│     └─ generateTokensFullProcess.js
├─ socket.io
│  ├─ handlers
│  │  └─ connectionHandler.js
│  ├─ middlewares.js
│  ├─ services
│  │  ├─ messageServices
│  │  │  ├─ chatRead.js
│  │  │  ├─ sendGroupMessage.js
│  │  │  ├─ sendIoMessage.js
│  │  │  └─ typingState.js
│  │  └─ userServices
│  │     ├─ groupRooms.js
│  │     └─ userStatus.js
│  ├─ socket.js
│  └─ utils.js
└─ utils
   ├─ apiError.js
   ├─ catchAsync.js
   ├─ factoryHandler.js
   ├─ getTokenFromHeaders.js
   ├─ queryProcesses.js
   ├─ rules.js
   └─ sendResponse.js

```
