"use client";

import { useState } from "react";
import Link from "next/link";
import { importUsers } from "../../../lib/api/users";
import { Button } from "@/components/ui/button";

export default function ImportUsersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("ファイルを選択してください。");
      return;
    }
    
    if (!file.name.endsWith('.csv')) {
      setError("CSVファイルを選択してください。");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await importUsers(file);
      setSuccess(result.message || "インポートが完了しました。");
      setFile(null);
      
      const fileInput = document.getElementById('csv_file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err: unknown) {
      console.error("Error importing users:", err);
      
      if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as { response: { data: unknown } }).response === 'object' && (err as { response: { data: unknown } }).response !== null && 'data' in (err as { response: { data: unknown } }).response && typeof (err as { response: { data: { error: unknown } } }).response.data === 'object' && (err as { response: { data: { error: unknown } } }).response.data !== null && 'error' in (err as { response: { data: { error: string } } }).response.data) {
        setError((err as { response: { data: { error: string } } }).response.data.error);
      } else {
        setError("不明なエラーが発生しました。");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">CSVインポート</h1>
        <Link 
          href="/users/list"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          一覧に戻る
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <p className="text-gray-700">
            CSVファイルからユーザーデータをインポートします。
          </p>
          <p className="text-gray-500 text-sm mt-2">
            ※ CSVファイルの1行目はヘッダー行として扱われます。
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
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="csv_file">
              CSVファイル
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="csv_file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading || !file}
            >
              {loading ? "インポート中..." : "インポートする"}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="bg-white border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-yellow-600 mb-4">CSVファイルの形式</h2>
        <p className="mb-4">
          CSVエクスポート機能で出力される形式である必要があります。
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">列名</th>
                <th className="py-2 px-4 border-b text-left">説明</th>
                <th className="py-2 px-4 border-b text-left">必須</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">ID</td>
                <td className="py-2 px-4 border-b">ユーザーID（更新時のみ）</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">名前</td>
                <td className="py-2 px-4 border-b">名前</td>
                <td className="py-2 px-4 border-b">○</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">メールアドレス</td>
                <td className="py-2 px-4 border-b">メールアドレス</td>
                <td className="py-2 px-4 border-b">○</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">電話番号</td>
                <td className="py-2 px-4 border-b">電話番号</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">住所</td>
                <td className="py-2 px-4 border-b">住所</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">生年月日</td>
                <td className="py-2 px-4 border-b">生年月日（YYYY-MM-DD形式）</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">性別</td>
                <td className="py-2 px-4 border-b">性別（male/female/other）</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">会員状態</td>
                <td className="py-2 px-4 border-b">会員状態（active/inactive/pending/expired）</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">メモ</td>
                <td className="py-2 px-4 border-b">メモ</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">プロフィール画像</td>
                <td className="py-2 px-4 border-b">プロフィール画像</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">ポイント</td>
                <td className="py-2 px-4 border-b">ポイント（数値）</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">最終ログイン</td>
                <td className="py-2 px-4 border-b">最終ログイン</td>
                <td className="py-2 px-4 border-b">×</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
