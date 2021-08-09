import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class AuthController {
  public async getLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async getRegister({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async register({ request, response, auth }: HttpContextContract) {
    const name = request.input('name')
    const email = request.input('email')
    const password = request.input('password')

    const user = new User()
    user.name = name
    user.email = email
    user.password = password
    user.showData = true
    user.avatarUrl = 'https://www.nretnil.com/avatar/LawrenceEzekielAmos.png'

    await user.save()

    await auth.attempt(email, password)

    return response.redirect('/dashboard')
  }

  public async login({ request, response, auth, view }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      await auth.attempt(email, password)
      return response.redirect('/dashboard')
    } catch (error) {
      return view.render('auth/login', {
        error: 'User with email / password does not exist',
      })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
