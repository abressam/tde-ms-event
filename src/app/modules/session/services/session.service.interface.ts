import { GetUserResDto } from '@app/modules/user/dtos/responses/get-user-res.dto';
import { PostLoginResDto } from '@app/modules/session/dtos/responses/post-login-res.dto';
import { PostLoginReqDto } from '@app/modules/session/dtos/requests/post-login-req.dto';

export interface SessionServiceInterface {
  postLogin(body: PostLoginReqDto): Promise<PostLoginResDto>;
}
