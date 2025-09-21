import cors from "cors";

export function corsOptions() {
  const whitelist = process.env.WHITELIST.split(",");
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (whitelist.includes(origin)) {
       return callback(null, true);
      }else{
         return callback(new Error("not allowed by CORS"));
      }
    },
  };
  return corsOptions
}
