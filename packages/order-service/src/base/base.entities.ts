import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntities extends BaseEntity {
    @Column({ nullable: false, default: 1 })
    createdBy: number

    @Column({ nullable: false, default: 1 })
    updatedBy: number

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}

export enum BySortType {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type DataUpdateType<T extends Object> = T | T[]
