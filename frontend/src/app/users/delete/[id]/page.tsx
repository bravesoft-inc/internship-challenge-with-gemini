"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchUser, deleteUser, User } from "../../../../lib/api/users";
import { Button } from "@/components/ui/button";

export default function DeleteUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await fetchUser(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError("ユーザーデータの取得に失敗しました。");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadUser();
    }
  }, [userId]);
  
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteUser(userId);
      
      setDeleting(false);
      setDeleteSuccess(true);
      setError(null);
      setTimeout(() => {
        router.push("/users/list");
      }, 2000);
    } catch (err) {
      setError("ユーザー削除に失敗しました。");
      console.error(err);
      setDeleting(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  
  if (!user) {
    return <div className="text-center py-10">ユーザーが見つかりません</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ユーザー削除</h1>
        <Link 
          href="/users/list"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          一覧に戻る
        </Link>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">削除の確認</h2>
        <p className="mb-4">
          以下のユーザーを削除しますか？この操作は取り消せません。
        </p>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {user.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              ID: {user.id}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone_number || "-"}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "削除中..." : "削除する"}
          </Button>
          <Link 
            href={`/users/detail/${userId}`}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            キャンセル
          </Link>
        </div>
      </div>
      
      {/* 削除成功時のメッセージ - 意図的に画面が更新されない状態 */}
      {deleteSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ユーザーが削除されました。一覧画面に戻るには「一覧に戻る」ボタンをクリックしてください。
        </div>
      )}
    </div>
  );
}
