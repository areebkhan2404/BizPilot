import Modal from "../../components/common/Modal.jsx"
import Button from "../../components/common/Button.jsx"
import Badge from "../../components/common/Badge.jsx"
import { CheckCircle, XCircle } from "lucide-react"

const VerificationModal = ({ isOpen, onClose, mentor, onApprove, onReject, isPending }) => {
  if (!mentor) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Mentor Application"
      subtitle={`${mentor.user?.name || "Applicant"} — ${mentor.businessName || "No business name"}`}
      maxWidth="max-w-xl"
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            icon={XCircle}
            onClick={() => onReject(mentor._id)}
            disabled={isPending}
          >
            Reject Application
          </Button>
          <Button
            variant="primary"
            icon={CheckCircle}
            onClick={() => onApprove(mentor._id)}
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Approve & Verify"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-0.5">Applicant Name</p>
            <p className="font-semibold text-slate-700">{mentor.user?.name || "N/A"}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-0.5">Email</p>
            <p className="font-semibold text-slate-700">{mentor.user?.email || mentor.email || "N/A"}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-0.5">Phone</p>
            <p className="font-semibold text-slate-700">{mentor.user?.phone || mentor.phone || "N/A"}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-0.5">Registration Number</p>
            <p className="font-semibold text-slate-700">{mentor.registrationNumber || "Not provided"}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Qualification</p>
          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{mentor.qualification || "N/A"}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{mentor.experience || "N/A"}</p>
        </div>

        {mentor.expertise?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expertise</p>
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.map((e) => (
                <Badge key={e} variant="purple" size="sm">{e}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-0.5">Consultation Fee</p>
            <p className="font-semibold text-slate-700">₹{mentor.consultationFee || 0} / session</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-0.5">Current Status</p>
            <Badge variant={mentor.isVerified ? "success" : "warning"} dot>
              {mentor.isVerified ? "Verified" : "Pending Verification"}
            </Badge>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default VerificationModal

