import { Job, Worker } from "bullmq";
import { Redis } from "ioredis";
import { config } from "../../configs";
import { QueueName } from "../queues";

import Mail from "nodemailer/lib/mailer";

export const mailWorker = new Worker<Mail.Options>(
  QueueName.mail,
  async (job: Job) => {},
  {
    connection: new Redis({
      ...config.redis,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    }),
  }
);
