import fs from 'fs';
export default defineEventHandler(async (event) => {
  const {kind} = getQuery(event);
  const data = fs.readdirSync(`./public/images/cover-images-gallery/${kind}`);
  return data;
});
