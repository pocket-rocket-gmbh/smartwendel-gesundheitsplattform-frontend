import { ServerCallResult } from '@/types/serverCallResult';
import axios, { Method } from 'axios';
import { useErrors } from '@/composables/ui/errors';

export function usePublicApi() {
	const errors = useErrors();

	const call = async (method: Method, url: string, data?: any): Promise<ServerCallResult> => {
		if (process.server) {
			const config = useRuntimeConfig();
			const token = `${config.PUBLIC_API_USERNAME}:${config.PUBLIC_API_PASSWORD}`;
			const encodedToken = Buffer.from(token).toString('base64');

			const serverInterface = useServerInterface();
			serverInterface.setDomain(`${config.public.API_BASE_URL}public/`);

			serverInterface.setHeaders({
				common: {
					Authorization: `Basic ${encodedToken}`,
					'Request-Source': 'web',
					'Request-Platform': 'browser',
				},
			});
			const result = await serverInterface.call(method, url, data);
			return result;
		}

		try {
			const test = await axios.post<ServerCallResult>('/api/public', { method, url, data });

			return test.data;
		} catch (error) {
			throw Error(errors.getErrorMessage(error));
		}
	};

	return {
		call,
	};
}
