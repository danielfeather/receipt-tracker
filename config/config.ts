const conf: any = {

	microsoft: {
		clientId: process.env.MICROSOFT_CLIENT_ID as string,
		clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string
	}

}

export default conf

export function config(path: string|string[]) {
	if (typeof path === 'string') {
		path = path.split('.')
	}

	return path.reduce((previousValue, currentValue) => previousValue[currentValue], conf)
}