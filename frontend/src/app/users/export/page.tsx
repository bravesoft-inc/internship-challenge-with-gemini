"use client";

import { useState } from "react";
import Link from "next/link";
import { exportUsers } from "../../../lib/api/users";
import { Button } from "@/components/ui/button";

export default function ExportUsersPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await exportUsers();
      setSuccess("エクスポートが完了しました。ダウンロードが開始されます。");
    } catch (err: unknown) {
      console.error("Error exporting users:", err);
      setError("エクスポートに失敗しました。");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">CSVエクスポート</h1>
        <Link 
          href="/users/list"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          一覧に戻る
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-200">
            ユーザーデータをCSVファイルにエクスポートします。
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            ※ 全てのユーザーデータがエクスポートされます。
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Button
            onClick={handleExport}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "エクスポート中..." : "エクスポートする"}
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-600 mb-4">CSVエクスポートについて</h2>
        <p className="text-gray-700">
          ユーザーデータをCSVファイルとしてエクスポートします。エクスポートには時間がかかる場合があります。
        </p>
      </div>
    </div>
  );
}
