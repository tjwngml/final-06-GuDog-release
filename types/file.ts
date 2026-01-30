// 업로드된 파일 정보 인터페이스
export interface FileInfo {
  _id: number;
  file_hash: string;
  public_id: string;
  cloudinary_url: string;
  filename: string;
  file_size: number; // 단위: bytes
  createdAt: string;
  updatedAt: string;
}
