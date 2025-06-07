'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addProjectMembers } from "@/lib/projectApi";
import Button from "@/components/ui/Button";

export default function JoinProjectPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("pid");
  const router = useRouter();

  const { firebaseUser, userData, isReady } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isReady) return;

    if (!firebaseUser || !userData) {
      const redirect = `/join?pid=${projectId}`;
      router.push(`/?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [isReady, firebaseUser, userData, projectId, router]);

  const handleJoin = async () => {
    if (!projectId || !userData) return;
    setIsJoining(true);

    try {
      await addProjectMembers(projectId, [userData.uid]);
      setJoined(true);
    } catch (error) {
      console.error("Error fetching to join project:", error);
      setError("加入失敗，請稍後再試");
    } finally {
      setIsJoining(false);
    }
  };

  if (!projectId) return <p>無效的邀請連結</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">邀請加入專案</h1>
      <p>這頁只是還沒做介面，請放心加入</p>
      <p className="mb-2">您確定要加入這個專案嗎？</p>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {joined ? (
        <>
          <p className="text-sp-blue-500">✅ 加入成功！</p>
          <Button onClick={() => router.replace(`/${userData?.uid}/${projectId}/dashboard`)} color="primary">
            前往專案
          </Button>
        </>
      ) : (
        <Button onClick={handleJoin} disabled={isJoining} color="primary">
          {isJoining ? "加入中..." : "確認加入"}
        </Button>
      )}
    </div>
  );
}
