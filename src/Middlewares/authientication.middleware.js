import { getsignature,  verifyToken } from "../Utils/token.utils.js";
import * as dbservice from "../DB/dbservice.js";
import { Usermodel } from "../DB/Model/user.model.js";

import { Tokenmodel } from "../DB/Model/Token.model.js";

export const TokentypeEnum = {
  access: "access",
  refresh: "refresh",
};

const decodedToken = async ({
  authorization,
  Tokentype = TokentypeEnum.access,
  next,
}) => {
  const [bearer, token] = authorization.split(" ") || [];

  if (!bearer || !token)
    return next(new Error("token not found", { cause: 401 }));

  let Signature = await getsignature({ signaturelevel: bearer });
  const decoded = verifyToken({
    token,
    signature:
      Tokentype === TokentypeEnum.access
        ? Signature.accessSignature
        : Signature.refreshSignature,
  });

  if (
    decoded.jti &&
    (await dbservice.findOne({
      model: Tokenmodel,
      filter: {
        jti: decoded.jti,
      },
    }))
  )
    return next(new Error("token is revoke ", { cause: 404 }));

  const user = await dbservice.findById({
    model: Usermodel,
    id: { _id: decoded._id },
  });
  if (!user) return next(new Error("user not found ", { cause: 404 }));


if(user.changeCredentialsTime?.getTime() > decoded.iat*1000 )
return next(new Error("token in expiered",{Cause:401}))

  return { user, decoded };
};

export const Authentication = ({ Tokentype = TokentypeEnum.access }) => {
  return async (req, res, next) => {
    const { user, decoded } = await decodedToken({
      authorization: req.headers.authorization,
      Tokentype,
      next,
    });
    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const Authorization = ({ accessRole = [] }) => {
  return async (req, res, next) => {
    if (!accessRole.includes(req.user.role))
      return next(new Error("unauthorizard", { cause: 403 }));
    return next();
  };
};
