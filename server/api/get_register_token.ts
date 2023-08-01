export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  const registerToken = config.REGISTER_TOKEN;

  return registerToken
});
