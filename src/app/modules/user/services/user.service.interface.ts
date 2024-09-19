import { DeleteUserResDto } from '@app/modules/user/dtos/responses/delete-user-res.dto';
import { GetUserResDto } from '@app/modules/user/dtos/responses/get-user-res.dto';
import { PostUserReqDto } from '@app/modules/user/dtos/requests/post-user-req.dto';
import { PutUserReqDto } from '@app/modules/user/dtos/requests/put-user-req.dto';

export interface UserServiceInterface {
  getUser(userId: number): Promise<GetUserResDto>;
  postUser(body: PostUserReqDto): Promise<GetUserResDto>
  putUser(userId: number, body: PutUserReqDto): Promise<GetUserResDto>;
  deleteUser(userId: number): Promise<DeleteUserResDto>;
}
