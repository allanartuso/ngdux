import { createPersistentProperties } from '@demo/demo/data-model/properties/test';
import { createPersistentUsers } from '@demo/demo/data-model/users/test';
import * as fs from 'fs';

const properties = createPersistentProperties(100);
const users = createPersistentUsers(30);

const db = {
  properties,
  users
};

fs.writeFile('./json-server/db.json', JSON.stringify(db), error => {
  if (error) {
    console.log(error);
    return;
  }

  console.log('DB generated successfully!');
});
