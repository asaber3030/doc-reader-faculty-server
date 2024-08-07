import { Request, Response } from "express"
import { TQueryParameters } from "../../types"

import { moduleSchema, subjectSchema } from "../../schema"
import { badRequest, conflict, notFound, send } from "../../utlis/responses"
import { extractErrors, parameterExists } from "../../utlis/helpers"

import Module from "../models/Module"
import db from "../../utlis/db"

export default class ModuleController {

  async get(req: Request, res: Response) {
    
    const yearId = parameterExists(req, res, "yearId")
    if (!yearId) return badRequest(res, "Invalid yearId")

    const { search, orderBy, orderType }: TQueryParameters = req.query as any
    
    const modules = await db.module.findMany({
      where: { 
        yearId,
        name: { contains: search }
      },
      include: { _count: { select: { subjects: true } } },
      orderBy: { [orderBy]: orderType }
    })

    return res.status(200).json({
      data: modules,
      message: "Modules data",
      status: 200
    })
  }

  async createModule(req: Request, res: Response) {
    const yearId = parameterExists(req, res, "yearId")
    if (!yearId) return badRequest(res, "Invalid yearId")

    const parsedBody = moduleSchema.create.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findModule = await db.module.findFirst({
      where: { yearId, name: parsedBody.data.name }
    })
    if (findModule) return conflict(res, "Module already exists.")
    
    const newModule = await db.module.create({
      data: {
        yearId,
        ...parsedBody.data
      }
    })
    return send(res, "Module has been created", 201, newModule)
  }
  
  async createSubject(req: Request, res: Response) {

    const moduleId = parameterExists(req, res, "moduleId")
    if (!moduleId) return notFound(res, "Invalid moduleId")

    const module = await db.module.findUnique({ where: { id: moduleId }, select: { id: true } })
    if (!module) return notFound(res, "Module not found.")

    const parsedBody = subjectSchema.create.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findSubject = await db.subject.findFirst({
      where: { moduleId, name: parsedBody.data.name }
    })
    if (findSubject) return conflict(res, "Subject already exists.")
    
    const newSubject = await db.subject.create({
      data: {
        moduleId,
        ...parsedBody.data
      }
    })
    await db.practicalData.create({ data: {
        title: "Practical Data",
        subTitle: "Practical Data is for lab.",
        subjectId: newSubject.id
      } 
    })
    await db.finalRevisionData.create({ data: {
        title: "Final Revision Data",
        subTitle: "Final Data is for Final including final exams and mid-term exams.",
        subjectId: newSubject.id
      }
    })
    return send(res, "Subject has been created", 201, newSubject)
  }

  async getModule(req: Request, res: Response) {
    const yearId = parameterExists(req, res, "yearId")
    const moduleId = parameterExists(req, res, "moduleId")

    if (!yearId) return badRequest(res, "Invalid yearId")
    if (!moduleId) return badRequest(res, "Invalid Module Id")
    
    const module = await Module.find(moduleId)
    if (!module) return notFound(res, "Module doesn't exist.")
   
    return send(res, "Module", 200, module)
  }

  async getModuleSubjects(req: Request, res: Response) {
    const yearId = parameterExists(req, res, "yearId")
    const moduleId = parameterExists(req, res, "moduleId")

    if (!yearId) return badRequest(res, "Invalid yearId")
    if (!moduleId) return badRequest(res, "Invalid moduleId")

    const module = await Module.find(moduleId)
    if (!module) return notFound(res, "Module doesn't exist.")

    const subjects = await Module.moduleSubjects(moduleId)
    return send(res, "Module subjects", 200, subjects)
  }

  async updateModule(req: Request, res: Response) {
    const yearId = parameterExists(req, res, "yearId")
    const moduleId = parameterExists(req, res, "moduleId")

    if (!yearId) return badRequest(res, "Invalid yearId")
    if (!moduleId) return badRequest(res, "Invalid moduleId")

    const module = await Module.find(moduleId)
    if (!module) return notFound(res, "Module doesn't exist.")
   
    const parsedBody = moduleSchema.update.safeParse(req.body)
    if (!parsedBody.success) return send(res, "Validation errors", 400, extractErrors(parsedBody))

    const findModule = await db.module.findFirst({
      where: { 
        yearId, 
        name: parsedBody.data.name,
        AND: [
          { id: { not: moduleId } }
        ]
      }
    })
    if (findModule) return conflict(res, "Module already exists.")
    
    const updatedModule = await db.module.update({
      where: { id: moduleId },
      data: parsedBody.data
    })
    return send(res, "Module has been updated", 200, updatedModule)
  }

  async deleteModule(req: Request, res: Response) {
    const yearId = parameterExists(req, res, "yearId")
    const moduleId = parameterExists(req, res, "moduleId")

    if (!yearId) return badRequest(res, "Invalid yearId")
    if (!moduleId) return badRequest(res, "Invalid moduleId")
    
    const module = await Module.find(moduleId)
    if (!module) return notFound(res, "Module doesn't exist.")

    const deletedModule = await db.module.delete({ where: { id: moduleId } })
    return send(res, "Module has been deleted", 200, deletedModule)
  }
 
}