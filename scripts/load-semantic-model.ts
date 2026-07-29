import { PrismaClient } from '@prisma/client';
import fs from 'fs';


const prisma = new PrismaClient();



async function main(){


const file =
process.argv[2];


if(!file){

 throw new Error(
 'Usage: npm run load-semantic-model file.json'
 );

}



const content =
JSON.parse(
 fs.readFileSync(file,'utf8')
);



for(
 const table of content.tables
){


 await prisma.semanticTable.create({

 data:{
   name:table.name,

   description:
   table.description ?? null,

   columns:
   table.columns
 }


 });


}



console.log(
'Semantic model imported'
);


}



main()
.catch(console.error)
.finally(
async()=>{
 await prisma.$disconnect();
}
);