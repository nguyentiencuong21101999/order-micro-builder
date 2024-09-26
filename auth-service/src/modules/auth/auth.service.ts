import {
    Expose,
    Transform,
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import jwt from 'jsonwebtoken'
import { Inject, Service } from 'typedi'
import { Config } from '../../configs'
import { CacheManager } from '../../utils/cache'
import { Errors } from '../../utils/error'
import { transform } from 'typescript'
import { ToNumber } from '../../utils/class-transform'
const CSM_ACCESS_TOKEN_KEY = 'csm_access_token'

export class AuthPayload {
    @Expose()
    @Transform(ToNumber)
    userId: number

    @Expose()
    @Transform(ToNumber)
    roleId: number

    static transferAuthPayload = (data: unknown) => {
        return plainToInstance(AuthPayload, data, {
            excludeExtraneousValues: true,
        })
    }

    static AuthPayloadSignToken = (authPayload: AuthPayload) => {
        Object.keys(authPayload).forEach((key) => {
            authPayload[key] = String(authPayload[key])
        })
        return authPayload
    }
}

@Service()
export class AuthService {
    constructor(
        @Inject() private config: Config,
        @Inject() private cacheManager: CacheManager
    ) {}

    signToken = (payload: AuthPayload) => {
        const { accessSecret } = this.config.jwt
        const token = jwt.sign(
            AuthPayload.AuthPayloadSignToken(payload),
            accessSecret
        )
        this.addAccessToken(payload.userId, token)
        return token
    }

    verifyToken = async (token: string) => {
        const decode = jwt.decode(token, {
            complete: true,
        })

        const authPayload = plainToInstance(
            AuthPayload,
            instanceToPlain(decode.payload)
        )

        jwt.verify(token, this.config.jwt.accessSecret)

        const tokens = await this.getAccessTokens(authPayload.userId)
        if (!tokens.has(token)) {
            throw Errors.Unauthorized
        }
        return authPayload
    }

    async getAccessTokens(userId: number) {
        const res = await this.cacheManager.hget(
            CSM_ACCESS_TOKEN_KEY,
            String(userId)
        )
        if (res != null) {
            return new Set(res.split(','))
        }
        return new Set()
    }

    async addAccessToken(userId: number, token: string) {
        const tokens = await this.getAccessTokens(userId)
        tokens.add(token)
        await this.cacheManager.hset(
            CSM_ACCESS_TOKEN_KEY,
            String(userId),
            [...tokens].join(',')
        )
    }

    async removeAccessToken(userId: number, token: string) {
        const tokens = await this.getAccessTokens(userId)
        tokens.delete(token)
        await this.cacheManager.hset(
            CSM_ACCESS_TOKEN_KEY,
            String(userId),
            [...tokens].join(',')
        )
    }

    async removeAllAccessToken(userId: number) {
        await this.cacheManager.hset(CSM_ACCESS_TOKEN_KEY, String(userId), '')
    }
}
