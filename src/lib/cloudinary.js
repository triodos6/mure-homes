import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(buffer, options = {}) {
  const uploadOptions = { folder: 'murahomes', resource_type: 'auto', ...options };
  const resourceType = uploadOptions.resource_type;

  return new Promise((resolve, reject) => {
    const doUpload = (opts) => {
      const stream = cloudinary.uploader.upload_stream(opts, (err, res) => {
        if (err && (opts.resource_type === 'auto' || opts.resource_type === 'image')) {
          doUpload({ ...opts, resource_type: 'raw' });
        } else if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
      stream.end(buffer);
    };
    doUpload(uploadOptions);
  });
}

export default cloudinary;
