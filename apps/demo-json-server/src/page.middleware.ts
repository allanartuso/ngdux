import { NextFunction } from 'express-serve-static-core';

const keyMap = {
  page: '_page',
  pageSize: '_limit'
};

function transformPageParams(query: Record<string, string>) {
  return Object.keys(query).reduce((result, key) => {
    if (Object.keys(keyMap).includes(key)) {
      return {
        ...result,
        [keyMap[key]]: query[key]
      };
    }

    return {
      ...result,
      [key]: query[key]
    };
  }, {});
}

export const pageMiddleware = (req, res, next: NextFunction) => {
  req.query = transformPageParams(req.query);
  console.log(req.query);
  next();
};
