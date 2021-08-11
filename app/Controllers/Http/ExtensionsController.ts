import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiResponse from 'App/Models/ApiResponse'
import User from 'App/Models/User'

export default class ExtensionsController {
  public async joinedMeet({ request, response }: HttpContextContract) {
    const { meetCode, userId } = request.body()
    console.log(meetCode, userId)

    const user = await User.find(parseInt(userId))

    user!.meetCode = meetCode
    user!.isCodeActive = true

    await user!.save()
    const res: ApiResponse = {
      success: true,
      message: '',
      data: {},
    }
    return response.json(res)
  }

  public async leftMeet({ request, response }: HttpContextContract) {
    const { userId } = request.body()
    console.log(userId)
    const user = await User.find(parseInt(userId))
    user!.meetCode = ''
    user!.isCodeActive = false

    await user!.save()
    const res: ApiResponse = {
      success: true,
      message: '',
      data: {},
    }
    return response.json(res)
  }

  public async listMeetPeople({ request, response }: HttpContextContract) {
    const { userId, meetCode } = request.qs()
    console.log(request.body())
    console.log(meetCode)
    let res: ApiResponse

    try {
      const users = await User.query().where('meetCode', meetCode).whereNot('id', parseInt(userId))
      res = {
        message: '',
        success: true,
        data: users,
      }
    } catch (error) {
      res = {
        message: error.toString(),
        success: false,
        data: {},
      }
    }
    return response.json(res)
  }
}
