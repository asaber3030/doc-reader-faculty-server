"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LectureController_1 = __importDefault(require("../http/controllers/LectureController"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const express_1 = require("express");
const lecturesRouter = (0, express_1.Router)();
const controller = new LectureController_1.default();
lecturesRouter.use(isAuthenticated_1.checkIsAuthenticated);
lecturesRouter.get('/lectures/:lectureId', controller.get);
lecturesRouter.patch('/lectures/:lectureId/update', controller.updateLecture);
lecturesRouter.delete('/lectures/:lectureId/delete', controller.deleteLecture);
lecturesRouter.get('/lectures/:lectureId/links', controller.getLinks);
lecturesRouter.post('/lectures/:lectureId/links/create', controller.createLink);
lecturesRouter.patch('/lectures/:lectureId/links/:linkId/update', controller.updateLink);
lecturesRouter.delete('/lectures/:lectureId/links/:linkId/delete', controller.deleteLink);
exports.default = lecturesRouter;
