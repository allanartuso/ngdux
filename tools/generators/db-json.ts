import { createPersistentCars } from '@demo/demo/data-model/cars/test';
import { createPersistentProperties } from '@demo/demo/data-model/properties/test';
import { createPersistentUsers } from '@demo/demo/data-model/users/test';
import * as fs from 'fs';

const properties = createPersistentProperties(100);
const users = createPersistentUsers(30);
const cars = createPersistentCars(30);

const db = {
  properties,
  users,
  cars
};

const fileContent = `export const db = ${JSON.stringify(db)}`;

fs.writeFile('./apps/demo-json-server/src/db.ts', fileContent, error => {
  if (error) {
    console.log(error);
    return;
  }

  console.log('DB generated successfully!');
});
