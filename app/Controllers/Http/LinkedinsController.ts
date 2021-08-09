import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export default class LinkedinsController {
  private async codeExchange(code: string): Promise<string> {
    try {
      const res = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken' +
          `?grant_type=authorization_code` +
          `&client_id=${Env.get('LINKEDIN_CLIENT_ID')}` +
          `&redirect_uri=${encodeURIComponent('http://localhost:3333/connect/linkedin/callback')}` +
          `&client_secret=${Env.get('LINKEDIN_CLIENT_SECRET')}` +
          `&code=${code}`
      )

      return res.data.access_token
    } catch (err) {
      console.error(err)
    }

    return ''
  }

  private async userData(accessToken: string): Promise<any> {
    try {
      const res = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return res.data
    } catch (err) {
      console.error(err.message)
    }
  }

  public async redirect({ auth, response }: HttpContextContract) {
    await auth.use('web').authenticate()

    response.redirect(
      `https://www.linkedin.com/oauth/v2/authorization` +
        `?response_type=code` +
        `&client_id=${Env.get('LINKEDIN_CLIENT_ID')}` +
        `&redirect_uri=${encodeURIComponent('http://localhost:3333/connect/linkedin/callback')}` +
        `&scope=${encodeURIComponent('r_basicprofile r_liteprofile r_emailaddress')}` +
        // Base64 encoded email
        `&state=${btoa(auth.user!.email)}`
    )
  }

  public async callback({ auth, request, response }: HttpContextContract) {
    const { code } = request.qs()
    console.log(code)

    const res = await this.userData(await this.codeExchange(code))
    //console.log('******')
    //console.log(res.login)
    //console.log('******')
    //auth.user!.linkedin = res.login
    //await auth.user!.save()

    //return response.redirect('/dashboard')
    return response.json(res)
  }
}
