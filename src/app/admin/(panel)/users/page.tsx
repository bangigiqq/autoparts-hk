import { listUsers } from "@/lib/admin";
import { formatDate } from "@/lib/format";

export default function AdminUsersPage() {
  const users = listUsers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">會員列表</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3">姓名</th>
              <th className="px-4 py-3">電郵</th>
              <th className="px-4 py-3">電話</th>
              <th className="px-4 py-3">角色</th>
              <th className="px-4 py-3">註冊日</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  {u.isAdmin ? (
                    <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs">
                      管理員
                    </span>
                  ) : (
                    "會員"
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
