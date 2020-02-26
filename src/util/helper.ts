import bcrypt from "bcrypt-nodejs";

export const getHash = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { reject(err); }
      bcrypt.hash(password, salt, undefined, (err, hash) => {
        if (err) { reject(err); }
        resolve(hash);
      });
    });
  });
};