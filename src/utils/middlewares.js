/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

export const restrictedPage = prefs => (request, response, next) => {
	const test = prefs.test || (() => true)

	if (request.session.user && test(request.session.user)) return next()

	const error = prefs.error || 'Operação não permitida.'
	const message = prefs.message || 'Acesso restrito.'
	const status = prefs.status || 403

	return response.status(status).render('error.pug', {
		status, message, error,
	})
}

export default { restrictedPage }
