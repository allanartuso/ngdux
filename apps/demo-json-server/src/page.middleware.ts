import { NextFunction, ParamsDictionary, Request, RequestHandler, Response } from 'express-serve-static-core';

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

export const pageMiddleware: RequestHandler = (
  req: Request<ParamsDictionary, unknown, unknown, Record<string, string>>,
  res: Response,
  next: NextFunction
) => {
  req.query = transformPageParams(req.query);
  console.log(req.query);
  next();
};
