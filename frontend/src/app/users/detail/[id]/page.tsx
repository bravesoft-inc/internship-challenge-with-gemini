"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchUser, User } from "../../../../lib/api/users";

export default function UserDetailPage() {
  const params = useParams();
  const userId = Number(params.id);
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
  
  const MembershipStatusChip = ({ status }: { status: string }) => {
    const statusStyles: { [key: string]: { label: string; className: string } } = {
      active: { label: "有効", className: "bg-green-200 text-green-800" },
      inactive: { label: "無効", className: "bg-red-200 text-red-800" },
      pending: { label: "保留", className: "bg-yellow-200 text-yellow-800" },
      expired: { label: "期限切れ", className: "bg-gray-200 text-gray-700" },
    };

    const { label, className } = statusStyles[status] || {
      label: "不明",
      className: "bg-gray-200 text-gray-700",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${className}`}>
        {label}
      </span>
    );
  };
  
  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }
  
  if (error || !user) {
    return <div className="text-center py-10 text-red-500">{error || "ユーザーが見つかりません"}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ユーザー詳細</h1>
        <div className="space-x-2">
          <Link 
            href={`/users/edit/${user.id}`}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            編集
          </Link>
          <Link 
            href={`/users/delete/${user.id}`}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            削除
          </Link>
          <Link 
            href="/users/list"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
              <dt className="text-sm font-medium text-gray-500">名前</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" dangerouslySetInnerHTML={{ __html: user.name }}></dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">電話番号</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone_number || "-"}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">住所</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" dangerouslySetInnerHTML={{ __html: user.address || "-" }}></dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">生年月日</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.birth_date || "-"}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">性別</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.gender || "-"}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">会員状態</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <MembershipStatusChip status={user.membership_status || "pending"} />
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ポイント</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.points || 0}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">最終ログイン</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.last_login_at || "-"}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">メモ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.notes || "-"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
