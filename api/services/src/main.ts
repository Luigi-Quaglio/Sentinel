import { UserRepository } from './repositories/UserRepository';

async function main() {
  const userRepo = new UserRepository();

  // example usage of the UserRepository
  const users = await userRepo.findMany({ take: 5 });
  console.log('Example users:', users);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
