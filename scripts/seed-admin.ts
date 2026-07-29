import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


async function main(){

 const permissions=[
   'VIEW_DASHBOARD',
   'VIEW_AUDIT_LOGS',
   'RUN_AI_QUERY',
   'MANAGE_USERS',
   'MANAGE_MODELS'
 ];


 for(const permission of permissions){

   await prisma.permission.upsert({

    where:{
      name:permission
    },

    update:{},

    create:{
      name:permission,
      description:
      `Permission ${permission}`
    }

   });

 }


 console.log(
  'Admin permissions created'
 );

}


main()
.catch(console.error)
.finally(
 async()=>{
  await prisma.$disconnect();
 }
);