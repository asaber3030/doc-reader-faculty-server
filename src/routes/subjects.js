"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubjectController_1 = __importDefault(require("../http/controllers/SubjectController"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const express_1 = require("express");
const subjectRouter = (0, express_1.Router)();
const controller = new SubjectController_1.default();
subjectRouter.use(isAuthenticated_1.checkIsAuthenticated);
subjectRouter.get('/subjects/:moduleId', controller.get);
subjectRouter.get('/subjects/:moduleId/:subjectId', controller.getSubject);
subjectRouter.get('/subjects/:moduleId/:subjectId/lectures', controller.getSubjectLectures);
subjectRouter.get('/subjects/:moduleId/:subjectId/final-revisions', controller.getSubjectFinalRevisions);
subjectRouter.get('/subjects/:moduleId/:subjectId/practical', controller.getSubjectPractical);
subjectRouter.post('/subjects/:moduleId/create', controller.createSubject);
exports.default = subjectRouter;
