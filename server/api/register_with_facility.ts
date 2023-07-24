import axios from "axios";
import { getErrorMessage } from "~~/utils/error.utils";
import { ServerCallResult } from "~~/types/serverCallResult";

export default defineEventHandler(async (event): Promise<ServerCallResult> => {
  const { data } = await readBody(event);

  const config = useRuntimeConfig();

  const token = `${config.PUBLIC_API_USERNAME}:${config.PUBLIC_API_PASSWORD}`;
  const encodedToken = Buffer.from(token).toString("base64");

  const registerToken = config.REGISTER_TOKEN;

  try {
    const response = await axios.post(
      `${config.public.API_BASE_URL}public/users/register_with_facility/${registerToken}`,
      data,
      {
        headers: {
          Authorization: `Basic ${encodedToken}`,
          "Request-Source": "web",
          "Request-Platform": "browser",
        },
      }
    );

    return ServerCallResult.success(response.data.status, response.data.data);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response &&
      "status" in error.response &&
      typeof error.response.status === "number" &&
      "data" in error.response
    ) {
      return ServerCallResult.error(getErrorMessage(error), error.response.status, error.response.data);
    }

    return ServerCallResult.error("Es ist ein unbekannter Fehler aufgetreten", 505, error);
  }
});
