import { useState } from "react"
import { useSelector } from "react-redux"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import adminService from "../../services/adminService.js"
import AdminSidebar from "../../components/admin/AdminSidebar.jsx"
import VerificationModal from "./VerificationModal.jsx"
import Card from "../../components/common/Card.jsx"
import Badge from "../../components/common/Badge.jsx"
import Button from "../../components/common/Button.jsx"
import Input from "../../components/common/Input.jsx"
import Loader from "../../components/common/Loader.jsx"
import { Search, CheckCircle, XCircle, Eye } from "lucide-react"

const AdminMentorsPage = () => {
  const { user } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { data: mentors, isLoading } = useQuery({
    queryKey: ["admin-mentors"],
    queryFn: () => adminService.getAllMentors(user?.token),
    enabled: !!user?.token
  })

  const { mutate: updateMentor, isPending } = useMutation({
    mutationFn: ({ mid, isVerified, isActive }) =>
      adminService.updateMentor(mid, { isVerified, isActive }, user?.token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-mentors"] })
      setModalOpen(false)
      setSelectedMentor(null)
      toast.success(data.isVerified ? "Mentor verified successfully!" : "Mentor status updated!")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const handleApprove = (mid) => {
    updateMentor({ mid, isVerified: true, isActive: true })
  }

  const handleReject = (mid) => {
    updateMentor({ mid, isVerified: false, isActive: false })
  }

  const handleOpenReview = (mentor) => {
    setSelectedMentor(mentor)
    setModalOpen(true)
  }

  const filteredMentors = mentors?.filter(
    (m) =>
      m.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      m.qualification?.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Mentor Applications</h1>
            <p className="text-slate-500 text-sm mt-1">Review and verify business mentors ({mentors?.length || 0} total)</p>
          </div>
          <div className="w-full sm:w-64">
            <Input
              icon={Search}
              placeholder="Search mentors..."
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
                    <th className="px-6 py-3.5">Mentor</th>
                    <th className="px-6 py-3.5">Business</th>
                    <th className="px-6 py-3.5">Qualification</th>
                    <th className="px-6 py-3.5">Fee</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMentors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No mentors found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredMentors.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">{m.user?.name || "N/A"}</p>
                            <p className="text-xs text-slate-400">{m.user?.email || m.email || "—"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{m.businessName || "—"}</td>
                        <td className="px-6 py-4 text-slate-600">{m.qualification || "—"}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {m.consultationFee ? `₹${m.consultationFee}` : "Free"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={m.isVerified ? "success" : "warning"}
                            size="sm"
                            dot
                          >
                            {m.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Eye}
                              onClick={() => handleOpenReview(m)}
                            >
                              Review
                            </Button>
                            {!m.isVerified ? (
                              <Button
                                variant="primary"
                                size="sm"
                                icon={CheckCircle}
                                disabled={isPending}
                                onClick={() => handleApprove(m._id)}
                              >
                                Approve
                              </Button>
                            ) : (
                              <Button
                                variant="danger"
                                size="sm"
                                icon={XCircle}
                                disabled={isPending}
                                onClick={() => handleReject(m._id)}
                              >
                                Revoke
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <VerificationModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedMentor(null); }}
          mentor={selectedMentor}
          onApprove={handleApprove}
          onReject={handleReject}
          isPending={isPending}
        />
      </main>
    </div>
  )
}

export default AdminMentorsPage

