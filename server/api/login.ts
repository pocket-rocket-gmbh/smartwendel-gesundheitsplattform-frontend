import axios from "axios";
import { ServerCallResult } from "~~/types/serverCallResult";

export default defineEventHandler(async (event): Promise<ServerCallResult> => {
  const { data } = await readBody(event);

  const config = useRuntimeConfig();
  const registerToken = config.REGISTER_TOKEN;

  data.register_token = registerToken

  try {
    const response = await axios.post(
      `${config.public.API_BASE_URL}auth`,
      data
    );
    return ServerCallResult.success(response.data.status, response.data);
  } catch (error) {

    return ServerCallResult.error(error)
  }
});
