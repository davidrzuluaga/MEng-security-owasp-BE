import { Request, Response, NextFunction } from "express";
import geoip from "geoip-lite";
import { Logs } from "../database/models";

type FunctionsLogsType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const createLogs = async ({
  req,
  msg = "",
  error = null,
}: {
  req: Request;
  msg?: string;
  error?: null | Error;
}) => {
  if (req.headers.origin !== "http://localhost:3000") {
    try {
      let ip = req.headers["x-forwarded-for"] || req.ip;
      let geo = geoip.lookup(ip as string);
      let response = {
        req: {
          error,
          geo,
          ip,
          headers: req.headers,
          originalUrl: req.originalUrl,
          body: req.body,
          params: req.params,
          query: req.query,
        },
      };
      Logs.create({
        log: response,
        name: `${msg}request-${req.originalUrl}`,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const errorLogs = ({ req, error }: { req: Request; error: Error }) => {
  createLogs({ req, msg: "error", error });
  if (req.headers.origin === "http://localhost:3000") console.log(error);
};

const saveReqLogs: FunctionsLogsType = async (req, res, next) => {
  if (req.headers.host !== "localhost:5000") {
    createLogs({ req });
  }
  next();
};

const verifyOrigin: FunctionsLogsType = async (req, res, next) => {
  const headers = req.headers;
  const REACT_ENV = process.env.REACT_ENV;
  const REACT_ENV2 = process.env.REACT_ENV2;

  if (
    headers.origin &&
    (headers.origin === REACT_ENV || headers.origin === REACT_ENV2)
  ) {
    next();
  } else {
    createLogs({ req, msg: "unAuth-" });
    return res.redirect("/400");
  }
};

export { saveReqLogs, verifyOrigin, errorLogs };
