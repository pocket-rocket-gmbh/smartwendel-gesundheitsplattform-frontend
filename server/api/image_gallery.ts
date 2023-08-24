import fs from 'fs';
export default defineEventHandler(async (event) => {
  const {kind} = getQuery(event);
  const data = fs.readdirSync(`./assets/images/cover-images-gallery/${kind}`);
  return data;
});
