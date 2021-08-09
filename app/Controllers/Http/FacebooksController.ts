import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export default class FacebooksController {
  private async codeExchange(code: string): Promise<string> {
    try {
      const res = await axios.post(
        'https://graph.facebook.com/oauth/access_token',
        {
          client_id: Env.get('FACEBOOK_CLIENT_ID'),
          client_secret: Env.get('FACEBOOK_CLIENT_SECRET'),
          code,
          redirect_uri: 'http://localhost:3333/connect/facebook/callback',
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )

      return res.data.access_token
    } catch (err) {
      console.error(err)
    }

    return ''
  }

  private async userData(accessToken: string): Promise<any> {
    try {
      const res = await axios.get(
        'https://graph.facebook.com/v11.0/me?fields=id%2Cname%2Clink&access_token=' + accessToken
      )

      return res.data
    } catch (err) {
      console.error(err)
    }
  }

  public async redirect({ auth, response }: HttpContextContract) {
    await auth.use('web').authenticate()

    response.redirect(
      `https://www.facebook.com/v11.0/dialog/oauth` +
        `?client_id=${Env.get('FACEBOOK_CLIENT_ID')}` +
        `&redirect_uri=${encodeURIComponent('http://localhost:3333/connect/facebook/callback')}` +
        `&state=${btoa(auth.user!.email)}`
    )
  }

  public async callback({ auth, request, response }: HttpContextContract) {
    const { code } = request.qs()

    const res = await this.userData(await this.codeExchange(code))
    auth.user!.facebook = res.link
    await auth.user!.save()

    return response.redirect('/dashboard')
  }
}
