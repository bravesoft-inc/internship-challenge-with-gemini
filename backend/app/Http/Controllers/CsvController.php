<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CsvController extends Controller
{
    /**
     * CSVファイルをインポートする
     * 意図的に問題のあるインポート処理
     * - エラー発生時に即停止し、詳細なエラーメッセージを表示しない
     * - トランザクション処理なし（エラー時にロールバックされない）
     * - 本来書き換えられないデータも書き換え可能
     */
    public function import(Request $request)
    {
        if (!$request->hasFile('csv_file')) {
            return response()->json(['error' => 'CSVファイルが選択されていません。'], 400);
        }

        $file = $request->file('csv_file');
        $path = $file->store('temp');
        $fullPath = Storage::path($path);

        DB::beginTransaction();
        try {
            $handle = fopen($fullPath, 'r');
            if (!$handle) {
                throw new \Exception('ファイルを開けませんでした。');
            }

            $header = fgetcsv($handle);
            if (!$header) {
                throw new \Exception('CSVヘッダーが読み取れませんでした。');
            }

            $lineNumber = 1;
            $headerCount = count($header);
            while (($data = fgetcsv($handle)) !== false) {
                $lineNumber++;
                if (count($data) !== $headerCount) {
                    throw new \Exception("{$lineNumber}行目: CSVの列数がヘッダーと一致しません。");
                }
                $rowData = array_combine($header, $data);

                $validator = Validator::make($rowData, [
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255',
                    'password' => 'nullable|string|min:8',
                ]);

                if ($validator->fails()) {
                    throw new \Exception("{$lineNumber}行目: " . $validator->errors()->first());
                }

                $allowedFields = [
                    'name', 'email', 'password', 'phone_number', 'address', 'birth_date',
                    'gender', 'membership_status', 'notes', 'profile_image', 'points', 'last_login_at'
                ];

                $updateData = array_intersect_key($rowData, array_flip($allowedFields));

                if (isset($updateData['password'])) {
                    $updateData['password'] = bcrypt($updateData['password']);
                } else {
                    unset($updateData['password']);
                }

                User::updateOrCreate(['email' => $rowData['email']], $updateData);
            }

            fclose($handle);
            DB::commit();
            Storage::delete($path);

            return response()->json(['message' => 'CSVのインポートが正常に完了しました。']);
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($handle) && is_resource($handle)) {
                fclose($handle);
            }
            Storage::delete($path);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * ユーザーデータをCSVファイルにエクスポートする
     * 意図的に非効率で問題のあるエクスポート処理
     * - 全ユーザーを一度に取得（メモリ使用量大）
     * - 文字コードがShift-JISでなくExcelで開くと文字化け
     * - 改行やカンマを含むデータの処理が不適切
     * - 全データを文字列として連結（メモリ使用量さらに増大）
     * - 各ユーザーごとにDBクエリを実行（N+1問題）
     */
    public function export()
    {
        return response()->streamDownload(function () {
            $file = fopen('php://output', 'w');

            // Add BOM to fix UTF-8 in Excel
            fwrite($file, "\xEF\xBB\xBF");

            $columns = [
                'ID', '名前', 'メールアドレス', '電話番号', '住所', '生年月日', '性別', '会員状態', 'メモ', 'プロフィール画像', 'ポイント', '最終ログイン'
            ];
            fputcsv($file, $columns);

            User::chunk(1000, function ($users) use ($file) {
                foreach ($users as $user) {
                    fputcsv($file, [
                        $user->id,
                        $user->name,
                        $user->email,
                        $user->phone_number,
                        $user->address,
                        $user->birth_date,
                        $user->gender,
                        $user->membership_status,
                        $user->notes,
                        $user->profile_image,
                        $user->points,
                        $user->last_login_at,
                    ]);
                }
            });

            fclose($file);
        }, 'users.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

}
