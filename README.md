
```
chatApp
├─ .gitignore
├─ config
│  ├─ cloudinary.js
│  ├─ DB.js
│  └─ server.js
├─ controllers
│  ├─ authController.js
│  ├─ groupController.js
│  ├─ messageController.js
│  ├─ storyController.js
│  └─ userController.js
├─ errors
│  ├─ authErrors.js
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
├─ routes
│  ├─ authRouter.js
│  ├─ groupRouter.js
│  ├─ messageRouter.js
│  ├─ storyRouter.js
│  └─ userRouter.js
├─ services
│  ├─ mailService
│  │  ├─ generateOTP.js
│  │  ├─ mailForm.js
│  │  ├─ resetPassMail.js
│  │  └─ verificationMail.js
│  ├─ offlineNotification
│  │  ├─ enums.js
│  │  ├─ offlineManyNotifier.js
│  │  └─ offlineOneNotifier.js
│  └─ token_management
│     ├─ checkTokenDate.js
│     ├─ createToken.js
│     ├─ generateTokensFullProcess.js
│     └─ handleTokenRefresh.js
├─ socket.io
│  ├─ handlers
│  │  └─ connectionHandler.js
│  ├─ middlewares.js
│  ├─ services
│  │  ├─ messageServices
│  │  │  ├─ sendGroupMessage.js
│  │  │  ├─ sendIoMessage.js
│  │  │  └─ typingState.js
│  │  └─ userServices
│  │     ├─ groupRooms.js
│  │     └─ userStatus.js
│  ├─ socket.js
│  └─ utils.js
├─ test2.js
├─ uploads
├─ utils
│  ├─ apiError.js
│  ├─ catchAsync.js
│  ├─ factoryHandler.js
│  ├─ queryProcesses.js
│  ├─ rules.js
│  └─ sendResponse.js
└─ view
   ├─ logo.png
   └─ test.html

```