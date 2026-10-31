import { useState } from "react"
import { useSelector } from "react-redux"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import adminService from "../../services/adminService.js"
import AdminSidebar from "../../components/admin/AdminSidebar.jsx"
import Card from "../../components/common/Card.jsx"
import Badge from "../../components/common/Badge.jsx"
import Button from "../../components/common/Button.jsx"
import Input from "../../components/common/Input.jsx"
import Loader from "../../components/common/Loader.jsx"
import { Search, UserCheck, UserX } from "lucide-react"

const AdminAllUsersPage = () => {
  const { user } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: () => adminService.getAllUsers(user?.token),
    enabled: !!user?.token
  })

  const { mutate: toggleUserStatus, isPending } = useMutation({
    mutationFn: ({ uid, isActive }) => adminService.updateUser(uid, { isActive }, user?.token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] })
      toast.success(`User ${data.isActive ? "activated" : "deactivated"} successfully!`)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const filteredUsers = users?.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.city?.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">All Users</h1>
            <p className="text-slate-500 text-sm mt-1">Manage registered users ({users?.length || 0} total)</p>
          </div>
          <div className="w-full sm:w-64">
            <Input
              icon={Search}
              placeholder="Search by name, email, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Phone</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Joined</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{u.phone || "—"}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {u.city ? `${u.city}${u.state ? `, ${u.state}` : ""}` : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={u.userType === "MENTOR" ? "purple" : "neutral"}
                            size="sm"
                          >
                            {u.userType}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={u.isActive ? "success" : "danger"}
                            size="sm"
                            dot
                          >
                            {u.isActive ? "Active" : "Deactivated"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant={u.isActive ? "danger" : "secondary"}
                            size="sm"
                            icon={u.isActive ? UserX : UserCheck}
                            disabled={isPending}
                            onClick={() =>
                              toggleUserStatus({ uid: u._id, isActive: !u.isActive })
                            }
                          >
                            {u.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}

export default AdminAllUsersPage

