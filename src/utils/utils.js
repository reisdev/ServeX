/* @Author: Raphael Nepomuceno <raphael.nepomuceno@ufv.br> */

export const mapPricingType = (type) => {
	switch (type)
	{
		case 'Daily':  return 'por dia'
		case 'Hourly': return 'por hora'
		case 'Once':   return 'único'
	}
}
