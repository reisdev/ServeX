/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

const DEFAULT_MESSAGE = 'Operação não permitida.'

export const restrictedPage = (error = DEFAULT_MESSAGE, test = () => true) => (request, response, next) => {
	if(request.session.user && test(request.session.user))
		return next()

	return response.status(403).render('error.pug', {
		status: 403,
		message: 'Acesso restrito',
		error
	})
}
