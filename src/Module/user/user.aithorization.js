import { roles } from "../../DB/Model/user.model.js"




export const endpoints = {
getProfile : [roles.admin,roles.user]
, updateProfile : [roles.admin,roles.user]
, freezAccount : [roles.admin,roles.user] 
,restoredaccount : [roles.admin , roles.user]  
,deleteaccount : [roles.admin] 
, updatepassword : [roles.admin , roles.user]  ,
}
