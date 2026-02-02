import { Suspense } from "react";
import QnAListContent from "./QnAListContent";

export default function QnAListPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <QnAListContent />
    </Suspense>
  );
}
