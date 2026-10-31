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
import Modal from "../../components/common/Modal.jsx"
import Loader from "../../components/common/Loader.jsx"
import { Search, Plus, ExternalLink, ToggleLeft, ToggleRight, Edit } from "lucide-react"

const AdminSchemesPage = () => {
  const { user } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingScheme, setEditingScheme] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    benefit: "",
    eligibility: "",
    applyUrl: "",
    sourceUrl: "",
    state: "All India",
    category: ""
  })

  const { data: schemes, isLoading } = useQuery({
    queryKey: ["admin-schemes-list"],
    queryFn: () => adminService.getAllSchemes(user?.token),
    enabled: !!user?.token
  })

  const { mutate: createScheme, isPending: isCreating } = useMutation({
    mutationFn: (data) => adminService.createScheme(data, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schemes-list"] })
      setModalOpen(false)
      resetForm()
      toast.success("Scheme created successfully!")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const { mutate: updateScheme, isPending: isUpdating } = useMutation({
    mutationFn: ({ sid, data }) => adminService.updateScheme(sid, data, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schemes-list"] })
      setModalOpen(false)
      resetForm()
      toast.success("Scheme updated successfully!")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const resetForm = () => {
    setEditingScheme(null)
    setFormData({
      name: "",
      benefit: "",
      eligibility: "",
      applyUrl: "",
      sourceUrl: "",
      state: "All India",
      category: ""
    })
  }

  const handleEdit = (scheme) => {
    setEditingScheme(scheme)
    setFormData({
      name: scheme.name || "",
      benefit: scheme.benefit || "",
      eligibility: scheme.eligibility || "",
      applyUrl: scheme.applyUrl || "",
      sourceUrl: scheme.sourceUrl || "",
      state: scheme.state || "All India",
      category: scheme.category || ""
    })
    setModalOpen(true)
  }

  const handleToggleActive = (scheme) => {
    updateScheme({ sid: scheme._id, data: { isActive: !scheme.isActive } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.benefit) {
      toast.error("Name and benefit are required!")
      return
    }
    if (editingScheme) {
      updateScheme({ sid: editingScheme._id, data: formData })
    } else {
      createScheme(formData)
    }
  }

  const filteredSchemes = schemes?.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase()) ||
      s.state?.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Government Schemes</h1>
            <p className="text-slate-500 text-sm mt-1">Curate and manage government schemes ({schemes?.length || 0} total)</p>
          </div>
          <div className="flex gap-3">
            <div className="w-full sm:w-64">
              <Input
                icon={Search}
                placeholder="Search schemes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              size="md"
              icon={Plus}
              onClick={() => { resetForm(); setModalOpen(true); }}
            >
              Add Scheme
            </Button>
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
                    <th className="px-6 py-3.5">Scheme Name</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">State</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchemes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        No schemes found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredSchemes.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">{s.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-1">{s.benefit}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{s.category || "—"}</td>
                        <td className="px-6 py-4 text-slate-600">{s.state || "All India"}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={s.isActive ? "success" : "neutral"}
                            size="sm"
                            dot
                          >
                            {s.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {s.applyUrl && (
                              <a href={s.applyUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" icon={ExternalLink}>View</Button>
                              </a>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Edit}
                              onClick={() => handleEdit(s)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant={s.isActive ? "danger" : "secondary"}
                              size="sm"
                              icon={s.isActive ? ToggleRight : ToggleLeft}
                              onClick={() => handleToggleActive(s)}
                            >
                              {s.isActive ? "Disable" : "Enable"}
                            </Button>
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

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); resetForm(); }}
          title={editingScheme ? "Edit Scheme" : "Add New Scheme"}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Scheme Name"
              name="name"
              placeholder="e.g. PM MUDRA Yojana"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Benefit <span className="text-red-500">*</span></label>
              <textarea
                value={formData.benefit}
                onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
                placeholder="What does the scheme offer? (loans, subsidy %, etc.)"
                rows={3}
                required
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Eligibility</label>
              <textarea
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                placeholder="Who is eligible for this scheme?"
                rows={2}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="State"
                name="state"
                placeholder="All India or specific state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <Input
                label="Category"
                name="category"
                placeholder="e.g. MSME, Food Processing"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <Input
              label="Application URL"
              name="applyUrl"
              placeholder="https://..."
              value={formData.applyUrl}
              onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
            />
            <Input
              label="Official Source URL"
              name="sourceUrl"
              placeholder="https://..."
              value={formData.sourceUrl}
              onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving..." : editingScheme ? "Update Scheme" : "Create Scheme"}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  )
}

export default AdminSchemesPage

