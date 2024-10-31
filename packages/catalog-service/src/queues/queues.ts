import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { DefaultJobOptions, Queue } from 'bullmq'
import { Redis } from 'ioredis'
import Container, { Inject, Service } from 'typedi'
import { Config } from '../configs'
import { logger } from '../utils/logger'

export enum QueueName {
    mail = 'mail',
}

@Service()
export class QueueManager {
    private readonly queues: Record<string, Queue> = {}

    constructor(@Inject() private config: Config) {}

    createQueue(
        queueName: QueueName,
        jobOptions: DefaultJobOptions = {
            removeOnComplete: 500,
            removeOnFail: 500,
        }
    ): Queue {
        const queue = new Queue(queueName, {
            connection: new Redis(this.config.redis),
            defaultJobOptions: jobOptions,
        })
        this.queues[queueName] = queue
        return queue
    }

    getQueue(queueName: QueueName): Queue {
        const queue = this.queues[queueName]
        if (!queue) {
            throw new Error(`Queue [${queueName}] does not exist`)
        }
        return queue
    }

    createBoard() {
        logger.info('create board')
        const queueAdapter = new ExpressAdapter()
        queueAdapter.setBasePath('/admin/queues')
        createBullBoard({
            queues: Object.values(this.queues).map(
                (queue) => new BullMQAdapter(queue)
            ),
            serverAdapter: queueAdapter,
            options: {
                uiConfig: {
                    boardTitle: '',
                    boardLogo: { path: '' },
                },
            },
        })
        return queueAdapter
    }
}

export const setupQueues = () => {
    logger.info('setup queue')
    Object.values(QueueName).forEach((queueName) =>
        Container.get(QueueManager).createQueue(queueName)
    )
}
