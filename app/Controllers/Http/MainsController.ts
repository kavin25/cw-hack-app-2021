import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MainsController {
  public async getDashboard({ view }: HttpContextContract) {
    return view.render('dashboard')
  }

  public async enterRecords({ request, auth, response }) {
    await auth.use('web').authenticate()
    const user = auth.user

    const { linkedin, facebook, twitter, github, phone, avatarUrl } = request.all()
    user.linkedin = linkedin
    user.facebook = facebook
    user.twitter = twitter
    user.github = github
    user.phone = phone
    user.avatarUrl = avatarUrl

    await user.save()

    return response.redirect('/dashboard')
  }
}
