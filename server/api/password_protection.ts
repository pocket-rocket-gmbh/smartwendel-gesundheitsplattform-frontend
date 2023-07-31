export default defineEventHandler(async (event): Promise<any> => {
  const { password } = await readBody(event);
  const config = useRuntimeConfig();
  const loginPassword = config.LOGIN_PASSWORD

  if (password === loginPassword) {
    return true
  } else {
    return false
  }
})