import { Inject, Service } from 'typedi'
import { AuthService } from '../../auth/auth.service'
import { MailerService } from '../../mailer/mailer.service'

@Service()
export class UserService {
    constructor(
        @Inject() public authService: AuthService,
        @Inject() public mailerService: MailerService
    ) {}

    signup = async (data: any) => {}
}
