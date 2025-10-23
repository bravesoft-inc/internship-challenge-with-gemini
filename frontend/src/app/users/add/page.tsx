"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser, User } from "../../../lib/api/users";
import { Button } from "@/components/ui/button";

export default function AddUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
    birth_date: "",
    gender: "",
    membership_status: "pending",
    notes: "",
    points: "0"
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string[]> = {};

    if (!formData.name) {
      newErrors.name = ["名前は必須です。"];
    }

    if (!formData.email) {
      newErrors.email = ["有効なメールアドレスを入力してください。"];
    }

    if (!formData.password) {
      newErrors.password = ["パスワードは必須です。"];
    } else if (formData.password.length < 8) {
      newErrors.password = ["パスワードは8文字以上で入力してください。"];
    }

    if (formData.phone_number && !/^\d{10,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = ["電話番号は10桁または11桁の数字で入力してください。"];
    }

    if (Object.keys(newErrors).length > 0) {
      setServerErrors(newErrors);
      setError("入力内容に問題があります。");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setServerErrors({});
      
      const userData = {
        ...formData,
        points: parseInt(formData.points)
      } as Partial<User>;
      
      await createUser(userData);
      router.push("/users/list");
    } catch (err: unknown) {
      console.error("Error creating user:", err);
      
      if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as { response: { data: unknown } }).response === 'object' && (err as { response: { data: unknown } }).response !== null && 'data' in (err as { response: { data: unknown } }).response && typeof (err as { response: { data: { errors: unknown } } }).response.data === 'object' && (err as { response: { data: { errors: unknown } } }).response.data !== null && 'errors' in (err as { response: { data: { errors: Record<string, string[]> } } }).response.data) {
        setServerErrors((err as { response: { data: { errors: Record<string, string[]> } } }).response.data.errors);
        setError("入力内容に問題があります。");
      } else {
        setError("ユーザー登録に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ユーザー追加</h1>
        <Link 
          href="/users/list"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          一覧に戻る
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            className={`shadow appearance-none border ${serverErrors.name ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {serverErrors.name && (
            <p className="text-red-500 text-xs italic">{serverErrors.name[0]}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            className={`shadow appearance-none border ${serverErrors.email ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {serverErrors.email && (
            <p className="text-red-500 text-xs italic">{serverErrors.email[0]}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード <span className="text-red-500">*</span>
          </label>
          <input
            className={`shadow appearance-none border ${serverErrors.password ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {serverErrors.password && (
            <p className="text-red-500 text-xs italic">{serverErrors.password[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
            電話番号
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone_number"
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            住所
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birth_date">
            生年月日
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="birth_date"
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
            性別
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">選択してください</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="membership_status">
            会員状態
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="membership_status"
            name="membership_status"
            value={formData.membership_status}
            onChange={handleChange}
          >
            <option value="pending">保留中</option>
            <option value="active">有効</option>
            <option value="inactive">無効</option>
            <option value="expired">期限切れ</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="points">
            ポイント
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="points"
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            メモ
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "処理中..." : "登録する"}
          </Button>
        </div>
      </form>
    </div>
  );
}

