import path from "node:path";
import morgan from "morgan";
import fs from "node:fs"

const __direname = path.resolve();
export function attachRoutingWithLogger(app,routerPath,router,Logsfilename){
const logStream = fs.createWriteStream(path.join(__direname,'./src/logs',Logsfilename)
, {flags:'a'}
);
app.use(routerPath,morgan('combined',{stream:logStream}),router)
app.use(routerPath,morgan('dev'),router)
}