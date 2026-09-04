import * as bcrypt from 'bcrypt';

const hashPasswordHandler = async (password: string) => {
  const hashedPass = await bcrypt.hashSync(password, 10);
  return hashedPass;
};

const comparePassword = async (password: string, hashPassword: string) => {
  const coparePass = await bcrypt.compareSync(password, hashPassword)
  return coparePass
}

export {hashPasswordHandler, comparePassword};
