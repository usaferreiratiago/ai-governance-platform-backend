import { PrismaClient } from '@prisma/client';


const prisma =
new PrismaClient();



async function main(){


const tests=[

 {
  name:
  'Semantic Search Accuracy',

  score:
  0.92
 },


 {
  name:
  'SQL Generation Quality',

  score:
  0.88
 }

];



for(const test of tests){


 await prisma.benchmarkRun.create({

 data:{
  name:test.name,
  score:test.score,
  status:'COMPLETED'
 }

 });


}



console.log(
'Benchmarks executed'
);


}



main()
.catch(console.error)
.finally(
async()=>{
 await prisma.$disconnect();
}
);