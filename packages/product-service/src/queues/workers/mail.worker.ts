import { Job, Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { config } from '../../configs'
import { logger } from '../../utils/logger'
import { QueueName } from '../queues'
import Container from 'typedi'
import { MailerService } from '../../modules/mailer/mailer.service'
import Mail from 'nodemailer/lib/mailer'

export const mailWorker = new Worker<Mail.Options>(
    QueueName.mail,
    async (job: Job) => {
        await Container.get(MailerService).sendMail(job.data)
    },
    {
        connection: new Redis({
            ...config.redis,
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        }),
    }
)
