import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export default class GithubsController {
  private async codeExchange(code: string): Promise<string> {
    try {
      const res = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: Env.get('GITHUB_CLIENT_ID'),
          client_secret: Env.get('GITHUB_CLIENT_SECRET'),
          code,
          redirect_uri: 'https://cognizer.kavin.me/connect/github/callback',
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
      const res = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      })

      return res.data
    } catch (err) {
      console.error(err)
    }
  }

  public async redirect({ auth, response }: HttpContextContract) {
    await auth.use('web').authenticate()

    response.redirect(
      `https://github.com/login/oauth/authorize` +
        `?client_id=${Env.get('GITHUB_CLIENT_ID')}` +
        `&redirect_uri=${encodeURIComponent('https://cognizer.kavin.me/connect/github/callback')}` +
        `&scope=${encodeURIComponent('read.user user.email')}` +
        // Base64 encoded email
        `&state=${btoa(auth.user!.email)}`
    )
  }

  public async callback({ auth, request, response }: HttpContextContract) {
    const { code } = request.qs()

    const res = await this.userData(await this.codeExchange(code))
    console.log('******')
    console.log(res.login)
    console.log('******')
    auth.user!.github = `https://github.com/${res.login}`
    await auth.user!.save()

    return response.redirect('/dashboard')
  }
}
