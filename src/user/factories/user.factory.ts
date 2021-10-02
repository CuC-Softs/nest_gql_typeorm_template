import * as Faker from 'faker';
import { define } from 'typeorm-factories';
import { User } from '../user.entity';

define(User, (faker: typeof Faker) => {
  const user = new User();
  user.id = faker.datatype.uuid();
  user.name = faker.name.firstName(1);
  user.password = faker.lorem.lines(8);
  user.createdAt = faker.date.future();
  user.updatedAt = faker.date.future();
  return user;
});
