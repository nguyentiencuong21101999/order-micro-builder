import { Inject, Service } from "typedi";
import { AuthService } from "../../auth/auth.service";

import { UserService } from "../../client/users/user.service";

@Service()
export class CMSUserService {
  constructor(
    @Inject() private authService: AuthService,
    @Inject() private userService: UserService
  ) {}

  signIn = async (data: any) => {
    console.log(data);
  };
}
