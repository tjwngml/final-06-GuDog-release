import { Reply } from "@/types/post";
import { PostInfoRes, ReplyListRes, ResData } from "@/types/response";
import useUserStore from "@/zustand/useStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";

// 폼 상태 타입
export interface ReplyFormState {
  content: string;
}

export interface QnaPostForm {
  title: string;
  content: string;
  product_id: number;
  category: string;
  product_name?: string;
  product_img?: string;
}

/**
 * QnA 게시글 등록
 */
export async function createQnaPost(form: QnaPostForm) {
  const token = useUserStore.getState().user?.token?.accessToken;
  if (!token) throw new Error("로그인이 필요합니다.");

  const payload = {
    type: "qna",
    title: form.title.trim(),
    content: form.content.trim(),
    product_id: form.product_id,
    extra: {
      category: form.category,
      product_name: form.product_name,
      product_img: form.product_img,
    },
  };

  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data: ResData<PostInfoRes> = await res.json();

  if (data.ok !== 1) {
    const errorMsg = data.errors
      ? Object.values(data.errors)[0].msg
      : data.message || "문의 등록에 실패했습니다.";
    throw new Error(errorMsg);
  }

  return data.item;
}

/**
 * QnA 답변 등록
 * @param postId - 게시글 id
 * @param form - 답변 폼 데이터
 */
export async function createReply(postId: string | number, form: ReplyFormState): Promise<Reply> {
  const token = useUserStore.getState().user?.token?.accessToken;
  if (!token) throw new Error("로그인이 필요합니다.");

  const payload = {
    content: form.content.trim(),
  };

  const res = await fetch(`${API_URL}/posts/${postId}/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data: ResData<ReplyListRes> = await res.json();

  if (data.ok !== 1) {
    const errorMsg = data.errors
      ? Object.values(data.errors)[0].msg
      : data.message || "답변 등록에 실패했습니다.";
    throw new Error(errorMsg);
  }

  return data.item[0];
}

/**
 * QnA 답변 수정
 * @param postId - 게시글 id
 * @param replyId - 댓글 id
 * @param form - 답변 폼 데이터
 */
export async function updateReply(
  postId: string | number,
  replyId: string | number,
  form: ReplyFormState,
): Promise<Reply> {
  const token = useUserStore.getState().user?.token?.accessToken;
  if (!token) throw new Error("로그인이 필요합니다.");

  const payload = {
    content: form.content.trim(),
  };

  const res = await fetch(`${API_URL}/posts/${postId}/replies/${replyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data: ResData<ReplyListRes> = await res.json();

  if (data.ok !== 1) {
    const errorMsg = data.errors
      ? Object.values(data.errors)[0].msg
      : data.message || "답변 수정에 실패했습니다.";
    throw new Error(errorMsg);
  }

  return data.item[0];
}

/**
 * QnA 답변 삭제
 * @param postId - 게시글 id
 * @param replyId - 댓글 id
 */
export async function deleteReply(
  postId: string | number,
  replyId: string | number,
): Promise<void> {
  const token = useUserStore.getState().user?.token?.accessToken;
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${API_URL}/posts/${postId}/replies/${replyId}`, {
    method: "DELETE",
    headers: {
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ResData<ReplyListRes> = await res.json();

  if (data.ok !== 1) {
    throw new Error(data.message || "답변 삭제에 실패했습니다.");
  }
}

/**
 * QnA 게시글 삭제
 * @param postId - 게시글 id
 */
export async function deletePost(postId: string | number): Promise<void> {
  const token = useUserStore.getState().user?.token?.accessToken;
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "client-id": CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ResData<PostInfoRes> = await res.json();

  if (data.ok !== 1) {
    throw new Error(data.message || "게시글 삭제에 실패했습니다.");
  }
}

/**
 * QnA 답변 등록/수정 통합 함수
 * @param postId - 게시글 id
 * @param form - 답변 폼 데이터
 * @param replyId - 댓글 id (수정 시에만 전달)
 */
export async function saveReply(
  postId: string | number,
  form: ReplyFormState,
  replyId?: string | number,
): Promise<Reply> {
  if (replyId) {
    return updateReply(postId, replyId, form);
  }
  return createReply(postId, form);
}
