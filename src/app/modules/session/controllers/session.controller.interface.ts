import { PostLoginResDto } from '@app/modules/session/dtos/responses/post-login-res.dto';
import { PostLoginReqDto } from '@app/modules/session/dtos/requests/post-login-req.dto';

export interface SessionControllerInterface {
  postLogin(query: PostLoginReqDto): Promise<PostLoginResDto>;
}
