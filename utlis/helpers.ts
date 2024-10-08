import { SafeParseReturnType } from "zod"
import { Request, Response } from "express"
import { TAKE_LIMIT } from "./constants"

import moment from "moment"

export function currentDate() {
  return new Date(moment().add(3, 'hour').format())
}

export function showAppURLCMD(port: string) {
  console.log(`Server running at PORT: http://localhost:${port}`)
}

export function extractErrors<T>(errors: SafeParseReturnType<T, T>) {
  return errors.error?.flatten().fieldErrors
}

export function extractToken(authorizationHeader: string) {
  if (authorizationHeader) {
    const splitted = authorizationHeader.split(' ')
    if (splitted[1]) return splitted[1]
  }
  return ''
}

export function createPagination(req: Request, skipLimit: boolean = false) {
  
  const page = req.query.page ? +req.query.page : 1
  const limit = req.query.limit ? +req.query.limit : (skipLimit ? null : TAKE_LIMIT)
  const orderBy = req.query.orderBy ?? 'id' 
  const orderType = req.query.orderType ?? 'desc'

  let skip = 0

  if (limit) {
    skip = (page - 1) * (skipLimit ? 0 : limit)
  }

  return {
    orderBy: orderBy as string, 
    orderType: orderType as string, 
    skip, 
    limit,
    page
  }
}

export function generateId(min = 999, max = 9999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  
  const num1 =  Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 =  Math.floor(Math.random() * (max - min + 1)) + min;
  const num3 =  Math.floor(Math.random() * (max - min + 1)) + min;
  const num4 =  Math.floor(Math.random() * (max - min + 1)) + min;

  // Return: 0000-0000-0000-0000
  return num1.toString().padStart(4, "0") + '-' + num2.toString().padStart(4, "0") + '-' + num3.toString().padStart(4, "0") + '-' + num4.toString().padStart(4, "0")
}

export function parameterExists(request: Request, response: Response, incomingParam: any) {
  const param = request.params[incomingParam] ? + request.params[incomingParam] : null
  if (!param) return undefined
  return param
}

export function getUniqueObjectsById<T extends { id: number }>(
  array: T[]
): T[] {
  const uniqueMap = new Map()

  array.forEach((item) => {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item)
    }
  })

  return Array.from(uniqueMap.values())
}

const upperDiff = "𝗔".codePointAt(0)! - "A".codePointAt(0)!
const lowerDiff = "𝗮".codePointAt(0)! - "a".codePointAt(0)!

const isUpper = (n: number) => n >= 65 && n < 91
const isLower = (n: number) => n >= 97 && n < 123

const bolderize = (char: string) => {
  const n = char.charCodeAt(0)
  if (isUpper(n)) return String.fromCodePoint(n + upperDiff)
  if (isLower(n)) return String.fromCodePoint(n + lowerDiff)
  return char
}

export const bolderizeWord = (word: string) =>
  [...word].map(bolderize).join("")
