import {
    DataSource,
    EntityManager,
    ReplicationMode,
    SelectQueryBuilder,
} from 'typeorm'
import { config } from '../configs'

const rootPath = config.isProduction() ? 'dist' : 'src'
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.masterDb.host,
    port: config.masterDb.port,
    username: config.masterDb.username,
    password: config.masterDb.password,
    database: config.masterDb.database,
    entities: [rootPath + '/modules/*/*/entities/*.entity.{ts,js}'],
    logging: true,
    // synchronize: true,
})

export const startTransaction = <T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>
) => {
    return AppDataSource.transaction(runInTransaction)
}

export type DBSource = ReplicationMode | EntityManager

/** Create a query builder based on dbsource
 *
 * - ReplicationMode: Perform queries on a single database connection (MASTER | SLAVE).
 * - EntityManager: Used for custom entity manager, like performing queries in transaction.
 */

export const createQuery = async <T>(
    db: DBSource,
    handler: (manager: EntityManager) => Promise<T>
) => {
    if (db instanceof EntityManager) {
        return await handler(db)
    }

    if (db === 'slave') {
        return await handler(AppDataSource.manager)
    }
    // create a connection to MASTER database
    const queryRunner = AppDataSource.createQueryRunner(db)
    try {
        const { manager } = queryRunner
        return await handler(manager)
    } finally {
        await queryRunner.release()
    }
}

export const createQueryBuilder = async <T>(
    db: ReplicationMode,
    handler: (buidler: SelectQueryBuilder<unknown>) => Promise<T>
) => {
    if (db === 'slave') {
        return await handler(AppDataSource.manager.createQueryBuilder())
    }
    // create a connection to MASTER database
    const queryRunner = AppDataSource.createQueryRunner(db)
    try {
        const { manager } = queryRunner
        return await handler(manager.createQueryBuilder())
    } finally {
        await queryRunner.release()
    }
}
