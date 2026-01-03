import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  // constructor() {
  //   const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
  //   if (accelerateUrl) {
  //     super({ accelerateUrl });
  //   }
  // }
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      }),
    })
  }
  
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
// import { PrismaClient } from "@prisma/client";

// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy
// {
//   constructor() {
//     super({
//       accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
//     });
//   }

//   async onModuleInit() {
//     await this.$connect();
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }
// }
