import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getErrorMessage } from '~~/utils/error.utils';
import { ServerCallResult } from '~~/types/serverCallResult';

export type EventBody = {
	method: 'post' | 'get' | 'patch' | 'delete';
	url: string;
	data?: any;
};

export default defineEventHandler(async (event): Promise<ServerCallResult> => {
	const { method, url, data } = await readBody<EventBody>(event);

	const config = useRuntimeConfig();
	const token = `${config.PUBLIC_API_USERNAME}:${config.PUBLIC_API_PASSWORD}`;
	const encodedToken = Buffer.from(token).toString('base64');
	const client: AxiosInstance = axios.create({
		baseURL: `${config.public.API_BASE_URL}public/`,
		headers: {
			Authorization: `Basic ${encodedToken}`,
			'Request-Source': 'web',
			'Request-Platform': 'browser',
		},
	});

	try {
		const response = await client.request({ method, url, data });
		return ServerCallResult.success(response.status, response.data);
	} catch (error) {
		if (
			typeof error === 'object' &&
			error &&
			'response' in error &&
			typeof error.response === 'object' &&
			error.response &&
			'status' in error.response &&
			typeof error.response.status === 'number' &&
			'data' in error.response
		) {
			return ServerCallResult.error(
				getErrorMessage(error),
				error.response.status,
				error.response.data
			);
		}

		return ServerCallResult.error('Es ist ein unbekannter Fehler aufgetreten', 505, error);
	}
});
