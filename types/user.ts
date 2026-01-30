// 유저의 타입을 구분하는 유니온 타입
export type UserType = "user" | "seller";

// 추가 정보(extra) 인터페이스
export interface UserExtra {
  zipcode?: string;
  detailaddress?: string;
  job?: string;
  biography?: string;
  keyword?: string[];
}

// 개별 사용자 정보 인터페이스
export interface User {
  _id: number;
  email: string;
  password?: string; // 보안상 응답에는 포함되지 않을 수 있음
  name: string;
  phone?: string;
  address?: string;
  type: UserType;
  loginType: "email";
  image?: string;
  extra?: UserExtra;
  createdAt: string;
  updatedAt: string;
  token: { accessToken: string; refreshToken: string };
  refreshToken?: string;
}
