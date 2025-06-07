import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = 10;
  const saltRound = await bcrypt.genSalt(salt);
  const hashedP = bcrypt.hash(password, saltRound);
  return hashedP;
};

export const comPare = async (currentPass: string, hashPass: string) => {
  const isEqual = await bcrypt.compare(currentPass, hashPass);
  if (isEqual) {
    return true;
  }
};
