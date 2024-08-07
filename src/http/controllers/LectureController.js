"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../schema");
const responses_1 = require("../../utlis/responses");
const helpers_1 = require("../../utlis/helpers");
const db_1 = __importDefault(require("../../utlis/db"));
const AuthController_1 = __importDefault(require("./AuthController"));
class LectureController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthController_1.default.user(req, res);
            const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
            if (!lectureId)
                return (0, responses_1.badRequest)(res, "Invalid lectureId");
            const lecture = yield db_1.default.lectureData.findUnique({
                where: { id: lectureId },
                include: { subject: true }
            });
            if (!lecture)
                return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
            const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
            if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                return (0, responses_1.unauthorized)(res, "Unauthorized");
            return (0, responses_1.send)(res, `lectureId [${lectureId}] - Data`, 200, lecture);
        });
    }
    updateLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthController_1.default.user(req, res);
            const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
            if (!lectureId)
                return (0, responses_1.badRequest)(res, "Invalid lectureId");
            const lecture = yield db_1.default.lectureData.findUnique({
                where: { id: lectureId },
                include: { subject: true }
            });
            if (!lecture)
                return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
            const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
            if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                return (0, responses_1.unauthorized)(res, "Unauthorized");
            const body = schema_1.subjectLecture.update.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const updatedLecture = yield db_1.default.lectureData.update({
                where: { id: lectureId },
                data
            });
            return (0, responses_1.send)(res, "Lecture has been updated", 200, updatedLecture);
        });
    }
    deleteLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthController_1.default.user(req, res);
            const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
            if (!lectureId)
                return (0, responses_1.badRequest)(res, "Invalid lectureId");
            const lecture = yield db_1.default.lectureData.findUnique({
                where: { id: lectureId },
                include: { subject: true }
            });
            if (!lecture)
                return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
            const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
            if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                return (0, responses_1.unauthorized)(res, "Unauthorized");
            const deletedLecture = yield db_1.default.lectureData.delete({
                where: { id: lectureId }
            });
            return (0, responses_1.send)(res, "Lecture has been deleted", 200, deletedLecture);
        });
    }
    getLinks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthController_1.default.user(req, res);
            const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
            if (!lectureId)
                return (0, responses_1.badRequest)(res, "Invalid lectureId");
            const lecture = yield db_1.default.lectureData.findUnique({
                where: { id: lectureId },
                include: { subject: true }
            });
            if (!lecture)
                return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
            const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
            if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                return (0, responses_1.unauthorized)(res, "Unauthorized");
            const links = yield db_1.default.lectureLinks.findMany({
                where: { lectureId: lecture.id }
            });
            return (0, responses_1.send)(res, `lectureId [${lectureId}] - Links`, 200, links);
        });
    }
    createLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthController_1.default.user(req, res);
            const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
            if (!lectureId)
                return (0, responses_1.badRequest)(res, "Invalid lectureId");
            const lecture = yield db_1.default.lectureData.findUnique({
                where: { id: lectureId },
                include: { subject: true }
            });
            if (!lecture)
                return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
            const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
            if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                return (0, responses_1.unauthorized)(res, "Unauthorized");
            const body = schema_1.linkSchema.create.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const createdLink = yield db_1.default.lectureLinks.create({
                data: Object.assign(Object.assign({}, data), { lectureId: lecture.id })
            });
            return (0, responses_1.send)(res, "Lecture Link has been created", 201, createdLink);
        });
    }
    updateLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthController_1.default.user(req, res);
            const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
            const linkId = (0, helpers_1.parameterExists)(req, res, "linkId");
            if (!lectureId)
                return (0, responses_1.badRequest)(res, "Invalid lectureId");
            if (!linkId)
                return (0, responses_1.badRequest)(res, "Invalid linkId");
            const lecture = yield db_1.default.lectureData.findUnique({
                where: { id: lectureId },
                include: { subject: true }
            });
            const link = yield db_1.default.lectureLinks.findUnique({ where: { id: linkId } });
            if (!lecture)
                return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
            if (!link)
                return (0, responses_1.notFound)(res, "Link doesn't exist.");
            const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
            if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                return (0, responses_1.unauthorized)(res, "Unauthorized");
            const body = schema_1.linkSchema.update.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const createdLink = yield db_1.default.lectureLinks.update({
                where: { id: link.id },
                data: Object.assign({}, data)
            });
            return (0, responses_1.send)(res, "Link has been updated", 200, createdLink);
        });
    }
    deleteLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthController_1.default.user(req, res);
            const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
            const linkId = (0, helpers_1.parameterExists)(req, res, "linkId");
            if (!lectureId)
                return (0, responses_1.badRequest)(res, "Invalid lectureId");
            if (!linkId)
                return (0, responses_1.badRequest)(res, "Invalid linkId");
            const lecture = yield db_1.default.lectureData.findUnique({
                where: { id: lectureId },
                include: { subject: true }
            });
            const link = yield db_1.default.lectureLinks.findUnique({ where: { id: linkId } });
            if (!lecture)
                return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
            if (!link)
                return (0, responses_1.notFound)(res, "Link doesn't exist.");
            const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
            if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                return (0, responses_1.unauthorized)(res, "Unauthorized");
            const deletedLink = yield db_1.default.lectureLinks.delete({
                where: { id: link.id }
            });
            return (0, responses_1.send)(res, "Link has been deleted", 200, deletedLink);
        });
    }
}
exports.default = LectureController;
