import UserRepository from '../../repositories/user.ts';

export default class UniqueUsernameSpecification {
  constructor(private userRepository: UserRepository) {}

  async isSatisfiedBy(username: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(username);
    return user === null;
  }
}