import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


async function main(){


const domains=[
 {
  name:'Customer Analytics',
  description:
  'Customer related analytical datasets'
 },
 {
  name:'Finance',
  description:
  'Financial reporting datasets'
 },
 {
  name:'Marketing',
  description:
  'Marketing intelligence datasets'
 }
];


for(const domain of domains){

 await prisma.dataDomain.upsert({

  where:{
    name:domain.name
  },

  update:{},

  create:domain

 });

}


console.log(
 'Governance data loaded'
);


}


main()
.catch(console.error)
.finally(
async()=>{
 await prisma.$disconnect();
}
);